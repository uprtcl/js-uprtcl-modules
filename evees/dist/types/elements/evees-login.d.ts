import { LitElement } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
import { EveesRemote } from '../services/evees.remote';
import { ApolloClient } from 'apollo-boost';
declare const EveesLoginWidget_base: {
    new (...args: any[]): import("@uprtcl/micro-orchestrator").ConnectedElement;
    prototype: any;
} & typeof LitElement;
export declare class EveesLoginWidget extends EveesLoginWidget_base {
    logger: Logger;
    loading: boolean;
    logged: boolean;
    remotes: EveesRemote[];
    client: ApolloClient<any>;
    private showAccountSelection;
    firstUpdated(): Promise<void>;
    load(): Promise<void>;
    reload(): Promise<void>;
    loginAll(): Promise<void>;
    logoutAll(): Promise<void>;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
}
export {};
