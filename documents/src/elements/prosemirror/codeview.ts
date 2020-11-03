import CodeMirror from 'codemirror';
import { exitCode } from 'prosemirror-commands';
import { Node } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

// This is the one responsible for code highlighting
// in codemirror editor
require('codemirror/mode/javascript/javascript.js');

export class CodeBlockView {
  cm: CodeMirror.Editor;
  dom: HTMLElement;
  updating: boolean;
  incomingChanges = false;

  constructor(
    public node: Node,
    public view: EditorView,
    public getPos,
    public enterPressed: Function
  ) {
    // Create a CodeMirror instance
    this.cm = CodeMirror(null as any, {
      value: this.node.textContent,
      mode: 'javascript',
      extraKeys: this.codeMirrorKeymap(),
      lineNumbers: false,
      theme: 'lesser-dark',
    });

    // The editor's outer node is our DOM representation
    this.dom = this.cm.getWrapperElement();
    // CodeMirror needs to be in the DOM to properly initialize, so
    // schedule it to update itself
    setTimeout(() => this.cm.refresh(), 20);

    // This flag is used to avoid an update loop between the outer and
    // inner editor
    this.updating = false;
    // Track whether changes are have been made but not yet propagated
    this.cm.on('beforeChange', () => (this.incomingChanges = true));
    // Propagate updates from the code editor to ProseMirror
    this.cm.on('cursorActivity', () => {
      if (!this.updating && !this.incomingChanges) this.forwardSelection();
    });
    this.cm.on('changes', () => {
      if (!this.updating) {
        this.valueChanged();
        this.forwardSelection();
      }
      this.incomingChanges = false;
    });
    this.cm.on('focus', () => this.forwardSelection());
  }

  forwardSelection() {
    if (!this.cm.hasFocus()) return;
    let state = this.view.state;
    let selection = this.asProseMirrorSelection(state.doc);
    if (!selection.eq(state.selection))
      this.view.dispatch(state.tr.setSelection(selection));
  }

  asProseMirrorSelection(doc) {
    let offset = this.getPos() + 1;
    let anchor = this.cm.indexFromPos(this.cm.getCursor('anchor')) + offset;
    let head = this.cm.indexFromPos(this.cm.getCursor('head')) + offset;
    return TextSelection.create(doc, anchor, head);
  }

  setSelection(anchor, head) {
    this.cm.focus();
    this.updating = true;
    this.cm.setSelection(
      this.cm.posFromIndex(anchor),
      this.cm.posFromIndex(head)
    );
    this.updating = false;
  }

  valueChanged() {
    let change = computeChange(this.node.textContent, this.cm.getValue());
    if (change) {
      let start = this.getPos() + 1;
      let tr = this.view.state.tr.replaceWith(
        start + change.from,
        start + change.to,
        change.text ? this.view.state.schema.text(change.text) : null
      );
      this.view.dispatch(tr);
    }
  }

  codeMirrorKeymap() {
    let view = this.view;
    return CodeMirror.normalizeKeyMap({
      Up: () => this.maybeEscape('line', -1),
      Left: () => this.maybeEscape('char', -1),
      Down: () => this.maybeEscape('line', 1),
      Right: () => this.maybeEscape('char', 1),
      'Ctrl-Enter': () => {
        this.enterPressed();
      },
    });
  }

  maybeEscape(unit, dir) {
    let pos = this.cm.getCursor();
    if (
      this.cm.somethingSelected() ||
      pos.line != (dir < 0 ? this.cm.firstLine() : this.cm.lastLine()) ||
      (unit == 'char' &&
        pos.ch != (dir < 0 ? 0 : this.cm.getLine(pos.line).length))
    )
      return CodeMirror.Pass;
    this.view.focus();
    let targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize);
    let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir);
    this.view.dispatch(
      this.view.state.tr.setSelection(selection).scrollIntoView()
    );
    this.view.focus();
  }

  update(node) {
    if (node.type != this.node.type) return false;
    this.node = node;
    let change = computeChange(this.cm.getValue(), node.textContent);
    if (change) {
      this.updating = true;
      this.cm.replaceRange(
        change.text,
        this.cm.posFromIndex(change.from),
        this.cm.posFromIndex(change.to)
      );
      this.updating = false;
    }
    return true;
  }

  selectNode() {
    this.cm.focus();
  }
  stopEvent() {
    return true;
  }
}

function computeChange(oldVal, newVal) {
  if (oldVal == newVal) return null;
  let start = 0,
    oldEnd = oldVal.length,
    newEnd = newVal.length;
  while (start < oldEnd && oldVal.charCodeAt(start) == newVal.charCodeAt(start))
    ++start;
  while (
    oldEnd > start &&
    newEnd > start &&
    oldVal.charCodeAt(oldEnd - 1) == newVal.charCodeAt(newEnd - 1)
  ) {
    oldEnd--;
    newEnd--;
  }
  return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) };
}
