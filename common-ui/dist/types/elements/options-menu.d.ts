import { LitElement } from 'lit-element';
export interface MenuConfig {
    [key: string]: {
        text: string;
        icon?: string;
        skinny?: boolean;
        disabled?: boolean;
        background?: string;
    };
}
import { UprtclPopper } from './popper';
export declare class UprtclOptionsMenu extends LitElement {
    config: MenuConfig;
    icon: string;
    popper: UprtclPopper;
    optionClicked(key: string, e: any): void;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
