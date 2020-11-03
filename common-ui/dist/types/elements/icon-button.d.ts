import { LitElement } from 'lit-element';
export declare class UprtclIconButton extends LitElement {
    icon: string;
    button: boolean;
    skinny: boolean;
    disabled: boolean;
    loading: boolean;
    /** Seems I cant prevent the click event from being emitted outside of this element  */
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
