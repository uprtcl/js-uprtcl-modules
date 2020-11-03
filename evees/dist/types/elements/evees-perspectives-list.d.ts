import { ApolloClient } from 'apollo-boost';
import { LitElement } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
import { EveesRemote } from './../services/evees.remote';
interface PerspectiveData {
    id: string;
    name: string;
    remote: string;
    creatorId: string;
    timestamp: number;
}
declare const EveesPerspectivesList_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesPerspectivesList extends EveesPerspectivesList_base {
    logger: Logger;
    perspectiveId: string;
    hidePerspectives: string[];
    canPropose: Boolean;
    loadingPerspectives: boolean;
    otherPerspectivesData: PerspectiveData[];
    canWrite: Boolean;
    perspectivesData: PerspectiveData[];
    protected client: ApolloClient<any>;
    protected remotes: EveesRemote[];
    firstUpdated(): Promise<void>;
    load(): Promise<void>;
    perspectiveClicked(id: string): void;
    perspectiveColor(creatorId: string): string;
    perspectiveButtonClicked(event: Event, perspectiveData: PerspectiveData): void;
    renderLoading(): import("lit-element").TemplateResult;
    renderPerspectiveRow(perspectiveData: PerspectiveData): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
