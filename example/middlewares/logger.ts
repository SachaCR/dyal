import { Next } from '../../src';

import { AppContext } from '../interfaces';

export async function loggerMiddleware(
  ctx: AppContext,
  next: Next,
): Promise<void> {
  const { logger } = ctx.dependencies;
  logger(`-------------------------------------------------------------`);
  logger(`Start executing action: ${ctx.action.actionType} ${ctx.action.name}`);
  await next();
  logger('Action executed');
}
