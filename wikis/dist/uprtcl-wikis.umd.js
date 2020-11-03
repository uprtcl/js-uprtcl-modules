(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@uprtcl/cortex'), require('@uprtcl/evees'), require('@uprtcl/graphql'), require('@uprtcl/micro-orchestrator'), require('lit-element'), require('@uprtcl/lenses'), require('@uprtcl/documents'), require('@uprtcl/common-ui'), require('@uprtcl/multiplatform'), require('inversify'), require('graphql-tag')) :
  typeof define === 'function' && define.amd ? define(['exports', '@uprtcl/cortex', '@uprtcl/evees', '@uprtcl/graphql', '@uprtcl/micro-orchestrator', 'lit-element', '@uprtcl/lenses', '@uprtcl/documents', '@uprtcl/common-ui', '@uprtcl/multiplatform', 'inversify', 'graphql-tag'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['uprtcl-wikis'] = {}, global.cortex, global.evees, global.graphql, global.microOrchestrator, global.litElement, global.lenses, global.documents, global.commonUi, global.multiplatform, global.inversify, global.gql));
}(this, (function (exports, cortex, evees, graphql, microOrchestrator, litElement, lenses, documents, commonUi, multiplatform, inversify, gql) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var gql__default = /*#__PURE__*/_interopDefaultLegacy(gql);

  const WikiBindings = {
      WikiType: 'Wiki',
      WikisRemote: 'wikis-remote',
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

  const MAX_LENGTH = 999;
  class WikiDrawerContent extends microOrchestrator.moduleConnect(litElement.LitElement) {
      constructor() {
          super(...arguments);
          this.logger = new microOrchestrator.Logger('WIKI-DRAWER-CONTENT');
          this.checkOwner = false;
          this.editable = false;
          this.loading = true;
          this.pagesList = undefined;
          this.selectedPageIx = undefined;
          this.creatingNewPage = false;
          this.editableActual = false;
          this.remote = '';
          this.currentHeadId = undefined;
      }
      async firstUpdated() {
          this.client = this.request(graphql.ApolloClientModule.bindings.Client);
          this.remotes = this.requestAll(evees.EveesModule.bindings.EveesRemote);
          this.recognizer = this.request(cortex.CortexModule.bindings.Recognizer);
          const config = this.request(evees.EveesModule.bindings.Config);
          this.editableRemotesIds = config.editableRemotesIds ? config.editableRemotesIds : [];
          this.logger.log('firstUpdated()', { uref: this.uref });
          this.loading = true;
          await this.load();
          this.loading = false;
      }
      connectedCallback() {
          super.connectedCallback();
          this.addEventListener(evees.CONTENT_UPDATED_TAG, ((e) => {
              if (e.detail.uref === this.uref) {
                  this.logger.log('ContentUpdatedEvent()', this.uref);
                  this.load();
              }
              if (this.pagesList && this.pagesList.findIndex(page => page.id === e.detail.uref) !== -1) {
                  this.loadPagesData();
              }
          }));
      }
      updated(changedProperties) {
          if (changedProperties.get('uref') !== undefined) {
              this.logger.info('updated()', { changedProperties });
              this.reset();
          }
      }
      async reset() {
          // await this.client.resetStore();
          this.pagesList = undefined;
          this.selectedPageIx = undefined;
          this.wiki = undefined;
          this.logger.log('reset()', this.uref);
          this.loading = true;
          this.load();
          this.loading = false;
      }
      async load() {
          if (this.uref === undefined)
              return;
          this.logger.log('load()');
          const perspective = (await multiplatform.loadEntity(this.client, this.uref));
          const headId = await evees.EveesHelpers.getPerspectiveHeadId(this.client, this.uref);
          this.remote = perspective.object.payload.remote;
          const canWrite = await evees.EveesHelpers.canWrite(this.client, this.uref);
          this.currentHeadId = headId;
          this.editableActual =
              this.editableRemotesIds.length > 0
                  ? this.editableRemotesIds.includes(this.remote) && canWrite
                  : canWrite;
          this.wiki = await evees.EveesHelpers.getPerspectiveData(this.client, this.uref);
          await this.loadPagesData();
      }
      async loadPagesData() {
          if (!this.wiki) {
              this.pagesList = [];
              return;
          }
          this.logger.log('loadPagesData()');
          const pagesListPromises = this.wiki.object.pages.map(async (pageId) => {
              const data = await evees.EveesHelpers.getPerspectiveData(this.client, pageId);
              if (!data)
                  throw new Error(`data not found for page ${pageId}`);
              const hasTitle = this.recognizer
                  .recognizeBehaviours(data)
                  .find(b => b.title);
              const title = hasTitle.title(data);
              return {
                  id: pageId,
                  title
              };
          });
          this.pagesList = await Promise.all(pagesListPromises);
          this.logger.log('loadPagesData()', { pagesList: this.pagesList });
      }
      selectPage(ix) {
          if (!this.wiki)
              return;
          this.selectedPageIx = ix;
      }
      getStore(remote, type) {
          const remoteInstance = this.remotes.find(r => r.id === remote);
          if (!remoteInstance)
              throw new Error(`Remote not found for remote ${remote}`);
          return remoteInstance.store;
      }
      handlePageDrag(e, pageId) {
          const dragged = { uref: pageId, parentId: this.uref };
          this.logger.info('dragging', dragged);
          e.dataTransfer.setData('text/plain', JSON.stringify(dragged));
      }
      async handlePageDrop(e) {
          const wikiObject = this.wiki
              ? this.wiki.object
              : {
                  title: '',
                  pages: []
              };
          const dragged = JSON.parse(e.dataTransfer.getData('text/plain'));
          this.logger.info('dropped', dragged);
          if (!this.wiki)
              return;
          if (!dragged.uref)
              return;
          if (dragged.parentId === this.uref)
              return;
          const index = this.wiki.object.pages.length;
          const result = await this.splicePages(wikiObject, [dragged.uref], index, 0);
          if (!result.entity)
              throw Error('problem with splice pages');
          await this.updateContent(result.entity);
      }
      dragOverEffect(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
      }
      async createPage(page, remote) {
          if (!this.remotes)
              throw new Error('eveesRemotes undefined');
          if (!this.client)
              throw new Error('client undefined');
          const remoteInstance = this.remotes.find(r => r.id === remote);
          if (!remoteInstance)
              throw new Error(`Remote not found for remote ${remote}`);
          const dataId = await evees.EveesHelpers.createEntity(this.client, remoteInstance.store, page);
          const headId = await evees.EveesHelpers.createCommit(this.client, remoteInstance.store, {
              dataId,
              parentsIds: []
          });
          return evees.EveesHelpers.createPerspective(this.client, remoteInstance, {
              headId,
              parentId: this.uref
          });
      }
      async updateContent(newWiki) {
          const store = this.getStore(this.remote, WikiBindings.WikiType);
          if (!store)
              throw new Error('store is undefined');
          const remote = this.remotes.find(r => r.id === this.remote);
          if (!remote)
              throw Error(`Remote not found for remote ${this.remote}`);
          const dataId = await evees.EveesHelpers.createEntity(this.client, store, newWiki);
          const headId = await evees.EveesHelpers.createCommit(this.client, remote.store, {
              dataId,
              parentsIds: this.currentHeadId ? [this.currentHeadId] : undefined
          });
          await evees.EveesHelpers.updateHead(this.client, this.uref, headId);
          this.logger.info('updateContent()', newWiki);
          await this.load();
      }
      async replacePagePerspective(oldId, newId) {
          if (!this.wiki)
              throw new Error('wiki undefined');
          const ix = this.wiki.object.pages.findIndex(pageId => pageId === oldId);
          if (ix === -1)
              return;
          const result = await this.splicePages(this.wiki.object, [newId], ix, 1);
          if (!result.entity)
              throw Error('problem with splice pages');
          await this.updateContent(result.entity);
      }
      async splicePages(wikiObject, pages, index, count) {
          const getPages = pages.map(page => {
              if (typeof page !== 'string') {
                  return this.createPage(page, this.remote);
              }
              else {
                  return Promise.resolve(page);
              }
          });
          const pagesIds = await Promise.all(getPages);
          const newObject = { ...wikiObject };
          const removed = newObject.pages.splice(index, count, ...pagesIds);
          return {
              entity: newObject,
              removed
          };
      }
      async newPage(index) {
          const wikiObject = this.wiki
              ? this.wiki.object
              : {
                  title: '',
                  pages: []
              };
          this.creatingNewPage = true;
          const newPage = {
              text: '',
              type: documents.TextType.Title,
              links: []
          };
          index = index === undefined ? wikiObject.pages.length : index;
          const result = await this.splicePages(wikiObject, [newPage], index, 0);
          if (!result.entity)
              throw Error('problem with splice pages');
          await this.updateContent(result.entity);
          this.selectPage(index);
          this.creatingNewPage = false;
      }
      async movePage(fromIndex, toIndex) {
          if (!this.wiki)
              throw new Error('wiki not defined');
          const { removed } = await this.splicePages(this.wiki.object, [], fromIndex, 1);
          const { entity } = await this.splicePages(this.wiki.object, removed, toIndex, 0);
          await this.updateContent(entity);
          if (this.selectedPageIx === undefined)
              return;
          /** this page was moved */
          if (fromIndex === this.selectedPageIx) {
              this.selectPage(toIndex);
          }
          else {
              /** a non selected page was moved to the selected index */
              if (toIndex === this.selectedPageIx) {
                  this.selectPage(fromIndex);
              }
          }
      }
      async removePage(pageIndex) {
          if (!this.wiki)
              throw new Error('wiki not defined');
          const { entity } = await this.splicePages(this.wiki.object, [], pageIndex, 1);
          await this.updateContent(entity);
          if (this.selectedPageIx === undefined)
              return;
          /** this page was removed */
          if (pageIndex === this.selectedPageIx) {
              this.selectPage(undefined);
          }
          /** a younger page was removed */
          if (pageIndex < this.selectedPageIx) {
              this.selectedPageIx = this.selectedPageIx - 1;
          }
      }
      async optionOnPage(pageIndex, option) {
          switch (option) {
              case 'move-up':
                  this.movePage(pageIndex, pageIndex - 1);
                  break;
              case 'move-down':
                  this.movePage(pageIndex, pageIndex + 1);
                  break;
              case 'add-below':
                  this.newPage(pageIndex + 1);
                  break;
              case 'remove':
                  this.removePage(pageIndex);
                  break;
          }
      }
      goToHome() {
          this.selectPage(undefined);
      }
      goBack() {
          this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
      }
      renderPageList(showOptions = true) {
          if (this.pagesList === undefined)
              return litElement.html `
        <uprtcl-loading class="empty-pages-loader"></uprtcl-loading>
      `;
          return litElement.html `
      ${this.pagesList.length === 0
            ? litElement.html `
            <div class="empty">
              <span><i>${this.t('wikis:no-pages-yet')}</i></span>
            </div>
          `
            : litElement.html `
            <uprtcl-list>
              ${this.pagesList.map((page, ix) => {
                // this.logger.log(`rendering page title ${page.id}`, menuConfig);
                return this.renderPageItem(page, ix, showOptions);
            })}
            </uprtcl-list>
          `}
      ${this.editableActual
            ? litElement.html `
            <div class="button-row">
              <uprtcl-button-loading
                icon="add_circle_outline"
                @click=${() => this.newPage()}
                ?loading=${this.creatingNewPage}
              >
                ${this.t('wikis:new-page')}
              </uprtcl-button-loading>
            </div>
          `
            : litElement.html ``}
    `;
      }
      renderPageItem(page, ix, showOptions) {
          const menuConfig = {
              'move-up': {
                  disabled: ix === 0,
                  text: 'move up',
                  icon: 'arrow_upward'
              },
              'move-down': {
                  disabled: ix === this.pagesList.length - 1,
                  text: 'move down',
                  icon: 'arrow_downward'
              },
              'add-below': {
                  disabled: false,
                  text: 'create below',
                  icon: 'add'
              },
              remove: {
                  disabled: false,
                  text: 'remove',
                  icon: 'clear'
              }
          };
          const text = documents.htmlToText(page.title);
          const empty = text === '';
          const selected = this.selectedPageIx === ix;
          let classes = [];
          classes.push('page-item');
          if (empty)
              classes.push('title-empty');
          if (selected)
              classes.push('title-selected');
          return litElement.html `
      <div
        class=${classes.join(' ')}
        draggable="false"
        @dragstart=${e => this.handlePageDrag(e, page.id)}
        @click=${() => this.selectPage(ix)}
      >
        <div class="text-container">
          ${text.length < MAX_LENGTH ? text : `${text.slice(0, MAX_LENGTH)}...`}
        </div>
        ${this.editableActual && showOptions
            ? litElement.html `
              <div class="item-menu-container">
                <uprtcl-options-menu
                  class="options-menu"
                  @option-click=${e => this.optionOnPage(ix, e.detail.key)}
                  .config=${menuConfig}
                >
                </uprtcl-options-menu>
              </div>
            `
            : ''}
      </div>
    `;
      }
      renderHome() {
          return ``;
          // return this.pagesList
          //   ? this.pagesList.map((page, ix) => {
          //       return html`
          //         <uprtcl-card class="home-card bg-transition" @click=${() => this.selectPage(ix)}>
          //           ${page.title}
          //         </uprtcl-card>
          //       `;
          //     })
          //   : '';
      }
      render() {
          if (this.loading)
              return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
          this.logger.log('rendering wiki after loading');
          return litElement.html `
      <div class="app-content-with-nav">
        <div class="app-navbar" @dragover=${this.dragOverEffect} @drop=${this.handlePageDrop}>
          ${this.renderPageList()}
        </div>

        <div class="app-content">
          ${this.selectedPageIx !== undefined && this.wiki
            ? litElement.html `
                <div class="page-container">
                  <documents-editor
                    id="doc-editor"
                    .client=${this.client}
                    uref=${this.wiki.object.pages[this.selectedPageIx]}
                    parent-id=${this.uref}
                    color=${this.color}
                    official-owner=${this.officialOwner}
                    ?check-owner=${this.checkOwner}
                    show-info
                  >
                  </documents-editor>
                </div>
              `
            : litElement.html `
                <div class="home-container">
                  ${this.renderHome()}
                </div>
              `}
        </div>
      </div>
    `;
      }
      static get styles() {
          return [
              commonUi.styles,
              litElement.css `
        :host {
          display: flex;
          flex: 1 1 0;
          flex-direction: column;
        }
        .app-content-with-nav {
          flex: 1 1 0;
          display: flex;
          flex-direction: row;
          position: relative;
        }
        .app-navbar {
          width: 260px;
          flex-shrink: 0;
        }
        .app-content {
          border-left: solid #cccccc 1px;
          min-width: 475px;
          max-width: calc(100% - 260px - 1px);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .empty-pages-loader {
          margin-top: 22px;
          display: block;
        }
        .page-item {
          min-height: 48px;
          cursor: pointer;
          width: calc(100% - 19px);
          display: flex;
          padding: 0px 3px 0px 16px;
          transition: all 0.1s ease-in;
        }
        .page-item .text-container {
          white-space: nowrap;
          overflow: hidden;
          max-width: calc(100% - 48px);
          overflow-x: hidden;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }
        .page-item .item-menu-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .page-item .item-menu-container .options-menu {
          --box-width: 160px;
          font-weight: normal;
        }
        .page-item:hover {
          background-color: #e8ecec;
        }
        .title-empty {
          color: #a2a8aa;
          font-style: italic;
        }
        .title-selected {
          font-weight: bold;
          background-color: rgb(200, 200, 200, 0.2);
        }
        .empty {
          width: 100%;
          text-align: center;
          padding-top: 24px;
          color: #a2a8aa;
        }
        .button-row {
          width: calc(100% - 20px);
          padding: 16px 10px 8px 10px;
          display: flex;
        }
        .button-row uprtcl-button-loading {
          margin: 0 auto;
          width: 180px;
        }
        .page-container {
          margin: 0 auto;
          max-width: 900px;
          width: 100%;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .home-container {
          text-align: center;
          height: auto;
          padding: 6vw 0vw;
        }
        .home-card {
          width: 100%;
          font-size: 20px;
          display: block;
          max-width: 340px;
          margin: 18px auto;
          cursor: pointer;
          padding: 8px 24px;
          font-weight: bold;
        }
        .home-card:hover {
          background-color: #f1f1f1;
        }
      `
          ];
      }
  }
  __decorate([
      litElement.property({ type: String }),
      __metadata("design:type", String)
  ], WikiDrawerContent.prototype, "uref", void 0);
  __decorate([
      litElement.property({ type: String }),
      __metadata("design:type", String)
  ], WikiDrawerContent.prototype, "color", void 0);
  __decorate([
      litElement.property({ type: String, attribute: 'official-owner' }),
      __metadata("design:type", String)
  ], WikiDrawerContent.prototype, "officialOwner", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: 'check-owner' }),
      __metadata("design:type", Boolean)
  ], WikiDrawerContent.prototype, "checkOwner", void 0);
  __decorate([
      litElement.property({ type: Boolean }),
      __metadata("design:type", Boolean)
  ], WikiDrawerContent.prototype, "editable", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], WikiDrawerContent.prototype, "loading", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], WikiDrawerContent.prototype, "wiki", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], WikiDrawerContent.prototype, "pagesList", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], WikiDrawerContent.prototype, "selectedPageIx", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], WikiDrawerContent.prototype, "creatingNewPage", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], WikiDrawerContent.prototype, "editableActual", void 0);

  const styleMap = style => {
      return Object.entries(style).reduce((styleString, [propName, propValue]) => {
          propName = propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`);
          return `${styleString}${propName}:${propValue};`;
      }, '');
  };
  class WikiDrawer extends microOrchestrator.moduleConnect(litElement.LitElement) {
      constructor() {
          super();
          this.logger = new microOrchestrator.Logger('WIKI-DRAWER');
          this.showProposals = false;
          this.showBack = false;
          this.checkOwner = false;
          this.loading = true;
      }
      async firstUpdated() {
          this.client = this.request(graphql.ApolloClientModule.bindings.Client);
          this.eveesRemotes = this.requestAll(evees.EveesModule.bindings.EveesRemote);
          this.recognizer = this.request(cortex.CortexModule.bindings.Recognizer);
          this.logger.log('firstUpdated()', { uref: this.uref });
          this.uref = this.firstRef;
          /** the official owner is the creator of the firstRef of the Wiki,
           * the firstRef is comming from the outside e.g. browser url. */
          const official = await multiplatform.loadEntity(this.client, this.firstRef);
          if (!official)
              throw new Error(`cant find official perspective ${this.firstRef}`);
          this.officialOwner = official.object.payload.creatorId;
          await this.load();
          this.loading = false;
      }
      connectedCallback() {
          super.connectedCallback();
          this.addEventListener('checkout-perspective', ((event) => {
              this.uref = event.detail.perspectiveId;
          }));
          this.addEventListener(evees.CONTENT_UPDATED_TAG, ((event) => {
              if (this.uref === event.detail.uref) {
                  this.content.load();
              }
          }));
          this.addEventListener(evees.PROPOSAL_CREATED_TAG, ((event) => {
              this.catchMergeProposal(event);
          }));
      }
      async load() {
          const current = await multiplatform.loadEntity(this.client, this.uref);
          if (!current)
              throw new Error(`cant find current perspective ${this.uref}`);
          this.creatorId = current.object.payload.creatorId;
      }
      async forceReload() {
          this.loading = true;
          await this.updateComplete;
          await this.client.resetStore();
          this.load();
          this.loading = false;
      }
      updated(changedProperties) {
          if (changedProperties.has('uref')) {
              this.load();
          }
      }
      async catchMergeProposal(e) {
          await this.client.mutate({
              mutation: evees.CREATE_PROPOSAL,
              variables: {
                  toPerspectiveId: this.firstRef,
                  fromPerspectiveId: this.uref,
                  newPerspectives: e.detail.proposalDetails.newPerspectives,
                  updates: e.detail.proposalDetails.updates
              }
          });
          this.eveesInfoLocal.load();
      }
      color() {
          if (this.firstRef === this.uref) {
              return evees.DEFAULT_COLOR;
          }
          else {
              return evees.eveeColor(this.creatorId);
          }
      }
      loggedIn() {
          this.content.load();
          this.eveesInfoLocal.load();
      }
      renderBreadcrumb() {
          return litElement.html `
      ${this.showBack
            ? litElement.html `
            <uprtcl-icon-button
              button
              class="back-button"
              icon="arrow_back"
              @click=${() => this.dispatchEvent(new CustomEvent('back'))}
            ></uprtcl-icon-button>
          `
            : ``}
      <evees-info-user-based
        id="evees-info-row"
        uref=${this.uref}
        first-uref=${this.firstRef}
        official-owner=${this.officialOwner}
        ?check-owner=${this.checkOwner}
        ?show-proposals=${this.showProposals}
        show-info
        show-icon
        ?show-debug=${false}
        show-draft
        show-edit-draft
      >
      </evees-info-user-based>
    `;
      }
      renderLoginWidget() {
          return litElement.html `
      <uprtcl-icon-button
        button
        class="reload-button"
        icon="cached"
        @click=${() => this.forceReload()}
      ></uprtcl-icon-button>
      <evees-login-widget @changed=${() => this.loggedIn()}></evees-login-widget>
    `;
      }
      render() {
          if (this.loading)
              return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
          this.logger.log('rendering wiki after loading');
          return litElement.html `
      <div class="app-drawer">
        <div
          class="app-topbar"
          style=${styleMap({
            borderColor: this.color()
        })}
        >
          <div class="breadcrum-container">${this.renderBreadcrumb()}</div>
          <div class="login-widget-container">${this.renderLoginWidget()}</div>
        </div>

        <wiki-drawer-content
          id="wiki-drawer-content"
          uref=${this.uref}
          editable
          color=${this.color()}
          official-owner=${this.officialOwner}
          ?check-owner=${this.checkOwner}
        >
        </wiki-drawer-content>
      </div>
    `;
      }
      static get styles() {
          return [
              lenses.sharedStyles,
              litElement.css `
        :host {
          display: flex;
          flex: 1 1 0;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji',
            Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
          font-size: 16px;
          color: #37352f;
          --mdc-theme-primary: #2196f3;
          width: 100%;
          position: relative;
        }
        .app-drawer {
          width: 100%;
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
        }
        .app-topbar {
          width: 100%;
          display: flex;
          flex-direction: row;
          height: 68px;
          border-width: 5px;
          border-bottom-style: solid;
        }
        .breadcrum-container {
          flex: 1 1 0;
          padding: 16px;
          display: flex;
          flex-direction: row;
        }
        evees-info-user-based {
          width: 100%;
        }
        .login-widget-container {
          flex: 0 0 0;
          padding: 16px;
          display: flex;
        }
        .reload-button {
          margin-right: 8px;
        }
        .back-button {
          margin-right: 8px;
        }
      `
          ];
      }
  }
  __decorate([
      litElement.property({ type: String, attribute: 'uref' }),
      __metadata("design:type", String)
  ], WikiDrawer.prototype, "firstRef", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: 'show-proposals' }),
      __metadata("design:type", Boolean)
  ], WikiDrawer.prototype, "showProposals", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: 'show-back' }),
      __metadata("design:type", Boolean)
  ], WikiDrawer.prototype, "showBack", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", String)
  ], WikiDrawer.prototype, "uref", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", String)
  ], WikiDrawer.prototype, "officialOwner", void 0);
  __decorate([
      litElement.property({ type: Boolean, attribute: 'check-owner' }),
      __metadata("design:type", Boolean)
  ], WikiDrawer.prototype, "checkOwner", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], WikiDrawer.prototype, "loading", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", String)
  ], WikiDrawer.prototype, "creatorId", void 0);
  __decorate([
      litElement.query('#wiki-drawer-content'),
      __metadata("design:type", WikiDrawerContent)
  ], WikiDrawer.prototype, "content", void 0);
  __decorate([
      litElement.query('#evees-info-row'),
      __metadata("design:type", Object)
  ], WikiDrawer.prototype, "eveesInfoLocal", void 0);

  const propertyOrder = ['title', 'pages'];
  const logger = new microOrchestrator.Logger('WIKI-ENTITY');
  class WikiPattern extends cortex.Pattern {
      constructor() {
          super(...arguments);
          this.type = WikiBindings.WikiType;
      }
      recognize(entity) {
          return cortex.recognizeEntity(entity) && propertyOrder.every(p => entity.object.hasOwnProperty(p));
      }
  }
  let WikiLinks = class WikiLinks {
      constructor() {
          this.replaceChildrenLinks = (wiki) => (childrenHashes) => ({
              ...wiki,
              object: {
                  ...wiki.object,
                  pages: childrenHashes
              }
          });
          this.getChildrenLinks = (wiki) => wiki.object.pages;
          this.links = async (wiki) => this.getChildrenLinks(wiki);
          this.merge = (originalNode) => async (modifications, mergeStrategy, workspace, config) => {
              const mergedTitle = evees.mergeStrings(originalNode.object.title, modifications.map(data => (!!data ? data.object.title : originalNode.object.title)));
              // TODO: add entity
              const mergedPages = await mergeStrategy.mergeLinks(originalNode.object.pages, modifications.map(data => (!!data ? data.object.pages : originalNode.object.pages)), workspace, config);
              return {
                  title: mergedTitle,
                  pages: mergedPages
              };
          };
      }
  };
  WikiLinks = __decorate([
      inversify.injectable()
  ], WikiLinks);
  let WikiCommon = class WikiCommon {
      constructor() {
          this.lenses = (wiki) => {
              return [
                  {
                      name: 'Wiki',
                      type: 'content',
                      render: (entity, context) => {
                          logger.info('lenses() - Wiki', { wiki, context });
                          return litElement.html `
            <wiki-drawer
              .data=${wiki}
              .uref=${entity.id}
              color=${context.color}
              .selectedPageHash=${context.selectedPageHash}
            >
            </wiki-drawer>
          `;
                      }
                  }
              ];
          };
          this.diffLenses = () => {
              return [
                  {
                      name: 'wikis:wiki-diff',
                      type: 'diff',
                      render: (workspace, newEntity, oldEntity, summary) => {
                          // logger.log('lenses: documents:document - render()', { node, lensContent, context });
                          return litElement.html `
            <wiki-diff
              .workspace=${workspace}
              .newData=${newEntity}
              .oldData=${oldEntity}
              ?summary=${summary}
            >
            </wiki-diff>
          `;
                      }
                  }
              ];
          };
          this.title = (wiki) => wiki.object.title;
      }
  };
  WikiCommon = __decorate([
      inversify.injectable()
  ], WikiCommon);

  const wikiTypeDefs = gql__default['default'] `
  type Wiki implements Entity {
    id: ID!

    title: String!
    pages: [Entity!]! @discover

    _context: EntityContext!
  }
`;

  var untitled = "Untitled";
  var en = {
  	"welcome-to": "Welcome to",
  	"new-page": "New page",
  	untitled: untitled,
  	"no-pages-yet": "There are no pages yet"
  };

  class WikiDiff extends microOrchestrator.moduleConnect(litElement.LitElement) {
      constructor() {
          super(...arguments);
          this.logger = new microOrchestrator.Logger('EVEES-DIFF');
          this.summary = false;
          this.loading = true;
          this.oldTitle = '';
      }
      async firstUpdated() {
          this.logger.log('firstUpdated()', {
              newData: this.newData,
              oldData: this.oldData
          });
          this.loadChanges();
      }
      async loadChanges() {
          this.loading = true;
          const oldPages = this.oldData ? this.oldData.object.pages : [];
          this.oldTitle = this.oldData ? this.oldData.object.title : '';
          this.newPages = this.newData.object.pages.filter(page => this.oldData ? !oldPages.includes(page) : true);
          this.deletedPages = this.oldData
              ? oldPages.filter(page => !this.newData.object.pages.includes(page))
              : [];
          this.loading = false;
      }
      renderPage(page, classes) {
          return litElement.html `
      <div class=${['page-row'].concat(classes).join(' ')}>
        <documents-editor
          .client=${this.workspace.workspace}
          uref=${page}
          read-only
        ></documents-editor>
      </div>
    `;
      }
      renderTitleChange(title, classes) {
          return litElement.html `
      <div class=${['page-row'].concat(classes).join(' ')}>
        <h1>${title}</h1>
      </div>
    `;
      }
      render() {
          if (this.loading) {
              return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
          }
          const titleChanged = this.newData.object.title !== this.oldTitle;
          const newPages = this.newPages !== undefined ? this.newPages : [];
          const deletedPages = this.deletedPages !== undefined ? this.deletedPages : [];
          if (this.summary) {
              return litElement.html `
        ${titleChanged
                ? litElement.html `
              <span class="">Title changed, </span>
            `
                : ''}
        ${newPages.length
                ? litElement.html `
              <span>${newPages.length} new pages added,</span>
            `
                : ''}
        ${deletedPages.length
                ? litElement.html `
              <span>${deletedPages.length} pages deleted.</span>
            `
                : ''}
      `;
          }
          return litElement.html `
      ${titleChanged
            ? litElement.html `
            <div class="pages-list">
              <div class="page-list-title">New Title</div>
              ${this.renderTitleChange(this.newData.object.title, ['green-background'])}
              ${this.renderTitleChange(this.oldTitle, ['red-background'])}
            </div>
          `
            : ''}
      ${newPages.length > 0
            ? litElement.html `
            <div class="pages-list">
              <div class="page-list-title">Pages Added</div>
              ${newPages.map(page => this.renderPage(page, ['green-background']))}
            </div>
          `
            : ''}
      ${deletedPages.length > 0
            ? litElement.html `
            <div class="pages-list">
              <div class="page-list-title">Pages Removed</div>
              ${deletedPages.map(page => this.renderPage(page, ['red-background']))}
            </div>
          `
            : ''}
    `;
      }
      static get styles() {
          return litElement.css `
      :host {
        text-align: left;
      }
      .page-list-title {
        font-weight: bold;
        margin-bottom: 9px;
        color: gray;
      }
      .page-row {
        padding: 2vw;
        border-radius: 3px;
        margin-bottom: 16px;
      }
      .green-background {
        background-color: #abdaab;
      }
      .red-background {
        background-color: #dab6ab;
      }
    `;
      }
  }
  __decorate([
      litElement.property({ type: Boolean }),
      __metadata("design:type", Boolean)
  ], WikiDiff.prototype, "summary", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", evees.EveesWorkspace)
  ], WikiDiff.prototype, "workspace", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], WikiDiff.prototype, "newData", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Object)
  ], WikiDiff.prototype, "oldData", void 0);
  __decorate([
      litElement.property({ attribute: false }),
      __metadata("design:type", Boolean)
  ], WikiDiff.prototype, "loading", void 0);

  /**
   * Configure a wikis module with the given providers
   *
   * Depends on: lensesModule, PatternsModule, multiSourceModule
   *
   * Example usage:
   *
   * ```ts
   * import { IpfsStore } from '@uprtcl/ipfs-provider';
   * import { WikisModule, WikisTypes } from '@uprtcl/wikis';
   *
   * const ipfsStore = new IpfsStore({
   *   host: 'ipfs.infura.io',
   *   port: 5001,
   *   protocol: 'https'
   * });
   *
   * const wikis = new WikisModule([ ipfsStore ]);
   * await orchestrator.loadModule(wikis);
   * ```
   *
   * @category CortexModule
   *
   * @param stores an array of CASStores in which the wiki objects can be stored/retrieved from
   */
  class WikisModule extends evees.EveesContentModule {
      constructor() {
          super(...arguments);
          this.providerIdentifier = WikiBindings.WikisRemote;
      }
      async onLoad(container) {
          super.onLoad(container);
          customElements.define('wiki-drawer', WikiDrawer);
          customElements.define('wiki-drawer-content', WikiDrawerContent);
          customElements.define('wiki-diff', WikiDiff);
      }
      get submodules() {
          return [
              ...super.submodules,
              new graphql.GraphQlSchemaModule(wikiTypeDefs, {}),
              new microOrchestrator.i18nextModule('wikis', { en: en }),
              new cortex.PatternsModule([new WikiPattern([WikiCommon, WikiLinks])])
          ];
      }
  }
  WikisModule.id = 'wikis-module';
  WikisModule.bindings = WikiBindings;

  exports.WikiBindings = WikiBindings;
  exports.WikisModule = WikisModule;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=uprtcl-wikis.umd.js.map
