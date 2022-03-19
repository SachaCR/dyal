import { Command, Context, Next } from 'dyal';

import { AppDependencies, GameObject } from '..';

type RemoveItemContext = Context<
  AppDependencies,
  RemoveItemCommand,
  RemoveItemResult
>;

export interface RemoveItemCommand extends Command {
  name: 'RemoveItem';
  payload: {
    item: GameObject;
  };
}

export type RemoveItemResult = 'No item to remove' | 'Item removed';

export async function removeItemMiddleware(
  context: RemoveItemContext,
  next: Next,
) {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  if (useCase.type !== 'command' || useCase.name !== 'RemoveItem') {
    await next();
    return;
  }

  const { item } = useCase.payload;
  const itemToRemoveIndex = inventory.items.indexOf(item);

  if (itemToRemoveIndex === -1) {
    context.result = 'No item to remove';
    return;
  }

  inventory.items.splice(itemToRemoveIndex, 1);

  context.result = 'Item removed';
  return;
}
