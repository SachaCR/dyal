import { createApp, CommandBus, createCommandBus } from '../src';

import { CountCommand, countCommandHandler, CountCommandResult } from './commands/countCommand';
import { TestCommand, testCommandHandler, TestCommandResult } from './commands/testCommand';
import { AppDependencies } from './interfaces';
import { loggerMiddleware } from './middlewares/logger';

async function run() {
  const dependencies: AppDependencies = { logger: console.log }
  const app = createApp(dependencies);
  
  const commandBus: CommandBus = createCommandBus();
  commandBus.register('CountCommand', countCommandHandler);
  commandBus.register('TestCommand', testCommandHandler);

  app.use(loggerMiddleware);
  app.use(commandBus.middleware);

  const countCommand: CountCommand = {
    name: 'CountCommand',
    payload: {
      count: 5,
    },
  }

  const testCommand: TestCommand = {
    name: 'TestCommand',
    payload: {
      name: 'John',
    },
  }

  const resultCount = await app.execute<CountCommandResult>(countCommand);
  console.log('resultCount:', resultCount.total);
  
  const resultTest = await app.execute <TestCommandResult>(testCommand);
  console.log('resultTest:', resultTest.fullName);
}

run().catch(console.error);