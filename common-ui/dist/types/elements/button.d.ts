import { LitElement } from 'lit-element';
export declare class UprtclButton extends LitElement {
    icon: string;
    transition: boolean;
    disabled: boolean;
    skinny: boolean;
    raised: boolean;
    /** Seems I cant prevent the click event from being emitted outside of this element  */
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
