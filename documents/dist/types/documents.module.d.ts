import { interfaces } from 'inversify';
import { EveesContentModule } from '@uprtcl/evees';
/**
 * Configure a documents module with the given stores
 *
 * Depends on these modules being present: LensesModule, CortexModule, DiscoveryModule, i18nBaseModule
 *
 * Example usage:
 *
 * ```ts
 * import { IpfsStore } from '@uprtcl/ipfs-provider';
 * import { DocumentsModule } from '@uprtcl/documents';
 *
 * const ipfsStore = new IpfsStore({
 *   host: 'ipfs.infura.io',
 *   port: 5001,
 *   protocol: 'https'
 * });
 *
 * const docs = new DocumentsModule([ ipfsStore ]);
 * await orchestrator.loadModule(docs);
 * ```
 *
 * @param stores an array of CASStores in which the documents objects can be stored/retrieved from
 */
export declare class DocumentsModule extends EveesContentModule {
    static id: string;
    static bindings: {
        TextNodeType: string;
        DocumentsRemote: string;
    };
    providerIdentifier: string;
    onLoad(container: interfaces.Container): Promise<void>;
    get submodules(): import("@uprtcl/micro-orchestrator").MicroModule[];
}
