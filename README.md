# cqrs-app

Simple CQRS app framework

# Example Usage Overview:

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
