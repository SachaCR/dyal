import { Command, Context, Next } from 'dyal';

import { AppDependencies, GameObject } from '..';

type AddItemContext = Context<AppDependencies, AddItemCommand, AddItemResult>;

export interface AddItemCommand extends Command {
  name: 'AddItem';
  payload: {
    item: GameObject;
  };
}

export type AddItemResult = 'Inventory is full' | 'Item added';

export async function addItemMiddleware(context: AddItemContext, next: Next) {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  if (useCase.type !== 'command' || useCase.name !== 'AddItem') {
    await next();
    return;
  }

  const { item } = useCase.payload;

  if (inventory.items.length >= 3) {
    context.result = 'Inventory is full';
    return;
  }

  inventory.items.push(item);

  context.result = 'Item added';
  return;
}
