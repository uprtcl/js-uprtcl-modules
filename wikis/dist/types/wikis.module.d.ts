import { Container } from 'inversify';
import { EveesContentModule } from '@uprtcl/evees';
/**
 * Configure a wikis module with the given providers
 *
 * Depends on: lensesModule, PatternsModule, multiSourceModule
 *
 * Example usage:
 *
 * ```ts
 * import { IpfsStore } from '@uprtcl/ipfs-provider';
 * import { WikisModule, WikisTypes } from '@uprtcl/wikis';
 *
 * const ipfsStore = new IpfsStore({
 *   host: 'ipfs.infura.io',
 *   port: 5001,
 *   protocol: 'https'
 * });
 *
 * const wikis = new WikisModule([ ipfsStore ]);
 * await orchestrator.loadModule(wikis);
 * ```
 *
 * @category CortexModule
 *
 * @param stores an array of CASStores in which the wiki objects can be stored/retrieved from
 */
export declare class WikisModule extends EveesContentModule {
    static id: string;
    static bindings: {
        WikiType: string;
        WikisRemote: string;
    };
    providerIdentifier: string;
    onLoad(container: Container): Promise<void>;
    get submodules(): import("@uprtcl/micro-orchestrator").MicroModule[];
}
