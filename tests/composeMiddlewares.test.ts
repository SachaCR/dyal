import { composeMiddlewares } from '../src/composeMiddlewares';

describe('composeMiddlewares()', () => {
  describe('Given an empty array of middlwares', () => {
    describe('When I compose them', () => {
      it('Then it does not throws', () => {
        composeMiddlewares([]);
      });
    });
  });

  describe('Given an empty array of invalid middlewares', () => {
    describe('When I compose them', () => {
      it('Then it throws', () => {
        let error;

        try {
          //@ts-expect-error
          composeMiddlewares(['toto']);
        } catch (err: any) {
          error = err;
        }

        expect(error.message).toStrictEqual(
          'Middleware must be composed of functions!',
        );
      });
    });
  });

  describe('Given an invalid middlewares', () => {
    describe('When I compose them', () => {
      it('Then it throws', () => {
        let error;

        try {
          //@ts-expect-error
          composeMiddlewares('toto');
        } catch (err: any) {
          error = err;
        }

        expect(error.message).toStrictEqual(
          'Middleware stack must be an array!',
        );
      });
    });
  });
});
