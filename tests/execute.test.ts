import { Context, createApp, Next } from '../src';

describe('app.execute()', () => {
  describe('Given I an app', () => {
    describe('With multiple middleware', () => {
      const app = createApp({
        steps: [],
      });

      type AppDependencies = {
        steps: string[];
      };

      app.use(async (ctx: Context<AppDependencies, any, any>, next: Next) => {
        ctx.dependencies.steps.push('in mid 1');
        await next();
        ctx.dependencies.steps.push('out mid 1');
      });

      app.use(async (ctx: Context<any, any, any>, next: Next) => {
        ctx.dependencies.steps.push('in mid 2');
        await next();
        ctx.dependencies.steps.push('out mid 2');
      });

      app.use(async (ctx: Context<any, any, any>, next: Next) => {
        ctx.dependencies.steps.push('mid 3');
        ctx.result = ctx.dependencies.steps;
      });

      describe('When I execute a tests command', () => {
        it('Then it should call middelwares in order and then backward', async () => {
          const result = await app.execute({
            name: 'TestCommand',
            payload: {},
          });

          expect(result).toStrictEqual([
            'in mid 1',
            'in mid 2',
            'mid 3',
            'out mid 2',
            'out mid 1',
          ]);
        });
      });
    });

    describe('With multiple middleware', () => {
      const context = {
        steps: [],
      };
      const app = createApp(context);

      type AppDependencies = {
        steps: string[];
      };

      app.use(async (ctx: Context<AppDependencies, any, any>, next: Next) => {
        ctx.dependencies.steps.push('in mid 1');
        await next();
        ctx.dependencies.steps.push('out mid 1');
      });

      app.use(async (ctx: Context<any, any, any>, next: Next) => {
        ctx.dependencies.steps.push('mid 2');
        throw new Error('Middleware 2 error');
      });

      describe('When I execute a tests command', () => {
        describe('And one middleware throws', () => {
          it('Then it should throw and stop the middlewares execution', async () => {
            let error;

            try {
              await app.execute({
                name: 'TestCommand',
                payload: {},
              });
            } catch (err: any) {
              error = err;
            }

            expect(error.message).toStrictEqual('Middleware 2 error');
            expect(context.steps).toStrictEqual([
              'in mid 1',
              'mid 2',
              // 'out mid 1', // This one is never reached
            ]);
          });
        });
      });
    });

    describe('With multiple middleware', () => {
      const context = {
        steps: [],
      };
      const app = createApp(context);

      type AppDependencies = {
        steps: string[];
      };

      describe('When a middleware calls next twice', () => {
        app.use(async (ctx: Context<AppDependencies, any, any>, next: Next) => {
          ctx.dependencies.steps.push('in mid 1');
          await next();
          await next();

          ctx.dependencies.steps.push('out mid 1');
        });

        app.use(async (ctx: Context<any, any, any>, next: Next) => {
          ctx.dependencies.steps.push('mid 2');
          ctx.result = 'test';
          await next();
        });

        it('Then it should throw', async () => {
          let error;

          try {
            await app.execute({
              name: 'TestCommand',
              payload: {},
            });
          } catch (err: any) {
            error = err;
          }

          expect(error.message).toStrictEqual('next() called multiple times');
          expect(context.steps).toStrictEqual(['in mid 1', 'mid 2']);
        });
      });
    });

    describe('With no middelwares', () => {
      describe('When I execute a test command', () => {
        it('Then it throw an error', async () => {
          const app = createApp({});
          let error;

          try {
            await app.execute({
              name: 'TestCommand',
              payload: {},
            });
          } catch (err: any) {
            error = err;
          }

          expect(error.message).toStrictEqual(
            'No result to return. At least one middleware must write the ctx.result object',
          );
        });
      });
    });
  });
});
