import { Command, Context, UseCase } from '../../../src';

import { AppDependencies, GameObject } from '..';

type AddItemContext = Context<AppDependencies, AddItemUseCase, AddItemResult>;

export interface AddItemUseCase {
  type: 'command';
  name: 'AddItem';
  payload: {
    item: GameObject;
  };
}

// You can also extend directly the command type if you prefer

// export interface AddItemCommand extends Command {
//   name: 'AddItem';
//   payload: {
//     item: GameObject;
//   };
// }

export type AddItemResult = 'Inventory is full' | 'Item added';

export async function addItemHandler(
  context: AddItemContext,
): Promise<AddItemResult> {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  const { item } = useCase.payload;

  if (inventory.items.length >= 3) {
    return 'Inventory is full';
  }

  inventory.items.push(item);

  return 'Item added';
}
