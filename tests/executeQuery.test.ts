import { QueryBus, Context, createApp, createQueryBus, Next } from '../src';

describe('app.execute()', () => {
  describe('Given an app', () => {
    const app = createApp({});

    describe('With a Query bus that register multiple Queries', () => {
      const queryBus: QueryBus = createQueryBus();

      queryBus.register('QueryA', async (ctx: Context<any, any, any>) => {
        return 'Query A result';
      });

      queryBus.register('QueryB', async (ctx: Context<any, any, any>) => {
        return 'Query B result';
      });

      queryBus.register('QueryC', async (ctx: Context<any, any, any>) => {
        return 'Query C result';
      });

      app.on('query').use(queryBus.middleware);

      describe('When I execute a QueryB Query', () => {
        it('Then it should call QueryB handler', async () => {
          const result = await app.execute({
            type: 'query',
            name: 'QueryB',
            payload: {},
          });

          expect(result).toStrictEqual('Query B result');
        });
      });

      describe('When I execute an UnknownQuery', () => {
        it('Then it should throw an error', async () => {
          let error;

          try {
            await app.execute({
              type: 'query',
              name: 'UnknownQuery',
              payload: {},
            });
          } catch (err: any) {
            error = err;
          }

          expect(error.message).toStrictEqual(
            'There is no query handler registered for this query name',
          );
          expect(error.name).toStrictEqual('RangeError');
        });
      });
    });
  });
});
