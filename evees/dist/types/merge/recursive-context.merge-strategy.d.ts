import { Dictionary } from '@uprtcl/micro-orchestrator';
import { SimpleMergeStrategy } from './simple.merge-strategy';
import { EveesWorkspace } from '../services/evees.workspace';
export declare class RecursiveContextMergeStrategy extends SimpleMergeStrategy {
    perspectivesByContext: Dictionary<{
        to: string | undefined;
        from: string | undefined;
    }> | undefined;
    allPerspectives: Dictionary<string> | undefined;
    isPattern(id: string, type: string): Promise<boolean>;
    setPerspective(perspectiveId: string, context: string, to: boolean): void;
    readPerspective(perspectiveId: string, to: boolean): Promise<void>;
    readAllSubcontexts(toPerspectiveId: string, fromPerspectiveId: string): Promise<void>;
    mergePerspectivesExternal(toPerspectiveId: string, fromPerspectiveId: string, workspace: EveesWorkspace, config: any): Promise<string>;
    mergePerspectives(toPerspectiveId: string, fromPerspectiveId: string, workspace: EveesWorkspace, config: any): Promise<string>;
    private getPerspectiveContext;
    getLinkMergeId(link: string): Promise<string>;
    mergeLinks(originalLinks: string[], modificationsLinks: string[][], workspace: EveesWorkspace, config: any): Promise<string[]>;
}
