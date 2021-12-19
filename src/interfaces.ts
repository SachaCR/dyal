
/**
 * This represent the context that will be passed along the middleware stack
 * @type D Dependencies of you application
 * @type C Command to execute
 * @type R The command's result
 */
export interface Context<D, C extends Command, R> {
  dependencies: D;
  command: C;
  result?: R;
}

export interface Command { 
  name: any;
  payload: any;
}

export type Middleware = <T extends Context<any, Command, any>>(context: T, next: Next) => Promise<void>;

export type Next = () => Promise<unknown>;


