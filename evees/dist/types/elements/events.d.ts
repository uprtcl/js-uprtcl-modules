export declare type ContentUpdatedArgs = {
    uref: string;
};
export declare type UpdateContentArgs = {
    dataId: string;
};
export declare type SpliceChildrenArgs = {
    startedOnElementId: string;
    elements: any[];
    index?: number;
    toIndex?: number;
    appendBackwards?: string;
    liftBackwards?: string[];
    focusAfter?: number;
};
export declare type LiftChildrenArgs = {
    startedOnElementId: string;
    index: number;
    toIndex: number;
};
export declare const UPDATE_CONTENT_TAG = "update-content";
export declare const SPLICE_CHILDREN_TAG = "splice-children";
export declare const LIFT_CHILDREN_TAG = "lift-children";
export declare const CONTENT_UPDATED_TAG = "content-updated";
export declare class UpdateContentEvent extends CustomEvent<UpdateContentArgs> {
    constructor(init: CustomEventInit<UpdateContentArgs>);
}
export declare class SpliceChildrenEvent extends CustomEvent<SpliceChildrenArgs> {
    constructor(init: CustomEventInit<SpliceChildrenArgs>);
}
export declare class LiftChildrenEvent extends CustomEvent<LiftChildrenArgs> {
    constructor(init: CustomEventInit<LiftChildrenArgs>);
}
export declare class ContentUpdatedEvent extends CustomEvent<ContentUpdatedArgs> {
    constructor(init: CustomEventInit<ContentUpdatedArgs>);
}
