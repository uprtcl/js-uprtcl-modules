import { ApolloClient } from 'apollo-boost';
import { Pattern, HasLinks, Entity, Signed } from '@uprtcl/cortex';
import { HasRedirect } from '@uprtcl/multiplatform';
import { Perspective } from '../types';
export declare const propertyOrder: string[];
export declare class PerspectivePattern extends Pattern<Entity<Signed<Perspective>>> {
    recognize(entity: object): boolean;
    type: string;
}
export declare class PerspectiveLinks implements HasLinks, HasRedirect {
    protected client: ApolloClient<any>;
    constructor(client: ApolloClient<any>);
    links: (perspective: Entity<Signed<Perspective>>) => Promise<any[]>;
    redirect: (perspective: Entity<Signed<Perspective>>) => Promise<any>;
}
