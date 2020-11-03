import { ApolloClient } from 'apollo-boost';
import { LitElement } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
import { EveesWorkspace } from '../services/evees.workspace';
import { EveesDiff } from './evees-diff';
declare const EveesProposalDiff_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesProposalDiff extends EveesProposalDiff_base {
    logger: Logger;
    proposalId: string;
    remoteId: string;
    summary: boolean;
    loading: boolean;
    eveesDiffEl: EveesDiff;
    protected client: ApolloClient<any>;
    protected workspace: EveesWorkspace;
    firstUpdated(): Promise<void>;
    updated(changedProperties: any): Promise<void>;
    loadProposal(): Promise<void>;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
