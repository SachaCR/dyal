export interface AnyCommand {
  type: 'command';
  name: 'AnyCommand';
  payload: { name: string };
}

export interface AnyCommandResult {
  fullName: string;
}

export async function anyCommandHandler(ctx: any): Promise<AnyCommandResult> {
  const { logger } = ctx.dependencies;
  logger('Command handler', ctx.useCase);
  const name = ctx.useCase.payload.name;
  return { fullName: `${name} Smith` };
}
