import { ApolloClient } from 'apollo-boost';
import { LitElement } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
declare const ProposalsList_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class ProposalsList extends ProposalsList_base {
    logger: Logger;
    perspectiveId: string;
    loadingProposals: boolean;
    proposalsIds: string[];
    remoteId: string;
    client: ApolloClient<any>;
    firstUpdated(): Promise<void>;
    load(): Promise<void>;
    updated(changedProperties: any): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
