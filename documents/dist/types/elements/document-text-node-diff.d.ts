import { LitElement } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
import { Entity } from '@uprtcl/cortex';
import { EveesWorkspace } from '@uprtcl/evees';
import { TextNode } from '../types';
declare const TextNodeDiff_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class TextNodeDiff extends TextNodeDiff_base {
    logger: Logger;
    summary: boolean;
    workspace: EveesWorkspace;
    newData: Entity<TextNode>;
    oldData: Entity<TextNode>;
    firstUpdated(): Promise<void>;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
