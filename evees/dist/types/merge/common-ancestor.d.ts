import { ApolloClient } from 'apollo-boost';
import { Commit } from '../types';
import { Secured } from '../utils/cid-hash';
interface Path {
    visited: {
        [commitId: string]: boolean;
    };
    heads: string[];
}
export declare class FindMostRecentCommonAncestor {
    protected client: ApolloClient<any>;
    allCommits: {
        [key: string]: Secured<Commit>;
    };
    paths: Path[];
    constructor(client: ApolloClient<any>, commitsIds: string[]);
    private getMostRecentCommonAncestor;
    /**
     * Explore the given path: get the parents of its heads and prepare the path for the next iteration
     */
    private explorePath;
    getCommit(commitId: string): Promise<Secured<Commit>>;
    compute(): Promise<string | undefined>;
}
export default function findMostRecentCommonAncestor(client: ApolloClient<any>): (commitsIds: string[]) => Promise<string | undefined>;
export {};
