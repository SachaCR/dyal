---
title: Decouple Your Application Layer
published: false
description: This article introduces you to DYAL, a small library that helps you decouple your application layer from your presentation layer.
tags: CQRS, typescript, DDD, nodejs
//cover_image: https://direct_url_to_image.jpg
---

In the past, I used to work on some Nodejs projects where a lot of things were mixed: business logic, data layer, HTTP, route handlers, etc...

Most of the time presentation layer (HTTP) and the application layer were tightly coupled.

If you take an Express or Koa application, it's common to find business logic in middlewares and route handlers. It's ok if your app is small, there is no need to over-engineer simple things.

The problem with this is you are coupling your application layer to Express and HTTP. As your application grows and your use cases become more complex you start having trouble testing your routes handlers.

As Uncle Bob says "_Web is a detail_".

## Start with the why

At Spendesk, we build microservices with four layers following [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design) principles (If you are interested in DDD, you should read this great [book](https://www.amazon.fr/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215/ref=asc_df_0321125215/?tag=googshopfr-21&linkCode=df0&hvadid=54193931092&hvpos=&hvnetw=g&hvrand=12069762422946850339&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9056598&hvtargid=pla-125562405915&psc=1) by Eric Evans):

- The `domain layer` contains your domain logic.
- The `application layer` contains your business use cases.
- The `infrastructure layer` provides data sources and repositories to persist your data.
- The `presentation layer` exposes your application features to your end-user.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vvffqnq98pjk1ke1ldc3.png)

During our design phase, we tried to follow these layers structure. We built a piece of software called the dispatcher that takes a command object and executes it. This dispatcher finds the correct handler for the command and will return the result. This way the HTTP layer(presentation) is just transforming a HTTP payload into a command object and asking the dispatcher (application layer) to execute it.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wx5gpvyg4xeym28c3u55.png)

We were really happy with this as it keeps our presentation layer really dumb with no business logic at all. Allowing us to have 2 differents presentation layers for our application because we need to expose it in two different ways to our users.

But, we had an issue. For legal reason we need to save every command our system receives. The problem with the dispatcher we implemented was that it only allows to register command handlers. A solution would have been for us to add code to save our commands in every handler. I was not really convinced it was a good idea, it creates code duplication and you can easily forget to add this piece of code.
So we started to create a wrapper around our command handlers that saves the command before calling the handler.
Honestly it was quite messy as we had to wrap all our handlers. I decided to improve the dispatcher by providing some pre and post hooks execution methods. It works fine, we can apply logic to all our commands handlers with these hooks.

```typescript
const dispatcher = createDispatcher();

dispatcher.preExecute(saveCommand);
dispatcher.postExecute(saveCommandResult);

dispatcher.register('Command1', command1Handler);
dispatcher.register('Command2', command2Handler);

// etc...
```

But I was still thinking that I would really appreciate something more flexible, something as flexible as a middleware system like Express or Koa.

This is why, I decided to start a small personal side project to implement a small [NPM package](https://www.npmjs.com/package/dyal) called DYAL (
Decouple Your Application Layer) that is basically an application layer with a middleware system.

The goals of DYAL are:

- **To make you focus on business logic and use cases.**
- **Allow you to choose or change your presentation layer later.**
- **Make your application easy to test.**
- **Bonus: Allows you to implement CQRS pattern.**

## How does it work?

