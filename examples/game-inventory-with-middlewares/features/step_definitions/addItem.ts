import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';

import { createGameInventoryApp } from '../../index';
import { AddItemCommand } from '../../commands/addItem';
import { InspectContentQuery } from '../../queries/inspectContent';

Given('there is nothing in my inventory', function () {
  const app = createGameInventoryApp({ items: [] });
  this.inventoryApp = app;
});

Given('my inventory is full with a sword, a shield and a bow', function () {
  const app = createGameInventoryApp({ items: ['sword', 'shield', 'bow'] });
  this.inventoryApp = app;
});

When('I try to add a sword', async function () {
  const addItemCommand: AddItemCommand = {
    type: 'command',
    name: 'AddItem',
    payload: {
      item: 'sword',
    },
  };

  const result = await this.inventoryApp.execute(addItemCommand);

  this.result = result;
});

When('I try to add a spear', async function () {
  const addItemCommand: AddItemCommand = {
    type: 'command',
    name: 'AddItem',
    payload: {
      item: 'spear',
    },
  };

  const result = await this.inventoryApp.execute(addItemCommand);

  this.result = result;
});

Then('it returns the item has been added', function () {
  assert.strictEqual(this.result, 'Item added');
});

Then('the sword is added to the inventory', async function () {
  const inspectContentQuery: InspectContentQuery = {
    type: 'query',
    name: 'InspectContent',
    filters: undefined,
  };

  const result = await this.inventoryApp.execute(inspectContentQuery);
  assert.deepStrictEqual(result, ['sword']);
});

Then('it returns that my inventory is full', function () {
  assert.strictEqual(this.result, 'Inventory is full');
});

Then('the spear is not added to the inventory', async function () {
  const inspectContentQuery: InspectContentQuery = {
    type: 'query',
    name: 'InspectContent',
    filters: undefined,
  };

  const result = await this.inventoryApp.execute(inspectContentQuery);
  assert.deepStrictEqual(result, ['sword', 'shield', 'bow']);
});
