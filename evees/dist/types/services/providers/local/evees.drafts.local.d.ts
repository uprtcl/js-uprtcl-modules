import { EveesDB } from './evees.db';
import { EveesDrafts } from '../../evees.drafts';
export declare class EveesDraftsLocal implements EveesDrafts {
    eveesDB: EveesDB;
    removeDraft(objectId: string): Promise<void>;
    getDraft(objectId: string): Promise<any>;
    setDraft(objectId: string, draft: any): Promise<void>;
}
