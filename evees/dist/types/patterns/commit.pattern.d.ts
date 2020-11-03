import { Pattern, HasLinks, Entity, Signed } from '@uprtcl/cortex';
import { Commit } from '../types';
import { HasRedirect } from '@uprtcl/multiplatform';
export declare const propertyOrder: string[];
export declare class CommitPattern extends Pattern<Entity<Signed<Commit>>> {
    recognize(entity: object): boolean;
    type: string;
}
export declare class CommitLinked implements HasLinks<Entity<Signed<Commit>>>, HasRedirect<Entity<Signed<Commit>>> {
    links: (commit: Entity<Signed<Commit>>) => Promise<string[]>;
    getChildrenLinks: (commit: Entity<Signed<Commit>>) => string[];
    replaceChildrenLinks: (commit: Entity<Signed<Commit>>, newLinks: string[]) => Entity<Signed<Commit>>;
    redirect: (commit: Entity<Signed<Commit>>) => Promise<string | undefined>;
}
