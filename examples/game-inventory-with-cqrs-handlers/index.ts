import { createApp, createCommandBus, createQueryBus } from 'dyal';
import { addItemHandler } from './commands/addItem';
import { removeItemHandler } from './commands/removeItem';
import { inspectContentHandler } from './queries/inspectContent';

export type GameObject = 'sword' | 'shield' | 'bow' | 'spear';

export type GameInventory = { items: GameObject[] };

export type AppDependencies = {
  inventory: GameInventory;
};

export function createGameInventoryApp(inventory: GameInventory) {
  const gameInventoryApp = createApp<AppDependencies>({
    inventory,
  });

  const commandBus = createCommandBus();
  commandBus.register('AddItem', addItemHandler);
  commandBus.register('RemoveItem', removeItemHandler);

  gameInventoryApp.on('command').use(commandBus.middleware);

  const queryBus = createQueryBus();
  queryBus.register('InspectContent', inspectContentHandler);

  gameInventoryApp.on('query').use(queryBus.middleware);

  return gameInventoryApp;
}
