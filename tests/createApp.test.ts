import { createApp } from '../src';

describe('createApp()', () => {
  describe('Given I create an app', () => {
    describe('With no dependency', () => {
      it('Then it returns an app', () => {
        const app = createApp({});
        expect(app).toHaveProperty('use');
        expect(app).toHaveProperty('execute');
      });
    });
  });
});
