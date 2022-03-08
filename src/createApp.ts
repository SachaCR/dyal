import { Action, TargetAction } from '.';
import { composeMiddlewares } from './composeMiddlewares';

import { Context, Middleware } from './interfaces';
/**
 * A CQRS app
 * @example
 * ```typescript
 * const app = createApp(dependencies);
 * const commandBus: CommandBus = createCommandBus();
 * commandBus.register('CountCommand', countCommandHandler);
 * app.on('command').use(commandBus.middleware);
 *
 * export interface CountCommandResult {
 *   total: number;
 * }
 *
 * const countCommand: CountCommand = {
 *   actionType: 'command',
 *   name: 'CountCommand',
 *   payload: {
 *    count: 5,
 *   },
 * };
 *
 * const result = await app.execute<CountCommandResult>(countCommand);
 * ```
 */
export interface CQRSApp {
  /**
   *
   * @param target It's the kind of action your middleware will be called for. Can be `query`, `command` or `all`
   * @example
   * ```typescript
   * app.on('command').use(commandHandlerMiddleware);
   * ```
   */
  on(target: TargetAction): {
    /**
     *
     * @param middleware middleware to add to the app stack
     * @returns void
     * @example
     * ```typescript
     * app.on('all').use(middleware);
     * ```
     */
    use(middleware: Middleware): void;
  };

  /**
   *
   * @param middleware middleware to add to the app stack
   * @returns void
   * @example
   * ```typescript
   * app.use(middleware);
   * ```
   */
  use(middleware: Middleware): void;

  /**
   * @param action The action to execute.
   * @type R The action's return type.
   * @returns R
   * @example
   * ```typescript
   * const app = createApp(dependencies);
   * const commandBus: CommandBus = createCommandBus();
   * commandBus.register('CountCommand', countCommandHandler);
   * app.on('command').use(commandBus.middleware);
   *
   * export interface CountCommandResult {
   *   total: number;
   * }
   *
   * const countCommand: CountCommand = {
   *   actionType: 'command',
   *   name: 'CountCommand',
   *   payload: {
   *    count: 5,
   *   },
   * };
   *
   * const result = await app.execute<CountCommandResult>(countCommand);
   * ```
   */
  execute<R>(action: Action): Promise<R>;
}

/**
 * @param dependencies Your app dependencies like repositories, logger, database connection, etc...
 * @returns CQRSApp
 * @example
 * ```typescript
 * const dependencies: AppDependencies = { logger: console.log };
 * const app = createApp(dependencies);
 * app.use(loggerMiddleware);
 * const commandResult = await app.execute(commands);
 * const queryResult = await app.execute(query);
 * ```
 */
export function createApp<D>(dependencies: D): CQRSApp {
  const middlewares: { target: TargetAction; middleware: Middleware }[] = [];

  function use(target: TargetAction, middleware: Middleware) {
    if (typeof middleware !== 'function') {
      throw new TypeError('Middleware must be composed of functions');
    }

    middlewares.push({ target, middleware });
  }

  return {
    on: (target: TargetAction) => {
      return {
        use: (middleware: Middleware) => {
          use(target, middleware);
        },
      };
    },

    use: (middleware: Middleware) => {
      use('all', middleware);
    },

    execute: async <R>(action: Action): Promise<R> => {
      const targetMiddlewares = middlewares.reduce(
        (selectedMids: Middleware[], mid) => {
          if (mid.target === 'all' || mid.target === action.actionType) {
            selectedMids.push(mid.middleware);
          }

          return selectedMids;
        },
        [],
      );

      const midStack = composeMiddlewares(targetMiddlewares);

      const context: Context<D, Action, R> = {
        dependencies,
        action,
        result: undefined,
      };

      await midStack(context);

      if (!context.result) {
        throw new RangeError(
          'No result to return. At least one middleware must write the ctx.result object',
        );
      }

      return context.result;
    },
  };
}
