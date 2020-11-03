import { Logger } from '@uprtcl/micro-orchestrator';
import { LitElement } from 'lit-element';
import { EditorState } from 'prosemirror-state';
import { TextType } from '../../types';
export declare const APPEND_ACTION = "append";
export declare const FOCUS_ACTION = "focus";
declare enum ActiveSubMenu {
    LINK = "link",
    IMAGE = "image",
    VIDEO = "video"
}
export declare class DocumentTextNodeEditor extends LitElement {
    logger: Logger;
    type: TextType;
    init: string;
    toAppend: string;
    editable: string;
    toggleAction: string;
    action: any;
    focusInit: string;
    level: number;
    selected: Boolean;
    empty: Boolean;
    showMenu: Boolean;
    showUrlMenu: Boolean;
    showDimMenu: Boolean;
    activeSubMenu: ActiveSubMenu | null;
    editor: any;
    preventHide: Boolean;
    currentContent: string | undefined;
    connectedCallback(): void;
    firstUpdated(): void;
    updated(changedProperties: Map<string, any>): void;
    runAction(action: any): void;
    getValidInnerHTML(text: string): string;
    getValidDocHtml(text: string): string;
    getSlice(text: string): ChildNode | null | undefined;
    appendContent(content: string): void;
    enterPressedEvent(content: any, asChild: any): void;
    keydown(view: any, event: any): void;
    isEditable(): boolean;
    initEditor(): void;
    state2Html(state: EditorState): string;
    html2doc(text: string): any;
    dispatchTransaction(transaction: any): void;
    toHeading(lift: boolean): void;
    toParagraph(): void;
    reduceHeading(): void;
    changeType(type: TextType, lift: boolean): void;
    urlKeydown(event: any): void;
    setShowMenu(value: boolean): Promise<void>;
    subMenuClick(type: ActiveSubMenu): void;
    private resetSubMenu;
    subMenuConfirm(): void;
    subMenuCancel(): void;
    private isValidLink;
    getSubMenuFields(): {
        link: string;
        width: string;
        height: string;
    };
    applyLinkMark(): void;
    alignNodeToCenter(): void;
    applyImageNode(): void;
    parseYoutubeURL(url: string): string;
    applyIframeNode(): void;
    menuItemClick(markType: any): void;
    editorFocused(): void;
    editorBlured(): void;
    renderDimensionsMenu(): import("lit-element").TemplateResult;
    renderUrlMenu(): import("lit-element").TemplateResult;
    renderParagraphItems(): import("lit-element").TemplateResult;
    renderHeadingItems(): import("lit-element").TemplateResult | "";
    renderLevelControllers(): import("lit-element").TemplateResult;
    /**
     * Menus that needs to show up only when there is a `selection`
     */
    renderSelectionOnlyMenus(type: string): import("lit-element").TemplateResult | "";
    hasSelection(): boolean;
    toggleCode(): void;
    renderMenu(): import("lit-element").TemplateResult;
    getBlockType(): string;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
export {};
