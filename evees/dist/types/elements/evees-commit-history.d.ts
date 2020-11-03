import { LitElement } from 'lit-element';
interface CommitHistoryData {
    id: string;
    entity: {
        message: string;
        timestamp: number;
        parentCommits: Array<CommitHistoryData>;
    };
}
declare const CommitHistory_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class CommitHistory extends CommitHistory_base {
    commitId: string;
    private commitHistory;
    firstUpdated(): Promise<void>;
    loadCommitHistory(): Promise<void>;
    renderCommitHistory(commitHistory: CommitHistoryData): any;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
