import { composeMiddlewares } from './composeMiddlewares';

import { Command, Context, Middleware } from './interfaces';

export type CQRSApp = ReturnType<typeof createApp>;

/**
 *
 * @param dependencies You app dependencies like repositories, logger, database connection, etc...
 * @returns CQRSApp
 */
export function createApp<D>(dependencies: D) {
  const middlewares: Middleware[] = [];

  return {
    use: (middelware: Middleware) => {
      if (typeof middelware !== 'function') {
        throw new TypeError('Middleware must be composed of functions');
      }

      middlewares.push(middelware);
    },

    /**
     * @param command The command to execute.
     * @type R The command's return type.
     * @returns R
     */
    execute: async <R>(command: Command): Promise<R> => {
      const midStack = composeMiddlewares(middlewares);

      const context: Context<D, Command, R> = {
        dependencies,
        command,
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
