export interface AnyCommand {
  actionType: 'command';
  name: 'AnyCommand';
  payload: { name: string };
}

export interface AnyCommandResult {
  fullName: string;
}

export async function anyCommandHandler(ctx: any): Promise<AnyCommandResult> {
  const { logger } = ctx.dependencies;
  logger('Command handler', ctx.action);
  const name = ctx.action.payload.name;
  return { fullName: `${name} Smith` };
}
