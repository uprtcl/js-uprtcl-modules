import { LitElement } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
import { Entity } from '@uprtcl/cortex';
import { Wiki } from '../types';
import { EveesWorkspace } from '@uprtcl/evees';
declare const WikiDiff_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class WikiDiff extends WikiDiff_base {
    logger: Logger;
    summary: boolean;
    workspace: EveesWorkspace;
    newData: Entity<Wiki>;
    oldData: Entity<Wiki>;
    loading: boolean;
    newPages: string[];
    deletedPages: string[];
    oldTitle: string;
    firstUpdated(): Promise<void>;
    loadChanges(): Promise<void>;
    renderPage(page: string, classes: string[]): import("lit-element").TemplateResult;
    renderTitleChange(title: string, classes: string[]): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
