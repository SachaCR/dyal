import { Query, Context } from '../../../src';

import { AppDependencies, GameObject } from '..';

type InspectContentContext = Context<
  AppDependencies,
  InspectContentQuery,
  InspectContentResult
>;

export interface InspectContentQuery extends Query {
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
