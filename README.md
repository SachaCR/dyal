# cqrs-app

Simple application layer framework with CQRS tooling

This framework helps you decouple your application layer from your presentation layer.

It is inspired from Koa for the middlewares implementation except that it does not couple your application to HTTP presentation layer.
It let you free to choose any way to expose your app commands with HTTP, CLI, gRPC, etc...

Also this framework allows you to implement CQRS pattern by providing a command bus and query bus utilities.
Notice that you are not forced to use them and you can write your own middlewares to handle action on your app.

# Basic Example Usage:

```typescript
type AppDependencies = {
  database: DBConnection;
};

const app = createApp({
  database,
});

app.use(async (ctx: Context<any, any, any>, next: Next) => {
  const results = await ctx.dependencies.database.query('SELECT * FROM ...');
  ctx.result = results;
});
```

# CQRS Example Usage Overview:

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

# Documentation:

The documentation is available here.
