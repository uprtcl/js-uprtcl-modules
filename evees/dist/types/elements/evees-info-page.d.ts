import { Logger } from '@uprtcl/micro-orchestrator';
import { EveesInfoBase } from './evees-info-base';
export declare class EveesInfoPage extends EveesInfoBase {
    logger: Logger;
    showPerspectives: boolean;
    showProposals: boolean;
    showAcl: boolean;
    showInfo: boolean;
    showEditName: boolean;
    parentId: string;
    draftTextField: any;
    firstUpdated(): Promise<void>;
    connectedCallback(): void;
    disconnectedCallback(): Promise<void>;
    editNameClicked(): Promise<void>;
    saveName(): Promise<void>;
    optionClicked(e: any): void;
    showPullChanges(): Promise<void>;
    renderPermissions(): import("lit-element").TemplateResult;
    renderNewPerspectiveButton(): import("lit-element").TemplateResult;
    renderMakeProposalButton(): import("lit-element").TemplateResult;
    renderPerspectiveActions(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
