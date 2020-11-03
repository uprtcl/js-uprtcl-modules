import { LitElement } from 'lit-element';
import { ApolloClient } from 'apollo-boost';
import { Logger } from '@uprtcl/micro-orchestrator';
import { PatternRecognizer } from '@uprtcl/cortex';
import { EveesRemote, EveesDraftsLocal, Perspective, Secured } from '@uprtcl/evees';
import { TextType, DocNode } from '../types';
declare const DocumentEditor_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class DocumentEditor extends DocumentEditor_base {
    logger: Logger;
    firstRef: string;
    uref: string;
    officialOwner: string;
    checkOwner: boolean;
    readOnly: boolean;
    rootLevel: number;
    parentId: string;
    defaultType: string;
    renderInfo: boolean;
    docHasChanges: boolean;
    persistingAll: boolean;
    showCommitMessage: boolean;
    color: string;
    reloading: boolean;
    checkedOutPerspectives: {
        [key: string]: {
            firstUref: string;
            newUref: string;
        };
    };
    doc: DocNode | undefined;
    client: ApolloClient<any>;
    protected remotes: EveesRemote[];
    protected recognizer: PatternRecognizer;
    protected editableRemotesIds: string[];
    draftService: EveesDraftsLocal;
    firstUpdated(): Promise<void>;
    updated(changedProperties: any): void;
    reload(): Promise<void>;
    loadDoc(): Promise<void>;
    loadNodeRec(uref: string, ix?: number, parent?: DocNode): Promise<DocNode>;
    refToNode(uref: string, parent?: DocNode, ix?: number): Promise<DocNode>;
    setNodeCoordinates(parent?: DocNode, ix?: number): number[];
    setNodeLevel(coord: any): number;
    isPlaceholder(uref: string): boolean;
    loadNode(uref: string, parent?: DocNode, ix?: number): Promise<DocNode>;
    defaultEntity(text: string, type: TextType): {
        data: {
            text: string;
            type: TextType;
            links: never[];
        };
        entityType: string;
    };
    hasChangesAll(): boolean;
    hasChanges(node: DocNode): boolean;
    hasChangesRec(node: DocNode): boolean;
    performUpdate(): void;
    persistAll(message?: string): Promise<void>;
    preparePersistRec(node: DocNode, defaultAuthority: string, message?: string): Promise<void>;
    derivePerspective(node: DocNode): Promise<Secured<Perspective>>;
    preparePersist(node: DocNode, defaultRemote: string, message?: string): Promise<void>;
    persistRec(node: DocNode): Promise<void>;
    persist(node: DocNode, message?: string): Promise<void>;
    createEntity(content: any, remote: string): Promise<string>;
    createCommit(content: object, remote: string, parentsIds?: string[], message?: string): Promise<string>;
    updateEvee(node: DocNode, message?: string): Promise<void>;
    createEvee(node: DocNode): Promise<string>;
    draftToPlaceholder(draft: any, parent?: DocNode, ix?: number): DocNode;
    createPlaceholder(draft: any, parent?: DocNode, ix?: number): DocNode;
    setNodeDraft(node: any, draft: any): void;
    /** node updated as reference */
    spliceChildren(node: DocNode, elements?: any[], index?: number, count?: number): Promise<DocNode[]>;
    /** explore node children at path until the last child of the last child is find
     * and returns the path to that element */
    getLastChild(node: DocNode): DocNode;
    getNextSiblingOf(node: DocNode): DocNode | undefined;
    /** find the next sibling of the parent with a next sibling */
    getNextSiblingOfLastParent(node: DocNode): DocNode | undefined;
    /** the tree of nodes is falttened, this gets the upper node in that flat list */
    getDownwardNode(node: DocNode): DocNode | undefined;
    getBackwardNode(node: DocNode): DocNode | undefined;
    createChild(node: DocNode, newEntity: any, entityType: string, index?: number): Promise<void>;
    createSibling(node: DocNode, newEntity: any, entityType: string): Promise<void>;
    focused(node: DocNode): void;
    blured(node: DocNode): void;
    focusBackward(node: DocNode): void;
    focusDownward(node: DocNode): void;
    contentChanged(node: DocNode, content: any, lift?: boolean): Promise<void>;
    /** take all next syblings of node and nest them under it */
    nestAfter(node: DocNode): Promise<void>;
    liftChildren(node: DocNode, index?: number, count?: number): Promise<void>;
    /** content is appended to the node, elements are added as silblings */
    appendBackwards(node: DocNode, content: any, elements: DocNode[]): Promise<void>;
    appended(node: DocNode): void;
    joinBackward(node: DocNode, tail: string): Promise<void>;
    pullDownward(node: DocNode): Promise<void>;
    lift(node: DocNode): Promise<void>;
    split(node: DocNode, tail: string, asChild: boolean): Promise<void>;
    isNodeFocused(): boolean;
    isNodeFocusedRec(node: DocNode): boolean;
    getLastNode(): DocNode | undefined;
    getLastNodeRec(node: DocNode): DocNode;
    clickAreaClicked(): void;
    connectedCallback(): void;
    commitWithMessageClicked(): void;
    cancelCommitClicked(): void;
    acceptCommitClicked(): void;
    handleNodePerspectiveCheckout(e: CustomEvent, node: DocNode): void;
    handleEditorPerspectiveCheckout(e: CustomEvent, node: DocNode): void;
    dragOverEffect(e: any, node: DocNode): void;
    handleDrop(e: any, node: DocNode): Promise<void>;
    getColor(): string;
    renderWithCortex(node: DocNode): import("lit-element").TemplateResult;
    renderTopRow(node: DocNode): import("lit-element").TemplateResult;
    renderHere(node: DocNode): any;
    renderDocNode(node: DocNode): any;
    commitOptionSelected(e: any): void;
    renderTopBar(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
