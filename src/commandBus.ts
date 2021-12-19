import { Command, Context, Action, Next } from './interfaces';

export type CommandHandler = <D, C extends Command, R>(
  context: Context<D, C, R>,
) => Promise<R>;

export type CommandBus = ReturnType<typeof createCommandBus>;

export function createCommandBus() {
  const commandHandlersMap = new Map<
    string,
    (context: Context<any, any, any>) => Promise<any>
  >();

  return {
    register: <D, C extends Command, R>(
      commandName: string,
      commandHandler: (context: Context<D, C, R>) => Promise<R>,
    ): void => {
      commandHandlersMap.set(commandName, commandHandler);
    },

    middleware: async function commandBusRoute<D, A extends Action, R>(
      context: Context<D, A, R>,
      next: Next,
    ): Promise<void> {
      const { action } = context;

      if (action.actionType !== 'command') {
        await next();
        return;
      }

      const command = action as Command;

      let commandHandler = commandHandlersMap.get(command.name);

      if (!commandHandler) {
        throw new RangeError(
          'There is no command handler registered for this command name',
        );
      }

      context.result = await commandHandler(context);

      return;
    },
  };
}
