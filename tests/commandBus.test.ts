import { Command, CommandBus, Context, createCommandBus, Query } from '../src';

describe('CommandBus', () => {
  describe('Given a command Bus with 3 command handlers registered', () => {
    const commandBus: CommandBus = createCommandBus();

    commandBus.register('CommandA', async (ctx: Context<any, any, any>) => {
      return 'Command A result';
    });

    commandBus.register('CommandB', async (ctx: Context<any, any, any>) => {
      return 'Command B result';
    });

    commandBus.register('CommandC', async (ctx: Context<any, any, any>) => {
      return 'Command C result';
    });

    describe('When I use the command bus middleware to execute a command ', () => {
      it('Then the correct handler is called And the Next callback is not called', async () => {
        const commandB: Command = {
          type: 'command',
          name: 'CommandB',
          payload: {},
        };

        const mockNext = jest.fn(async () => {});

        const context = {
          useCase: commandB,
          dependencies: {},
          result: undefined,
        };

        await commandBus.middleware(context, mockNext);

        expect(context.result).toStrictEqual('Command B result');
        expect(mockNext.mock.calls.length).toStrictEqual(0);
      });
    });

    describe('When I use the command bus middleware to execute a query ', () => {
      it('Then the next callback is called directly', async () => {
        const query: Query = {
          type: 'query',
          name: 'Query',
          payload: {},
        };

        const mockNext = jest.fn(async () => {});

        const context = {
          useCase: query,
          dependencies: {},
          result: undefined,
        };

        // @ts-expect-error
        await commandBus.middleware(context, mockNext);

        expect(context.result).toBeUndefined();
        expect(mockNext.mock.calls.length).toStrictEqual(1);
      });
    });

    describe('When I use the command bus middleware to execute an unregistered command ', () => {
      it('Then an error is thrown', async () => {
        const commandD: Command = {
          type: 'command',
          name: 'CommandD',
          payload: {},
        };

        const mockNext = jest.fn(async () => {});

        const context = {
          useCase: commandD,
          dependencies: {},
          result: undefined,
        };

        let error;
        try {
          await commandBus.middleware(context, mockNext);
        } catch (err: any) {
          error = err;
        }

        expect(error.message).toStrictEqual(
          'There is no command handler registered for this command name',
        );
        expect(error.name).toStrictEqual('RangeError');
      });
    });
  });
});
