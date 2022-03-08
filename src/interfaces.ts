/**
 * This represent the context that will be passed along the middleware stack
 * @typeParam D Dependencies of your application
 * @typeParam A The action to execute. It can be a Command or a Query.
 * @typeParam R The command's result
 */
export interface Context<D, A extends Action, R> {
  dependencies: D;
  action: A;
  result?: R;
}

/**
 * An Action is either a Command or a Query
 */
export type Action = Command | Query;

/**
 * The Query interface should be used to implement your queries types.
 * @example
 * ```typescript
 * export interface GetCountQuery extends Query {
 *   name: 'GetCountQuery';
 *   filters: {};
 * }
 * ```
 */
export interface Query {
  actionType: 'query';
  name: any;
  filters: any;
}

/**
 * The Command interface should be used to implement your commands types.
 * @example
 * ```typescript
 * export interface CountCommand extends Command {
 *   name: 'CountCommand';
 *   payload: { count: number };
 * }
 * ```
 */
export interface Command {
  actionType: 'command';
  name: any;
  payload: any;
}

/**
 * Middleware takes a context and a next callback to pass the control the next middleware in the stack.
 * @params context This is the action context it contains dependencies and the action to handle.
 * @params next It's the callback to call to pass the control to the next middleware in the stack.
 */
export type Middleware = <T extends Context<any, Action, any>>(
  context: T,
  next: Next,
) => Promise<void>;

export type Next = () => Promise<unknown>;

export type TargetAction = 'query' | 'command' | 'all';
