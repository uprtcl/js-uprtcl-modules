import { LitElement } from 'lit-element';
export declare class UprtclTextField extends LitElement {
    label: string;
    value: string;
    focused: boolean;
    inputEl: HTMLInputElement;
    focus(): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
