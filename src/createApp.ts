import { Action, TargetAction } from '.';
import { composeMiddlewares } from './composeMiddlewares';

import { Context, Middleware } from './interfaces';

export type CQRSApp = ReturnType<typeof createApp>;

/**
 * @param dependencies Your app dependencies like repositories, logger, database connection, etc...
 * @returns CQRSApp
 */
export function createApp<D>(dependencies: D) {
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

    /**
     * @param action The action to execute.
     * @type R The action's return type.
     * @returns R
     */
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
