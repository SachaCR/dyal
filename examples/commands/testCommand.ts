import { Command, Context } from '../../src';
import { AppDependencies } from '../interfaces';

export type TestCommandContext = Context<
  AppDependencies,
  TestCommand,
  TestCommandResult
>;

export class TestCommand implements Command {
  public name: 'TestCommand';
  public type: 'command';
  public payload: { name: string };

  constructor(name) {
    this.name = 'TestCommand';
    this.type = 'command';
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
  logger('Command handler', ctx.useCase);
  const name = ctx.useCase.payload.name;
  return { fullName: `${name} Smith` };
}
