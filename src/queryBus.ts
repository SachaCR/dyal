import { Query, Context, Action, Next } from './interfaces';

export type QueryHandler = <D, Q extends Query, R>(
  context: Context<D, Q, R>,
) => Promise<R>;

export type QueryBus = ReturnType<typeof createQueryBus>;

export function createQueryBus() {
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

    middleware: async function queryBusRoute<D, A extends Action, R>(
      context: Context<D, A, R>,
      next: Next,
    ): Promise<void> {
      const { action } = context;

      if (action.actionType !== 'query') {
        await next();
        return;
      }

      const query = action as Query;

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