> All examples in this article are available [here](https://github.com/SachaCR/dyal/tree/main/examples)

For this article, we will build an application module that manages a video game inventory.

The only business rule is:

- `The inventory can only contain three objects at the same time`

Let's create our app:

```typescript
import { createApp } from 'dyal';

export type GameObject = 'sword' | 'shield' | 'bow' | 'spear';

export type GameInventory = { items: GameObject[] };

export type AppDependencies = {
  inventory: GameInventory;
};

const gameInventoryApp = createApp<AppDependencies>({
  inventory: { items: [] },
});

gameInventoryApp.use(addItemMiddleware); // Command
gameInventoryApp.use(removeItemMiddleware); // Command
gameInventoryApp.use(inspectContentMiddleware); // Query
```

Our application allows three different actions:

- Add an item -> state changes, it's a command
- Remove an item -> state changes, it's a command
- Inspect our inventory content -> read the state, it's a query

If you are familiar with Express or Koa you have spotted that DYAL replicates the middleware stack feature with `app.use()`. The difference is those middlewares are not handling HTTP requests but `UseCase` objects that you will define according to your business use cases. A `UseCase` is either a `Command` or a `Query` object depending on if it modifies or reads your application state.

Now let's take a look at our `addItemMiddleware` that will handle a `Command` as it modifies our application state:

```typescript
import { UseCase, Context, Next } from 'dyal';

import { AppDependencies, GameObject } from '..';

export interface AddItemCommand extends UseCase {
  type: 'command';
  name: 'AddItem';
  payload: {
    item: GameObject;
  };
}

export type AddItemResult = 'Inventory is full' | 'Item added';

type AddItemContext = Context<AppDependencies, AddItemCommand, AddItemResult>;

export async function addItemMiddleware(context: AddItemContext, next: Next) {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  if (useCase.type === 'command' && useCase.name !== 'AddItem') {
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
```

We can see with this implementation that we'll need to repeat this piece of code in all our middlewares:

```typescript
if (useCase.type === 'command' && useCase.name !== 'AddItem') {
  await next();
  return;
}
```

That would be nice to have a way to automate that...
That's what I thought while implementing DYAL, so I did it.

DYAL provides `CommandBus` and `QueryBus` objects that route your commands and queries to the appropriate handler.
Let's migrate our application:

```typescript
1   const gameInventoryApp = createApp<AppDependencies>({
2     inventory,
3   });
4
5   const commandBus = createCommandBus();
6   commandBus.register('AddItem', addItemHandler);
7   commandBus.register('RemoveItem', removeItemHandler);
8
9   gameInventoryApp.on('command').use(logger) // Will log only the commands.
10  gameInventoryApp.on('command').use(commandBus.middleware);
11
12  const queryBus = createQueryBus();
13  queryBus.register('InspectContent', inspectContentHandler);
14
15  gameInventoryApp.on('query').use(queryBus.middleware);
```

And the command handler :

```typescript
export async function addItemHandler(
  context: AddItemContext,
): Promise<AddItemResult> {
  const { inventory } = context.dependencies;
  const { useCase } = context;

  const { item } = useCase.payload;

  if (inventory.items.length >= 3) {
    return 'Inventory is full'; // We don't write result in the context we return directly the expected result.
  }

  inventory.items.push(item);

  return 'Item added'; // We don't write the result in the context we return directly the expected result.
}
```

This example shows that you can have two different middleware stacks for commands and queries.

In the example above I added a logger only for the commands at line 9.
This could be interesting if, for example, you have specific needs on the command side that are not necessary on the query side like authentication, validation, etc...

This is at the core of the CQRS pattern and DYAL as a bonus allows you to implement it if you need.

## What's the value?

Ok let's see if we've reached our goals:

### 1. To make you focus on business logic and use cases:

This piece of code seems pretty explicit to me. It is not coupled with any communication protocol. It's pure business modelization:

```typescript
export interface AddItemCommand extends UseCase {
  type: 'command';
  name: 'AddItem';
  payload: {
    item: GameObject;
  };
}

// Notice that DYAL provides also utility types Command and Query
export interface RemoveItemCommand extends Command {
  name: 'RemoveItem';
  payload: {
    item: GameObject;
  };
}

export interface InspectContentQuery extends Query {
  name: 'InspectContent';
  payload: undefined;
}
```

### 2. Allows you to choose or change your presentation layer later:

Here is the diff if you decide to migrate from Express to Koa:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1has0sfzegi6fwi1dl6j.png)

Nothing has changed in my application layer. My presentation layer is limited to its role: validating user's inputs, reshaping them into a UseCase object, asking the application layer to execute the command.

This allows you to test any presentation layer with your app. So you can determine which one is the best fit.
Also if one day the presentation framework you use is deprecated or unmaintained you can migrate to a more recent one.

### 3. Makes your application easy to test:

If I want to test my app I can easily instantiate the app and build command and query objects directly. No need to set up an HTTP server and perform HTTP requests to verify my code works.

You can guarantee that your application use cases works as expected independently from the network or the UI.

### 4. Bonus: Allows you to implement CQRS pattern:

This one is a bonus but as we've seen we can completely separate the middleware stack that is used for command and queries which is one of the core principles of CQRS.

## Conclusion:

I think [DYAL](https://www.npmjs.com/package/dyal) could be useful if you have a large application with a lot of business logic. Please don't use it to implement a CRUD API it would be over-engineered.

But if you need to implement complex business use cases and want to avoid being too dependent on a presentation framework. Or you just prefer to wait before choosing one. DYAL could be a great tool for you.

Don't hesitate to tell me in the comments if you've tried it or are using it for your application. The package is in version 1.0.9 while I'm writing those lines. Let me know if you find bugs or have feedback I'll be happy to make some evolutions.

Thanks for having read that far.

Happy coding!
