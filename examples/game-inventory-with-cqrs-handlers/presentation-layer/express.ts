import express from 'express';
import { createGameInventoryApp } from '..';
import { AddItemUseCase } from '../commands/addItem';

function validateAddItemBody(body: any): { error?: any } {
  return {};
}

const inventoryApp = createGameInventoryApp({
  items: [],
});

const app = express();

app.post('/add-item', async (req, res) => {
  const body = req.body;
  const validationResult = validateAddItemBody(body);
  if (validationResult.error) {
    res.status(400).json(validationResult.error);
    return;
  }

  const addItemCommand: AddItemUseCase = {
    type: 'command',
    name: 'AddItem',
    payload: { item: body.item },
  };

  const result = await inventoryApp.execute(addItemCommand);
  res.status(200).json(result);
  return;
});
