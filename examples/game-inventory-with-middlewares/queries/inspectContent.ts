import { Command, Context, Next } from 'dyal';

import { AppDependencies, GameObject } from '..';

type InspectContentContext = Context<
  AppDependencies,
  InspectContentCommand,
  InspectContentResult
>;

export interface InspectContentCommand extends Command {
  name: 'InspectContent';
  payload: undefined;
}

export type InspectContentResult = GameObject[];

export async function inspectContentMiddleware(
  context: InspectContentContext,
  next: Next,
) {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  if (useCase.type === 'command' && useCase.name !== 'InspectContent') {
    await next();
    return;
  }

  context.result = inventory.items.map((item) => item);
}
