import { Command, Context } from '../src';

export interface AppDependencies {
  logger: (...args: any[]) => void;
}

export type AppContext = Context<AppDependencies, Command, any>;
