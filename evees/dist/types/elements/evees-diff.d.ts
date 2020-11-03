import { LitElement } from 'lit-element';
import { Logger, Dictionary } from '@uprtcl/micro-orchestrator';
import { PatternRecognizer } from '@uprtcl/cortex';
import { UpdateRequest, DiffLens } from '../types';
import { EveesWorkspace } from '../services/evees.workspace';
interface UpdateDetails {
    update?: UpdateRequest;
    newData: any;
    oldData: any;
    diffLense: DiffLens;
}
declare const EveesDiff_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesDiff extends EveesDiff_base {
    logger: Logger;
    rootPerspective: string;
    summary: boolean;
    workspace: EveesWorkspace;
    loading: boolean;
    updatesDetails: Dictionary<UpdateDetails>;
    protected recognizer: PatternRecognizer;
    firstUpdated(): Promise<void>;
    updated(changedProperties: any): Promise<void>;
    loadUpdates(): Promise<void>;
    renderUpdateDiff(details: UpdateDetails): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult | import("lit-element").TemplateResult[];
    static get styles(): import("lit-element").CSSResult;
}
export {};
