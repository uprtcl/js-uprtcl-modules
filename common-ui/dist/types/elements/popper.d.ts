import { Logger } from '@uprtcl/micro-orchestrator';
import { LitElement } from 'lit-element';
export declare class UprtclPopper extends LitElement {
    logger: Logger;
    icon: string;
    position: string;
    disableDropdown: boolean;
    showDropdown: boolean;
    popperId: string;
    handleDocClick: (event: any) => void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    showDropDownClicked(e: any): void;
    updated(changedProperties: any): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
