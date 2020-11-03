import { LitElement } from 'lit-element';
import { UprtclPopper } from '@uprtcl/common-ui';
import { Logger } from '@uprtcl/micro-orchestrator';
import { ApolloClient } from 'apollo-boost';
declare const EveesInfoPopper_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesInfoPopper extends EveesInfoPopper_base {
    logger: Logger;
    uref: string;
    firstRef: string;
    parentId: string;
    officialOwner: string | undefined;
    checkOwner: boolean;
    eveeColor: string;
    showDraft: boolean;
    showProposals: boolean;
    showAcl: boolean;
    showInfo: boolean;
    showIcon: boolean;
    showDebug: boolean;
    emitProposals: boolean;
    officialId: string;
    creatorId: string;
    dropdownShown: boolean;
    infoPopper: UprtclPopper;
    protected client: ApolloClient<any>;
    firstUpdated(): Promise<void>;
    load(): Promise<void>;
    color(): string;
    updated(changedProperties: any): void;
    connectedCallback(): void;
    officialIdReceived(perspectiveId: string): void;
    handleDragStart(e: any): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
export {};
