import { MicroModule, Logger } from '@uprtcl/micro-orchestrator';
export declare class CommonUIModule extends MicroModule {
    static id: string;
    static bindings: {};
    logger: Logger;
    onLoad(): Promise<void>;
    get submodules(): never[];
}
