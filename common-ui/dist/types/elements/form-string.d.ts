import { LitElement } from 'lit-element';
export declare class UprtclFormString extends LitElement {
    fieldValue: string;
    fieldLabel: string;
    cancelIcon: string;
    acceptIcon: string;
    loading: boolean;
    newTitleEl: any;
    connectedCallback(): void;
    firstUpdated(): void;
    cancelClick(): void;
    acceptClick(): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
