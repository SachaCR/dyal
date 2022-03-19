import assert from 'assert';
import { When, Then } from '@cucumber/cucumber';

import { InspectContentCommand } from '../../queries/inspectContent';
import { RemoveItemCommand } from '../../commands/removeItem';

When('I remove the shield', async function () {
  const removeItemCommand: RemoveItemCommand = {
    type: 'command',
    name: 'RemoveItem',
    payload: {
      item: 'shield',
    },
  };

  const result = await this.inventoryApp.execute(removeItemCommand);

  this.result = result;
});

Then('it returns there is "No item to remove"', function () {
  assert.strictEqual(this.result, 'No item to remove');
});

Then('it returns the item has been removed', function () {
  assert.strictEqual(this.result, 'Item removed');
});

Then('the item is removed from the inventory', async function () {
  const inspectContentCommand: InspectContentCommand = {
    type: 'command',
    name: 'InspectContent',
    payload: undefined,
  };

  const result = await this.inventoryApp.execute(inspectContentCommand);
  assert.deepStrictEqual(result, ['sword', 'bow']);
});
