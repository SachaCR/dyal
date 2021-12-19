import { Middleware, Context, Command } from './interfaces';

export function composeMiddlewares(middlewares: Middleware[]) {
  if (!Array.isArray(middlewares)) {
    throw new TypeError('Middleware stack must be an array!');
  }

  for (const fn of middlewares) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }

  return async function runStack<D, C extends Command, R>(
    context: Context<D, C, R>,
  ): Promise<unknown> {
    let index = -1;

    async function next(i: number): Promise<unknown> {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }

      index = i;

      let currentMiddleware = middlewares[i];

      if (i === middlewares.length) {
        return Promise.resolve();
      }

      const nextMiddlewareNext = next.bind(null, i + 1);

      return await currentMiddleware(context, nextMiddlewareNext);
    }

    return await next(0);
  };
}
