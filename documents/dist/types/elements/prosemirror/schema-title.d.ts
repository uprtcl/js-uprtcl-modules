import { Schema } from 'prosemirror-model';
export declare const nodes: {
    doc: {
        content: string;
    };
    heading: {
        attrs: {
            level: {
                default: number;
            };
        };
        content: string;
        group: string;
        defining: boolean;
        parseDOM: {
            tag: string;
            attrs: {
                level: number;
            };
        }[];
        toDOM(node: any): (string | number)[];
    };
    text: {
        group: string;
    };
};
export declare const marks: {
    link: {
        attrs: {
            href: {};
            title: {
                default: null;
            };
        };
        inclusive: boolean;
        parseDOM: {
            tag: string;
            getAttrs(dom: any): {
                href: any;
                title: any;
            };
        }[];
        toDOM(node: any): (string | number | {
            href: any;
            title: any;
        })[];
    };
    em: {
        parseDOM: ({
            tag: string;
            style?: undefined;
        } | {
            style: string;
            tag?: undefined;
        })[];
        toDOM(): (string | number)[];
    };
};
export declare const titleSchema: Schema<any, any>;
