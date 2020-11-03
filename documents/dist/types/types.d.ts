import { Entity, HasChildren } from '@uprtcl/cortex';
import { HasDocNodeLenses } from './patterns/document-patterns';
export declare enum TextType {
    Title = "Title",
    Paragraph = "Paragraph"
}
export interface TextNode {
    text: string;
    type: TextType;
    links: string[];
}
export interface DocNode {
    uref: string;
    isPlaceholder: boolean;
    placeholderRef?: string;
    remote?: string;
    context?: string;
    data?: Entity<any>;
    draft: any;
    type?: string;
    timestamp: number;
    coord: number[];
    level: number;
    append?: any;
    childrenNodes: DocNode[];
    headId?: string;
    editable: boolean;
    parent?: DocNode;
    ix?: number;
    focused: boolean;
    hasDocNodeLenses: HasDocNodeLenses;
    hasChildren: HasChildren;
}
export interface DocNodeEventsHandlers {
    focus: () => void;
    blur: () => void;
    contentChanged: (newContent: any, lift: boolean) => void;
    split: (tail: string, asChild: boolean) => void;
    joinBackward: (tail: string) => void;
    pullDownward: () => void;
    focusBackward: () => void;
    focusDownward: () => void;
    lift: () => void;
    appended: () => void;
}
