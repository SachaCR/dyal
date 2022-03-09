import { Query, Context, UseCase, Next } from './interfaces';

/**
 * The query bus registers queries handlers that will be called if the query's name matches.
 * It exposes a middleware function that you can use in an app to mount the query bus on the middleware stack.
 * @example
 *```typescript
 * const app = createApp(dependencies);
 * const queryBus: QueryBus = createQueryBus();
 * queryBus.register('QueryA', getCountQueryHandler);
 * queryBus.register('QueryB', getCountQueryHandler);
 * queryBus.register('QueryC', getCountQueryHandler);
 * app.on('query').use(queryBus.middleware);
 * ```
 */
export interface QueryBus {
  /**
   * This function allows to declare a handler for a given query name.
   * @param queryName The query name that will trigger this command handler.
   * @param queryHandler The query handler called on each query where the queryName matches.
   * @example
   *```typescript
   * const app = createApp(dependencies);
   * const queryBus: QueryBus = createQueryBus();
   * queryBus.register('QueryA', getCountQueryHandler);
   * queryBus.register('QueryB', getCountQueryHandler);
   * queryBus.register('QueryC', getCountQueryHandler);
   * app.on('query').use(queryBus.middleware);
   * ```
   */
  register<D, Q extends Query, R>(
    queryName: string,
    queryHandler: (context: Context<D, Q, R>) => Promise<R>,
  ): void;

  /**
   * This function is the middleware that your app should use to handle queries.
   * @param context
   * @param next
   * @example
   *```typescript
   * const app = createApp(dependencies);
   * const queryBus: QueryBus = createQueryBus();
   * queryBus.register('QueryA', getCountQueryHandler);
   * queryBus.register('QueryB', getCountQueryHandler);
   * queryBus.register('QueryC', getCountQueryHandler);
   * app.on('query').use(queryBus.middleware);
   * ```
   */
  middleware<D, A extends UseCase, R>(
    context: Context<D, A, R>,
    next: Next,
  ): Promise<void>;
}

/**
 * this function returns a QueryBus object. It allows you to declare queries handler that will be called if the query's name matches.
 * @returns QueryBus
 * @example
 *```typescript
 * const app = createApp(dependencies);
 * const queryBus: QueryBus = createQueryBus();
 * queryBus.register('QueryA', getCountQueryHandler);
 * queryBus.register('QueryB', getCountQueryHandler);
 * queryBus.register('QueryC', getCountQueryHandler);
 * app.on('query').use(queryBus.middleware);
 * ```
 */
export function createQueryBus(): QueryBus {
  const queryHandlersMap = new Map<
    string,
    (context: Context<any, any, any>) => Promise<any>
  >();

  return {
    register: <D, Q extends Query, R>(
      queryName: string,
      queryHandler: (context: Context<D, Q, R>) => Promise<R>,
    ): void => {
      queryHandlersMap.set(queryName, queryHandler);
    },

    middleware: async function queryBusRoute<D, A extends UseCase, R>(
      context: Context<D, A, R>,
      next: Next,
    ): Promise<void> {
      const { useCase } = context;

      if (useCase.type !== 'query') {
        await next();
        return;
      }

      const query = useCase as Query;

      let queryHandler = queryHandlersMap.get(query.name);

      if (!queryHandler) {
        throw new RangeError(
          'There is no query handler registered for this query name',
        );
      }

      context.result = await queryHandler(context);

      return;
    },
  };
}
