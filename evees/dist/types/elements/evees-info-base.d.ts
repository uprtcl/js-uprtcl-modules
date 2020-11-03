import { LitElement, TemplateResult } from 'lit-element';
import { ApolloClient } from 'apollo-boost';
import { Logger } from '@uprtcl/micro-orchestrator';
import { PatternRecognizer, Entity } from '@uprtcl/cortex';
import { EntityCache } from '@uprtcl/multiplatform';
import { MenuConfig, UprtclDialog } from '@uprtcl/common-ui';
import { Perspective, PerspectiveDetails, Commit, EveesConfig } from '../types';
import { MergeStrategy } from '../merge/merge-strategy';
import { Evees } from '../services/evees';
import { EveesRemote } from '../services/evees.remote';
import { EveesWorkspace } from '../services/evees.workspace';
import { EveesDiff } from './evees-diff';
interface PerspectiveData {
    id?: string;
    perspective?: Perspective;
    details?: PerspectiveDetails;
    canWrite?: Boolean;
    permissions?: any;
    head?: Entity<Commit>;
    data?: Entity<any>;
}
declare const EveesInfoBase_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesInfoBase extends EveesInfoBase_base {
    logger: Logger;
    uref: string;
    firstRef: string;
    parentId: string;
    defaultRemoteId: string | undefined;
    officialRemoteId: string | undefined;
    eveeColor: string;
    emitProposals: boolean;
    entityType: string | undefined;
    loading: Boolean;
    isLogged: boolean;
    isLoggedOnDefault: any;
    forceUpdate: string;
    showUpdatesDialog: boolean;
    loggingIn: boolean;
    creatingNewPerspective: boolean;
    proposingUpdate: boolean;
    makingPublic: boolean;
    firstHasChanges: boolean;
    merging: boolean;
    updatesDialogEl: UprtclDialog;
    eveesDiffEl: EveesDiff;
    eveesDiffInfoMessage: TemplateResult;
    perspectiveData: PerspectiveData;
    pullWorkspace: EveesWorkspace | undefined;
    protected client: ApolloClient<any>;
    protected config: EveesConfig;
    protected merge: MergeStrategy;
    protected evees: Evees;
    protected remote: EveesRemote;
    protected remotes: EveesRemote[];
    protected recognizer: PatternRecognizer;
    protected cache: EntityCache;
    /** official remote is used to indentity the special perspective, "the master branch" */
    protected officialRemote: EveesRemote | undefined;
    /** default remote is used to create new branches */
    protected defaultRemote: EveesRemote | undefined;
    firstUpdated(): Promise<void>;
    updated(changedProperties: any): void;
    /** must be called from subclass as super.load() */
    load(): Promise<void>;
    checkPull(fromUref: string): Promise<void>;
    getContextPerspectives(perspectiveId?: string): Promise<string[]>;
    connectedCallback(): void;
    login(): Promise<void>;
    logout(): Promise<void>;
    otherPerspectiveMerge(fromPerspectiveId: string, toPerspectiveId: string): Promise<void>;
    createMergeProposal(fromPerspectiveId: string, toPerspectiveId: string, fromHeadId: string, toHeadId: string | undefined, workspace: EveesWorkspace): Promise<void>;
    deletePerspective(perspectiveId?: string): Promise<void>;
    forkPerspective(perspectiveId?: string): Promise<void>;
    checkoutPerspective(perspectiveId: string): void;
    proposeMergeClicked(): Promise<void>;
    perspectiveTextColor(): "#37352f" | "#ffffff";
    delete(): Promise<void>;
    updatesDialog(workspace: EveesWorkspace, options: MenuConfig, message?: TemplateResult): Promise<string>;
    renderUpdatesDialog(): TemplateResult;
    renderFromToPerspective(toPerspectiveId: string, fromPerspectiveId: string): TemplateResult;
    renderLoading(): TemplateResult;
    /** overwrite */
    renderIcon(): TemplateResult;
    renderInfo(): TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
export {};
