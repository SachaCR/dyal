import { Command, Context } from '../../src';
import { AppDependencies } from '../interfaces';

export type TestCommandContext = Context<AppDependencies, TestCommand, TestCommandResult>;
export interface TestCommand extends Command {
  name: 'TestCommand';
  payload: { name: string },
}
export interface TestCommandResult {
  fullName: string;
}

export async function testCommandHandler(ctx: TestCommandContext): Promise<TestCommandResult> {
  const logger = ctx.dependencies.logger;
  logger('Command handler', ctx.command);
  const name = ctx.command.payload.name;
  return { fullName: `${name} Smith` };
}
