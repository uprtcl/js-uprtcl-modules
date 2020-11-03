import { ApolloClient } from 'apollo-boost';
import { LitElement } from 'lit-element';
import { Secured } from 'src/uprtcl-evees';
import { EveesRemote } from '../services/evees.remote';
import { Perspective } from '../types';
declare const EveesPerspectiveIcon_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesPerspectiveIcon extends EveesPerspectiveIcon_base {
    perspectiveId: string;
    loading: boolean;
    perspective: Secured<Perspective>;
    remote: EveesRemote;
    remotes: EveesRemote[];
    client: ApolloClient<any>;
    firstUpdated(): Promise<void>;
    updated(changedProperties: any): void;
    load(): Promise<void>;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
}
export {};
