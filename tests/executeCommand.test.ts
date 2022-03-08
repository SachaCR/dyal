import { CommandBus, Context, createApp, createCommandBus, Next } from '../src';

describe('app.execute()', () => {
  describe('Given an app', () => {
    const app = createApp({});

    describe('With a command bus that register multiple commands', () => {
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

      app.on('command').use(commandBus.middleware);

      describe('When I execute a CommandB command', () => {
        it('Then it should call CommandB handler', async () => {
          const result = await app.execute({
            actionType: 'command',
            name: 'CommandB',
            payload: {},
          });

          expect(result).toStrictEqual('Command B result');
        });
      });

      describe('When I execute an UnknownCommand', () => {
        it('Then it should throw an error', async () => {
          let error;

          try {
            await app.execute({
              actionType: 'command',
              name: 'UnknownCommand',
              payload: {},
            });
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
});
