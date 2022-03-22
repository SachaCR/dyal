import { createApp } from '../../src';
import { addItemMiddleware } from './commands/addItem';
import { removeItemMiddleware } from './commands/removeItem';
import { inspectContentMiddleware } from './queries/inspectContent';

export type GameObject = 'sword' | 'shield' | 'bow' | 'spear';

export type GameInventory = { items: GameObject[] };

export type AppDependencies = {
  inventory: GameInventory;
};

export function createGameInventoryApp(inventory: GameInventory) {
  const gameInventoryApp = createApp<AppDependencies>({
    inventory,
  });

  gameInventoryApp.use(addItemMiddleware);
  gameInventoryApp.use(removeItemMiddleware);
  gameInventoryApp.use(inspectContentMiddleware);

  return gameInventoryApp;
}
