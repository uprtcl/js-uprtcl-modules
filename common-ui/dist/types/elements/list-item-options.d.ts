import { LitElement } from 'lit-element';
import { MenuConfig } from './options-menu';
import './options-menu';
export declare class UprtclListItemWithOption extends LitElement {
    text: string;
    selected: string;
    config: MenuConfig;
    elementClicked(): void;
    optionClicked(e: CustomEvent): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
