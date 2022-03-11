import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';

import { createApp, createCommandBus, createQueryBus } from '../../src';

Given('a DYAL app', function () {
  const app = createApp({});
  this.app = app;
});

Given(
  'command handlers have been registered for command types A, B ,C',
  function () {
    const commandBus = createCommandBus();

    commandBus.register('CommandA', async (ctx) => {
      return 'A';
    });

    commandBus.register('CommandB', async (ctx) => {
      return 'B';
    });

    commandBus.register('CommandC', async (ctx) => {
      return 'C';
    });

    this.app.on('command').use(commandBus.middleware);
  },
);

Given(
  'query handlers have been registered for queries types D, E ,F',
  function () {
    const queryBus = createQueryBus();

    queryBus.register('QueryD', async (ctx) => {
      return 'D';
    });

    queryBus.register('QueryE', async (ctx) => {
      return 'E';
    });

    queryBus.register('QueryF', async (ctx) => {
      return 'F';
    });

    this.app.on('query').use(queryBus.middleware);
  },
);

When(
  'I execute a {string} {string}',
  async function (useCaseName, useCaseType) {
    const command = {
      type: useCaseType,
      name: useCaseName,
      payload: {},
    };

    try {
      const result = await this.app.execute(command);
      this.result = result;
    } catch (err: any) {
      this.result = `${err.name}: ${err.message}`;
    }
  },
);

Then('it should return the expected result: {string}', function (result) {
  assert.strictEqual(this.result, result);
});
