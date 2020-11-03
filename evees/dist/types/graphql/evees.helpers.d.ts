import { ApolloClient } from 'apollo-boost';
import { CASStore } from '@uprtcl/multiplatform';
import { Entity, PatternRecognizer } from '@uprtcl/cortex';
import { EveesRemote } from '../services/evees.remote';
import { EveesConfig, Perspective } from '../types';
import { Secured } from '../utils/cid-hash';
export interface CreateCommit {
    dataId: string;
    parentsIds?: string[];
    creatorsIds?: string[];
    message?: string;
    timestamp?: number;
}
export interface CreatePerspective {
    headId?: string;
    parentId?: string;
    context?: string;
    name?: string;
    canWrite?: string;
    timestamp?: number;
    creatorId?: string;
}
export declare class EveesHelpers {
    static getPerspectiveHeadId(client: ApolloClient<any>, perspectiveId: string): Promise<string | undefined>;
    static canWrite(client: ApolloClient<any>, perspectiveId: string): Promise<boolean>;
    static getPerspectiveRemoteId(client: ApolloClient<any>, perspectiveId: string): Promise<string>;
    static getPerspectiveDataId(client: ApolloClient<any>, perspectiveId: string): Promise<string | undefined>;
    static getPerspectiveData(client: ApolloClient<any>, perspectiveId: string): Promise<Entity<any> | undefined>;
    static getCommitData(client: ApolloClient<any>, commitId: string): Promise<Entity<any>>;
    static getCommitDataId(client: ApolloClient<any>, commitId: string): Promise<string>;
    static getData(client: ApolloClient<any>, recognizer: PatternRecognizer, uref: string): Promise<Entity<any> | undefined>;
    static getChildren(client: ApolloClient<any>, recognizer: PatternRecognizer, uref: string): Promise<string[]>;
    static getDescendantsRec(client: ApolloClient<any>, recognizer: PatternRecognizer, uref: string, current: string[]): Promise<string[]>;
    static getDescendants(client: ApolloClient<any>, recognizer: PatternRecognizer, uref: string): Promise<string[]>;
    static createEntity(client: ApolloClient<any>, store: CASStore, object: any): Promise<any>;
    static createCommit(client: ApolloClient<any>, store: CASStore, commit: CreateCommit): Promise<any>;
    static createPerspective(client: ApolloClient<any>, remote: EveesRemote, perspective: CreatePerspective): Promise<any>;
    static updateHead(client: ApolloClient<any>, perspectiveId: string, headId: string): Promise<string>;
    static isAncestorCommit(client: ApolloClient<any>, perspectiveId: string, commitId: string, stopAt?: string): Promise<any>;
    static checkEmit(config: EveesConfig, client: ApolloClient<any>, eveesRemotes: EveesRemote[], perspectiveId: string): Promise<boolean>;
    static snapDefaultPerspective(remote: EveesRemote, creatorId?: string, context?: string, timestamp?: number, path?: string, fromPerspectiveId?: string, fromHeadId?: string): Promise<Secured<Perspective>>;
    static getHome(remote: EveesRemote, userId?: string): Promise<Secured<Perspective>>;
}
export declare class FindAncestor {
    protected client: ApolloClient<any>;
    protected lookingFor: string;
    protected stopAt?: string | undefined;
    done: boolean;
    constructor(client: ApolloClient<any>, lookingFor: string, stopAt?: string | undefined);
    checkIfParent(commitId: string): any;
}
