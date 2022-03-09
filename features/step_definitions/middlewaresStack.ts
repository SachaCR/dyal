import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

import { Context, createApp, Next } from '../../src';

Given('a CQRS app with a test context', function () {
  const app = createApp({
    steps: [],
  });
  this.app = app;
});

Given(
  '3 middlewares that returns they have been called in the result',
  function () {
    type AppDependencies = {
      steps: string[];
    };

    this.app.use(
      async (ctx: Context<AppDependencies, any, any>, next: Next) => {
        ctx.dependencies.steps.push('in mid 1');
        await next();
        ctx.dependencies.steps.push('out mid 1');
      },
    );

    this.app.use(async (ctx: Context<any, any, any>, next: Next) => {
      ctx.dependencies.steps.push('in mid 2');
      await next();
      ctx.dependencies.steps.push('out mid 2');
    });

    this.app.use(async (ctx: Context<any, any, any>, next: Next) => {
      ctx.dependencies.steps.push('mid 3');
      ctx.result = ctx.dependencies.steps;
    });
  },
);

When('I execute an action', async function () {
  const result = await this.app.execute({
    actionType: 'command',
    name: 'TestCommand',
    payload: {},
  });

  this.result = result;
});

Then(
  'the result indicates all middlewares have been called in order and then backwards',
  function () {
    assert.deepStrictEqual(this.result, [
      'in mid 1',
      'in mid 2',
      'mid 3',
      'out mid 2',
      'out mid 1',
    ]);
  },
);
