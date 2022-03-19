# DYAL

![test](https://github.com/SachaCR/dyal/actions/workflows/test.yml/badge.svg)

Simple application layer framework with CQRS tooling

This framework helps you Decouple Your Application Layer (DYAL) from your presentation layer.

It is inspired from Koa for the middlewares implementation except that it does not couple your application to HTTP presentation layer.
It let you free to choose any way to expose your app commands with HTTP, CLI, gRPC, etc...

[![https://nodei.co/npm/dyal.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/dyal.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/dyal)

`npm install dyal`

# Documentation:

- [Type Documentation](https://sachacr.github.io/dyal/)
- [Code Coverage Report](https://sachacr.github.io/dyal/jest/lcov-report/index.html)
- [Cucumber Tests Report](https://sachacr.github.io/dyal/features-report.html)

# Basic Example:

You can find this example and more advanced [here](https://github.com/SachaCR/dyal/tree/main/examples)

```typescript
// Declare the dependencies you will inject into your app.
type AppDependencies = {
  database: DBConnection;
  logger: Logger;
};

// Build the app and inject dependencies.
const app = createApp({
  database,
  logger,
});

// Mount handlers and middelwares to handle you app's use cases.
app.use(async (ctx: any) => {
  const results = await ctx.dependencies.database.query('SELECT * FROM ...');
  ctx.result = results;
});
```

# Typed Context Middlware Example:

You can type your middleware's context to know which `UseCase` it will handle, what `result` it must return and which are the `dependencies` that are available on the context.

You can find this example and more advanced [here](https://github.com/SachaCR/dyal/tree/main/examples)

```typescript
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

export async function addItemMiddleware(
  context: AddItemContext,
  next: Next,
): Promise<void> {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  if (useCase.type === 'command' && useCase.name !== 'AddItem') {
    await next();
    return;
  }

  const { item } = useCase.payload;

  if (inventory.items.length >= 3) {
    context.result = 'Inventory is full'; // Write the result in context.result
    return;
  }

  inventory.items.push(item);

  context.result = 'Item added'; // Write the result in context.result
  return;
}
```

As it is not very practical to always filter use cases in each middlewares.
DYAL provides `CommandBus` and `QueryBus`. These objects allows you to have two distinct middleware stacks for commands an queries and will handle the routing for you so you won't need to do that anymore:

```typescript
if (useCase.type === 'command' && useCase.name !== 'AddItem') {
  await next();
  return;
}
```

Notice that you are not forced to use them and you can write your own middlewares to handle use cases on your app.

# Command & Query Bus Example:

You can find this example and more advanced [here](https://github.com/SachaCR/dyal/tree/main/examples)

```typescript
  const dependencies: AppDependencies = { logger: console.log };

  const app = createApp(dependencies);

  const commandBus: CommandBus = createCommandBus();
  commandBus.register('CountCommand', countCommandHandler);

  const queryBus: QueryBus = createQueryBus();
  queryBus.register('GetCountQuery', getCountQueryHandler);

  app.use(loggerMiddleware);
  app.on('command').use(commandBus.middleware);
  app.on('query').use(queryBus.middleware);

  const countCommand: CountCommand = {
    actionType: 'command',
    name: 'CountCommand',
    payload: {
      count: 5,
    },
  };

  const resultCount = await app.execute<CountCommandResult>(countCommand);
  console.log('resultCount:', resultCount.total);

  const resultGetCount: GetCountQueryResult = await app.execute(getCountQuery);
  console.log('resultGetCount:', resultGetCount.count);
}
```

# Command & Query handlers examples:

Notice that by using `CommandBus` and `QueryBus`. You are not writting middlewares but command and query handlers. Their function signature is a bit different as they are not returning a `Promise<void>` and writing to the `context.result`. Instead they just return directly their expected return type: `Promise<AddItemResult>`. It's the command or query bus that will write the `context.result` for you.

Here is the same example as above, with command handler implementation:

```typescript
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

export async function addItemHandler(
  context: AddItemContext,
): Promise<AddItemResult> {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  const { item } = useCase.payload;

  if (inventory.items.length >= 3) {
    return 'Inventory is full'; // Return directly the expected return type
  }

  inventory.items.push(item);

  return 'Item added'; // Return directly the expected return type
}
```

# Middlewares:

You can create your own middleware like this:

```typescript
const dependencies: AppDependencies = { logger: console.log };

async function myLoggerMiddleware(
  ctx: Context<any, AppDependencies, any>,
  next: Next,
): Promise<void> {
  const { logger } = ctx.dependencies;
  logger(`Executing use case: ${ctx.useCase.type} ${ctx.useCase.name}`);
  await next();
}

const app = createApp(dependencies);

app.use(myLoggerMiddleware);
```
