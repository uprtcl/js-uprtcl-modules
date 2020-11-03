import { Signed } from '@uprtcl/cortex';
import { CidConfig } from '@uprtcl/multiplatform';
import { Secured } from './cid-hash';
export declare function signObject<T>(object: T): Signed<T>;
export declare function extractSignedEntity(object: object): any | undefined;
export declare function deriveSecured<O>(object: O, config?: CidConfig): Promise<Secured<O>>;
