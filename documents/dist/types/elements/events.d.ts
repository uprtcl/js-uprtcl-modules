export declare type KeypressAtArgs = {
    path: number[];
    keyCode: number;
    tail: string;
};
export declare const KEYPRESS_AT_TAG = "keypress-at";
export declare class KeypressAtEvent extends CustomEvent<KeypressAtArgs> {
    constructor(init: CustomEventInit<KeypressAtArgs>);
}
