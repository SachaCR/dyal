import { Next } from '../../src';

import { AppContext } from '../interfaces';

export async function loggerMiddleware(
  ctx: AppContext,
  next: Next,
): Promise<void> {
  const { logger } = ctx.dependencies;
  logger(`-------------------------------------------------------------`);
  logger(`Start executing use case: ${ctx.useCase.type} ${ctx.useCase.name}`);
  await next();
  logger('UseCase executed');
}
