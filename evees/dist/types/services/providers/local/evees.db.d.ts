import Dexie from 'dexie';
export declare class EveesDB extends Dexie {
    drafts: Dexie.Table<any, string>;
    constructor();
}
