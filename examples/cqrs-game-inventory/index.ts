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

  const queryBus = createQueryBus();
  commandBus.register('InspectContent', inspectContentHandler);

  gameInventoryApp.use(commandBus.middleware);
  gameInventoryApp.use(queryBus.middleware);

  return gameInventoryApp;
}
