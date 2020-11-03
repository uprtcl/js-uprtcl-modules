import { LitElement } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
declare const EveesAuthor_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesAuthor extends EveesAuthor_base {
    logger: Logger;
    userId: string;
    showName: boolean;
    short: boolean;
    color: string;
    loading: boolean;
    profile: any;
    image: any | undefined;
    blockie: HTMLElement;
    firstUpdated(): Promise<void>;
    updated(changedProperties: any): void;
    load(): Promise<void>;
    clicked(): void;
    render(): "" | import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
