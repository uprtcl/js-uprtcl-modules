import { ApolloClient } from 'apollo-boost';
export declare const isAncestorOf: (client: ApolloClient<any>) => (ancestorId: string, commitId: string) => Promise<boolean>;
