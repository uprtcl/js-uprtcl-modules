import { Schema } from 'prosemirror-model';
export declare const nodes: {
    doc: {
        content: string;
    };
    paragraph: {
        content: string;
        group: string;
        attrs: {
            style: {
                default: string;
            };
        };
        toDOM(node: any): (string | number | {
            style: any;
        })[];
        parseDOM: {
            tag: string;
            getAttrs: (node: any) => {
                textAlign: any;
            };
        }[];
    };
    horizontal_rule: {
        group: string;
        parseDOM: {
            tag: string;
        }[];
        toDOM(): string[];
    };
    code_block: {
        content: string;
        marks: string;
        group: string;
        code: boolean;
        defining: boolean;
        parseDOM: {
            tag: string;
            preserveWhitespace: string;
        }[];
        toDOM: () => (string | (string | number)[])[];
    };
    text: {
        group: string;
    };
    image: {
        inline: boolean;
        attrs: {
            src: {};
            alt: {
                default: null;
            };
            title: {
                default: null;
            };
            style: {};
        };
        group: string;
        draggable: boolean;
        parseDOM: {
            tag: string;
            getAttrs(dom: any): {
                src: any;
                title: any;
                alt: any;
                style: any;
            };
        }[];
        toDOM(node: any): (string | {
            src: any;
            alt: any;
            title: any;
            style: any;
        })[];
    };
    iframe: {
        inline: boolean;
        attrs: {
            src: {};
            style: {};
        };
        group: string;
        parseDOM: {
            tag: string;
            getAttrs(dom: any): {
                src: any;
                style: any;
            };
        }[];
        toDOM(node: any): (string | {
            src: any;
            style: any;
            class: string;
        })[];
    };
    hard_break: {
        inline: boolean;
        group: string;
        selectable: boolean;
        parseDOM: {
            tag: string;
        }[];
        toDOM(): string[];
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
    strong: {
        parseDOM: ({
            tag: string;
            getAttrs?: undefined;
            style?: undefined;
        } | {
            tag: string;
            getAttrs: (node: any) => false | null;
            style?: undefined;
        } | {
            style: string;
            getAttrs: (value: any) => false | null;
            tag?: undefined;
        })[];
        toDOM(): (string | number)[];
    };
    code: {
        parseDOM: {
            tag: string;
            node: string;
            preserveWhitespace: string;
        }[];
        toDOM(): (string | number)[];
    };
};
export declare const blockSchema: Schema<any, any>;
