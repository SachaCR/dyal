# DYAL

![test](https://github.com/github/docs/actions/workflows/test.yml/badge.svg)

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

# Typed Context Example:

You can type your handler context to know which `UseCase` it will handle, what `result` it must return and which are the `dependencies` that are available on the context.

```typescript
export type CountCommandContext = Context<
  AppDependencies,
  CountCommand,
  CountCommandResult
>;

type AppDependencies = {
  logger: Logger;
};

export interface CountCommand extends Command {
  name: 'CountCommand';
  payload: { count: number };
}

export interface CountCommandResult {
  total: number;
}

export async function countCommandHandler(
  ctx: CountCommandContext,
): Promise<CountCommandResult> {
  const logger = ctx.dependencies.logger;
  logger('Command handler', ctx.useCase);
  return { total: ctx.useCase.payload.count + 1 };
}
```

Also DYAL allows you to implement CQRS pattern by providing a command bus and query bus utilities.
Notice that you are not forced to use them and you can write your own middlewares to handle use cases on your app.

# CQRS Example:

You can retrieve the full example here on github

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
