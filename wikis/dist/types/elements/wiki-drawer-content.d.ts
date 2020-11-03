import { LitElement } from 'lit-element';
import { ApolloClient } from 'apollo-boost';
import { TextNode } from '@uprtcl/documents';
import { Logger } from '@uprtcl/micro-orchestrator';
import { Entity, PatternRecognizer } from '@uprtcl/cortex';
import { EveesRemote } from '@uprtcl/evees';
import { CASStore } from '@uprtcl/multiplatform';
import { Wiki } from '../types';
interface PageData {
    id: string;
    title: string;
}
declare const WikiDrawerContent_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class WikiDrawerContent extends WikiDrawerContent_base {
    logger: Logger;
    uref: string;
    color: string;
    officialOwner: string;
    checkOwner: boolean;
    editable: boolean;
    loading: boolean;
    wiki: Entity<Wiki> | undefined;
    pagesList: PageData[] | undefined;
    selectedPageIx: number | undefined;
    creatingNewPage: boolean;
    editableActual: boolean;
    remote: string;
    currentHeadId: string | undefined;
    protected client: ApolloClient<any>;
    protected remotes: EveesRemote[];
    protected recognizer: PatternRecognizer;
    protected editableRemotesIds: string[];
    firstUpdated(): Promise<void>;
    connectedCallback(): void;
    updated(changedProperties: any): void;
    reset(): Promise<void>;
    load(): Promise<void>;
    loadPagesData(): Promise<void>;
    selectPage(ix: number | undefined): void;
    getStore(remote: string, type: string): CASStore | undefined;
    handlePageDrag(e: any, pageId: any): void;
    handlePageDrop(e: any): Promise<void>;
    dragOverEffect(e: any): void;
    createPage(page: TextNode, remote: string): Promise<any>;
    updateContent(newWiki: Wiki): Promise<void>;
    replacePagePerspective(oldId: any, newId: any): Promise<void>;
    splicePages(wikiObject: Wiki, pages: any[], index: number, count: number): Promise<{
        entity: {
            title: string;
            pages: string[];
        };
        removed: string[];
    }>;
    newPage(index?: number): Promise<void>;
    movePage(fromIndex: number, toIndex: number): Promise<void>;
    removePage(pageIndex: number): Promise<void>;
    optionOnPage(pageIndex: number, option: string): Promise<void>;
    goToHome(): void;
    goBack(): void;
    renderPageList(showOptions?: boolean): import("lit-element").TemplateResult;
    renderPageItem(page: PageData, ix: number, showOptions: boolean): import("lit-element").TemplateResult;
    renderHome(): string;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
export {};
