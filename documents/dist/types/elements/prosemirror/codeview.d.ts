import CodeMirror from 'codemirror';
import { Node } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export declare class CodeBlockView {
    node: Node;
    view: EditorView;
    getPos: any;
    enterPressed: Function;
    cm: CodeMirror.Editor;
    dom: HTMLElement;
    updating: boolean;
    incomingChanges: boolean;
    constructor(node: Node, view: EditorView, getPos: any, enterPressed: Function);
    forwardSelection(): void;
    asProseMirrorSelection(doc: any): TextSelection<any>;
    setSelection(anchor: any, head: any): void;
    valueChanged(): void;
    codeMirrorKeymap(): CodeMirror.KeyMap;
    maybeEscape(unit: any, dir: any): {
        toString(): "CodeMirror.PASS";
    } | undefined;
    update(node: any): boolean;
    selectNode(): void;
    stopEvent(): boolean;
}
