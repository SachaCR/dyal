const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const cqrsApp = require('../../dist/src/index');

Given('a CQRS app', function () {
  const app = cqrsApp.createApp({});
  const commandBus = cqrsApp.createCommandBus();

  commandBus.register('CommandA', async (ctx) => {
    return 'A';
  });

  commandBus.register('CommandB', async (ctx) => {
    return 'B';
  });

  commandBus.register('CommandC', async (ctx) => {
    return 'C';
  });

  app.on('command').use(commandBus.middleware);

  this.app = app;
});

Given('command handlers are regitered for command types A, B ,C', function () {
  const app = cqrsApp.createApp({});
  const commandBus = cqrsApp.createCommandBus();

  commandBus.register('CommandA', async (ctx) => {
    return 'A';
  });

  commandBus.register('CommandB', async (ctx) => {
    return 'B';
  });

  commandBus.register('CommandC', async (ctx) => {
    return 'C';
  });

  app.on('command').use(commandBus.middleware);

  this.app = app;
});

When('I execute a {string} command', async function (commandType) {
  const command = {
    actionType: 'command',
    name: commandType,
    payload: {},
  };

  try {
    const result = await this.app.execute(command);
    this.result = result;
  } catch (err) {
    this.result = err.name;
  }
});

Then('it should return {string}', function (result) {
  assert.strictEqual(this.result, result);
});
