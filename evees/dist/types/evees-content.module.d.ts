import { interfaces } from 'inversify';
import { MicroModule } from '@uprtcl/micro-orchestrator';
import { CASStore } from '@uprtcl/multiplatform';
export declare abstract class EveesContentModule extends MicroModule {
    protected stores: Array<CASStore | interfaces.ServiceIdentifier<CASStore>>;
    constructor(stores?: Array<CASStore | interfaces.ServiceIdentifier<CASStore>>);
    dependencies: string[];
    abstract providerIdentifier: interfaces.ServiceIdentifier<CASStore> | undefined;
    onLoad(container: interfaces.Container): Promise<void>;
    get submodules(): MicroModule[];
}
