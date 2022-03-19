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

export async function inspectContentHandler(
  context: InspectContentContext,
): Promise<InspectContentResult> {
  const { inventory } = context.dependencies;

  return inventory.items.map((item) => item);
}
