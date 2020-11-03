import { ApolloClient } from 'apollo-boost';
import { PatternRecognizer, Signed } from '@uprtcl/cortex';
import { Logger } from '@uprtcl/micro-orchestrator';
import { Perspective, EveesConfig } from '../types';
import { EveesRemote } from './evees.remote';
import { EveesWorkspace } from './evees.workspace';
/**
 * Main service used to interact with _Prtcl compatible objects and providers
 */
export declare class Evees {
    protected recognizer: PatternRecognizer;
    protected eveesRemotes: EveesRemote[];
    protected client: ApolloClient<any>;
    protected config: EveesConfig;
    logger: Logger;
    constructor(recognizer: PatternRecognizer, eveesRemotes: EveesRemote[], client: ApolloClient<any>, config: EveesConfig);
    /** Public functions */
    getRemote(remote: string | undefined): EveesRemote;
    /**
     * Returns the uprtcl remote that controls the given perspective, from its remote
     * @returns the uprtcl remote
     */
    getPerspectiveProvider(perspective: Signed<Perspective>): EveesRemote;
    /**
     * Returns the uprtcl remote that controls the given perspective, from its remote
     * @returns the uprtcl remote
     */
    getPerspectiveRemoteById(perspectiveId: String): Promise<EveesRemote>;
    isPerspective(id: string): Promise<boolean>;
    isPattern(id: string, type: string): Promise<boolean>;
    /**
     * receives an entity id and compute the actions that will
     * result on this entity being forked on a target remote
     * with a target owner (canWrite).
     *
     * it also makes sure that all entities are clonned
     * on the target remote default store.
     *
     * recursively fork entity children
     */
    fork(id: string, workspace: EveesWorkspace, remote: string, parentId?: string): Promise<string>;
    getEntityChildren(entity: object): string[];
    replaceEntityChildren(entity: object, newLinks: string[]): any;
    forkPerspective(perspectiveId: string, workspace: EveesWorkspace, remote?: string, parentId?: string, name?: string): Promise<string>;
    forkCommit(commitId: string, workspace: EveesWorkspace, remote: string, parentId?: string): Promise<string>;
    forkEntity(entityId: string, workspace: EveesWorkspace, remote: string, parentId?: string): Promise<string>;
}
