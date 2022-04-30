import Koa from 'koa';
import Router from 'koa-router';
import { createGameInventoryApp } from '..';
import { AddItemUseCase } from '../commands/addItem';

function validateAddItemBody(body: any): { error?: any } {
  return {};
}

const inventoryApp = createGameInventoryApp({
  items: [],
});

const app = new Koa();
const router = new Router();

router.post('/add-item', async (ctx: any) => {
  const body = ctx.request.body;
  const validationResult = validateAddItemBody(body);
  if (validationResult.error) {
    ctx.status = 400;
    ctx.response.body = validationResult.error;
    return;
  }

  const addItemCommand: AddItemUseCase = {
    type: 'command',
    name: 'AddItem',
    payload: { item: body.item },
  };

  const result = await inventoryApp.execute(addItemCommand);
  ctx.status = 200;
  ctx.response.body = result;
  return;
});

app.use(router.routes());
app.use(router.allowedMethods());
