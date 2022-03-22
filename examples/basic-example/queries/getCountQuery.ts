import { Query, Context } from '../../../src';
import { AppDependencies } from '../interfaces';

export type CountQueryContext = Context<
  AppDependencies,
  GetCountQuery,
  GetCountQueryResult
>;

export interface GetCountQuery extends Query {
  name: 'GetCountQuery';
  payload: {};
}

export interface GetCountQueryResult {
  count: number;
}

export async function getCountQueryHandler(
  ctx: CountQueryContext,
): Promise<GetCountQueryResult> {
  const logger = ctx.dependencies.logger;
  logger('Query handler', ctx.useCase);
  return { count: 123 };
}
