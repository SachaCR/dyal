import {
  createApp,
  CommandBus,
  createCommandBus,
  QueryBus,
  createQueryBus,
} from '../../src';

import {
  CountCommand,
  countCommandHandler,
  CountCommandResult,
} from './commands/countCommand';

import {
  AnyCommand,
  anyCommandHandler,
  AnyCommandResult,
} from './commands/anyCommand';

import {
  TestCommand,
  testCommandHandler,
  TestCommandResult,
} from './commands/testCommand';

import { AppDependencies } from './interfaces';
import { loggerMiddleware } from './middlewares/logger';
import {
  GetCountQuery,
  getCountQueryHandler,
  GetCountQueryResult,
} from './queries/getCountQuery';

async function run() {
  const dependencies: AppDependencies = { logger: console.log };
  const app = createApp(dependencies);

  const commandBus: CommandBus = createCommandBus();

  commandBus.register('CountCommand', countCommandHandler);
  commandBus.register('TestCommand', testCommandHandler);
  commandBus.register('AnyCommand', anyCommandHandler);

  const queryBus: QueryBus = createQueryBus();

  queryBus.register('GetCountQuery', getCountQueryHandler);

  app.use(loggerMiddleware);
  app.on('command').use(commandBus.middleware);
  app.on('query').use(queryBus.middleware);

  const countCommand: CountCommand = {
    type: 'command',
    name: 'CountCommand',
    payload: {
      count: 5,
    },
  };

  const testCommand = new TestCommand('John');

  const anyCommand: AnyCommand = {
    type: 'command',
    name: 'AnyCommand',
    payload: {
      name: 'Default',
    },
  };

  const getCountQuery: GetCountQuery = {
    type: 'query',
    name: 'GetCountQuery',
    filters: {},
  };

  const resultCount = await app.execute<CountCommandResult>(countCommand);
  console.log('resultCount:', resultCount.total);

  const resultTest = await app.execute<TestCommandResult>(testCommand);
  console.log('resultTest:', resultTest.fullName);

  const resultDefault = await app.execute<AnyCommandResult>(anyCommand);
  console.log('resultDefault:', resultDefault.fullName);

  const resultGetCount: GetCountQueryResult = await app.execute(getCountQuery);
  console.log('resultGetCount:', resultGetCount.count);
}

run().catch(console.error);
