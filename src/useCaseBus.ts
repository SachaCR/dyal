import { Command, Context, UseCase, Next, Query } from './interfaces';

export interface UseCaseBus<U extends UseCase> {
  register<D, R>(
    useCaseName: string,
    handler: (context: Context<D, U, R>) => Promise<R>,
  ): void;

  middleware<D, R>(context: Context<D, U, R>, next: Next): Promise<void>;
}

export type CommandBus = UseCaseBus<Command>;
export type QueryBus = UseCaseBus<Query>;

export function createCommandBus(): CommandBus {
  return createUseCaseBus<Command>('command');
}

export function createQueryBus(): QueryBus {
  return createUseCaseBus<Query>('query');
}

function createUseCaseBus<U extends UseCase>(
  useCaseType: 'command' | 'query',
): UseCaseBus<U> {
  const handlersMap = new Map<
    string,
    (context: Context<any, U, any>) => Promise<any>
  >();

  return {
    register: function useCaseBusRegister<D, R>(
      useCaseName: string,
      handler: (context: Context<D, U, R>) => Promise<R>,
    ): void {
      handlersMap.set(useCaseName, handler);
    },

    middleware: async function useCaseBusRoute<D, R>(
      context: Context<D, U, R>,
      next: Next,
    ): Promise<void> {
      const { useCase } = context;
      if (useCase.type !== useCaseType) {
        await next();
        return;
      }

      let handler = handlersMap.get(useCase.name);

      if (!handler) {
        throw new RangeError(
          `There is no ${useCaseType} handler registered for this ${useCaseType} name`,
        );
      }

      context.result = await handler(context);

      return;
    },
  };
}
