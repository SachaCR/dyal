import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';

import { createApp, createCommandBus, createQueryBus } from '../../src';

Given('une application CQRS', function () {
  const app = createApp({});
  this.app = app;
});

Given(
  'des controlleurs ont été enregistré pour les commandes de types A, B, C',
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
  'des controlleurs ont été enregistré pour les requêtes de types D, E ,F',
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
  "j'éxécute une {string} de type {string}",
  async function (actionType, actionName) {
    const command = {
      actionType: actionType,
      name: actionName,
      payload: {},
    };

    try {
      const result = await this.app.execute(command);
      this.result = result;
    } catch (err: any) {
      this.result = err.name;
    }
  },
);

Then('je dois recevoir le resultat suivant: {string}', function (result) {
  assert.strictEqual(this.result, result);
});
