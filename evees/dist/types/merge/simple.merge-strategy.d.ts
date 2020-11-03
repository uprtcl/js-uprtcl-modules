import { ApolloClient } from 'apollo-boost';
import { EntityCache } from '@uprtcl/multiplatform';
import { PatternRecognizer, Entity } from '@uprtcl/cortex';
import { Evees } from '../services/evees';
import { MergeStrategy } from './merge-strategy';
import { EveesWorkspace } from '../services/evees.workspace';
export declare class SimpleMergeStrategy implements MergeStrategy {
    protected evees: Evees;
    protected recognizer: PatternRecognizer;
    protected client: ApolloClient<any>;
    protected entityCache: EntityCache;
    constructor(evees: Evees, recognizer: PatternRecognizer, client: ApolloClient<any>, entityCache: EntityCache);
    mergePerspectivesExternal(toPerspectiveId: string, fromPerspectiveId: string, workspace: EveesWorkspace, config: any): Promise<string>;
    mergePerspectives(toPerspectiveId: string, fromPerspectiveId: string, workspace: EveesWorkspace, config: any): Promise<string>;
    protected loadPerspectiveData(perspectiveId: string): Promise<Entity<any>>;
    protected loadCommitData(commitId: string | undefined): Promise<Entity<any> | undefined>;
    findLatestNonFork(commitId: string): any;
    mergeCommits(toCommitIdOrg: string | undefined, fromCommitIdOrg: string, remote: string, workspace: EveesWorkspace, config: any): Promise<string>;
    mergeData<T extends object>(originalData: T, newDatas: T[], workspace: EveesWorkspace, config: any): Promise<T>;
    mergeLinks(originalLinks: string[], modificationsLinks: string[][], workspace: EveesWorkspace, config: any): Promise<string[]>;
}
