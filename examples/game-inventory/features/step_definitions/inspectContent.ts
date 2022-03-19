import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';

import { InspectContentCommand } from '../../queries/inspectContent';
import { createGameInventoryApp } from '../..';

Given('there is a sword in my inventory', function () {
  const app = createGameInventoryApp({ items: ['sword'] });
  this.inventoryApp = app;
});

When('I inspect its content', async function () {
  const inspectContentCommand: InspectContentCommand = {
    type: 'command',
    name: 'InspectContent',
    payload: undefined,
  };

  const result = await this.inventoryApp.execute(inspectContentCommand);

  this.result = result;
});

Then('it returns an item list that contains a sword', function () {
  assert.deepStrictEqual(this.result, ['sword']);
});

Then('it returns an empty item list', function () {
  assert.deepStrictEqual(this.result, []);
});

Then(
  'it returns an item list that contains a sword, a shield and a bow',
  function () {
    assert.deepStrictEqual(this.result, ['sword', 'shield', 'bow']);
  },
);
