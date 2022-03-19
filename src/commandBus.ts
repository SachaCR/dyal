import { Command, Context, UseCase, Next } from './interfaces';

/**
 * The command bus registers command handlers that will be called if the command's name matches.
 * It exposes a middleware function that you can use in an app to mount the command bus on the middleware stack.
 * @example
 *```typescript
 * const app = createApp(dependencies);
 * const commandBus: CommandBus = createCommandBus();
 * commandBus.register('CommandA', countCommandHandler);
 * commandBus.register('CommandB', countCommandHandler);
 * commandBus.register('CommandC', countCommandHandler);
 * app.on('command').use(commandBus.middleware);
 * ```
 */
export interface CommandBus {
  /**
   * This function allows to declare a handler for a given command name.
   * @param commandName The command name that will trigger this command handler.
   * @param commandHandler The command handler called on each command where the commandName matches.
   * @example
   *```typescript
   * const app = createApp(dependencies);
   * const commandBus: CommandBus = createCommandBus();
   * commandBus.register('CountCommand', countCommandHandler);
   * app.on('command').use(commandBus.middleware);
   * ```
   */
  register<D, C extends Command, R>(
    commandName: string,
    commandHandler: (context: Context<D, C, R>) => Promise<R>,
  ): void;

  /**
   * This function is the middleware that your app should use to handle commands.
   * @param context
   * @param next
   * @example
   *```typescript
   * const app = createApp(dependencies);
   * const commandBus: CommandBus = createCommandBus();
   * commandBus.register('CountCommand', countCommandHandler);
   * app.on('command').use(commandBus.middleware);
   * ```
   */
  middleware<D, A extends UseCase, R>(
    context: Context<D, A, R>,
    next: Next,
  ): Promise<void>;
}

/**
 * this function returns a CommandBus object. It allows you to declare commands handler that will be called if the command's name matches.
 * @returns CommandBus
 * @example
 *```typescript
 * const app = createApp(dependencies);
 * const commandBus: CommandBus = createCommandBus();
 * commandBus.register('CommandA', countCommandHandler);
 * commandBus.register('CommandB', countCommandHandler);
 * commandBus.register('CommandC', countCommandHandler);
 * app.on('command').use(commandBus.middleware);
 * ```
 */
export function createCommandBus(): CommandBus {
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

    middleware: async function commandBusRoute<D, U extends UseCase, R>(
      context: Context<D, U, R>,
      next: Next,
    ): Promise<void> {
      const { useCase } = context;
      if (useCase.type !== 'command') {
        await next();
        return;
      }

      const command = useCase as Command;

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
