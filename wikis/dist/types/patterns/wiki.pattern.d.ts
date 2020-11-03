import { Pattern, Entity, HasChildren, HasTitle } from '@uprtcl/cortex';
import { MergeStrategy, Merge, HasDiffLenses, DiffLens, EveesWorkspace } from '@uprtcl/evees';
import { HasLenses, Lens } from '@uprtcl/lenses';
import { Wiki } from '../types';
export declare class WikiPattern extends Pattern<Wiki> {
    recognize(entity: object): boolean;
    type: string;
}
export declare class WikiLinks implements HasChildren<Entity<Wiki>>, Merge<Entity<Wiki>> {
    replaceChildrenLinks: (wiki: Entity<Wiki>) => (childrenHashes: string[]) => Entity<Wiki>;
    getChildrenLinks: (wiki: Entity<Wiki>) => string[];
    links: (wiki: Entity<Wiki>) => Promise<string[]>;
    merge: (originalNode: Entity<Wiki>) => (modifications: (Entity<Wiki> | undefined)[], mergeStrategy: MergeStrategy, workspace: EveesWorkspace, config: any) => Promise<Wiki>;
}
export declare class WikiCommon implements HasTitle, HasLenses<Entity<Wiki>>, HasDiffLenses<Entity<Wiki>> {
    lenses: (wiki: Entity<Wiki>) => Lens[];
    diffLenses: () => DiffLens[];
    title: (wiki: Entity<Wiki>) => string;
}
