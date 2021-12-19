/**
 * This represent the context that will be passed along the middleware stack
 * @type D Dependencies of your application
 * @type A The action to execut. It can be a Command or a Query.
 * @type R The command's result
 */
export interface Context<D, A extends Action, R> {
  dependencies: D;
  action: A;
  result?: R;
}

export type Action = Command | Query;

export interface Query {
  actionType: 'query';
  name: any;
  filters: any;
}

export interface Command {
  actionType: 'command';
  name: any;
  payload: any;
}

export type Middleware = <T extends Context<any, Action, any>>(
  context: T,
  next: Next,
) => Promise<void>;

export type Next = () => Promise<unknown>;

export type TargetAction = 'query' | 'command' | 'all';
