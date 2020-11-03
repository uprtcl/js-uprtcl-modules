import { interfaces } from 'inversify';
import { MicroModule, i18nextModule } from '@uprtcl/micro-orchestrator';
import { PatternsModule } from '@uprtcl/cortex';
import { CASModule } from '@uprtcl/multiplatform';
import { GraphQlSchemaModule } from '@uprtcl/graphql';
import { CommonUIModule } from '@uprtcl/common-ui';
import { EveesRemote } from './services/evees.remote';
import { EveesConfig } from './types';
/**
 * Configure a _Prtcl Evees module with the given service providers
 *
 * Example usage:
 *
 * ```ts
 * import { MicroOrchestrator } from '@uprtcl/micro-orchestrator';
 * import { IpfsStore } from '@uprtcl/ipfs-provider';
 * import { HttpConnection } from '@uprtcl/http-provider';
 * import { EthereumConnection } from '@uprtcl/ethereum-provider';
 * import { EveesModule, EveesEthereum, EveesHttp } from '@uprtcl/evees';
 *
 * const ipfsConfig = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' };
 *
 * const cidConfig = { version: 1, type: 'sha2-256', codec: 'raw', base: 'base58btc' };
 *
 * // Don't put anything on host to get from Metamask's ethereum provider
 * const ethConnection = new EthereumConnection({});
 *
 * const eveesEth = new EveesEthereum(ethConnection, ipfsConfig, cidConfig);
 *
 * const httpConnection = new HttpConnection();
 *
 * const httpEvees = new EveesHttp('http://localhost:3100/uprtcl/1', httpConnection, ethConnection, cidConfig);
 *
 * const evees = new EveesModule([httpEvees, eveesEth], httpEvees);
 *
 * const orchestrator = new MicroOrchestrator();
 *
 * await orchestrator.loadModule(evees);
 * ```
 *
 *
 * @param eveesProviders array of remote services that implement Evees behaviour
 * @param defaultRemote default remote service to which to create Perspective and Commits
 */
export declare class EveesModule extends MicroModule {
    protected eveesProviders: Array<EveesRemote>;
    protected config?: EveesConfig | undefined;
    static id: string;
    dependencies: never[];
    static bindings: {
        PerspectiveType: string;
        CommitType: string;
        EveesRemote: string;
        MergeStrategy: string;
        Evees: string;
        Config: string;
        Remote: string;
    };
    constructor(eveesProviders: Array<EveesRemote>, config?: EveesConfig | undefined);
    onLoad(container: interfaces.Container): Promise<void>;
    get submodules(): (GraphQlSchemaModule | i18nextModule | PatternsModule | CASModule | CommonUIModule)[];
}
