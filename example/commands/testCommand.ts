import { Command, Context } from '../../src';
import { AppDependencies } from '../interfaces';

export type TestCommandContext = Context<
  AppDependencies,
  TestCommand,
  TestCommandResult
>;

export class TestCommand implements Command {
  public name: 'TestCommand';
  public actionType: 'command';
  public payload: { name: string };

  constructor(name) {
    this.name = 'TestCommand';
    this.actionType = 'command';
    this.payload = {
      name,
    };
  }
}

export interface TestCommandResult {
  fullName: string;
}

export async function testCommandHandler(
  ctx: TestCommandContext,
): Promise<TestCommandResult> {
  const logger = ctx.dependencies.logger;
  logger('Command handler', ctx.action);
  const name = ctx.action.payload.name;
  return { fullName: `${name} Smith` };
}
