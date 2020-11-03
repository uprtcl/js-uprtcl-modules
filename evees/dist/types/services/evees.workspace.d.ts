import { ApolloClient } from 'apollo-boost';
import { Entity, PatternRecognizer } from '@uprtcl/cortex';
import { UpdateRequest, NewPerspectiveData } from '../types';
export declare class EveesWorkspace {
    protected recognizer?: PatternRecognizer | undefined;
    private entities;
    private newPerspectives;
    private updates;
    workspace: ApolloClient<any>;
    constructor(client: ApolloClient<any>, recognizer?: PatternRecognizer | undefined);
    private buildWorkspace;
    hasUpdates(): boolean;
    isSingleAuthority(remote: string): Promise<boolean>;
    getUpdates(): UpdateRequest[];
    getEntities(): Entity<any>[];
    getNewPerspectives(): NewPerspectiveData[];
    create(entity: Entity<any>): void;
    newPerspective(newPerspective: NewPerspectiveData): void;
    update(update: UpdateRequest): void;
    cacheCreateEntity(client: ApolloClient<any>, entity: Entity<any>): void;
    cacheInitPerspective(client: ApolloClient<any>, newPerspective: NewPerspectiveData): void;
    cacheUpdateHead(client: ApolloClient<any>, update: UpdateRequest): void;
    /** takes the Evees actions and replicates them in another client  */
    execute(client: ApolloClient<any>): Promise<import("apollo-boost").FetchResult<any, Record<string, any>, Record<string, any>>[]>;
    executeCreate(client: ApolloClient<any>): Promise<void[]>;
    precacheInit(client: ApolloClient<any>): void;
    private executeInit;
    /** copies the new perspective data (head) in the workspace into the
     *  cache of an apollo client */
    precacheNewPerspectives(client: ApolloClient<any>): Promise<void>;
    executeUpdate(client: ApolloClient<any>): Promise<import("apollo-boost").FetchResult<any, Record<string, any>, Record<string, any>>[]>;
}
