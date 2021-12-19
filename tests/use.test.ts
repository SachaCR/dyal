import { Context, createApp, Next } from '../src';

describe('app.use()', () => {
  describe('Given I an app', () => {
    describe('With no dependency', () => {
      describe('When I use a middleware', () => {
        it('Then it should not throw', () => {
          const app = createApp({});
          app.use(async (ctx: Context<any, any, any>, next: Next) => {
            await next();
          });
        });
      });

      describe('When I try use a middleware that is not a function', () => {
        it('Then it should throw', () => {
          const app = createApp({});
          expect(() => {
            //@ts-expect-error
            app.use('toto');
          }).toThrowError('Middleware must be composed of functions');
        });
      });
    });
  });
});
