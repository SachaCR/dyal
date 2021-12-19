import { Next } from '../../src';

import { AppContext } from '../interfaces';

export async function loggerMiddleware(ctx: AppContext, next: Next): Promise<void> {
  const { logger } = ctx.dependencies;
  logger(`Start processing command: ${ctx.command.name}`);
  await next();
  logger('Command Processed');
}
