import { Signed, Entity } from '@uprtcl/cortex';
import { CidConfig } from '@uprtcl/multiplatform';
export declare function hashObject(object: object, config?: CidConfig): Promise<string>;
export declare type Secured<T> = Entity<Signed<T>>;
export declare function deriveEntity<O extends object>(object: O, config?: CidConfig): Promise<Entity<O>>;
