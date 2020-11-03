import { LitElement } from 'lit-element';
import { MenuConfig } from './options-menu';
export declare class UprtclDialog extends LitElement {
    resolved: Function | undefined;
    options: MenuConfig;
    optionClicked(e: any, option: any): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
