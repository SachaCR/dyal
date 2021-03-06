/**
 * This represent the context that will be passed along the middleware stack
 * @typeParam D Dependencies of your application
 * @typeParam U The usecase to execute. It can be a Command or a Query.
 * @typeParam R The command's result
 */
export interface Context<D, U extends UseCase, R> {
  dependencies: D;
  useCase: U;
  result?: R;
}

/**
 * A UseCase is either a Command or a Query
 */
export interface UseCase {
  type: 'command' | 'query';
  name: any;
  payload: any;
}

/**
 * The Query interface should be used to implement your query use case types.
 * @example
 * ```typescript
 * export interface GetCountQuery extends Query {
 *   name: 'GetCountQuery';
 *   payload: {};
 * }
 * ```
 */
export interface Query extends UseCase {
  type: 'query';
}
/**
 * The Command interface should be used to implement your command use case types.
 * @example
 * ```typescript
 * export interface CountCommand extends Command {
 *   name: 'CountCommand';
 *   payload: { count: number };
 * }
 * ```
 */
export interface Command extends UseCase {
  type: 'command';
}

/**
 * Middleware takes a context and a next callback to pass the control the next middleware in the stack.
 * @params context This is the use case context it contains dependencies and the use case to handle.
 * @params next It's the callback to call to pass the control to the next middleware in the stack.
 */
export type Middleware = <T extends Context<any, any, any>>(
  context: T,
  next: Next,
) => Promise<void>;

export type Next = () => Promise<unknown>;

export type UseCaseType = 'query' | 'command' | 'all';
