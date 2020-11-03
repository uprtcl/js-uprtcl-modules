import { LitElement } from 'lit-element';
export declare class UprtclToggle extends LitElement {
    icon: string;
    disabled: boolean;
    active: boolean;
    handleToggleClick(): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
