import { Context, Next, Query } from '../../../src';

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

export async function inspectContentMiddleware(
  context: InspectContentContext,
  next: Next,
) {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  if (useCase.type !== 'query' || useCase.name !== 'InspectContent') {
    await next();
    return;
  }

  context.result = inventory.items.map((item) => item);
}
