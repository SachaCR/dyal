import { createApp } from '../../src';
import { addItemMiddleware } from './commands/addItem';

export type GameObject = 'sword' | 'shield' | 'bow';

export type GameInventory = { items: GameObject[] };

export type AppDependencies = {
  inventory: GameInventory;
};

const app = createApp<AppDependencies>({
  inventory: { items: [] },
});

app.on('command').use(addItemMiddleware);
app.on('all').use(addItemMiddleware);
app.use(addItemMiddleware);
