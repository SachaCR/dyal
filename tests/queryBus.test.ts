import { QueryBus, Context, createQueryBus, Query, Command } from '../src';

describe('QueryBus', () => {
  describe('Given a query Bus with 3 query handlers registered', () => {
    const queryBus: QueryBus = createQueryBus();

    queryBus.register('QueryA', async (ctx: Context<any, any, any>) => {
      return 'Query A result';
    });

    queryBus.register('QueryB', async (ctx: Context<any, any, any>) => {
      return 'Query B result';
    });

    queryBus.register('queryC', async (ctx: Context<any, any, any>) => {
      return 'Query C result';
    });

    describe('When I use the query bus middleware to execute a query ', () => {
      it('Then the correct handler is called And the Next callback is not called', async () => {
        const queryB: Query = {
          actionType: 'query',
          name: 'QueryB',
          filters: {},
        };

        const mockNext = jest.fn(async () => {});

        const context = {
          action: queryB,
          dependencies: {},
          result: undefined,
        };

        await queryBus.middleware(context, mockNext);

        expect(context.result).toStrictEqual('Query B result');
        expect(mockNext.mock.calls.length).toStrictEqual(0);
      });
    });

    describe('When I use the query bus middleware to execute a command ', () => {
      it('Then the next callback is called directly', async () => {
        const command: Command = {
          actionType: 'command',
          name: 'Command',
          payload: {},
        };

        const mockNext = jest.fn(async () => {});

        const context = {
          action: command,
          dependencies: {},
          result: undefined,
        };

        await queryBus.middleware(context, mockNext);

        expect(context.result).toBeUndefined();
        expect(mockNext.mock.calls.length).toStrictEqual(1);
      });
    });

    describe('When I use the query bus middleware to execute an unregistered query ', () => {
      it('Then an error is thrown', async () => {
        const queryD: Query = {
          actionType: 'query',
          name: 'QueryD',
          filters: {},
        };

        const mockNext = jest.fn(async () => {});

        const context = {
          action: queryD,
          dependencies: {},
          result: undefined,
        };

        let error;
        try {
          await queryBus.middleware(context, mockNext);
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
