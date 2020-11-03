(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata'), require('lit-element'), require('inversify'), require('@uprtcl/cortex'), require('@uprtcl/evees'), require('@uprtcl/graphql'), require('@uprtcl/micro-orchestrator'), require('@uprtcl/common-ui'), require('graphql-tag'), require('prosemirror-commands'), require('prosemirror-model'), require('prosemirror-state'), require('prosemirror-view'), require('codemirror'), require('lodash-es/isEqual'), require('@uprtcl/multiplatform')) :
  typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata', 'lit-element', 'inversify', '@uprtcl/cortex', '@uprtcl/evees', '@uprtcl/graphql', '@uprtcl/micro-orchestrator', '@uprtcl/common-ui', 'graphql-tag', 'prosemirror-commands', 'prosemirror-model', 'prosemirror-state', 'prosemirror-view', 'codemirror', 'lodash-es/isEqual', '@uprtcl/multiplatform'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['uprtcl-documents'] = {}, null, global.litElement, global.inversify, global.cortex, global.evees, global.graphql, global.microOrchestrator, global.commonUi, global.gql, global.prosemirrorCommands, global.prosemirrorModel, global.prosemirrorState, global.prosemirrorView, global.CodeMirror, global.isEqual, global.multiplatform));
}(this, (function (exports, reflectMetadata, litElement, inversify, cortex, evees, graphql, microOrchestrator, commonUi, gql, prosemirrorCommands, prosemirrorModel, prosemirrorState, prosemirrorView, CodeMirror, isEqual, multiplatform) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var gql__default = /*#__PURE__*/_interopDefaultLegacy(gql);
  var CodeMirror__default = /*#__PURE__*/_interopDefaultLegacy(CodeMirror);
  var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);

  (function (TextType) {
      TextType["Title"] = "Title";
      TextType["Paragraph"] = "Paragraph";
  })(exports.TextType || (exports.TextType = {}));

  const DocumentsBindings = {
      TextNodeType: 'TextNode',
      DocumentsRemote: 'documents-remote',
  };

  const htmlToText = (textWithHtml) => {
      const temp = document.createElement('template');
      temp.innerHTML = textWithHtml;
      if (!temp.content)
          return 'unknown';
      if (temp.content.textContent !== '') {
          return temp.content.textContent != null ? temp.content.textContent : 'unknown';
      }
      else {
          if (!temp.content.firstElementChild)
              return 'unknown';
          return temp.content.firstElementChild.innerText;
      }
  };

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }

  const propertyOrder = ['text', 'type', 'links'];
  const textToTextNode = (textNode, text) => {
      return {
          ...textNode,
          text: text,
      };
  };
  const typeToTextNode = (textNode, type) => {
      return {
          ...textNode,
          type: type,
      };
  };
  class TextNodePattern extends cortex.Pattern {
      constructor() {
          super(...arguments);
          this.type = DocumentsBindings.TextNodeType;
      }
      recognize(entity) {
          return (cortex.recognizeEntity(entity) &&
              propertyOrder.every((p) => entity.object.hasOwnProperty(p)));
      }
  }
  exports.TextNodeCommon = class TextNodeCommon {
      constructor() {
          this.replaceChildrenLinks = (node) => (childrenHashes) => ({
              id: '',
              object: {
                  ...node.object,
                  links: childrenHashes,
              },
          });
          this.getChildrenLinks = (node) => node.object.links;
          this.links = async (node) => this.getChildrenLinks(node);
          this.lenses = (node) => {
              return [
                  {
                      name: 'documents:document',
                      type: 'content',
                      render: (entity, context) => {
                          return litElement.html `
            <documents-text-node .data=${node} uref=${entity.id}>
            </documents-text-node>
          `;
                      },
                  },
              ];
          };
          /** lenses top is a lense that dont render the node children, leaving the job to an upper node tree controller */
          this.docNodeLenses = () => {
              return [
                  {
                      name: 'documents:document',
                      type: 'content',
                      render: (node, events) => {
                          // logger.log('lenses: documents:document - render()', { node });
                          return litElement.html `
            <documents-text-node-editor
              type=${node.draft.type}
              init=${node.draft.text}
              to-append=${node.append}
              level=${node.level + 1}
              editable=${node.editable ? 'true' : 'false'}
              focus-init=${node.focused}
              @focus=${events.focus}
              @blur=${events.blur}
              @content-changed=${(e) => events.contentChanged(textToTextNode(node.draft, e.detail.content), false)}
              @enter-pressed=${(e) => events.split(e.detail.content, e.detail.asChild)}
              @backspace-on-start=${(e) => events.joinBackward(e.detail.content)}
              @delete-on-end=${(e) => events.pullDownward()}
              @keyup-on-start=${events.focusBackward}
              @keydown-on-end=${events.focusDownward}
              @lift-heading=${events.lift}
              @change-type=${(e) => events.contentChanged(typeToTextNode(node.draft, e.detail.type), e.detail.lift)}
              @content-appended=${events.appended}
            >
            </documents-text-node-editor>
          `;
                      },
                  },
              ];
          };
          this.merge = (originalNode) => async (modifications, mergeStrategy, workspace, config) => {
              const resultText = modifications[1].object.text;
              const resultType = evees.mergeResult(originalNode.object.type, modifications.map((data) => data.object.type));
              const mergedLinks = await mergeStrategy.mergeLinks(originalNode.object.links, modifications.map((data) => data.object.links), workspace, config);
              return {
                  text: resultText,
                  type: resultType,
                  links: mergedLinks,
              };
          };
      }
  };
  exports.TextNodeCommon = __decorate([
      inversify.injectable()
  ], exports.TextNodeCommon);
  exports.TextNodeTitle = class TextNodeTitle {
      constructor() {
          this.title = (textNode) => textNode.object.text;
          this.diffLenses = (node) => {
              return [
                  {
                      name: 'documents:document-diff',
                      type: 'diff',
                      render: (workspace, newEntity, oldEntity, summary) => {
                          // logger.log('lenses: documents:document - render()', { node, lensContent, context });
                          return litElement.html `
            <documents-text-node-diff
              .workspace=${workspace}
              .newData=${newEntity}
              .oldData=${oldEntity}
              ?summary=${summary}
            >
            </documents-text-node-diff>
          `;
                      },
                  },
              ];
          };
      }
  };
  exports.TextNodeTitle = __decorate([
      inversify.injectable()
  ], exports.TextNodeTitle);

  const documentsTypeDefs = gql__default['default'] `
  extend type Patterns {
    title: String
  }

  enum TextType {
    Title
    Paragraph
  }

  type TextNode implements Entity {
    id: ID!

    text: String!
    type: TextType!
    links: [Entity]! @discover

    _context: EntityContext!
  }
`;

  var document$1 = "Document";
  var to_title = "To title";
  var to_paragraph = "To paragraph";
  var en = {
  	document: document$1,
  	to_title: to_title,
  	to_paragraph: to_paragraph
  };

  const styles = litElement.css `
  /* BASICS */

  .CodeMirror {
    /* Set height, width, borders, and global font properties here */
    font-family: monospace;
    height: auto;
    color: black;
    direction: ltr;
    padding: 2vh 1.5vh;
    border-radius: 5px;
  }

  /* PADDING */

  .CodeMirror-lines {
    padding: 4px 0; /* Vertical padding around content */
  }
  .CodeMirror pre.CodeMirror-line,
  .CodeMirror pre.CodeMirror-line-like {
    padding: 0 4px; /* Horizontal padding of content */
  }

  .CodeMirror-scrollbar-filler,
  .CodeMirror-gutter-filler {
    background-color: white; /* The little square between H and V scrollbars */
  }

  /* GUTTER */

  .CodeMirror-gutters {
    border-right: 1px solid #ddd;
    background-color: #f7f7f7;
    white-space: nowrap;
  }
  .CodeMirror-linenumbers {
  }
  .CodeMirror-linenumber {
    padding: 0 3px 0 5px;
    min-width: 20px;
    text-align: right;
    color: #999;
    white-space: nowrap;
  }

  .CodeMirror-guttermarker {
    color: black;
  }
  .CodeMirror-guttermarker-subtle {
    color: #999;
  }

  /* CURSOR */

  .CodeMirror-cursor {
    border-left: 1px solid black;
    border-right: none;
    width: 0;
  }
  /* Shown when moving in bi-directional text */
  .CodeMirror div.CodeMirror-secondarycursor {
    border-left: 1px solid silver;
  }
  .cm-fat-cursor .CodeMirror-cursor {
    width: auto;
    border: 0 !important;
    background: #7e7;
  }
  .cm-fat-cursor div.CodeMirror-cursors {
    z-index: 1;
  }
  .cm-fat-cursor-mark {
    background-color: rgba(20, 255, 20, 0.5);
    -webkit-animation: blink 1.06s steps(1) infinite;
    -moz-animation: blink 1.06s steps(1) infinite;
    animation: blink 1.06s steps(1) infinite;
  }
  .cm-animate-fat-cursor {
    width: auto;
    border: 0;
    -webkit-animation: blink 1.06s steps(1) infinite;
    -moz-animation: blink 1.06s steps(1) infinite;
    animation: blink 1.06s steps(1) infinite;
    background-color: #7e7;
  }
  @-moz-keyframes blink {
    0% {
    }
    50% {
      background-color: transparent;
    }
    100% {
    }
  }
  @-webkit-keyframes blink {
    0% {
    }
    50% {
      background-color: transparent;
    }
    100% {
    }
  }
  @keyframes blink {
    0% {
    }
    50% {
      background-color: transparent;
    }
    100% {
    }
  }

  /* Can style cursor different in overwrite (non-insert) mode */
  .CodeMirror-overwrite .CodeMirror-cursor {
  }

  .cm-tab {
    display: inline-block;
    text-decoration: inherit;
  }

  .CodeMirror-rulers {
    position: absolute;
    left: 0;
    right: 0;
    top: -50px;
    bottom: 0;
    overflow: hidden;
  }
  .CodeMirror-ruler {
    border-left: 1px solid #ccc;
    top: 0;
    bottom: 0;
    position: absolute;
  }

  /* DEFAULT THEME */

  .cm-s-default .cm-header {
    color: blue;
  }
  .cm-s-default .cm-quote {
    color: #090;
  }
  .cm-negative {
    color: #d44;
  }
  .cm-positive {
    color: #292;
  }
  .cm-header,
  .cm-strong {
    font-weight: bold;
  }
  .cm-em {
    font-style: italic;
  }
  .cm-link {
    text-decoration: underline;
  }
  .cm-strikethrough {
    text-decoration: line-through;
  }

  .cm-s-default .cm-keyword {
    color: #708;
  }
  .cm-s-default .cm-atom {
    color: #219;
  }
  .cm-s-default .cm-number {
    color: #164;
  }
  .cm-s-default .cm-def {
    color: #00f;
  }
  .cm-s-default .cm-variable,
  .cm-s-default .cm-punctuation,
  .cm-s-default .cm-property,
  .cm-s-default .cm-operator {
  }
  .cm-s-default .cm-variable-2 {
    color: #05a;
  }
  .cm-s-default .cm-variable-3,
  .cm-s-default .cm-type {
    color: #085;
  }
  .cm-s-default .cm-comment {
    color: #a50;
  }
  .cm-s-default .cm-string {
    color: #a11;
  }
  .cm-s-default .cm-string-2 {
    color: #f50;
  }
  .cm-s-default .cm-meta {
    color: #555;
  }
  .cm-s-default .cm-qualifier {
    color: #555;
  }
  .cm-s-default .cm-builtin {
    color: #30a;
  }
  .cm-s-default .cm-bracket {
    color: #997;
  }
  .cm-s-default .cm-tag {
    color: #170;
  }
  .cm-s-default .cm-attribute {
    color: #00c;
  }
  .cm-s-default .cm-hr {
    color: #999;
  }
  .cm-s-default .cm-link {
    color: #00c;
  }

  .cm-s-default .cm-error {
    color: #f00;
  }
  .cm-invalidchar {
    color: #f00;
  }

  .CodeMirror-composing {
    border-bottom: 2px solid;
  }

  /* Default styles for common addons */

  div.CodeMirror span.CodeMirror-matchingbracket {
    color: #0b0;
  }
  div.CodeMirror span.CodeMirror-nonmatchingbracket {
    color: #a22;
  }
  .CodeMirror-matchingtag {
    background: rgba(255, 150, 0, 0.3);
  }
  .CodeMirror-activeline-background {
    background: #e8f2ff;
  }

  /* STOP */

  /* The rest of this file contains styles related to the mechanics of
   the editor. You probably shouldn't touch them. */

  .CodeMirror {
    position: relative;
    overflow: hidden;
    background: white;
  }

  .CodeMirror-scroll {
    overflow: scroll !important; /* Things will break if this is overridden */
    /* 50px is the magic margin used to hide the element's real scrollbars */
    /* See overflow: hidden in .CodeMirror */
    margin-bottom: -50px;
    margin-right: -50px;
    padding-bottom: 50px;
    height: auto !important;
    outline: none; /* Prevent dragging from highlighting the element */
    position: relative;
  }
  .CodeMirror-sizer {
    position: relative;
    border-right: 50px solid transparent;
  }

  /* The fake, visible scrollbars. Used to force redraw during scrolling
   before actual scrolling happens, thus preventing shaking and
   flickering artifacts. */
  .CodeMirror-vscrollbar,
  .CodeMirror-hscrollbar,
  .CodeMirror-scrollbar-filler,
  .CodeMirror-gutter-filler {
    position: absolute;
    z-index: 6;
    display: none;
  }
  .CodeMirror-vscrollbar {
    right: 0;
    top: 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .CodeMirror-hscrollbar {
    bottom: 0;
    left: 0;
    overflow-y: hidden;
    overflow-x: scroll;
  }
  .CodeMirror-scrollbar-filler {
    right: 0;
    bottom: 0;
  }
  .CodeMirror-gutter-filler {
    left: 0;
    bottom: 0;
  }

  .CodeMirror-gutters {
    position: absolute;
    left: 0;
    top: 0;
    min-height: 100%;
    z-index: 3;
  }
  .CodeMirror-gutter {
    white-space: normal;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    margin-bottom: -50px;
  }
  .CodeMirror-gutter-wrapper {
    position: absolute;
    z-index: 4;
    background: none !important;
    border: none !important;
  }
  .CodeMirror-gutter-background {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 4;
  }
  .CodeMirror-gutter-elt {
    position: absolute;
    cursor: default;
    z-index: 4;
  }
  .CodeMirror-gutter-wrapper ::selection {
    background-color: transparent;
  }
  .CodeMirror-gutter-wrapper ::-moz-selection {
    background-color: transparent;
  }

  .CodeMirror-lines {
    cursor: text;
    min-height: 1px; /* prevents collapsing before first draw */
  }
  .CodeMirror pre.CodeMirror-line,
  .CodeMirror pre.CodeMirror-line-like {
    /* Reset some styles that the rest of the page might have set */
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
    border-radius: 0;
    border-width: 0;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    white-space: pre;
    word-wrap: normal;
    line-height: inherit;
    color: inherit;
    z-index: 2;
    position: relative;
    overflow: visible;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-variant-ligatures: contextual;
    font-variant-ligatures: contextual;
  }
  .CodeMirror-wrap pre.CodeMirror-line,
  .CodeMirror-wrap pre.CodeMirror-line-like {
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: normal;
  }

  .CodeMirror-linebackground {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
  }

  .CodeMirror-linewidget {
    position: relative;
    z-index: 2;
    padding: 0.1px; /* Force widget margins to stay inside of the container */
  }

  .CodeMirror-widget {
  }

  .CodeMirror-rtl pre {
    direction: rtl;
  }

  .CodeMirror-code {
    outline: none;
  }

  /* Force content-box sizing for the elements where we expect it */
  .CodeMirror-scroll,
  .CodeMirror-sizer,
  .CodeMirror-gutter,
  .CodeMirror-gutters,
  .CodeMirror-linenumber {
    -moz-box-sizing: content-box;
    box-sizing: content-box;
  }

  .CodeMirror-measure {
    position: absolute;
    width: 100%;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }

  .CodeMirror-cursor {
    position: absolute;
    pointer-events: none;
  }
  .CodeMirror-measure pre {
    position: static;
  }

  div.CodeMirror-cursors {
    visibility: hidden;
    position: relative;
    z-index: 3;
  }
  div.CodeMirror-dragcursors {
    visibility: visible;
  }

  .CodeMirror-focused div.CodeMirror-cursors {
    visibility: visible;
  }

  .CodeMirror-selected {
    background: #d9d9d9;
  }
  .CodeMirror-focused .CodeMirror-selected {
    background: #d7d4f0;
  }
  .CodeMirror-crosshair {
    cursor: crosshair;
  }
  .CodeMirror-line::selection,
  .CodeMirror-line > span::selection,
  .CodeMirror-line > span > span::selection {
    background: #d7d4f0;
  }
  .CodeMirror-line::-moz-selection,
  .CodeMirror-line > span::-moz-selection,
  .CodeMirror-line > span > span::-moz-selection {
    background: #d7d4f0;
  }

  .cm-searching {
    background-color: #ffa;
    background-color: rgba(255, 255, 0, 0.4);
  }

  /* Used to force a border model for a node */
  .cm-force-border {
    padding-right: 0.1px;
  }

  @media print {
    /* Hide the cursor when printing */
    .CodeMirror div.CodeMirror-cursors {
      visibility: hidden;
    }
  }

  /* See issue #2901 */
  .cm-tab-wrap-hack:after {
    content: '';
  }

  /* Help users use markselection to safely style text background */
  span.CodeMirror-selectedtext {
    background: none;
  }
`;

  // This is the one responsible for code highlighting
  // in codemirror editor
  require('codemirror/mode/javascript/javascript.js');
  class CodeBlockView {
      constructor(node, view, getPos, enterPressed) {
          this.node = node;
          this.view = view;
          this.getPos = getPos;
          this.enterPressed = enterPressed;
          this.incomingChanges = false;
          // Create a CodeMirror instance
          this.cm = CodeMirror__default['default'](null, {
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
              if (!this.updating && !this.incomingChanges)
                  this.forwardSelection();
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
          if (!this.cm.hasFocus())
              return;
          let state = this.view.state;
          let selection = this.asProseMirrorSelection(state.doc);
          if (!selection.eq(state.selection))
              this.view.dispatch(state.tr.setSelection(selection));
      }
      asProseMirrorSelection(doc) {
          let offset = this.getPos() + 1;
          let anchor = this.cm.indexFromPos(this.cm.getCursor('anchor')) + offset;
          let head = this.cm.indexFromPos(this.cm.getCursor('head')) + offset;
          return prosemirrorState.TextSelection.create(doc, anchor, head);
      }
      setSelection(anchor, head) {
          this.cm.focus();
          this.updating = true;
          this.cm.setSelection(this.cm.posFromIndex(anchor), this.cm.posFromIndex(head));
          this.updating = false;
      }
      valueChanged() {
          let change = computeChange(this.node.textContent, this.cm.getValue());
          if (change) {
              let start = this.getPos() + 1;
              let tr = this.view.state.tr.replaceWith(start + change.from, start + change.to, change.text ? this.view.state.schema.text(change.text) : null);
              this.view.dispatch(tr);
          }
      }
      codeMirrorKeymap() {
          let view = this.view;
          return CodeMirror__default['default'].normalizeKeyMap({
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
          if (this.cm.somethingSelected() ||
              pos.line != (dir < 0 ? this.cm.firstLine() : this.cm.lastLine()) ||
              (unit == 'char' &&
                  pos.ch != (dir < 0 ? 0 : this.cm.getLine(pos.line).length)))
              return CodeMirror__default['default'].Pass;
          this.view.focus();
          let targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize);
          let selection = prosemirrorState.Selection.near(this.view.state.doc.resolve(targetPos), dir);
          this.view.dispatch(this.view.state.tr.setSelection(selection).scrollIntoView());
          this.view.focus();
      }
      update(node) {
          if (node.type != this.node.type)
              return false;
          this.node = node;
          let change = computeChange(this.cm.getValue(), node.textContent);
          if (change) {
              this.updating = true;
              this.cm.replaceRange(change.text, this.cm.posFromIndex(change.from), this.cm.posFromIndex(change.to));
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
      if (oldVal == newVal)
          return null;
      let start = 0, oldEnd = oldVal.length, newEnd = newVal.length;
      while (start < oldEnd && oldVal.charCodeAt(start) == newVal.charCodeAt(start))
          ++start;
      while (oldEnd > start &&
          newEnd > start &&
          oldVal.charCodeAt(oldEnd - 1) == newVal.charCodeAt(newEnd - 1)) {
          oldEnd--;
          newEnd--;
      }
      return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) };
  }

  const icons = {
      bold: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H8c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h5.78c2.07 0 3.96-1.69 3.97-3.77.01-1.53-.85-2.84-2.15-3.44zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
      />
    </svg>
  `,
      em: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M10 5.5c0 .83.67 1.5 1.5 1.5h.71l-3.42 8H7.5c-.83 0-1.5.67-1.5 1.5S6.67 18 7.5 18h5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-.71l3.42-8h1.29c.83 0 1.5-.67 1.5-1.5S17.33 4 16.5 4h-5c-.83 0-1.5.67-1.5 1.5z"
      />
    </svg>
  `,
      link: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M3.96 11.38C4.24 9.91 5.62 8.9 7.12 8.9h2.93c.52 0 .95-.43.95-.95S10.57 7 10.05 7H7.22c-2.61 0-4.94 1.91-5.19 4.51C1.74 14.49 4.08 17 7 17h3.05c.52 0 .95-.43.95-.95s-.43-.95-.95-.95H7c-1.91 0-3.42-1.74-3.04-3.72zM9 13h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1s.45 1 1 1zm7.78-6h-2.83c-.52 0-.95.43-.95.95s.43.95.95.95h2.93c1.5 0 2.88 1.01 3.16 2.48.38 1.98-1.13 3.72-3.04 3.72h-3.05c-.52 0-.95.43-.95.95s.43.95.95.95H17c2.92 0 5.26-2.51 4.98-5.49-.25-2.6-2.59-4.51-5.2-4.51z"
      />
    </svg>
  `,
      check: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"
      />
    </svg>
  `,
      cross: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
      />
    </svg>
  `,
      arrow_left: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M14 7l-5 5 5 5V7z" />
      <path d="M24 0v24H0V0h24z" fill="none" />
    </svg>
  `,
      arrow_right: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M10 17l5-5-5-5v10z" />
      <path d="M0 24V0h24v24H0z" fill="none" />
    </svg>
  `,
      arrow_drop_down: litElement.html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M7 10l5 5 5-5z" />
    </svg>
  `,
      arrow_back: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  `,
      add: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  `,
      add_box: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
      />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  `,
      edit: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  `,
      image: litElement.html `
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,16.25C16.5,14.75 13.5,14 12,14C10.5,14 7.5,14.75 7.5,16.25V17H16.5M12,12.25A2.25,2.25 0 0,0 14.25,10A2.25,2.25 0 0,0 12,7.75A2.25,2.25 0 0,0 9.75,10A2.25,2.25 0 0,0 12,12.25Z"
      />
    </svg>
  `,
      youtube: litElement.html `
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"
      />
    </svg>
  `,
      code: litElement.html `
    <svg xmlns="http://www.w3.org/2000/svg" width="18px" viewBox="0 0 24 24" height="18px">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
      />
    </svg>
  `
  };

  const iconsStyle = litElement.css `
  clr-icon {
    display: inline-block;
    margin: 0;
    height: 16px;
    width: 16px;
    vertical-align: middle;
    fill: currentColor;
  }
  clr-icon .transparent-fill-stroke {
    stroke: currentColor;
  }
  clr-icon.is-green,
  clr-icon.is-success {
    fill: #318700;
  }
  clr-icon.is-green .transparent-fill-stroke,
  clr-icon.is-success .transparent-fill-stroke {
    stroke: #318700;
  }
  clr-icon.is-danger,
  clr-icon.is-error,
  clr-icon.is-red {
    fill: #e62700;
  }
  clr-icon.is-danger .transparent-fill-stroke,
  clr-icon.is-error .transparent-fill-stroke,
  clr-icon.is-red .transparent-fill-stroke {
    stroke: #e62700;
  }
  clr-icon.is-warning {
    fill: #fac400;
  }
  clr-icon.is-warning .transparent-fill-stroke {
    stroke: #fac400;
  }
  clr-icon.is-blue,
  clr-icon.is-info {
    fill: #007cbb;
  }
  clr-icon.is-blue .transparent-fill-stroke,
  clr-icon.is-info .transparent-fill-stroke {
    stroke: #007cbb;
  }
  clr-icon.is-inverse,
  clr-icon.is-white {
    fill: #fff;
  }
  clr-icon.is-inverse .transparent-fill-stroke,
  clr-icon.is-white .transparent-fill-stroke {
    stroke: #fff;
  }
  clr-icon.is-highlight {
    fill: #007cbb;
  }
  clr-icon.is-highlight .transparent-fill-stroke {
    stroke: #007cbb;
  }
  clr-icon[dir='up'] svg,
  clr-icon[shape$=' up'] svg {
    transform: rotate(0deg);
  }
  clr-icon[dir='down'] svg,
  clr-icon[shape$=' down'] svg {
    transform: rotate(180deg);
  }
  clr-icon[dir='right'] svg,
  clr-icon[shape$=' right'] svg {
    transform: rotate(90deg);
  }
  clr-icon[dir='left'] svg,
  clr-icon[shape$=' left'] svg {
    transform: rotate(270deg);
  }
  clr-icon[flip='horizontal'] svg {
    transform: scale(-1) rotateX(180deg);
  }
  clr-icon[flip='vertical'] svg {
    transform: scale(-1) rotateY(180deg);
  }
  clr-icon .clr-i-badge {
    fill: #e62700;
  }
  clr-icon .clr-i-badge .transparent-fill-stroke {
    stroke: #e62700;
  }
  clr-icon > * {
    height: 100%;
    width: 100%;
    display: block;
    pointer-events: none;
  }
  clr-icon > svg {
    transition: inherit;
  }
  clr-icon .clr-i-outline--alerted:not(.clr-i-outline),
  clr-icon .clr-i-outline--badged:not(.clr-i-outline),
  clr-icon .clr-i-solid,
  clr-icon .clr-i-solid--alerted,
  clr-icon .clr-i-solid--badged,
  clr-icon > svg title {
    display: none;
  }
  clr-icon[class*='has-alert'] .can-alert .clr-i-outline--alerted {
    display: block;
  }
  clr-icon[class*='has-alert'] .can-alert .clr-i-outline:not(.clr-i-outline--alerted) {
    display: none;
  }
  clr-icon[class*='has-badge'] .can-badge .clr-i-outline--badged {
    display: block;
  }
  clr-icon[class*='has-badge'] .can-badge .clr-i-outline:not(.clr-i-outline--badged) {
    display: none;
  }
  clr-icon.is-solid .has-solid .clr-i-solid {
    display: block;
  }
  clr-icon.is-solid .has-solid .clr-i-outline,
  clr-icon.is-solid .has-solid .clr-i-outline--badged,
  clr-icon.is-solid .has-solid .clr-i-solid--alerted:not(.clr-i-solid),
  clr-icon.is-solid .has-solid .clr-i-solid--badged:not(.clr-i-solid) {
    display: none;
  }
  clr-icon.is-solid[class*='has-badge'] .can-badge.has-solid .clr-i-solid--badged {
    display: block;
  }
  clr-icon.is-solid[class*='has-badge'] .can-badge.has-solid .clr-i-outline,
  clr-icon.is-solid[class*='has-badge'] .can-badge.has-solid .clr-i-outline--badged,
  clr-icon.is-solid[class*='has-badge']
    .can-badge.has-solid
    .clr-i-solid:not(.clr-i-solid--badged) {
    display: none;
  }
  clr-icon.is-solid[class*='has-alert'] .can-alert.has-solid .clr-i-solid--alerted {
    display: block;
  }
  clr-icon.is-solid[class*='has-alert'] .can-alert.has-solid .clr-i-outline,
  clr-icon.is-solid[class*='has-alert'] .can-alert.has-solid .clr-i-outline--alerted,
  clr-icon.is-solid[class*='has-alert']
    .can-alert.has-solid
    .clr-i-solid:not(.clr-i-solid--alerted) {
    display: none;
  }
  clr-icon.has-badge--success .clr-i-badge {
    fill: #318700;
  }
  clr-icon.has-badge--success .clr-i-badge .transparent-fill-stroke {
    stroke: #318700;
  }
  clr-icon.has-badge--error .clr-i-badge {
    fill: #e62700;
  }
  clr-icon.has-badge--error .clr-i-badge .transparent-fill-stroke {
    stroke: #e62700;
  }
  clr-icon.has-badge--info .clr-i-badge {
    fill: #007cbb;
  }
  clr-icon.has-badge--info .clr-i-badge .transparent-fill-stroke {
    stroke: #007cbb;
  }
  clr-icon.has-alert .clr-i-alert {
    fill: #fac400;
  }
  clr-icon.has-alert .clr-i-alert .transparent-fill-stroke {
    stroke: #fac400;
  }
  clr-icon .is-off-screen {
    position: fixed !important;
    border: none !important;
    height: 1px !important;
    width: 1px !important;
    left: 0 !important;
    top: -1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    margin: 0 0 -1px 0 !important;
  }
`;

  const styles$1 = litElement.css `
  .ProseMirror {
    position: relative;
  }

  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
  }

  .ProseMirror pre {
    white-space: pre-wrap;
  }

  .ProseMirror li {
    position: relative;
  }

  .ProseMirror-hideselection *::selection {
    background: transparent;
  }
  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }
  .ProseMirror-hideselection {
    caret-color: transparent;
  }

  .ProseMirror-selectednode {
    outline: 2px solid #8cf;
  }

  /* Make sure li selections wrap around markers */

  li.ProseMirror-selectednode {
    outline: none;
  }

  li.ProseMirror-selectednode:after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }
  .ProseMirror-textblock-dropdown {
    min-width: 3em;
  }

  .ProseMirror-menu {
    margin: 0 -4px;
    line-height: 1;
  }

  .ProseMirror-tooltip .ProseMirror-menu {
    width: -webkit-fit-content;
    width: fit-content;
    white-space: pre;
  }

  .ProseMirror-menuitem {
    margin-right: 3px;
    display: inline-block;
  }

  .ProseMirror-menuseparator {
    border-right: 1px solid #ddd;
    margin-right: 3px;
  }

  .ProseMirror-menu-dropdown,
  .ProseMirror-menu-dropdown-menu {
    font-size: 90%;
    white-space: nowrap;
  }

  .ProseMirror-menu-dropdown {
    vertical-align: 1px;
    cursor: pointer;
    position: relative;
    padding-right: 15px;
  }

  .ProseMirror-menu-dropdown-wrap {
    padding: 1px 0 1px 4px;
    display: inline-block;
    position: relative;
  }

  .ProseMirror-menu-dropdown:after {
    content: '';
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid currentColor;
    opacity: 0.6;
    position: absolute;
    right: 4px;
    top: calc(50% - 2px);
  }

  .ProseMirror-menu-dropdown-menu,
  .ProseMirror-menu-submenu {
    position: absolute;
    background: white;
    color: #666;
    border: 1px solid #aaa;
    padding: 2px;
  }

  .ProseMirror-menu-dropdown-menu {
    z-index: 15;
    min-width: 6em;
  }

  .ProseMirror-menu-dropdown-item {
    cursor: pointer;
    padding: 2px 8px 2px 4px;
  }

  .ProseMirror-menu-dropdown-item:hover {
    background: #f2f2f2;
  }

  .ProseMirror-menu-submenu-wrap {
    position: relative;
    margin-right: -4px;
  }

  .ProseMirror-menu-submenu-label:after {
    content: '';
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid currentColor;
    opacity: 0.6;
    position: absolute;
    right: 4px;
    top: calc(50% - 4px);
  }

  .ProseMirror-menu-submenu {
    display: none;
    min-width: 4em;
    left: 100%;
    top: -3px;
  }

  .ProseMirror-menu-active {
    background: #eee;
    border-radius: 4px;
  }

  .ProseMirror-menu-active {
    background: #eee;
    border-radius: 4px;
  }

  .ProseMirror-menu-disabled {
    opacity: 0.3;
  }

  .ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu,
  .ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
    display: block;
  }

  .ProseMirror-menubar {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    position: relative;
    min-height: 1em;
    color: #666;
    padding: 1px 6px;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid silver;
    background: white;
    z-index: 10;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: visible;
  }

  .ProseMirror-icon {
    display: inline-block;
    line-height: 0.8;
    vertical-align: -2px; /* Compensate for padding */
    padding: 2px 8px;
    cursor: pointer;
  }

  .ProseMirror-menu-disabled.ProseMirror-icon {
    cursor: default;
  }

  .ProseMirror-icon svg {
    fill: currentColor;
    height: 1em;
  }

  .ProseMirror-icon span {
    vertical-align: text-top;
  }
  .ProseMirror-gapcursor {
    display: none;
    pointer-events: none;
    position: absolute;
  }

  .ProseMirror-gapcursor:after {
    content: '';
    display: block;
    position: absolute;
    top: -2px;
    width: 20px;
    border-top: 1px solid black;
    animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
  }

  @keyframes ProseMirror-cursor-blink {
    to {
      visibility: hidden;
    }
  }

  .ProseMirror-focused .ProseMirror-gapcursor {
    display: block;
  }
  /* Add space around the hr to make clicking it easier */

  .ProseMirror-example-setup-style hr {
    padding: 2px 10px;
    border: none;
    margin: 1em 0;
  }

  .ProseMirror-example-setup-style hr:after {
    content: '';
    display: block;
    height: 1px;
    background-color: silver;
    line-height: 2px;
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 30px;
  }

  .ProseMirror blockquote {
    padding-left: 1em;
    border-left: 3px solid #eee;
    margin-left: 0;
    margin-right: 0;
  }

  .ProseMirror-example-setup-style img {
    cursor: default;
  }

  .ProseMirror-prompt {
    background: white;
    padding: 5px 10px 5px 15px;
    border: 1px solid silver;
    position: fixed;
    border-radius: 3px;
    z-index: 11;
    box-shadow: -0.5px 2px 5px rgba(0, 0, 0, 0.2);
  }

  .ProseMirror-prompt h5 {
    margin: 0;
    font-weight: normal;
    font-size: 100%;
    color: #444;
  }

  .ProseMirror-prompt input[type='text'],
  .ProseMirror-prompt textarea {
    background: #eee;
    border: none;
    outline: none;
  }

  .ProseMirror-prompt input[type='text'] {
    padding: 0 4px;
  }

  .ProseMirror-prompt-close {
    position: absolute;
    left: 2px;
    top: 1px;
    color: #666;
    border: none;
    background: transparent;
    padding: 0;
  }

  .ProseMirror-prompt-close:after {
    content: 'âœ•';
    font-size: 12px;
  }

  .ProseMirror-invalid {
    background: #ffc;
    border: 1px solid #cc7;
    border-radius: 4px;
    padding: 5px 10px;
    position: absolute;
    min-width: 10em;
  }

  .ProseMirror-prompt-buttons {
    margin-top: 5px;
    display: none;
  }
  #editor,
  .editor {
    background: white;
    color: black;
    background-clip: padding-box;
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px 0;
    margin-bottom: 23px;
  }

  .ProseMirror h1:first-child,
  .ProseMirror h2:first-child,
  .ProseMirror h3:first-child,
  .ProseMirror h4:first-child,
  .ProseMirror h5:first-child,
  .ProseMirror h6:first-child {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .ProseMirror {
    padding: 4px 8px 4px 14px;
    line-height: 1.2;
    outline: none;
  }

  .ProseMirror p {
    margin: 0px;
  }
`;

  const styles$2 = litElement.css `
  /*
http://lesscss.org/ dark theme
Ported to CodeMirror by Peter Kroon
*/
  .cm-s-lesser-dark {
    line-height: 1.3em;
  }
  .cm-s-lesser-dark.CodeMirror {
    background: #262626;
    color: #ebefe7;
    text-shadow: 0 -1px 1px #262626;
  }
  .cm-s-lesser-dark div.CodeMirror-selected {
    background: #45443b;
  } /* 33322B*/
  .cm-s-lesser-dark .CodeMirror-line::selection,
  .cm-s-lesser-dark .CodeMirror-line > span::selection,
  .cm-s-lesser-dark .CodeMirror-line > span > span::selection {
    background: rgba(69, 68, 59, 0.99);
  }
  .cm-s-lesser-dark .CodeMirror-line::-moz-selection,
  .cm-s-lesser-dark .CodeMirror-line > span::-moz-selection,
  .cm-s-lesser-dark .CodeMirror-line > span > span::-moz-selection {
    background: rgba(69, 68, 59, 0.99);
  }
  .cm-s-lesser-dark .CodeMirror-cursor {
    border-left: 1px solid white;
  }
  .cm-s-lesser-dark pre {
    padding: 0 8px;
  } /*editable code holder*/

  .cm-s-lesser-dark.CodeMirror span.CodeMirror-matchingbracket {
    color: #7efc7e;
  } /*65FC65*/

  .cm-s-lesser-dark .CodeMirror-gutters {
    background: #262626;
    border-right: 1px solid #aaa;
  }
  .cm-s-lesser-dark .CodeMirror-guttermarker {
    color: #599eff;
  }
  .cm-s-lesser-dark .CodeMirror-guttermarker-subtle {
    color: #777;
  }
  .cm-s-lesser-dark .CodeMirror-linenumber {
    color: #777;
  }

  .cm-s-lesser-dark span.cm-header {
    color: #a0a;
  }
  .cm-s-lesser-dark span.cm-quote {
    color: #090;
  }
  .cm-s-lesser-dark span.cm-keyword {
    color: #599eff;
  }
  .cm-s-lesser-dark span.cm-atom {
    color: #c2b470;
  }
  .cm-s-lesser-dark span.cm-number {
    color: #b35e4d;
  }
  .cm-s-lesser-dark span.cm-def {
    color: white;
  }
  .cm-s-lesser-dark span.cm-variable {
    color: #d9bf8c;
  }
  .cm-s-lesser-dark span.cm-variable-2 {
    color: #669199;
  }
  .cm-s-lesser-dark span.cm-variable-3,
  .cm-s-lesser-dark span.cm-type {
    color: white;
  }
  .cm-s-lesser-dark span.cm-property {
    color: #92a75c;
  }
  .cm-s-lesser-dark span.cm-operator {
    color: #92a75c;
  }
  .cm-s-lesser-dark span.cm-comment {
    color: #666;
  }
  .cm-s-lesser-dark span.cm-string {
    color: #bcd279;
  }
  .cm-s-lesser-dark span.cm-string-2 {
    color: #f50;
  }
  .cm-s-lesser-dark span.cm-meta {
    color: #738c73;
  }
  .cm-s-lesser-dark span.cm-qualifier {
    color: #555;
  }
  .cm-s-lesser-dark span.cm-builtin {
    color: #ff9e59;
  }
  .cm-s-lesser-dark span.cm-bracket {
    color: #ebefe7;
  }
  .cm-s-lesser-dark span.cm-tag {
    color: #669199;
  }
  .cm-s-lesser-dark span.cm-attribute {
    color: #81a4d5;
  }
  .cm-s-lesser-dark span.cm-hr {
    color: #999;
  }
  .cm-s-lesser-dark span.cm-link {
    color: #7070e6;
  }
  .cm-s-lesser-dark span.cm-error {
    color: #9d1e15;
  }

  .cm-s-lesser-dark .CodeMirror-activeline-background {
    background: #3c3a3a;
  }
  .cm-s-lesser-dark .CodeMirror-matchingbracket {
    outline: 1px solid grey;
    color: white !important;
  }
`;

  const hrDOM = ['hr'], brDOM = ['br'];
  // :: Object
  // [Specs](#model.NodeSpec) for the nodes defined in this schema.
  const nodes = {
      // :: NodeSpec The top level document node.
      doc: {
          content: 'block+'
      },
      // :: NodeSpec A plain paragraph textblock. Represented in the DOM
      // as a `<p>` element.
      paragraph: {
          content: 'inline*',
          group: 'block',
          attrs: {
              style: {
                  default: ''
              }
          },
          toDOM(node) {
              return ['p', { style: node.attrs.style }, 0];
          },
          parseDOM: [
              {
                  tag: 'p',
                  getAttrs: node => {
                      return {
                          textAlign: node.attributes ? node.attributes.style : node.attrs.style
                      };
                  }
              }
          ]
      },
      // :: NodeSpec A horizontal rule (`<hr>`).
      horizontal_rule: {
          group: 'block',
          parseDOM: [{ tag: 'hr' }],
          toDOM() {
              return hrDOM;
          }
      },
      // :: NodeSpec A code listing. Disallows marks or non-text inline
      // nodes by default. Represented as a `<pre>` element with a
      // `<code>` element inside of it.
      code_block: {
          content: 'text*',
          marks: '',
          group: 'block',
          code: true,
          defining: true,
          parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
          toDOM: function toDOM() {
              return ['pre', ['code', 0]];
          }
      },
      // :: NodeSpec The text node.
      text: {
          group: 'inline'
      },
      // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
      // `alt`, `style`, and `href` attributes. The latter two default to the empty
      // string.
      image: {
          inline: true,
          attrs: {
              src: {},
              alt: { default: null },
              title: { default: null },
              style: {}
          },
          group: 'inline',
          draggable: true,
          parseDOM: [
              {
                  tag: 'img',
                  getAttrs(dom) {
                      return {
                          src: dom.getAttribute('src'),
                          title: dom.getAttribute('title'),
                          alt: dom.getAttribute('alt'),
                          style: dom.getAttribute('style')
                      };
                  }
              }
          ],
          toDOM(node) {
              let { src, alt, title, style } = node.attrs;
              return ['img', { src, alt, title, style }];
          }
      },
      // :: NodeSpec An inline image (`<iframe>`) node. Supports `src`,
      //  and `style` attributes.
      iframe: {
          inline: true,
          attrs: {
              src: {},
              style: {}
          },
          group: 'inline',
          parseDOM: [
              {
                  tag: 'iframe',
                  getAttrs(dom) {
                      return {
                          src: dom.getAttribute('src'),
                          style: dom.getAttribute('style')
                      };
                  }
              }
          ],
          toDOM(node) {
              let { src, style } = node.attrs;
              return ['iframe', { src, style, class: 'yt-embed' }];
          }
      },
      // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
      hard_break: {
          inline: true,
          group: 'inline',
          selectable: false,
          parseDOM: [{ tag: 'br' }],
          toDOM() {
              return brDOM;
          }
      }
  };
  const emDOM = ['em', 0], strongDOM = ['strong', 0], codeDOM = ['code', 0];
  // :: Object [Specs](#model.MarkSpec) for the marks in the schema.
  const marks = {
      // :: MarkSpec A link. Has `href` and `title` attributes. `title`
      // defaults to the empty string. Rendered and parsed as an `<a>`
      // element.
      link: {
          attrs: {
              href: {},
              title: { default: null }
          },
          inclusive: false,
          parseDOM: [
              {
                  tag: 'a[href]',
                  getAttrs(dom) {
                      return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
                  }
              }
          ],
          toDOM(node) {
              let { href, title } = node.attrs;
              return ['a', { href, title }, 0];
          }
      },
      // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
      // Has parse rules that also match `<i>` and `font-style: italic`.
      em: {
          parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
          toDOM() {
              return emDOM;
          }
      },
      // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
      // also match `<b>` and `font-weight: bold`.
      strong: {
          parseDOM: [
              { tag: 'strong' },
              // This works around a Google Docs misbehavior where
              // pasted content will be inexplicably wrapped in `<b>`
              // tags with a font-weight normal.
              { tag: 'b', getAttrs: node => node.style.fontWeight != 'normal' && null },
              {
                  style: 'font-weight',
                  getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
              }
          ],
          toDOM() {
              return strongDOM;
          }
      },
      // :: MarkSpec Code font mark. Represented as a `<code>` element.
      code: {
          parseDOM: [{ tag: 'code', node: 'code_block', preserveWhitespace: 'full' }],
          toDOM() {
              return codeDOM;
          }
      }
  };
  // :: Schema
  // This schema roughly corresponds to the document schema used by
  // [CommonMark](http://commonmark.org/), minus the list elements,
  // which are defined in the [`prosemirror-schema-list`](#schema-list)
  // module.
  //
  // To reuse elements from this schema, extend or read from its
  // `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
  const blockSchema = new prosemirrorModel.Schema({ nodes: nodes, marks: marks });

  // :: Object
  // [Specs](#model.NodeSpec) for the nodes defined in this schema.
  const nodes$1 = {
      // :: NodeSpec The top level document node.
      doc: {
          content: 'heading+',
      },
      // :: NodeSpec A heading textblock, with a `level` attribute that
      // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
      // `<h6>` elements.
      heading: {
          attrs: { level: { default: 1 } },
          content: 'inline*',
          group: 'block',
          defining: true,
          parseDOM: [
              { tag: 'h1', attrs: { level: 1 } },
              { tag: 'h2', attrs: { level: 2 } },
              { tag: 'h3', attrs: { level: 3 } },
              { tag: 'h4', attrs: { level: 4 } },
              { tag: 'h5', attrs: { level: 5 } },
              { tag: 'h6', attrs: { level: 6 } },
          ],
          toDOM(node) {
              return ['h' + node.attrs.level, 0];
          },
      },
      // :: NodeSpec The text node.
      text: {
          group: 'inline',
      },
  };
  const emDOM$1 = ['em', 0];
  // :: Object [Specs](#model.MarkSpec) for the marks in the schema.
  const marks$1 = {
      // :: MarkSpec A link. Has `href` and `title` attributes. `title`
      // defaults to the empty string. Rendered and parsed as an `<a>`
      // element.
      link: {
          attrs: {
              href: {},
              title: { default: null },
          },
          inclusive: false,
          parseDOM: [
              {
                  tag: 'a[href]',
                  getAttrs(dom) {
                      return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
                  },
              },
          ],
          toDOM(node) {
              let { href, title } = node.attrs;
              return ['a', { href, title }, 0];
          },
      },
      // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
      // Has parse rules that also match `<i>` and `font-style: italic`.
      em: {
          parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
          toDOM() {
              return emDOM$1;
          },
      },
  };
  // :: Schema
  // This schema roughly corresponds to the document schema used by
  // [CommonMark](http://commonmark.org/), minus the list elements,
  // which are defined in the [`prosemirror-schema-list`](#schema-list)
  // module.
  //
  // To reuse elements from this schema, extend or read from its
  // `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
  const titleSchema = new prosemirrorModel.Schema({ nodes: nodes$1, marks: marks$1 });

  const APPEND_ACTION = 'append';
  const FOCUS_ACTION = 'focus';
  var ActiveSubMenu;
  (function (ActiveSubMenu) {
      ActiveSubMenu["LINK"] = "link";
      ActiveSubMenu["IMAGE"] = "image";
      ActiveSubMenu["VIDEO"] = "video";
  })(ActiveSubMenu || (ActiveSubMenu = {}));
  class DocumentTextNodeEditor extends litElement.LitElement {
      constructor() {
          super(...arguments);
          this.logger = new microOrchestrator.Logger('DOCUMENT-TEXT-NODE-EDITOR');
          this.editable = 'true';
          this.toggleAction = 'true';
          this.action = {};
          this.focusInit = 'false';
          this.level = 0;
          this.selected = false;
          this.empty = false;
          this.showMenu = false;
          this.showUrlMenu = false;
          this.showDimMenu = false;
          this.editor = {};
          this.preventHide = false;
          this.currentContent = undefined;
      }
      connectedCallback() {
          super.connectedCallback();
          this.addEventListener('blur', () => {
              setTimeout(() => {
                  this.selected = false;
              }, 200);
          });
      }
      firstUpdated() {
          this.initEditor();
      }
      updated(changedProperties) {
          if (changedProperties.has('toggleAction')) {
              if (changedProperties.get('toggleAction') !== undefined) {
                  this.runAction(this.action);
              }
          }
          if (changedProperties.has('focusInit')) {
              if (this.focusInit === 'true') {
                  this.editor.view.focus();
              }
              else {
                  this.setShowMenu(false);
              }
          }
          if (changedProperties.has('toAppend')) {
              if (changedProperties.get('toAppend') === undefined ||
                  changedProperties.get('toAppend') === 'undefined') {
                  if (this.toAppend !== 'undefined') {
                      this.appendContent(this.toAppend);
                      this.dispatchEvent(new CustomEvent('content-appended'));
                  }
              }
          }
          if (changedProperties.has('editable') || changedProperties.has('type')) {
              // if (LOGINFO) this.logger.info('updated() - editable || type', {editable: this.editable, type: this.type, changedProperties});
              this.initEditor();
          }
          if (changedProperties.has('init')) {
              if (this.init !== this.currentContent) {
                  this.initEditor();
                  return;
              }
          }
          if (changedProperties.has('showUrlMenu') && this.showUrlMenu && this.shadowRoot != null) {
              const input = this.shadowRoot.getElementById('URL_INPUT');
              if (input) {
                  input.focus();
              }
          }
      }
      runAction(action) {
          switch (action.name) {
              case APPEND_ACTION:
                  this.appendContent(action.pars.content);
                  break;
              case FOCUS_ACTION:
                  this.editor.view.focus();
                  break;
              default:
                  throw new Error(`unexpected action ${action.name}`);
          }
      }
      getValidInnerHTML(text) {
          if (text.startsWith('<h1') || text.startsWith('<p')) {
              const temp = document.createElement('template');
              temp.innerHTML = text.trim();
              if (temp.content.firstElementChild == null) {
                  return '';
              }
              return temp.content.firstElementChild.innerHTML;
          }
          else {
              return text;
          }
      }
      getValidDocHtml(text) {
          const innerHTML = this.getValidInnerHTML(text);
          let tag = this.type === exports.TextType.Title ? 'h1' : 'p';
          return `<${tag}>${innerHTML}</${tag}>`;
      }
      getSlice(text) {
          const htmlString = this.getValidDocHtml(text);
          if (!htmlString)
              return undefined;
          let temp = document.createElement('template');
          temp.innerHTML = htmlString;
          return temp.content.firstChild;
      }
      appendContent(content) {
          const sliceNode = this.getSlice(content);
          const slice = this.editor.parser.parseSlice(sliceNode);
          const end = this.editor.view.state.doc.content.content[0].nodeSize;
          this.editor.view.dispatch(this.editor.view.state.tr.replace(end - 1, end, slice));
          this.editor.view.dispatch(this.editor.view.state.tr.setSelection(prosemirrorState.TextSelection.near(this.editor.view.state.doc.resolve(end - 1))));
          this.editor.view.focus();
      }
      enterPressedEvent(content, asChild) {
          this.dispatchEvent(new CustomEvent('enter-pressed', {
              detail: {
                  content,
                  asChild
              }
          }));
      }
      keydown(view, event) {
          /** enter */
          if (event.keyCode === 13) {
              event.preventDefault();
              /** simulate splitBlock */
              const splitTr = view.state.tr.split(view.state.selection.$cursor.pos);
              /** applied just to get the second part, the actual transaction
               * is applied in dispatch */
              const newState = view.state.apply(splitTr);
              const secondPart = newState.doc.content.content[1];
              view.dispatch(splitTr.delete(view.state.selection.$cursor.pos, view.state.doc.nodeSize));
              /** send event to parent */
              const fragment = this.editor.serializer.serializeFragment(secondPart);
              const temp = document.createElement('div');
              temp.appendChild(fragment);
              const content = temp.innerHTML;
              this.enterPressedEvent(content, this.type === exports.TextType.Title);
              return;
          }
          // 27 is esc
          if (event.keyCode === 27) {
              if (this.showMenu) {
                  event.preventDefault();
                  this.preventHide = false;
                  this.showUrlMenu = false;
                  this.setShowMenu(false);
              }
          }
          /** backspace */
          if (event.keyCode === 8) {
              if (view.state.selection.$cursor.pos === 1) {
                  event.preventDefault();
                  const content = this.state2Html(view.state);
                  this.dispatchEvent(new CustomEvent('backspace-on-start', {
                      bubbles: true,
                      composed: true,
                      detail: {
                          content
                      }
                  }));
              }
              return;
          }
          /** delete */
          if (event.keyCode === 46) {
              if (view.state.selection.$cursor.pos >= view.state.doc.content.content[0].nodeSize - 1) {
                  event.preventDefault();
                  const content = this.state2Html(view.state);
                  this.dispatchEvent(new CustomEvent('delete-on-end'));
              }
              return;
          }
          /** arrow up */
          if (event.keyCode === 38) {
              if (view.state.selection.$cursor.pos === 1) {
                  event.preventDefault();
                  this.dispatchEvent(new CustomEvent('keyup-on-start'));
                  return;
              }
          }
          /** arrow down */
          if (event.keyCode === 40) {
              if (view.state.selection.$cursor.pos >= view.state.doc.content.content[0].nodeSize - 1) {
                  event.preventDefault();
                  this.dispatchEvent(new CustomEvent('keydown-on-end'));
                  return;
              }
          }
          /** (B)old */
          /** backspace */
          if (event.keyCode === 66) {
              if (event.ctrlKey === true) {
                  event.preventDefault();
                  prosemirrorCommands.toggleMark(this.editor.view.state.schema.marks.strong)(this.editor.view.state, this.editor.view.dispatch);
              }
              return;
          }
          if (event.keyCode === 74) {
              if (event.ctrlKey === true) {
                  event.preventDefault();
                  prosemirrorCommands.toggleMark(this.editor.view.state.schema.marks.em)(this.editor.view.state, this.editor.view.dispatch);
              }
              return;
          }
          if (event.keyCode === 75) {
              if (event.ctrlKey === true) {
                  event.preventDefault();
                  this.subMenuConfirm();
              }
              return;
          }
      }
      isEditable() {
          const editable = this.editable !== undefined ? this.editable === 'true' : false;
          return editable;
      }
      initEditor() {
          if (this.editor && this.editor.view) {
              this.editor.view.destroy();
              this.editor = {};
          }
          const schema = this.type === exports.TextType.Title ? titleSchema : blockSchema;
          this.editor.parser = prosemirrorModel.DOMParser.fromSchema(schema);
          this.editor.serializer = prosemirrorModel.DOMSerializer.fromSchema(schema);
          this.currentContent = this.init;
          const doc = this.html2doc(this.getValidDocHtml(this.init));
          /** the heading level for render is given by the `level` attribute,
           * not the heading tag (which is always <h1> in the data text) */
          if (doc.content.content[0].type.name === 'heading') {
              doc.content.content[0].attrs.level = this.level;
          }
          const state = prosemirrorState.EditorState.create({
              schema: schema,
              doc: doc,
              plugins: []
          });
          if (this.shadowRoot == null)
              return;
          const container = this.shadowRoot.getElementById('editor-content');
          this.editor.view = new prosemirrorView.EditorView(container, {
              state: state,
              editable: () => this.isEditable(),
              dispatchTransaction: transaction => this.dispatchTransaction(transaction),
              handleDOMEvents: {
                  focus: () => this.dispatchEvent(new CustomEvent('focus-changed', {
                      bubbles: true,
                      composed: true,
                      detail: { value: true }
                  })),
                  blur: () => {
                      this.dispatchEvent(new CustomEvent('focus-changed', {
                          bubbles: true,
                          composed: true,
                          detail: { value: false }
                      }));
                      return true;
                  },
                  keydown: (view, event) => {
                      this.keydown(view, event);
                      return true;
                  },
                  dblclick: (view, event) => {
                      this.setShowMenu(true);
                      return true;
                  }
              },
              nodeViews: {
                  code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos, () => this.enterPressedEvent('', false))
              }
          });
          if (this.focusInit === 'true') {
              this.editor.view.focus();
          }
      }
      state2Html(state) {
          const fragment = this.editor.serializer.serializeFragment(state.doc);
          const node = state.doc.content.child(0);
          const temp = document.createElement('div');
          temp.appendChild(fragment);
          /** heading and paragraph content are stored without the exernal tag */
          if (node.type.name === 'code_block') {
              return temp.innerHTML;
          }
          else {
              return temp.firstElementChild.innerHTML;
          }
      }
      html2doc(text) {
          /** convert HTML string to doc state */
          let temp = document.createElement('template');
          temp.innerHTML = text;
          const element = temp.content.firstChild;
          return this.editor.parser.parse(element);
      }
      dispatchTransaction(transaction) {
          if (!transaction.curSelection.empty) {
              this.selected = true;
              this.setShowMenu(true);
          }
          else {
              this.selected = false;
          }
          const content = this.state2Html(this.editor.view.state);
          let newState = this.editor.view.state.apply(transaction);
          let contentChanged = !newState.doc.eq(this.editor.view.state.doc);
          this.editor.view.updateState(newState);
          if (!contentChanged)
              return;
          /** doc changed */
          const newContent = this.state2Html(newState);
          /** local copy of the html (withot the external tag) represeting the current state */
          this.currentContent = newContent;
          this.dispatchEvent(new CustomEvent('content-changed', {
              detail: {
                  content: newContent
              }
          }));
      }
      toHeading(lift) {
          this.changeType(exports.TextType.Title, lift);
      }
      toParagraph() {
          this.changeType(exports.TextType.Paragraph, false);
      }
      reduceHeading() {
          this.dispatchEvent(new CustomEvent('lift-heading', {}));
      }
      changeType(type, lift) {
          this.dispatchEvent(new CustomEvent('change-type', {
              detail: { type, lift }
          }));
      }
      urlKeydown(event) {
          // 27 is esc
          if (event.keyCode === 27) {
              if (this.showMenu) {
                  event.preventDefault();
                  this.subMenuCancel();
              }
          }
          // 13 is enter
          if (event.keyCode === 13) {
              if (this.showMenu) {
                  event.preventDefault();
                  this.subMenuConfirm();
              }
          }
      }
      async setShowMenu(value) {
          if (!this.shadowRoot)
              return;
          if (this.editable !== 'true') {
              this.showMenu = false;
              return;
          }
          this.showMenu = value;
          this.requestUpdate();
          if (value === true) {
              await this.updateComplete;
              const menu = this.shadowRoot.getElementById('TOP_MENU');
              if (!menu)
                  return;
              /** listen events */
              menu.addEventListener('keydown', event => {
                  if (event.keyCode === 27) {
                      // 27 is esc
                      event.stopPropagation();
                      this.setShowMenu(false);
                  }
              });
          }
          else {
              if (this.preventHide) {
                  this.editor.view.focus();
              }
          }
      }
      subMenuClick(type) {
          if (this.activeSubMenu !== type) {
              this.activeSubMenu = type;
              this.preventHide = true;
              this.showUrlMenu = true;
              if (this.activeSubMenu === ActiveSubMenu.IMAGE ||
                  this.activeSubMenu === ActiveSubMenu.VIDEO) {
                  this.showDimMenu = true;
              }
              else {
                  this.showDimMenu = false;
              }
          }
          else {
              this.resetSubMenu();
          }
      }
      resetSubMenu() {
          this.preventHide = false;
          this.activeSubMenu = null;
          this.showDimMenu = false;
          this.showUrlMenu = false;
      }
      subMenuConfirm() {
          switch (this.activeSubMenu) {
              case ActiveSubMenu.LINK:
                  this.applyLinkMark();
                  break;
              case ActiveSubMenu.IMAGE:
                  this.applyImageNode();
                  break;
              case ActiveSubMenu.VIDEO:
                  this.applyIframeNode();
                  break;
          }
          this.resetSubMenu();
      }
      subMenuCancel() {
          this.resetSubMenu();
          this.setShowMenu(false);
      }
      isValidLink(link) {
          if (!link.startsWith('http')) {
              link = `http://${link}`;
          }
          try {
              new URL(link);
          }
          catch (_) {
              return false;
          }
          return link;
      }
      getSubMenuFields() {
          if (this.shadowRoot == null)
              return { link: '', width: '', height: '' };
          return {
              link: this.shadowRoot.getElementById('URL_INPUT').value,
              width: this.shadowRoot.getElementById('DIM_WIDTH') ? this.shadowRoot.getElementById('DIM_WIDTH').value : '',
              height: this.shadowRoot.getElementById('DIM_HEIGHT') ? this.shadowRoot.getElementById('DIM_HEIGHT').value : ''
          };
      }
      applyLinkMark() {
          const { link } = this.getSubMenuFields();
          const href = this.isValidLink(link);
          if (href) {
              prosemirrorCommands.toggleMark(this.editor.view.state.schema.marks.link, { href })(this.editor.view.state, this.editor.view.dispatch);
              this.preventHide = false;
              this.selected = false;
          }
      }
      alignNodeToCenter() {
          prosemirrorCommands.setBlockType(this.editor.view.state.schema.nodes.paragraph, {
              style: 'text-align:center'
          })(this.editor.view.state, this.editor.view.dispatch);
      }
      applyImageNode() {
          const { link, width, height } = this.getSubMenuFields();
          if (this.isValidLink(link)) {
              const node = this.editor.view.state.doc.content.content[0];
              const end = node.nodeSize;
              const imgNode = this.editor.view.state.schema.nodes.image.create({
                  src: link,
                  style: `${width !== '' ? `width:${width}px` : ''};${height !== '' ? `height:${height}px` : ''};max-width: 100%;margin: 0 auto;border-radius: 5px;`
              });
              this.dispatchTransaction(this.editor.view.state.tr.replaceSelectionWith(imgNode, false));
              this.alignNodeToCenter();
              // this.editor.view.dispatch();
          }
      }
      parseYoutubeURL(url) {
          const getParameterByName = (name, url) => {
              name = name.replace(/[\[\]]/g, '\\$&');
              var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
              if (!results)
                  return null;
              if (!results[2])
                  return '';
              return decodeURIComponent(results[2].replace(/\+/g, ' '));
          };
          let embedUrl = 'https://www.youtube.com/embed';
          // For when the user copies the youtube video URL
          // on the address bar
          if (url.indexOf('?v=') > -1) {
              const videoId = getParameterByName('v', url);
              embedUrl += `/${videoId}`;
              // For when the user right-clicks on the video and
              // copies the "video url"
          }
          else if (url.indexOf('youtu.be') > -1) {
              embedUrl += `/${url.split('/').pop()}`;
              // If none of these patterns match, do not parse
              // the given URL by the user.
          }
          else {
              return url;
          }
          return embedUrl;
      }
      applyIframeNode() {
          const { link, width, height } = this.getSubMenuFields();
          if (this.isValidLink(link)) {
              const iframeNode = this.editor.view.state.schema.nodes.iframe.create({
                  src: this.parseYoutubeURL(link),
                  style: `width:${width !== '' ? width + 'px' : '100%'};height:52vw;border:0px;max-width:100%;max-height:470px;`
              });
              this.dispatchTransaction(this.editor.view.state.tr.replaceSelectionWith(iframeNode, false));
              this.alignNodeToCenter();
          }
      }
      menuItemClick(markType) {
          this.preventHide = false;
          prosemirrorCommands.toggleMark(markType)(this.editor.view.state, this.editor.view.dispatch);
          this.resetSubMenu();
      }
      editorFocused() {
      }
      editorBlured() {
      }
      renderDimensionsMenu() {
          // incase we want the height field back
          // const renderHeightDim = () => html`
          //   <input @keydown=${this.urlKeydown} class="dim" placeholder="height" id="DIM_HEIGHT" />px
          // `;
          return litElement.html `
      <input
        @keydown=${this.urlKeydown}
        class="dim"
        placeholder="width (optional)"
        id="DIM_WIDTH"
      />
    `;
      }
      renderUrlMenu() {
          return litElement.html `
      <div class="inp">
        <div class="inp-hldr">
          <input
            @keydown=${this.urlKeydown}
            placeholder="${this.activeSubMenu !== ActiveSubMenu.LINK
            ? this.activeSubMenu + ' '
            : ''}url"
            id="URL_INPUT"
          />
          ${this.showDimMenu ? this.renderDimensionsMenu() : ''}
        </div>
        <div class="inp-actions">
          <button @click=${this.subMenuCancel} class="btn btn-small">
            ${icons.cross}
          </button>
          <button @click=${this.subMenuConfirm} class="btn btn-small">
            ${icons.check}
          </button>
        </div>
      </div>
    `;
      }
      renderParagraphItems() {
          return litElement.html `
      ${this.level > 2
            ? litElement.html `
            <button class="btn btn-text" @click=${() => this.toHeading(true)}>
              <span>h${this.level - 1}</span>
            </button>
          `
            : ''}
      <button class="btn btn-text" @click=${() => this.toHeading(false)}>
        <span>h${this.level}</span>
      </button>
    `;
      }
      renderHeadingItems() {
          return this.level > 1
              ? litElement.html `
          ${this.level > 2
                ? litElement.html `
                <button class="btn btn-text" @click=${() => this.reduceHeading()}>
                  <span>h${this.level - 1}</span>
                </button>
              `
                : ''}
          <button class="btn btn-text" @click=${this.toParagraph}>
            <span>text</span>
          </button>
        `
              : '';
      }
      renderLevelControllers() {
          return litElement.html `
      <!-- level controllers -->
      ${this.type === exports.TextType.Paragraph ? this.renderParagraphItems() : this.renderHeadingItems()}
    `;
      }
      /**
       * Menus that needs to show up only when there is a `selection`
       */
      renderSelectionOnlyMenus(type) {
          const menus = litElement.html `
      ${this.renderLevelControllers()}
      ${this.type !== exports.TextType.Title
            ? litElement.html `
            <button
              class="btn btn-square btn-large"
              @click=${() => this.menuItemClick(this.editor.view.state.schema.marks.strong)}
            >
              ${icons.bold}
            </button>
          `
            : ''}
      <button
        class="btn btn-square btn-large"
        @click=${() => this.menuItemClick(this.editor.view.state.schema.marks.em)}
      >
        ${icons.em}
      </button>

      <button
        class="btn btn-square btn-small"
        @click=${() => this.subMenuClick(ActiveSubMenu.LINK)}
      >
        ${icons.link}
      </button>
    `;
          return this.hasSelection() && type !== 'code' ? menus : '';
      }
      hasSelection() {
          if (this.editor.view.state.selection.from > 1 || this.editor.view.state.selection.to > 1) {
              return true;
          }
          return false;
      }
      toggleCode() {
          const node = this.editor.view.state.doc.content.content[0];
          const end = node.nodeSize;
          const newType = node.type.name !== 'code_block' ? blockSchema.nodes.code_block : blockSchema.nodes.paragraph;
          this.editor.view.dispatch(this.editor.view.state.tr.setBlockType(0, end, newType));
      }
      renderMenu() {
          const embedSubMenu = litElement.html `
      <button
        class="btn btn-square btn-small"
        @click=${() => this.subMenuClick(ActiveSubMenu.IMAGE)}
      >
        ${icons.image}
      </button>

      <button
        class="btn btn-square btn-small"
        @click=${() => this.subMenuClick(ActiveSubMenu.VIDEO)}
      >
        ${icons.youtube}
      </button>
    `;
          const codeSubMenu = litElement.html `
      <button class="btn btn-square btn-small" @click=${this.toggleCode}>
        ${icons.code}
      </button>
    `;
          const type = this.getBlockType();
          return litElement.html `
      <div class="top-menu" id="TOP_MENU">
        <!-- icons from https://material.io/resources/icons/?icon=format_bold&style=round  -->

        <div class="menus">
          <!-- current level -->
          <button class="btn-text btn-current">
            <span>${type}</span>
          </button>
          ${this.renderSelectionOnlyMenus(type)}
          ${this.type === 'Paragraph' && type !== 'code' ? embedSubMenu : ''}
          ${this.type !== 'Title' ? codeSubMenu : ''}
        </div>
        ${this.showUrlMenu && type !== 'code' ? this.renderUrlMenu() : ''}
      </div>
    `;
      }
      getBlockType() {
          const nodeType = this.editor.view.state.doc.child(0).type;
          if (nodeType && nodeType.name === 'code_block') {
              return 'code';
          }
          return this.type === exports.TextType.Title ? `h${this.level}` : 'text';
      }
      render() {
          return litElement.html `
      ${this.showMenu ? this.renderMenu() : ''}
      <div 
        id="editor-content" 
        class="editor-content">
      </div>
    `;
      }
      static get styles() {
          return [
              styles,
              styles$1,
              iconsStyle,
              styles$2,
              litElement.css `
        :host {
          position: relative;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji',
            Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
        }

        a {
          color: inherit;
        }

        .top-menu {
          z-index: 10;
          position: absolute;
          padding: 0px 0px;
          height: initial;
          top: -50px;
          left: 25px;
          background-color: white;
          border-radius: 10px;
          border: solid 1px #cfcfcf;
          background-color: #28282a60;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          max-width: calc(100vw - 50px);
        }

        .top-menu .menus {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .top-menu button {
          font-family: inherit;
          font-size: 100%;
          line-height: 1.15;
          margin: 0;
          overflow: visible;
          text-transform: none;
          background-color: transparent;
          border: 0px;
        }

        .btn {
          cursor: pointer;
          border-radius: 8px;
          text-align: center;
          fill: white;
          color: white;
        }

        .btn:hover {
          background-color: #444444;
          transition: background-color 100ms linear;
        }

        .btn-text {
          color: white;
          padding: 12px 16px;
          font-weight: bold;
        }

        .btn-current {
          text-decoration: underline;
          user-select: none;
        }

        .btn-square {
          width: 40px;
        }

        .btn-large svg {
          margin-top: 6px;
          width: 30px;
          height: 30px;
        }

        .btn-small svg {
          margin-top: 8px;
          width: 26px;
          height: 26px;
        }

        .inp {
          display: flex;
          padding: 0 10px 7px 10px;
        }
        .inp-actions {
          display: flex;
        }

        .inp input {
          height: 38px;
          font-size: 14px;
          padding-left: 12px;
          border: none;
          background-color: #444444;
          color: white;
          margin: 0 5px 0 0;
          border-radius: 6px;
        }

        .inp input#URL_INPUT {
          flex-grow: 1;
        }

        .inp input.dim {
          width: 100px;
          margin-left: 5px;
        }

        .inp .inp-hldr {
          display: flex;
          flex-grow: 1;
          color: white;
          align-items: center;
          margin-right: 5px;
        }

        @media (max-width: 768px) {
          .inp {
            flex-direction: column;
            overflow: auto;
          }
          .top-menu {
            max-width: 80vw;
          }
          .inp input#URL_INPUT {
            width: 50%;
          }
          .inp input.dim {
            width: 50%;
          }
          .inp-actions {
            justify-content: center;
          }
        }

        .editor-content {
          margin: 0px 0px;
        }

        .yt-embed {
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .yt-embed {
            max-height: 300px;
          }
        }
      `
          ];
      }
  }
  __decorate([
      litElement.property({ type: String }),
      __metadata("design:type", String)
  ], DocumentTextNodeEditor.prototype, "type", void 0);
  __decorate([
      litElement.property({ type: String }),
      __metadata("design:type", String)
  ], DocumentTextNodeEditor.prototype, "init", void 0);
  __decorate([
      litElement.property({ type: String, attribute: 'to-append' }),
      __metadata("design:type", String)
  ], DocumentTextNodeEditor.prototype, "toAppend", void 0);
  __decorate([
      litElement.property({ type: String }),
      __metadata("design:type", String)
  ], DocumentTextNodeEditor.prototype, "editable", void 0);
  __decorate([
      litElement.property({ type: String, attribute: 'toggle-action' }),
      __metadata("design:type", String)
  ], DocumentTextNodeEditor.prototype, "toggleAction", void 0);
  __decorate([
      litElement.property({ type: Object }),
      __metadata("design:type", Object)
  ], DocumentTextNodeEditor.prototype, "action", void 0);
  __decorate([
      litElement.property({ type: String, attribute: 'focus-init' }),
      __metadata("design:type", String)
  ], DocumentTextNodeEditor.prototype, "focusInit", void 0);
  __decorate([
      litElement.property({ type: Number }),
      __metadata("design:type", Number)
  ], DocumentTextNodeEditor.prototype, "level", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentTextNodeEditor.prototype, "selected", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentTextNodeEditor.prototype, "empty", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentTextNodeEditor.prototype, "showMenu", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentTextNodeEditor.prototype, "showUrlMenu", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentTextNodeEditor.prototype, "showDimMenu", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], DocumentTextNodeEditor.prototype, "activeSubMenu", void 0);

  const styleMap = style => {
      return Object.entries(style).reduce((styleString, [propName, propValue]) => {
          propName = propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`);
          return `${styleString}${propName}:${propValue};`;
      }, '');
  };
  const SELECTED_BACKGROUND = 'rgb(200,200,200,0.2);';
  const PLACEHOLDER_TOKEN = '_PLACEHOLDER_';
  class DocumentEditor extends microOrchestrator.moduleConnect(litElement.LitElement) {
      constructor() {
          super(...arguments);
          this.logger = new microOrchestrator.Logger('DOCUMENT-EDITOR');
          this.checkOwner = false;
          this.readOnly = false;
          this.rootLevel = 0;
          this.parentId = '';
          this.defaultType = evees.EveesModule.bindings.PerspectiveType;
          this.renderInfo = false;
          this.docHasChanges = false;
          this.persistingAll = false;
          this.showCommitMessage = false;
          this.reloading = true;
          this.checkedOutPerspectives = {};
          this.doc = undefined;
          this.draftService = new evees.EveesDraftsLocal();
      }
      async firstUpdated() {
          this.remotes = this.requestAll(evees.EveesModule.bindings.EveesRemote);
          this.recognizer = this.request(cortex.CortexModule.bindings.Recognizer);
          const config = this.request(evees.EveesModule.bindings.Config);
          this.editableRemotesIds = config.editableRemotesIds ? config.editableRemotesIds : [];
          if (!this.client) {
              this.client = this.request(graphql.ApolloClientModule.bindings.Client);
          }
          this.uref = this.firstRef;
          await this.loadDoc();
          this.reloading = false;
      }
      updated(changedProperties) {
          let reload = false;
          if (changedProperties.has('firstRef')) {
              this.uref = this.firstRef;
          }
          if (changedProperties.has('uref')) {
              reload = true;
          }
          if (changedProperties.has('client')) {
              reload = true;
          }
          if (changedProperties.has('editable')) {
              reload = true;
          }
          if (reload) {
              this.reload();
          }
      }
      async reload() {
          this.reloading = true;
          await this.loadDoc();
          this.reloading = false;
      }
      async loadDoc() {
          if (!this.client)
              return;
          if (!this.uref)
              return;
          this.doc = await this.loadNodeRec(this.uref);
          this.requestUpdate();
      }
      async loadNodeRec(uref, ix, parent) {
          const node = await this.loadNode(uref, parent, ix);
          const loadChildren = node.hasChildren.getChildrenLinks({ id: '', object: node.draft }).map(async (child, ix) => {
              return child !== undefined && child !== ''
                  ? await this.loadNodeRec(child, ix, node)
                  : node.childrenNodes[ix];
          });
          node.parent = parent;
          node.childrenNodes = await Promise.all(loadChildren);
          /** focus if top element */
          if (node.uref === this.uref && node.editable) {
              node.focused = true;
          }
          return node;
      }
      async refToNode(uref, parent, ix) {
          const entity = await multiplatform.loadEntity(this.client, uref);
          if (!entity)
              throw Error(`Entity not found ${uref}`);
          let entityType = this.recognizer.recognizeType(entity);
          let editable = false;
          let remoteId;
          let context;
          let dataId;
          let headId;
          if (entityType === evees.EveesModule.bindings.PerspectiveType) {
              remoteId = await evees.EveesHelpers.getPerspectiveRemoteId(this.client, entity.id);
              const remote = this.remotes.find(r => r.id === remoteId);
              if (!remote)
                  throw new Error(`remote not found for ${remoteId}`);
              let canWrite = false;
              if (!this.readOnly) {
                  const editableRemote = this.editableRemotesIds.length > 0 ? this.editableRemotesIds.includes(remote.id) : true;
                  if (editableRemote) {
                      canWrite = await evees.EveesHelpers.canWrite(this.client, uref);
                  }
              }
              if (!this.readOnly) {
                  editable = canWrite;
                  headId = await evees.EveesHelpers.getPerspectiveHeadId(this.client, entity.id);
                  dataId =
                      headId !== undefined
                          ? await evees.EveesHelpers.getCommitDataId(this.client, headId)
                          : undefined;
              }
              else {
                  editable = false;
                  dataId = await evees.EveesHelpers.getPerspectiveDataId(this.client, entity.id);
                  context = '';
                  headId = '';
              }
          }
          else {
              if (entityType === evees.EveesModule.bindings.CommitType) {
                  if (!parent)
                      throw new Error('Commit must have a parent');
                  editable = parent.editable;
                  remoteId = parent.remote;
                  dataId = await evees.EveesHelpers.getCommitDataId(this.client, entity.id);
                  headId = uref;
              }
              else {
                  entityType = 'Data';
                  editable = false;
                  remoteId = '';
                  dataId = uref;
                  headId = '';
              }
          }
          if (!dataId || !entityType)
              throw Error(`data not loaded for uref ${this.uref}`);
          // TODO get data and patterns hasChildren/hasDocNodeLenses from query
          const data = await multiplatform.loadEntity(this.client, dataId);
          if (!data)
              throw Error('Data undefined');
          const hasChildren = this.recognizer
              .recognizeBehaviours(data)
              .find(b => b.getChildrenLinks);
          const hasDocNodeLenses = this.recognizer
              .recognizeBehaviours(data)
              .find(b => b.docNodeLenses);
          if (!hasChildren)
              throw Error('hasChildren undefined');
          if (!hasDocNodeLenses)
              throw Error('hasDocNodeLenses undefined');
          /** disable editable */
          if (this.readOnly) {
              editable = false;
          }
          // Add node coordinates
          const coord = this.setNodeCoordinates(parent, ix);
          // Add node level
          const level = this.setNodeLevel(coord);
          const node = {
              uref: entity.id,
              isPlaceholder: false,
              type: entityType,
              ix,
              hasChildren,
              childrenNodes: [],
              data,
              draft: data ? data.object : undefined,
              coord,
              level,
              headId,
              hasDocNodeLenses,
              editable,
              remote: remoteId,
              context,
              focused: false,
              timestamp: Date.now()
          };
          return node;
      }
      setNodeCoordinates(parent, ix) {
          const currentIndex = ix ? ix : 0;
          const coord = parent && parent.coord ? parent.coord.concat([currentIndex]) : [currentIndex];
          return coord;
      }
      setNodeLevel(coord) {
          return this.rootLevel + (coord.length - 1);
      }
      isPlaceholder(uref) {
          return uref.startsWith(PLACEHOLDER_TOKEN);
      }
      async loadNode(uref, parent, ix) {
          let node;
          if (this.isPlaceholder(uref)) {
              const draft = await this.draftService.getDraft(uref);
              node = this.draftToPlaceholder(draft, parent, ix);
          }
          else {
              node = await this.refToNode(uref, parent, ix);
              /** initialize draft */
              const draft = await this.draftService.getDraft(uref);
              if (draft !== undefined) {
                  node.draft = draft;
              }
          }
          return node;
      }
      defaultEntity(text, type) {
          return {
              data: { text, type, links: [] },
              entityType: DocumentsBindings.TextNodeType
          };
      }
      hasChangesAll() {
          if (!this.doc)
              return false;
          return this.hasChangesRec(this.doc);
      }
      hasChanges(node) {
          if (node.uref === '')
              return true; // is placeholder
          if (!node.data)
              return true;
          if (!isEqual__default['default'](node.data.object, node.draft))
              return true;
          return false;
      }
      hasChangesRec(node) {
          if (this.hasChanges(node))
              return true;
          const ix = node.childrenNodes.find(child => this.hasChangesRec(child));
          if (ix !== undefined)
              return true;
          return false;
      }
      performUpdate() {
          this.docHasChanges = this.hasChangesAll();
          // console.log({ hasChanges: this.docHasChanges });
          let event = new CustomEvent('doc-changed', {
              detail: {
                  docChanged: this.docHasChanges
              }
          });
          this.dispatchEvent(event);
          super.performUpdate();
      }
      async persistAll(message) {
          if (!this.doc)
              return;
          this.persistingAll = true;
          if (this.doc.remote === undefined)
              throw Error('top element must have an remote');
          await this.preparePersistRec(this.doc, this.doc.remote, message);
          await this.persistRec(this.doc);
          /** reload doc from backend */
          await this.loadDoc();
          this.requestUpdate();
          this.persistingAll = false;
      }
      async preparePersistRec(node, defaultAuthority, message) {
          const prepareChildren = node.childrenNodes.map(child => this.preparePersistRec(child, defaultAuthority, message));
          await Promise.all(prepareChildren);
          /** set the children with the children refs (which were created above) */
          const { object } = node.hasChildren.replaceChildrenLinks({
              id: '',
              object: node.draft
          })(node.childrenNodes.map(node => node.uref));
          this.setNodeDraft(node, object);
          await this.preparePersist(node, defaultAuthority, message);
      }
      async derivePerspective(node) {
          const remoteInstance = this.remotes.find(r => r.id == node.remote);
          if (!remoteInstance)
              throw new Error(`Remote not found for remote ${remoteInstance}`);
          const creatorId = remoteInstance.userId ? remoteInstance.userId : '';
          const context = await evees.hashObject({
              creatorId,
              timestamp: node.timestamp
          });
          const perspective = {
              creatorId,
              remote: remoteInstance.id,
              path: remoteInstance.defaultPath,
              timestamp: node.timestamp,
              context
          };
          return evees.deriveSecured(perspective, remoteInstance.store.cidConfig);
      }
      /* bottom up traverse the tree to set the uref of all placeholders */
      async preparePersist(node, defaultRemote, message) {
          if (!node.isPlaceholder) {
              return;
          }
          switch (this.defaultType) {
              case evees.EveesModule.bindings.PerspectiveType:
                  node.remote = node.remote !== undefined ? node.remote : defaultRemote;
                  const secured = await this.derivePerspective(node);
                  node.uref = secured.id;
                  node.type = evees.EveesModule.bindings.PerspectiveType;
                  break;
              case evees.EveesModule.bindings.CommitType:
                  throw new Error('TBD');
              // const secured = await this.deriveCommit(node);
              // node.uref = commitId;
              // node.type = EveesModule.bindings.CommitType;
              // break;
              default:
                  throw new Error('TBD');
              // const dataId = await this.createEntity(node.draft, node.remote);
              // node.uref = dataId;
              // break;
          }
      }
      /* top down persist all new nodes in their backend */
      async persistRec(node) {
          await this.persist(node);
          const persistChildren = node.childrenNodes.map(child => this.persistRec(child));
          await Promise.all(persistChildren);
      }
      async persist(node, message = '') {
          if (!node.isPlaceholder && node.data !== undefined && isEqual__default['default'](node.data.object, node.draft)) {
              /** nothing to persist here */
              return;
          }
          switch (node.type) {
              case evees.EveesModule.bindings.PerspectiveType:
                  if (node.isPlaceholder) {
                      const perspectiveId = await this.createEvee(node);
                      if (perspectiveId !== node.uref) {
                          throw new Error(`perspective id ${perspectiveId} of doc node not as expected ${node.uref}`);
                      }
                  }
                  else {
                      await this.updateEvee(node, message);
                  }
                  break;
              case evees.EveesModule.bindings.CommitType:
                  const commitParents = this.isPlaceholder(node.uref) ? [] : node.headId ? [node.headId] : [];
                  if (node.remote === undefined)
                      throw new Error('undefined remote for node');
                  const commitId = await this.createCommit(node.draft, node.remote, commitParents, message);
                  if (commitId !== node.uref) {
                      throw new Error(`commit id ${commitId} of doc node not as expected ${node.uref}`);
                  }
                  break;
          }
          await this.draftService.removeDraft(node.placeholderRef ? node.placeholderRef : node.uref);
      }
      async createEntity(content, remote) {
          const entityType = this.recognizer.recognizeType({
              id: '',
              object: content
          });
          const remoteInstance = this.remotes.find(r => r.id === remote);
          if (!remoteInstance)
              throw new Error(`Remote not found for remote ${remote}`);
          const store = remoteInstance.store;
          const createTextNode = await this.client.mutate({
              mutation: evees.CREATE_ENTITY,
              variables: {
                  object: content,
                  casID: store.casID
              }
          });
          return createTextNode.data.createEntity.id;
      }
      async createCommit(content, remote, parentsIds, message) {
          const dataId = await this.createEntity(content, remote);
          const remoteInstance = this.remotes.find(r => r.id === remote);
          if (!remoteInstance)
              throw new Error(`Remote not found for remote ${remote}`);
          return await evees.EveesHelpers.createCommit(this.client, remoteInstance.store, {
              dataId,
              parentsIds
          });
      }
      async updateEvee(node, message) {
          if (node.remote === undefined)
              throw Error(`remote not defined for node ${node.uref}`);
          const commitId = await this.createCommit(node.draft, node.remote, node.headId ? [node.headId] : []);
          await this.client.mutate({
              mutation: evees.UPDATE_HEAD,
              variables: {
                  perspectiveId: node.uref,
                  headId: commitId,
                  message
              }
          });
          /** inform the external world if top element */
          if (this.doc && node.uref === this.doc.uref) {
              this.dispatchEvent(new evees.ContentUpdatedEvent({
                  bubbles: true,
                  composed: true,
                  detail: { uref: this.uref }
              }));
          }
      }
      async createEvee(node) {
          if (node.remote === undefined)
              throw new Error('undefined remote for node');
          const commitId = await this.createCommit(node.draft, node.remote);
          const remoteInstance = this.remotes.find(r => r.id === node.remote);
          if (!remoteInstance)
              throw new Error(`Remote not found for remote ${node.remote}`);
          // using the same function used in preparePersist to get the same id
          const secured = await this.derivePerspective(node);
          return evees.EveesHelpers.createPerspective(this.client, remoteInstance, {
              ...secured.object.payload,
              headId: commitId,
              parentId: node.parent ? node.parent.uref : undefined
          });
      }
      draftToPlaceholder(draft, parent, ix) {
          const draftForReco = { id: '', object: draft };
          const hasChildren = this.recognizer
              .recognizeBehaviours(draftForReco)
              .find(b => b.getChildrenLinks);
          const hasDocNodeLenses = this.recognizer
              .recognizeBehaviours(draftForReco)
              .find(b => b.docNodeLenses);
          if (!hasChildren)
              throw new Error(`hasChildren not found for object ${JSON.stringify(draftForReco)}`);
          if (!hasDocNodeLenses)
              throw new Error(`hasDocNodeLenses not found for object ${JSON.stringify(draftForReco)}`);
          const randint = 0 + Math.floor((10000 - 0) * Math.random());
          const uref = PLACEHOLDER_TOKEN + `-${ix !== undefined ? ix : 0}-${randint}`;
          // Add node coordinates
          const coord = this.setNodeCoordinates(parent, ix);
          // Add node level
          const level = this.setNodeLevel(coord);
          return {
              uref,
              placeholderRef: uref,
              isPlaceholder: true,
              ix,
              parent,
              draft,
              coord,
              level,
              childrenNodes: [],
              hasChildren,
              hasDocNodeLenses,
              editable: true,
              focused: false,
              timestamp: Date.now()
          };
      }
      createPlaceholder(draft, parent, ix) {
          const node = this.draftToPlaceholder(draft, parent, ix);
          /** async store */
          this.draftService.setDraft(node.uref, node.draft);
          return node;
      }
      setNodeDraft(node, draft) {
          node.draft = draft;
          /** async store */
          this.draftService.setDraft(node.uref, draft);
      }
      /** node updated as reference */
      async spliceChildren(node, elements = [], index, count = 0) {
          const currentChildren = node.hasChildren.getChildrenLinks({
              id: '',
              object: node.draft
          });
          index = index !== undefined ? index : currentChildren.length;
          /** create objects if elements is not an id */
          const getNewNodes = elements.map((el, ix) => {
              const elIndex = index + ix;
              if (typeof el !== 'string') {
                  if (el.object !== undefined && el.entityType !== undefined) {
                      /** element is an object from which a DocNode should be create */
                      const placeholder = this.createPlaceholder(el.object, node, elIndex);
                      return Promise.resolve(placeholder);
                  }
                  else {
                      /** element is a DocNode */
                      return Promise.resolve(el);
                  }
              }
              else {
                  /** element is a string (a uref) */
                  return this.loadNodeRec(el, elIndex, node);
              }
          });
          const newNodes = await Promise.all(getNewNodes);
          let newChildren = [...currentChildren];
          newChildren.splice(index, count, ...newNodes.map(node => node.uref));
          const removed = node.childrenNodes.splice(index, count, ...newNodes);
          /** update ix and parent of child nodes */
          node.childrenNodes.map((child, ix) => {
              child.ix = ix;
              child.parent = node;
              child.coord = node.coord.concat(ix);
              child.level = node.level + 1;
          });
          const { object } = node.hasChildren.replaceChildrenLinks({
              id: '',
              object: node.draft
          })(newChildren);
          this.setNodeDraft(node, object);
          return removed;
      }
      /** explore node children at path until the last child of the last child is find
       * and returns the path to that element */
      getLastChild(node) {
          let child = node;
          while (child.childrenNodes.length > 0) {
              child = child.childrenNodes[child.childrenNodes.length - 1];
          }
          return child;
      }
      getNextSiblingOf(node) {
          if (!node.parent)
              return undefined;
          if (node.ix === undefined)
              return undefined;
          if (node.ix === node.parent.childrenNodes.length - 1) {
              /** this is the last child of its parent */
              return undefined;
          }
          else {
              /** return the next  */
              return node.parent.childrenNodes[node.ix + 1];
          }
      }
      /** find the next sibling of the parent with a next sibling */
      getNextSiblingOfLastParent(node) {
          let parent = node.parent;
          let nextSibling = parent ? this.getNextSiblingOf(parent) : undefined;
          while (parent && !nextSibling) {
              parent = parent.parent;
              nextSibling = parent ? this.getNextSiblingOf(parent) : undefined;
          }
          return nextSibling;
      }
      /** the tree of nodes is falttened, this gets the upper node in that flat list */
      getDownwardNode(node) {
          if (node.childrenNodes.length > 0) {
              /** downward is the first child */
              return node.childrenNodes[0];
          }
          else {
              let nextSibling = this.getNextSiblingOf(node);
              if (nextSibling) {
                  return nextSibling;
              }
              else {
                  return this.getNextSiblingOfLastParent(node);
              }
          }
      }
      getBackwardNode(node) {
          if (node.ix === undefined)
              throw new Error('Node dont have an ix');
          if (node.ix === 0) {
              /** backward is the parent */
              return node.parent;
          }
          else {
              /** backward is the last child of the upper sybling */
              if (!node.parent)
                  return undefined;
              return this.getLastChild(node.parent.childrenNodes[node.ix - 1]);
          }
      }
      async createChild(node, newEntity, entityType, index) {
          await this.spliceChildren(node, [{ object: newEntity, entityType }], 0);
          /** focus child */
          const child = node.childrenNodes[0];
          if (child.parent) {
              child.parent.focused = false;
          }
          child.focused = true;
          this.requestUpdate();
      }
      async createSibling(node, newEntity, entityType) {
          if (!node.parent)
              throw new Error('Node dont have a parent');
          if (node.ix === undefined)
              throw new Error('Node dont have an ix');
          await this.spliceChildren(node.parent, [{ object: newEntity, entityType }], node.ix + 1);
          /** focus sibling */
          const sibling = node.parent.childrenNodes[node.ix + 1];
          node.focused = false;
          sibling.focused = true;
          this.requestUpdate();
      }
      focused(node) {
          node.focused = true;
          this.requestUpdate();
      }
      blured(node) {
          node.focused = false;
          this.requestUpdate();
      }
      focusBackward(node) {
          const backwardNode = this.getBackwardNode(node);
          if (!backwardNode)
              return;
          node.focused = false;
          backwardNode.focused = true;
          this.requestUpdate();
      }
      focusDownward(node) {
          const downwardNode = this.getDownwardNode(node);
          if (!downwardNode)
              return;
          node.focused = false;
          downwardNode.focused = true;
          this.requestUpdate();
      }
      async contentChanged(node, content, lift) {
          const oldType = node.draft.type;
          this.setNodeDraft(node, content);
          /** react to type change by manipulating the tree */
          /** PAR => TITLE */
          if (oldType === exports.TextType.Paragraph && content.type === exports.TextType.Title) {
              if (lift === undefined || lift === false) {
                  await this.nestAfter(node);
              }
              else {
                  if (!node.parent)
                      throw new Error('parent undefined');
                  await this.nestAfter(node);
                  await this.liftChildren(node.parent, node.ix, 1);
              }
          }
          /** TITLE => PAR */
          if (oldType === exports.TextType.Title && content.type === exports.TextType.Paragraph) {
              /** remove this node children */
              const children = await this.spliceChildren(node, [], 0, node.childrenNodes.length);
              /** append backwards this node with its children as siblings */
              await this.appendBackwards(node, '', [node].concat(children));
          }
          this.requestUpdate();
      }
      /** take all next syblings of node and nest them under it */
      async nestAfter(node) {
          if (!node.parent)
              return;
          if (node.ix === undefined)
              return;
          const ix = node.ix;
          const ixNext = ix + 1;
          const deltaWithChidren = node.parent.childrenNodes
              .slice(ixNext)
              .findIndex(sibling => sibling.childrenNodes.length > 0);
          /** remove next siblings (until the first sibling with childs is found) from parent */
          const removed = await this.spliceChildren(node.parent, [], ixNext, deltaWithChidren !== -1 ? deltaWithChidren : node.parent.childrenNodes.length - ixNext);
          /** add them as child of this node */
          await this.spliceChildren(node, removed);
      }
      async liftChildren(node, index, count) {
          if (!node.parent)
              throw new Error('parent undefined');
          if (node.ix === undefined)
              throw new Error('ix undefined');
          /** default to all children */
          index = index !== undefined ? index : 0;
          count = count !== undefined ? count : node.childrenNodes.length;
          /** remove children */
          const removed = await this.spliceChildren(node, [], index, count);
          /** add to parent */
          await this.spliceChildren(node.parent, removed, node.ix + 1);
      }
      /** content is appended to the node, elements are added as silblings */
      async appendBackwards(node, content, elements) {
          const backwardNode = this.getBackwardNode(node);
          if (!backwardNode)
              throw new Error('backward node not found');
          if (node.parent === undefined)
              throw new Error('cant remove node');
          if (node.ix === undefined)
              throw new Error('cant remove node');
          /** set the content to append to the backward node */
          backwardNode.append = content;
          /** remove this node */
          await this.spliceChildren(node.parent, [], node.ix, 1);
          if (elements.length > 0) {
              if (backwardNode.parent !== undefined) {
                  if (backwardNode.ix === undefined)
                      throw new Error('cant append elements');
                  /** add elements as siblings of backward node */
                  await this.spliceChildren(backwardNode.parent, elements, backwardNode.ix + 1);
              }
              else {
                  /** add elements as children of backward node */
                  await this.spliceChildren(backwardNode, elements, 0);
              }
          }
          backwardNode.focused = true;
          node.focused = false;
      }
      appended(node) {
          node.append = undefined;
          this.requestUpdate();
      }
      async joinBackward(node, tail) {
          /** remove this node children */
          const removed = await this.spliceChildren(node, [], 0, node.childrenNodes.length);
          await this.appendBackwards(node, tail, removed);
          this.requestUpdate();
      }
      async pullDownward(node) {
          const next = this.getDownwardNode(node);
          if (!next)
              return;
          await this.joinBackward(next, next.draft.text);
          this.requestUpdate();
      }
      async lift(node) {
          if (!node.parent)
              throw new Error('parent undefined');
          if (node.ix === undefined)
              throw new Error('ix undefined');
          await this.liftChildren(node.parent, node.ix, 1);
          this.requestUpdate();
      }
      async split(node, tail, asChild) {
          const dftEntity = this.defaultEntity(tail, exports.TextType.Paragraph);
          if (asChild) {
              await this.createChild(node, dftEntity.data, dftEntity.entityType, 0);
          }
          else {
              await this.createSibling(node, dftEntity.data, dftEntity.entityType);
          }
          this.requestUpdate();
      }
      isNodeFocused() {
          if (!this.doc)
              return false;
          return this.isNodeFocusedRec(this.doc);
      }
      isNodeFocusedRec(node) {
          if (node.focused) {
              return true;
          }
          else {
              for (let ix = 0; ix < node.childrenNodes.length; ix++) {
                  if (this.isNodeFocusedRec(node.childrenNodes[ix])) {
                      return true;
                  }
              }
          }
          return false;
      }
      getLastNode() {
          if (!this.doc)
              return undefined;
          return this.getLastNodeRec(this.doc);
      }
      getLastNodeRec(node) {
          if (node.childrenNodes.length === 0) {
              return node;
          }
          else {
              return this.getLastNodeRec(node.childrenNodes[node.childrenNodes.length - 1]);
          }
      }
      clickAreaClicked() {
          if (!this.isNodeFocused()) {
              const last = this.getLastNode();
              if (last !== undefined) {
                  last.focused = true;
              }
          }
          this.requestUpdate();
      }
      connectedCallback() {
          super.connectedCallback();
          this.addEventListener('checkout-perspective', ((event) => {
              event.stopPropagation();
              this.uref = event.detail.perspectiveId;
          }));
          this.addEventListener('keydown', ((event) => {
              if (event.ctrlKey && event.key === 's') {
                  event.preventDefault();
                  event.stopPropagation();
                  this.persistAll();
              }
          }));
      }
      commitWithMessageClicked() {
          this.showCommitMessage = true;
      }
      cancelCommitClicked() {
          this.showCommitMessage = false;
      }
      acceptCommitClicked() {
          if (!this.shadowRoot)
              return;
          const input = this.shadowRoot.getElementById('COMMIT_MESSAGE');
          const message = input.value;
          this.showCommitMessage = false;
          this.persistAll(message);
      }
      handleNodePerspectiveCheckout(e, node) {
          if (node.coord.length === 1 && node.coord[0] === 0) {
              /** if this is the top element, let the parent handle this */
              return;
          }
          e.stopPropagation();
          this.checkedOutPerspectives[JSON.stringify(node.coord)] = {
              firstUref: node.uref,
              newUref: e.detail.perspectiveId
          };
          this.requestUpdate();
      }
      handleEditorPerspectiveCheckout(e, node) {
          // we are in the parent document editor
          e.stopPropagation();
          const nodeCoord = JSON.stringify(node.coord);
          if (this.checkedOutPerspectives[nodeCoord] !== undefined) {
              if (this.checkedOutPerspectives[nodeCoord].firstUref === e.detail.perspectiveId) {
                  delete this.checkedOutPerspectives[nodeCoord];
              }
              else {
                  this.checkedOutPerspectives[nodeCoord].newUref = e.detail.perspectiveId;
              }
          }
          this.requestUpdate();
      }
      dragOverEffect(e, node) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
      }
      async handleDrop(e, node) {
          e.preventDefault();
          e.stopPropagation();
          const dragged = JSON.parse(e.dataTransfer.getData('text/plain'));
          if (!dragged.uref)
              return;
          if (dragged.parentId === this.uref)
              return;
          if (node.parent === undefined)
              return;
          const ix = node.ix !== undefined ? node.ix : node.parent.childrenNodes.length - 1;
          await this.spliceChildren(node.parent, [dragged.uref], ix + 1, 0);
          this.requestUpdate();
      }
      getColor() {
          return this.color ? this.color : evees.eveeColor(this.uref);
      }
      renderWithCortex(node) {
          return litElement.html `
      <cortex-entity hash=${node.uref}></cortex-entity>
    `;
      }
      renderTopRow(node) {
          /** the uref to which the parent is pointing at */
          const nodeLense = node.hasDocNodeLenses.docNodeLenses()[0];
          const hasIcon = this.hasChanges(node);
          const icon = node.uref === '' ? icons.add_box : icons.edit;
          // for the topNode (the docId), the uref can change, for the other nodes it can't (if it does, a new editor is rendered)
          const uref = node.coord.length === 1 && node.coord[0] === 0 ? this.uref : node.uref;
          const firstRef = node.coord.length === 1 && node.coord[0] === 0 ? this.firstRef : node.uref;
          let paddingTop = '0px';
          if (node.draft.type === exports.TextType.Title) {
              switch (node.level) {
                  case 0:
                      paddingTop = '20px';
                      break;
                  case 1:
                      paddingTop = '14px';
                      break;
                  case 2:
                      paddingTop = '10px';
                      break;
                  default:
                      paddingTop = '0px';
                      break;
              }
          }
          return litElement.html `
      <div
        class="row"
        @dragover=${e => this.dragOverEffect(e, node)}
        @drop=${e => this.handleDrop(e, node)}
      >
        <div class="evee-info" style=${`padding-top:${paddingTop}`}>
          ${!node.isPlaceholder && this.renderInfo
            ? litElement.html `
                <evees-info-popper
                  parent-id=${node.parent ? node.parent.uref : this.parentId}
                  uref=${uref}
                  first-uref=${firstRef}
                  official-owner=${this.officialOwner}
                  ?check-owner=${this.checkOwner}
                  evee-color=${this.getColor()}
                  @checkout-perspective=${e => this.handleNodePerspectiveCheckout(e, node)}
                  show-draft
                  show-info
                  show-icon
                  ?show-debug=${false}
                  emit-proposals
                ></evees-info-popper>
              `
            : litElement.html `
                <div class="empty-evees-info"></div>
              `}
        </div>
        <div class="node-content">
          ${nodeLense.render(node, {
            focus: () => this.focused(node),
            blur: () => this.blured(node),
            contentChanged: (content, lift) => this.contentChanged(node, content, lift),
            focusBackward: () => this.focusBackward(node),
            focusDownward: () => this.focusDownward(node),
            joinBackward: (tail) => this.joinBackward(node, tail),
            pullDownward: () => this.pullDownward(node),
            lift: () => this.lift(node),
            split: (tail, asChild) => this.split(node, tail, asChild),
            appended: () => this.appended(node)
        })}
          ${hasIcon
            ? litElement.html `
                <div class="node-mark">${icon}</div>
              `
            : ''}
        </div>
      </div>
    `;
      }
      renderHere(node) {
          return litElement.html `
      ${this.renderTopRow(node)}
      ${node.childrenNodes
            ? node.childrenNodes.map(child => {
                return this.renderDocNode(child);
            })
            : ''}
    `;
      }
      renderDocNode(node) {
          const coordString = JSON.stringify(node.coord);
          if (this.checkedOutPerspectives[coordString] !== undefined) {
              return litElement.html `
        <documents-editor
          uref=${this.checkedOutPerspectives[coordString].newUref}
          ?read-only=${this.readOnly}
          root-level=${node.level}
          color=${this.getColor()}
          @checkout-perspective=${e => this.handleEditorPerspectiveCheckout(e, node)}
          official-owner=${this.officialOwner}
          ?check-owner=${this.checkOwner}
          show-draft
          show-info
          show-icon
          ?show-debug=${false}
        >
        </documents-editor>
      `;
          }
          return litElement.html `
      <div
        style=${styleMap({
            backgroundColor: node.focused ? SELECTED_BACKGROUND : 'transparent'
        })}
      >
        ${node.hasDocNodeLenses.docNodeLenses().length > 0
            ? this.renderHere(node)
            : this.renderWithCortex(node)}
      </div>
    `;
      }
      commitOptionSelected(e) {
          switch (e.detail.key) {
              case 'push':
                  this.persistAll();
                  break;
              case 'push-with-message':
                  this.commitWithMessageClicked();
                  break;
          }
      }
      renderTopBar() {
          return litElement.html `
      <div class="doc-topbar">
        ${this.docHasChanges && !this.showCommitMessage
            ? litElement.html `
              <uprtcl-button-loading
                icon="unarchive"
                @click=${() => this.persistAll()}
                ?loading=${this.persistingAll}
              >
                push
              </uprtcl-button-loading>
              <uprtcl-help>
                <span>
                  Your current changes are safely stored on this device and won't be lost.<br /><br />
                  "Push" them if<br /><br />
                  <li>You are about to propose a merge.</li>
                  <br />
                  <li>
                    This draft is public and you want them to be visible to others.
                  </li>
                </span>
              </uprtcl-help>
            `
            : ''}
        ${this.showCommitMessage
            ? litElement.html `
              <uprtcl-textfield id="COMMIT_MESSAGE" label="Message"> </uprtcl-textfield>
              <uprtcl-icon-button icon="clear" @click=${this.cancelCommitClicked} button>
              </uprtcl-icon-button>
              <uprtcl-icon-button icon="done" @click=${this.acceptCommitClicked} button>
              </uprtcl-icon-button>
            `
            : ''}
      </div>
    `;
      }
      render() {
          if (this.reloading || this.doc === undefined) {
              return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
          }
          const editorClasses = ['editor-container'];
          if (!this.readOnly) ;
          return litElement.html `
      <div class=${editorClasses.join(' ')}>
        ${this.renderTopBar()} ${this.renderDocNode(this.doc)}
      </div>
      <div @click=${this.clickAreaClicked} class="click-area"></div>
    `;
      }
      static get styles() {
          return litElement.css `
      :host {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        text-align: left;
      }
      .editor-container {
        position: relative;
        width: 100%;
      }
      .padding-bottom {
        padding-bottom: 20vh;
      }
      .click-area {
        flex-grow: 1;
      }
      .doc-topbar {
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        z-index: 2;
      }
      .doc-topbar uprtcl-button-loading {
        opacity: 0.9;
        margin-right: 6px;
        width: 90px;
      }

      .row {
        margin-bottom: 8px;
        display: flex;
        flex-direction: row;
      }

      .evee-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .empty-evees-info {
        width: 30px;
        height: 10px;
      }

      .node-content {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        padding-right: 4px;
      }

      .node-mark {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        fill: rgb(80, 80, 80, 0.2);
      }

      .node-mark svg {
        height: 14px;
        width: 14px;
      }

      @media (max-width: 768px) {
        .doc-topbar {
          display: none;
        }
      }
    `;
      }
  }
  __decorate([
      litElement.property({ type: String, attribute: 'uref' }),
      __metadata("design:type", String)
  ], DocumentEditor.prototype, "firstRef", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", String)
  ], DocumentEditor.prototype, "uref", void 0);
  __decorate([
      litElement.property({ type: String, attribute: 'official-owner' }),
      __metadata("design:type", String)
  ], DocumentEditor.prototype, "officialOwner", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: 'check-owner' }),
      __metadata("design:type", Boolean)
  ], DocumentEditor.prototype, "checkOwner", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: 'read-only' }),
      __metadata("design:type", Boolean)
  ], DocumentEditor.prototype, "readOnly", void 0);
  __decorate([
      litElement.property({ type: Number, attribute: 'root-level' }),
      __metadata("design:type", Number)
  ], DocumentEditor.prototype, "rootLevel", void 0);
  __decorate([
      litElement.property({ type: String }),
      __metadata("design:type", String)
  ], DocumentEditor.prototype, "parentId", void 0);
  __decorate([
      litElement.property({ type: String, attribute: 'default-type' }),
      __metadata("design:type", String)
  ], DocumentEditor.prototype, "defaultType", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: 'show-info' }),
      __metadata("design:type", Boolean)
  ], DocumentEditor.prototype, "renderInfo", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentEditor.prototype, "docHasChanges", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentEditor.prototype, "persistingAll", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentEditor.prototype, "showCommitMessage", void 0);
  __decorate([
      litElement.property({ type: String }),
      __metadata("design:type", String)
  ], DocumentEditor.prototype, "color", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], DocumentEditor.prototype, "reloading", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], DocumentEditor.prototype, "checkedOutPerspectives", void 0);

  class TextNodeDiff extends microOrchestrator.moduleConnect(litElement.LitElement) {
      constructor() {
          super(...arguments);
          this.logger = new microOrchestrator.Logger('EVEES-DIFF');
          this.summary = false;
      }
      async firstUpdated() {
          this.logger.log('firstUpdated()', {
              newData: this.newData,
              oldData: this.oldData
          });
      }
      render() {
          if (this.newData === undefined || this.oldData === undefined) {
              return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
          }
          return litElement.html `
      <div class="page-edited-title">Updated</div>
      <div class="document-container old-page">
        <documents-editor
          .client=${this.workspace.workspace}
          uref=${this.oldData.id}
          read-only
        ></documents-editor>
      </div>
      <div class="document-container new-page">
        <documents-editor
          .client=${this.workspace.workspace}
          uref=${this.newData.id}
          read-only
        ></documents-editor>
      </div>
    `;
      }
      static get styles() {
          return litElement.css `
      :host {
        text-align: left;
      }
      .page-edited-title {
        font-weight: bold;
        margin-bottom: 9px;
        color: gray;
      }
      .document-container {
        padding: 2vw;
        border-radius: 3px;
        margin-bottom: 16px;
      }
      .editor-container {
        border-radius: 3px;
      }
      .new-page {
        background-color: #abdaab;
      }
      .old-page {
        background-color: #dab6ab;
      }
    `;
      }
  }
  __decorate([
      litElement.property({ type: Boolean }),
      __metadata("design:type", Boolean)
  ], TextNodeDiff.prototype, "summary", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", evees.EveesWorkspace)
  ], TextNodeDiff.prototype, "workspace", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], TextNodeDiff.prototype, "newData", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], TextNodeDiff.prototype, "oldData", void 0);

  /**
   * Configure a documents module with the given stores
   *
   * Depends on these modules being present: LensesModule, CortexModule, DiscoveryModule, i18nBaseModule
   *
   * Example usage:
   *
   * ```ts
   * import { IpfsStore } from '@uprtcl/ipfs-provider';
   * import { DocumentsModule } from '@uprtcl/documents';
   *
   * const ipfsStore = new IpfsStore({
   *   host: 'ipfs.infura.io',
   *   port: 5001,
   *   protocol: 'https'
   * });
   *
   * const docs = new DocumentsModule([ ipfsStore ]);
   * await orchestrator.loadModule(docs);
   * ```
   *
   * @param stores an array of CASStores in which the documents objects can be stored/retrieved from
   */
  class DocumentsModule extends evees.EveesContentModule {
      constructor() {
          super(...arguments);
          this.providerIdentifier = DocumentsBindings.DocumentsRemote;
      }
      async onLoad(container) {
          super.onLoad(container);
          customElements.define('documents-text-node-editor', DocumentTextNodeEditor);
          customElements.define('documents-editor', DocumentEditor);
          customElements.define('documents-text-node-diff', TextNodeDiff);
      }
      get submodules() {
          return [
              ...super.submodules,
              new graphql.GraphQlSchemaModule(documentsTypeDefs, {}),
              new microOrchestrator.i18nextModule('documents', { en: en }),
              new cortex.PatternsModule([
                  new TextNodePattern([exports.TextNodeCommon, exports.TextNodeTitle]),
              ]),
              new commonUi.CommonUIModule(),
          ];
      }
  }
  DocumentsModule.id = 'documents-module';
  DocumentsModule.bindings = DocumentsBindings;

  exports.DocumentsBindings = DocumentsBindings;
  exports.DocumentsModule = DocumentsModule;
  exports.TextNodePattern = TextNodePattern;
  exports.htmlToText = htmlToText;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=uprtcl-documents.umd.js.map
