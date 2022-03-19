import { Command, Context } from 'dyal';

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

export async function removeItemHandler(
  context: RemoveItemContext,
): Promise<RemoveItemResult> {
  const { inventory } = context.dependencies;
  const { useCase } = context;
  const { item } = useCase.payload;

  const itemToRemoveIndex = inventory.items.indexOf(item);

  if (itemToRemoveIndex === -1) {
    return 'No item to remove';
  }

  inventory.items.splice(itemToRemoveIndex, 1);

  return 'Item removed';
}
