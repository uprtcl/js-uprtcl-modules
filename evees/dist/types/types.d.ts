import { TemplateResult } from 'lit-element';
import { Behaviour } from '@uprtcl/cortex';
import { EveesRemote } from './services/evees.remote';
import { Secured } from './utils/cid-hash';
import { EveesWorkspace } from './services/evees.workspace';
export declare type Context = string;
export interface Perspective {
    remote: string;
    path: string;
    creatorId: string;
    context: string;
    timestamp: number;
    fromPerspectiveId?: string;
    fromHeadId?: string;
}
export declare const getAuthority: (perspective: Perspective) => string;
export interface PerspectiveDetails {
    name?: string;
    headId?: string | undefined;
}
export interface Commit {
    creatorsIds: string[];
    timestamp: number;
    message?: string;
    forking?: string;
    parentsIds: Array<string>;
    dataId: string;
}
export interface UpdateRequest {
    fromPerspectiveId?: string;
    oldHeadId?: string;
    perspectiveId: string;
    newHeadId: string;
}
export interface Proposal {
    id: string;
    creatorId?: string;
    timestamp?: number;
    toPerspectiveId: string;
    fromPerspectiveId?: string;
    toHeadId?: string;
    fromHeadId?: string;
    details: ProposalDetails;
}
export interface ProposalDetails {
    updates: UpdateRequest[];
    newPerspectives: NewPerspectiveData[];
}
export interface NewProposal {
    fromPerspectiveId: string;
    toPerspectiveId: string;
    fromHeadId: string;
    toHeadId: string;
    details: ProposalDetails;
}
export interface ProposalCreatedDetail {
    remote: string;
    proposalDetails: ProposalDetails;
}
export declare const PROPOSAL_CREATED_TAG: string;
export declare class ProposalCreatedEvent extends CustomEvent<ProposalCreatedDetail> {
    constructor(eventInitDict?: CustomEventInit<ProposalCreatedDetail>);
}
export interface NewPerspectiveData {
    perspective: Secured<Perspective>;
    details: PerspectiveDetails;
    parentId?: string;
}
export interface DiffLens {
    name: string;
    render: (workspace: EveesWorkspace, newEntity: any, oldEntity: any, summary: boolean) => TemplateResult;
    type?: string;
}
export interface HasDiffLenses<T = any> extends Behaviour<T> {
    diffLenses: () => DiffLens[];
}
export interface EveesConfig {
    defaultRemote?: EveesRemote;
    officialRemote?: EveesRemote;
    editableRemotesIds?: string[];
    emitIf?: {
        remote: string;
        owner: string;
    };
}
