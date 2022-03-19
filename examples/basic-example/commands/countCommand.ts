import { Command, Context } from '../../../src';
import { AppDependencies } from '../interfaces';

export type CountCommandContext = Context<
  AppDependencies,
  CountCommand,
  CountCommandResult
>;

export interface CountCommand extends Command {
  name: 'CountCommand';
  payload: { count: number };
}

export interface CountCommandResult {
  total: number;
}

export async function countCommandHandler(
  ctx: CountCommandContext,
): Promise<CountCommandResult> {
  const logger = ctx.dependencies.logger;
  logger('Command handler', ctx.useCase);
  return { total: ctx.useCase.payload.count };
}
