import { Pattern, HasChildren, Entity, HasTitle } from '@uprtcl/cortex';
import { Merge, MergeStrategy, HasDiffLenses, DiffLens, EveesWorkspace } from '@uprtcl/evees';
import { Lens, HasLenses } from '@uprtcl/lenses';
import { TextNode } from '../types';
import { DocNodeLens } from './document-patterns';
export declare class TextNodePattern extends Pattern<Entity<TextNode>> {
    recognize(entity: object): boolean;
    type: string;
}
export declare class TextNodeCommon implements HasLenses<Entity<TextNode>>, HasChildren<Entity<TextNode>>, Merge<Entity<TextNode>> {
    replaceChildrenLinks: (node: Entity<TextNode>) => (childrenHashes: string[]) => Entity<TextNode>;
    getChildrenLinks: (node: Entity<TextNode>) => string[];
    links: (node: Entity<TextNode>) => Promise<string[]>;
    lenses: (node: Entity<TextNode>) => Lens[];
    /** lenses top is a lense that dont render the node children, leaving the job to an upper node tree controller */
    docNodeLenses: () => DocNodeLens[];
    merge: (originalNode: Entity<TextNode>) => (modifications: Entity<TextNode>[], mergeStrategy: MergeStrategy, workspace: EveesWorkspace, config: any) => Promise<TextNode>;
}
export declare class TextNodeTitle implements HasTitle, HasDiffLenses {
    title: (textNode: Entity<TextNode>) => string;
    diffLenses: (node?: TextNode | undefined) => DiffLens[];
}
