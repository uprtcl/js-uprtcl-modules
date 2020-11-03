import { Logger } from '@uprtcl/micro-orchestrator';
import { UprtclPopper } from '@uprtcl/common-ui';
import { EveesInfoBase } from './evees-info-base';
import { EveesPerspectivesList } from './evees-perspectives-list';
import { ProposalsList } from './evees-proposals-list';
/** An evees info with
 *  - one official remote with the official perspective
 *  - one defaultRemote with one perspective per user */
export declare class EveesInfoUserBased extends EveesInfoBase {
    logger: Logger;
    showProposals: boolean;
    showDraftControl: boolean;
    showEditDraft: boolean;
    showInfo: boolean;
    showIcon: boolean;
    showAcl: boolean;
    showDebugInfo: boolean;
    officialOwner: string;
    checkOwner: boolean;
    officialId: string | undefined;
    mineId: string | undefined;
    author: string;
    isTheirs: boolean;
    isMine: boolean;
    isOfficial: boolean;
    hasPull: boolean;
    creatingMine: boolean;
    proposalsPopper: UprtclPopper;
    perspectivesPopper: UprtclPopper;
    perspectivesList: EveesPerspectivesList;
    eveesProposalsList: ProposalsList;
    firstUpdated(): Promise<void>;
    connectedCallback(): void;
    disconnectedCallback(): Promise<void>;
    /** overwrite  */
    updated(changedProperties: any): void;
    load(): Promise<void>;
    draftClicked(): void;
    closePoppers(): void;
    createDraft(): Promise<void>;
    seeDraft(): void;
    proposeDraft(): Promise<void>;
    seeOfficial(): void;
    showPull(): Promise<void>;
    optionOnMine(option: string): Promise<void>;
    checkoutPerspective(perspectiveId: any): void;
    color(): string;
    renderOtherPerspectives(): import("lit-element").TemplateResult;
    renderDraftControl(): import("lit-element").TemplateResult;
    renderProposals(): import("lit-element").TemplateResult;
    renderPermissions(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
