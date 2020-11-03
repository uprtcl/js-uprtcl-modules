(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata'), require('apollo-boost'), require('inversify'), require('@uprtcl/cortex'), require('@uprtcl/multiplatform'), require('@uprtcl/micro-orchestrator'), require('@uprtcl/graphql'), require('multihashing-async'), require('cbor-js'), require('cids'), require('@uprtcl/ipfs-provider'), require('lodash-es'), require('@uprtcl/common-ui'), require('lit-element'), require('zen-observable-ts'), require('lodash-es/cloneDeep'), require('randomcolor'), require('lodash-es/isEqual'), require('diff-match-patch-ts'), require('dexie')) :
    typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata', 'apollo-boost', 'inversify', '@uprtcl/cortex', '@uprtcl/multiplatform', '@uprtcl/micro-orchestrator', '@uprtcl/graphql', 'multihashing-async', 'cbor-js', 'cids', '@uprtcl/ipfs-provider', 'lodash-es', '@uprtcl/common-ui', 'lit-element', 'zen-observable-ts', 'lodash-es/cloneDeep', 'randomcolor', 'lodash-es/isEqual', 'diff-match-patch-ts', 'dexie'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['uprtcl-evees'] = {}, null, global.apolloBoost, global.inversify, global.cortex, global.multiplatform, global.microOrchestrator, global.graphql, global.multihashing, global.CBOR, global.CID, global.ipfsProvider, global.lodashEs, global.commonUi, global.litElement, global.Observable, global.cloneDeep, global.randomcolor, global.isEqual, global.diffMatchPatchTs, global.Dexie));
}(this, (function (exports, reflectMetadata, apolloBoost, inversify, cortex, multiplatform, microOrchestrator, graphql, multihashing, CBOR, CID, ipfsProvider, lodashEs, commonUi, litElement, Observable, cloneDeep, randomcolor, isEqual, diffMatchPatchTs, Dexie) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var multihashing__default = /*#__PURE__*/_interopDefaultLegacy(multihashing);
    var CBOR__default = /*#__PURE__*/_interopDefaultLegacy(CBOR);
    var CID__default = /*#__PURE__*/_interopDefaultLegacy(CID);
    var Observable__default = /*#__PURE__*/_interopDefaultLegacy(Observable);
    var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);
    var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
    var Dexie__default = /*#__PURE__*/_interopDefaultLegacy(Dexie);

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

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    const EveesBindings = {
        PerspectiveType: 'Perspective',
        CommitType: 'Commit',
        EveesRemote: 'evees-remote',
        MergeStrategy: 'merge-strategy',
        Evees: 'evees',
        Config: 'evees-config',
        Remote: 'remote'
    };

    async function hashObject(object, config = multiplatform.defaultCidConfig) {
        const sorted = ipfsProvider.sortObject(object);
        const buffer = CBOR__default['default'].encode(sorted);
        const encoded = await multihashing__default['default'](buffer, config.type);
        const cid = new CID__default['default'](config.version, config.codec, encoded, config.base);
        return cid.toString();
    }
    async function deriveEntity(object, config = multiplatform.defaultCidConfig) {
        const hash = await hashObject(object, config);
        return {
            id: hash,
            object,
            casID: undefined,
        };
    }

    function signObject(object) {
        return {
            proof: {
                signature: '',
                type: '',
            },
            payload: object,
        };
    }
    function extractSignedEntity(object) {
        if (!(object.hasOwnProperty('id') && object.hasOwnProperty('object')))
            return undefined;
        const entity = object.object;
        if (!(entity.hasOwnProperty('proof') && entity.hasOwnProperty('payload')))
            return undefined;
        return entity.payload;
    }
    async function deriveSecured(object, config = multiplatform.defaultCidConfig) {
        const signed = signObject(object);
        return deriveEntity(signed, config);
    }

    const UPDATE_HEAD = apolloBoost.gql `
  mutation UpdatePerspectiveHead(
    $perspectiveId: ID!
    $headId: ID
    $context: String
    $name: String
  ) {
    updatePerspectiveHead(
      perspectiveId: $perspectiveId
      headId: $headId
      context: $context
      name: $name
    ) {
      id
      head {
        id
        data {
          id
        }
      }
      context {
        id
      }
      name
      payload {
        remote
      }
      _context {
        content {
          id
        }
      }
    }
  }
`;
    const DELETE_PERSPECTIVE = apolloBoost.gql `
  mutation DeletePerspective($perspectiveId: ID!) {
    deletePerspective(perspectiveId: $perspectiveId) {
      id
    }
  }
`;
    const CREATE_ENTITY = apolloBoost.gql `
  mutation CreateEntity($id: String, $object: JSON!, $casID: ID) {
    createEntity(id: $id, object: $object, casID: $casID) {
      id
    }
  }
`;
    const CREATE_PERSPECTIVE = apolloBoost.gql `
  mutation CreatePerspective(
    $remote: String!
    $path: String
    $creatorId: String
    $timestamp: Date
    $headId: ID
    $context: String
    $name: String
    $canWrite: String
    $parentId: String
    $fromPerspectiveId: String
    $fromHeadId: String
  ) {
    createPerspective(
      remote: $remote
      path: $path
      creatorId: $creatorId
      timestamp: $timestamp
      headId: $headId
      context: $context
      name: $name
      canWrite: $canWrite
      parentId: $parentId
      fromPerspectiveId: $fromPerspectiveId
      fromHeadId: $fromHeadId
    ) {
      id
      name
      head {
        id
        data {
          id
        }
      }
      payload {
        creatorId
        remote
        path
        timestamp
        context {
          id
          perspectives {
            id
          }
        }
        fromPerspectiveId
        fromHeadId
      }
    }
  }
`;
    const FORK_PERSPECTIVE = apolloBoost.gql `
  mutation ForkPerspective(
    $perspectiveId: String
    $remote: String
    $parentId: String
    $name: String
  ) {
    forkPerspective(
      perspectiveId: $perspectiveId
      remote: $remote
      parentId: $parentId
      name: $name
    ) {
      id
      head {
        id
      }
      context {
        id
        perspectives {
          id
        }
      }
      name
      payload {
        path
        remote
        creatorId
        timestamp
      }
    }
  }
`;
    const CREATE_PROPOSAL = apolloBoost.gql `
  mutation AddProposal(
    $toPerspectiveId: ID!
    $fromPerspectiveId: ID!
    $toHeadId: ID
    $fromHeadId: ID
    $newPerspectives: [NewPerspectiveInput]!
    $updates: [HeadUpdateInput!]
  ) {
    addProposal(
      toPerspectiveId: $toPerspectiveId
      fromPerspectiveId: $fromPerspectiveId
      toHeadId: $toHeadId
      fromHeadId: $fromHeadId
      newPerspectives: $newPerspectives
      updates: $updates
    ) {
      id
      toPerspective {
        id
        proposals
      }
      fromPerspective {
        id
      }
      updates
      newPerspectives
    }
  }
`;
    const EXECUTE_PROPOSAL = apolloBoost.gql `
  mutation ExecuteProposal($proposalId: ID!, $perspectiveId: ID!) {
    executeProposal(proposalId: $proposalId, perspectiveId: $perspectiveId) {
      id
      toPerspective {
        id
        head {
          id
          data {
            id
          }
        }
      }
    }
  }
`;
    const GET_PERSPECTIVE_CONTEXTS = (perspectiveId) => {
        return apolloBoost.gql `{
    entity(uref: "${perspectiveId}") {
      id
      ... on Perspective {
        payload {
          context {
            id
            perspectives {
              id
            } 
          }
        }
      }
    }
  }`;
    };

    class EveesHelpers {
        static async getPerspectiveHeadId(client, perspectiveId) {
            if (!perspectiveId)
                throw new Error('PerspectiveId undefined');
            const result = await client.query({
                query: apolloBoost.gql `
        {
          entity(uref: "${perspectiveId}") {
            id
            ... on Perspective {
              head {
                id
              }
            }
          }
        }`
            });
            if (result.data.entity.head === undefined || result.data.entity.head == null)
                return undefined;
            return result.data.entity.head.id;
        }
        static async canWrite(client, perspectiveId) {
            const result = await client.query({
                query: apolloBoost.gql `
        {
          entity(uref: "${perspectiveId}") {
            id
            ... on Perspective {
              canWrite
            }
          }
        }`
            });
            if (result.data.entity.canWrite === undefined || result.data.entity.canWrite == null)
                return false;
            return result.data.entity.canWrite;
        }
        static async getPerspectiveRemoteId(client, perspectiveId) {
            const perspective = await multiplatform.loadEntity(client, perspectiveId);
            if (!perspective)
                throw new Error('perspective not found');
            return perspective.object.payload.remote;
        }
        static async getPerspectiveDataId(client, perspectiveId) {
            const headId = await this.getPerspectiveHeadId(client, perspectiveId);
            if (headId === undefined)
                return undefined;
            return this.getCommitDataId(client, headId);
        }
        static async getPerspectiveData(client, perspectiveId) {
            const headId = await this.getPerspectiveHeadId(client, perspectiveId);
            if (headId === undefined)
                return undefined;
            return this.getCommitData(client, headId);
        }
        static async getCommitData(client, commitId) {
            const dataId = await this.getCommitDataId(client, commitId);
            const data = await multiplatform.loadEntity(client, dataId);
            if (!data)
                throw new Error('data not found');
            /** make sure users of loadEntity wont mess the cache by reference */
            return lodashEs.cloneDeep(data);
        }
        static async getCommitDataId(client, commitId) {
            const commit = await multiplatform.loadEntity(client, commitId);
            if (!commit)
                throw new Error('commit not found');
            return commit.object.payload.dataId;
        }
        static async getData(client, recognizer, uref) {
            const entity = await multiplatform.loadEntity(client, uref);
            if (!entity)
                return undefined;
            let entityType = recognizer.recognizeType(entity);
            switch (entityType) {
                case EveesBindings.PerspectiveType:
                    return this.getPerspectiveData(client, uref);
                case EveesBindings.CommitType:
                    return this.getCommitData(client, uref);
                default:
                    return entity;
            }
        }
        static async getChildren(client, recognizer, uref) {
            const data = await this.getData(client, recognizer, uref);
            const hasChildren = recognizer
                .recognizeBehaviours(data)
                .find(b => b.getChildrenLinks);
            return hasChildren.getChildrenLinks(data);
        }
        static async getDescendantsRec(client, recognizer, uref, current) {
            const newDescendants = [];
            const children = await this.getChildren(client, recognizer, uref);
            for (let ix = 0; ix < children.length; ix++) {
                const child = children[ix];
                const thisDescendants = await this.getDescendantsRec(client, recognizer, child, []);
                newDescendants.push(child);
                newDescendants.push(...thisDescendants);
            }
            return current.concat(newDescendants);
        }
        static async getDescendants(client, recognizer, uref) {
            return this.getDescendantsRec(client, recognizer, uref, []);
        }
        // Creators
        static async createEntity(client, store, object) {
            const create = await client.mutate({
                mutation: CREATE_ENTITY,
                variables: {
                    object: object,
                    casID: store.casID
                }
            });
            return create.data.createEntity.id;
        }
        static async createCommit(client, store, commit) {
            const message = commit.message !== undefined ? commit.message : '';
            const timestamp = commit.timestamp !== undefined ? commit.timestamp : Date.now();
            const creatorsIds = commit.creatorsIds !== undefined ? commit.creatorsIds : [];
            const parentsIds = commit.parentsIds !== undefined ? commit.parentsIds : [];
            const commitData = {
                creatorsIds: creatorsIds,
                dataId: commit.dataId,
                message: message,
                timestamp: timestamp,
                parentsIds: parentsIds
            };
            const commitObject = signObject(commitData);
            const create = await client.mutate({
                mutation: CREATE_ENTITY,
                variables: {
                    object: commitObject,
                    casID: store.casID
                }
            });
            return create.data.createEntity.id;
        }
        static async createPerspective(client, remote, perspective) {
            const createPerspective = await client.mutate({
                mutation: CREATE_PERSPECTIVE,
                variables: {
                    remote: remote.id,
                    casID: remote.store.casID,
                    ...perspective
                }
            });
            return createPerspective.data.createPerspective.id;
        }
        static async updateHead(client, perspectiveId, headId) {
            await client.mutate({
                mutation: UPDATE_HEAD,
                variables: {
                    perspectiveId,
                    headId
                }
            });
            return headId;
        }
        static async isAncestorCommit(client, perspectiveId, commitId, stopAt) {
            const headId = await this.getPerspectiveHeadId(client, perspectiveId);
            if (headId === undefined)
                return false;
            const findAncestor = new FindAncestor(client, commitId, stopAt);
            return findAncestor.checkIfParent(headId);
        }
        static async checkEmit(config, client, eveesRemotes, perspectiveId) {
            if (config.emitIf === undefined)
                return false;
            const remoteId = await EveesHelpers.getPerspectiveRemoteId(client, perspectiveId);
            const toRemote = eveesRemotes.find(r => r.id === remoteId);
            if (!toRemote)
                throw new Error(`remote not found for ${remoteId}`);
            if (remoteId === config.emitIf.remote) {
                const owner = await toRemote.accessControl.getOwner(perspectiveId);
                return owner.toLocaleLowerCase() === config.emitIf.owner.toLocaleLowerCase();
            }
            return false;
        }
        static async snapDefaultPerspective(remote, creatorId, context, timestamp, path, fromPerspectiveId, fromHeadId) {
            creatorId = creatorId ? creatorId : remote.userId ? remote.userId : '';
            timestamp = timestamp ? timestamp : Date.now();
            const defaultContext = await hashObject({
                creatorId,
                timestamp
            });
            context = context || defaultContext;
            const object = {
                creatorId,
                remote: remote.id,
                path: path !== undefined ? path : remote.defaultPath,
                timestamp,
                context
            };
            if (fromPerspectiveId)
                object.fromPerspectiveId = fromPerspectiveId;
            if (fromHeadId)
                object.fromHeadId = fromHeadId;
            const perspective = await deriveSecured(object, remote.store.cidConfig);
            perspective.casID = remote.store.casID;
            return perspective;
        }
        static async getHome(remote, userId) {
            const creatorId = userId === undefined ? 'root' : userId;
            const remoteHome = {
                remote: remote.id,
                path: '',
                creatorId,
                timestamp: 0,
                context: `${creatorId}.home`
            };
            return deriveSecured(remoteHome, remote.store.cidConfig);
        }
    }
    class FindAncestor {
        constructor(client, lookingFor, stopAt) {
            this.client = client;
            this.lookingFor = lookingFor;
            this.stopAt = stopAt;
            this.done = false;
        }
        async checkIfParent(commitId) {
            /* stop searching all paths once one path finds it */
            if (this.done) {
                return false;
            }
            if (this.lookingFor === commitId) {
                this.done = true;
                return true;
            }
            if (this.stopAt !== undefined) {
                if (this.stopAt === commitId) {
                    this.done = true;
                    return false;
                }
            }
            const commit = await multiplatform.loadEntity(this.client, commitId);
            if (!commit)
                throw new Error(`commit ${commitId} not found`);
            if (commit.object.payload.parentsIds.length === 0) {
                return false;
            }
            const seeParents = await Promise.all(commit.object.payload.parentsIds.map(parentId => {
                /* recursively look on parents */
                return this.checkIfParent(parentId);
            }));
            return seeParents.includes(true);
        }
    }

    /**
     * Main service used to interact with _Prtcl compatible objects and providers
     */
    exports.Evees = class Evees {
        constructor(recognizer, eveesRemotes, client, config) {
            this.recognizer = recognizer;
            this.eveesRemotes = eveesRemotes;
            this.client = client;
            this.config = config;
            this.logger = new microOrchestrator.Logger('evees');
        }
        /** Public functions */
        getRemote(remote) {
            if (!remote && this.eveesRemotes.length === 1)
                return this.eveesRemotes[0];
            const remoteInstance = this.eveesRemotes.find(instance => instance.id === remote);
            if (!remoteInstance)
                throw new Error(`Remote ${remote}  is not registered`);
            return remoteInstance;
        }
        /**
         * Returns the uprtcl remote that controls the given perspective, from its remote
         * @returns the uprtcl remote
         */
        getPerspectiveProvider(perspective) {
            return this.getRemote(perspective.payload.remote);
        }
        /**
         * Returns the uprtcl remote that controls the given perspective, from its remote
         * @returns the uprtcl remote
         */
        async getPerspectiveRemoteById(perspectiveId) {
            const result = await this.client.query({
                query: apolloBoost.gql `
        {
          entity(uref: "${perspectiveId}") {
            id
            ... on Perspective {
              payload {
                remote
              }
            }
          }
        }
      `
            });
            // TODO: this throws: cannot read property entity of null
            const remote = result.data.entity.payload.remote;
            return this.getRemote(remote);
        }
        async isPerspective(id) {
            const entity = await multiplatform.loadEntity(this.client, id);
            if (entity === undefined)
                throw new Error('entity not found');
            const type = this.recognizer.recognizeType(entity);
            return type === 'Perspective';
        }
        async isPattern(id, type) {
            const entity = await multiplatform.loadEntity(this.client, id);
            if (entity === undefined)
                throw new Error('entity not found');
            const recognizedType = this.recognizer.recognizeType(entity);
            return type === recognizedType;
        }
        /**
         * receives an entity id and compute the actions that will
         * result on this entity being forked on a target remote
         * with a target owner (canWrite).
         *
         * it also makes sure that all entities are clonned
         * on the target remote default store.
         *
         * recursively fork entity children
         */
        async fork(id, workspace, remote, parentId) {
            const isPerspective = await this.isPattern(id, EveesBindings.PerspectiveType);
            if (isPerspective) {
                return this.forkPerspective(id, workspace, remote, parentId);
            }
            else {
                const isCommit = await this.isPattern(id, EveesBindings.CommitType);
                if (isCommit) {
                    return this.forkCommit(id, workspace, remote, parentId);
                }
                else {
                    return this.forkEntity(id, workspace, remote, parentId);
                }
            }
        }
        getEntityChildren(entity) {
            let hasChildren = this.recognizer
                .recognizeBehaviours(entity)
                .find(prop => !!prop.getChildrenLinks);
            if (!hasChildren) {
                return [];
            }
            else {
                return hasChildren.getChildrenLinks(entity);
            }
        }
        replaceEntityChildren(entity, newLinks) {
            let hasChildren = this.recognizer
                .recognizeBehaviours(entity)
                .find(prop => !!prop.getChildrenLinks);
            if (!hasChildren) {
                throw new Error(`entity dont hasChildren ${JSON.stringify(entity)}`);
            }
            else {
                return hasChildren.replaceChildrenLinks(entity)(newLinks);
            }
        }
        async forkPerspective(perspectiveId, workspace, remote, parentId, name) {
            const eveesRemote = remote !== undefined && remote !== null
                ? this.getRemote(remote)
                : this.config.defaultRemote;
            const refPerspective = await multiplatform.loadEntity(this.client, perspectiveId);
            if (!refPerspective)
                throw new Error(`base perspective ${perspectiveId} not found`);
            const headId = await EveesHelpers.getPerspectiveHeadId(this.client, perspectiveId);
            const perspective = await eveesRemote.snapPerspective(parentId, refPerspective.object.payload.context, undefined, undefined, perspectiveId, headId);
            /* BUG-FIXED: this is needed so that the getOwner of the snapPerspective function has the parent object.
               TODO: How to add the concept of workspaces to the fork process? how to snapPerspectives based on a workspace ? */
            await EveesHelpers.createEntity(this.client, eveesRemote.store, perspective.object);
            let forkCommitId = undefined;
            if (headId !== undefined) {
                forkCommitId = await this.forkCommit(headId, workspace, eveesRemote.id, perspective.id // this perspective is set as the parent of the children's new perspectives
                );
            }
            workspace.newPerspective({
                perspective,
                details: { headId: forkCommitId, name },
                parentId
            });
            return perspective.id;
        }
        async forkCommit(commitId, workspace, remote, parentId) {
            const commit = await multiplatform.loadEntity(this.client, commitId);
            if (!commit)
                throw new Error(`Could not find commit with id ${commitId}`);
            const remoteInstance = this.getRemote(remote);
            const dataId = commit.object.payload.dataId;
            const dataForkId = await this.forkEntity(dataId, workspace, remote, parentId);
            const eveesRemote = this.getRemote(remote);
            /** build new head object pointing to new data */
            const newCommit = {
                creatorsIds: eveesRemote.userId ? [eveesRemote.userId] : [''],
                dataId: dataForkId,
                message: `autocommit to fork ${commitId} on remote ${remote}`,
                forking: commitId,
                parentsIds: [],
                timestamp: Date.now()
            };
            const newHead = await deriveSecured(newCommit, remoteInstance.store.cidConfig);
            newHead.casID = remoteInstance.store.casID;
            workspace.create(newHead);
            return newHead.id;
        }
        async forkEntity(entityId, workspace, remote, parentId) {
            const data = await multiplatform.loadEntity(this.client, entityId);
            if (!data)
                throw new Error(`data ${entityId} not found`);
            /** createOwnerPreservingEntity of children */
            const getLinksForks = this.getEntityChildren(data).map(link => this.fork(link, workspace, remote, parentId));
            const newLinks = await Promise.all(getLinksForks);
            const tempData = this.replaceEntityChildren(data, newLinks);
            const remoteInstance = this.eveesRemotes.find(r => r.id === remote);
            if (!remoteInstance)
                throw new Error(`Could not find registered evees remote for remote with ID ${remote}`);
            const newData = await deriveEntity(tempData.object, remoteInstance.store.cidConfig);
            newData.casID = remoteInstance.store.casID;
            workspace.create(newData);
            return newData.id;
        }
    };
    exports.Evees = __decorate([
        inversify.injectable(),
        __param(0, inversify.inject(cortex.CortexModule.bindings.Recognizer)),
        __param(1, inversify.multiInject(EveesBindings.EveesRemote)),
        __param(2, inversify.inject(graphql.ApolloClientModule.bindings.Client)),
        __param(3, inversify.inject(EveesBindings.Config)),
        __metadata("design:paramtypes", [cortex.PatternRecognizer, Array, apolloBoost.ApolloClient, Object])
    ], exports.Evees);

    const propertyOrder = ['creatorId', 'path', 'remote', 'timestamp'];
    class PerspectivePattern extends cortex.Pattern {
        constructor() {
            super(...arguments);
            this.type = EveesBindings.PerspectiveType;
        }
        recognize(entity) {
            const object = extractSignedEntity(entity);
            return object && propertyOrder.every((p) => object.hasOwnProperty(p));
        }
    }
    exports.PerspectiveLinks = class PerspectiveLinks {
        constructor(client) {
            this.client = client;
            this.links = async (perspective) => {
                const result = await this.client.query({
                    query: apolloBoost.gql `{
        entity(uref: "${perspective.id}") {
          id
          ... on Perspective {
            head {
              id
            }
          }
        }
      }`,
                });
                const headId = result.data.entity.head
                    ? result.data.entity.head.id
                    : undefined;
                return headId ? [headId] : [];
            };
            this.redirect = async (perspective) => {
                const result = await this.client.query({
                    query: apolloBoost.gql `{
        entity(uref: "${perspective.id}") {
          id
          ... on Perspective {
            head {
              id
            }
          }
        }
      }`,
                });
                return result.data.entity.head ? result.data.entity.head.id : undefined;
            };
        }
    };
    exports.PerspectiveLinks = __decorate([
        inversify.injectable(),
        __param(0, inversify.inject(graphql.ApolloClientModule.bindings.Client)),
        __metadata("design:paramtypes", [apolloBoost.ApolloClient])
    ], exports.PerspectiveLinks);

    const propertyOrder$1 = ['creatorsIds', 'timestamp', 'message', 'parentsIds', 'dataId'];
    class CommitPattern extends cortex.Pattern {
        constructor() {
            super(...arguments);
            this.type = EveesBindings.CommitType;
        }
        recognize(entity) {
            const object = extractSignedEntity(entity);
            return object && propertyOrder$1.every((p) => object.hasOwnProperty(p));
        }
    }
    exports.CommitLinked = class CommitLinked {
        constructor() {
            this.links = async (commit) => [commit.object.payload.dataId, ...commit.object.payload.parentsIds];
            this.getChildrenLinks = (commit) => [];
            this.replaceChildrenLinks = (commit, newLinks) => commit;
            this.redirect = async (commit) => commit.object.payload.dataId;
        }
    };
    exports.CommitLinked = __decorate([
        inversify.injectable()
    ], exports.CommitLinked);

    class CommitHistory extends microOrchestrator.moduleConnect(litElement.LitElement) {
        async firstUpdated() {
            this.loadCommitHistory();
        }
        async loadCommitHistory() {
            this.commitHistory = undefined;
            const apolloClient = this.request(graphql.ApolloClientModule.bindings.Client);
            const result = await apolloClient.query({
                query: apolloBoost.gql `
      {
        entity(uref: "${this.commitId}") {
          id
          entity {
            ... on Commit {
              message
              timestamp
              parentCommits {
                id
                entity {
                  ... on Commit {
                    message
                    timestamp
                    parentCommits {
                      id
                      entity {
                        ... on Commit {
                          timestamp
                          message
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
            });
            this.commitHistory = result.data.entity;
        }
        renderCommitHistory(commitHistory) {
            return litElement.html `
      <div class="column">
        ${commitHistory.id} ${commitHistory.entity.message}
        ${commitHistory.entity.timestamp}
        ${commitHistory.entity.parentCommits
            ? litElement.html `
              <div class="row">
                ${commitHistory.entity.parentCommits.map((parent) => this.renderCommitHistory(parent))}
              </div>
            `
            : litElement.html ``}
      </div>
    `;
        }
        render() {
            return litElement.html `
      <div class="row">
        ${this.commitHistory
            ? this.renderCommitHistory(this.commitHistory)
            : litElement.html ``}
        <slot name="plugins"></slot>
      </div>
    `;
        }
        static get styles() {
            return litElement.css `
      .column {
        display: flex;
        flex-direction: column;
      }

      .row {
        display: flex;
        flex-direction: row;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ attribute: 'commit-id' }),
        __metadata("design:type", String)
    ], CommitHistory.prototype, "commitId", void 0);
    __decorate([
        litElement.property({ type: Object, attribute: false }),
        __metadata("design:type", Object)
    ], CommitHistory.prototype, "commitHistory", void 0);

    const eveesTypeDefs = apolloBoost.gql `
  scalar Date

  extend type Mutation {
    updatePerspectiveHead(perspectiveId: ID!, headId: ID, name: String): Perspective!

    createEntity(id: String, object: JSON!, casID: ID): Entity!

    createPerspective(
      remote: String!
      path: String
      creatorId: String
      timestamp: Date
      headId: ID
      context: String
      name: String
      parentId: String
      fromPerspectiveId: String
      fromHeadId: String
    ): Perspective!

    forkPerspective(
      perspectiveId: ID!
      remote: String
      parentId: String
      name: String
    ): Perspective!

    deletePerspective(perspectiveId: ID!): Perspective!

    addProposal(
      toPerspectiveId: ID!
      fromPerspectiveId: ID!
      toHeadId: ID
      fromHeadId: ID
      newPerspectives: [NewPerspectiveInput!]
      updates: [HeadUpdateInput!]
    ): UpdateProposal!

    executeProposal(proposalId: ID!, perspectiveId: ID!): UpdateProposal!
  }

  extend type Query {
    contextPerspectives(context: String!): [Perspective!]
  }

  type Context {
    id: String!
    perspectives: [Perspective!] @discover
  }

  type HeadUpdate {
    fromPerspective: Perspective! @discover
    oldHead: Commit! @discover
    toPerspective: Perspective! @discover
    newHead: Commit! @discover
  }

  # Exact match to UpdateRequest typescript type
  input HeadUpdateInput {
    fromPerspectiveId: String
    oldHeadId: String
    perspectiveId: String
    newHeadId: String
  }

  input ProofInput {
    signature: String
    type: String
  }

  input PerspectivePayloadInput {
    remote: String
    path: String
    timestamp: Float
    creatorId: String
    context: String
    fromPerspectiveId: String
    fromHeadId: String
  }

  input PerspectiveEntityInput {
    proof: ProofInput
    payload: PerspectivePayloadInput
  }

  input PerspectiveInput {
    id: String
    object: PerspectiveEntityInput
    casID: String
  }

  input PerspectiveDetailsInput {
    name: String
    headId: String
  }

  input NewPerspectiveInput {
    perspective: PerspectiveInput
    details: PerspectiveDetailsInput
    parentId: String
  }

  input ProposalInput {
    toPerspectiveId: String!
    fromPerspectiveId: String!
    toHeadId: String!
    fromHeadId: String!
    newPerspectives: [NewPerspectiveInput!]
    updates: [HeadUpdateInput!]
  }

  type NewPerspective {
    perspective: Perspective
    details: PerspectiveDetails
    parentId: String
  }

  type PerspectiveDetails {
    name: String
    headId: String
  }

  type UpdateProposal {
    id: ID!

    creatorId: String
    toPerspective: Perspective! @discover
    fromPerspective: Perspective! @discover
    toHead: Commit! @discover
    fromHead: Commit! @discover
    newPerspectives: [NewPerspective!]
    updates: [HeadUpdate!]
  }

  type Commit implements Entity {
    id: ID!

    parentCommits: [Commit!]! @discover
    timestamp: Date!
    message: String
    data: Entity @discover
    creatorsIds: [ID!]!

    _context: EntityContext!
  }

  type Perspective implements Entity {
    id: ID!

    head: Commit @discover
    name: String
    payload: Payload
    proposals: [String!]
    canWrite: Boolean

    _context: EntityContext!
  }

  type Payload {
    remote: String
    path: String
    creatorId: String
    timestamp: Date
    context: Context
    fromPerspectiveId: String
    fromHeadId: String
  }
`;

    class EveesWorkspace {
        constructor(client, recognizer) {
            this.recognizer = recognizer;
            this.entities = [];
            this.newPerspectives = [];
            this.updates = [];
            this.workspace = this.buildWorkspace(client);
        }
        buildWorkspace(client) {
            const link = new apolloBoost.ApolloLink((operation, forward) => {
                return new Observable__default['default'](observer => {
                    client
                        .query({
                        query: operation.query,
                        variables: operation.variables,
                        context: operation.getContext()
                    })
                        .then(result => {
                        observer.next(result);
                        observer.complete();
                    })
                        .catch(error => {
                        observer.error(error);
                        observer.complete();
                    });
                    return () => { };
                });
            });
            const workspace = new apolloBoost.ApolloClient({
                cache: cloneDeep__default['default'](client.cache),
                typeDefs: client.typeDefs,
                link: link
            });
            return workspace;
        }
        hasUpdates() {
            return this.updates.length > 0;
        }
        async isSingleAuthority(remote) {
            const newNot = this.newPerspectives.find(newPerspective => newPerspective.perspective.object.payload.remote !== remote);
            if (newNot !== undefined)
                return false;
            const check = this.updates.map(async (update) => EveesHelpers.getPerspectiveRemoteId(this.workspace, update.perspectiveId));
            const checktoPerspectives = await Promise.all(check);
            const updateNot = checktoPerspectives.find(_remoteId => _remoteId !== remote);
            if (updateNot !== undefined)
                return false;
            return true;
        }
        getUpdates() {
            return this.updates;
        }
        getEntities() {
            return this.entities;
        }
        getNewPerspectives() {
            return this.newPerspectives;
        }
        create(entity) {
            this.entities.push(entity);
            this.cacheCreateEntity(this.workspace, entity);
        }
        newPerspective(newPerspective) {
            /* perspective entity is stored as an entity too */
            this.create(newPerspective.perspective);
            this.newPerspectives.push(newPerspective);
            this.cacheInitPerspective(this.workspace, newPerspective);
        }
        update(update) {
            this.updates.push(update);
            this.cacheUpdateHead(this.workspace, update);
        }
        cacheCreateEntity(client, entity) {
            if (!this.recognizer)
                throw new Error('recognized not provided');
            const type = this.recognizer.recognizeType(entity);
            client.writeQuery({
                query: apolloBoost.gql `{
        entity(uref: "${entity.id}") {
          __typename
          id
          _context {
            object
            casID
          }
        }
      }`,
                data: {
                    entity: {
                        __typename: type,
                        id: entity.id,
                        _context: {
                            __typename: 'EntityContext',
                            object: entity.object,
                            casID: entity.casID
                        }
                    }
                }
            });
        }
        cacheInitPerspective(client, newPerspective) {
            const perspectiveId = newPerspective.perspective.id;
            const headId = newPerspective.details ? newPerspective.details.headId : undefined;
            const object = newPerspective.perspective.object;
            client.cache.writeQuery({
                query: apolloBoost.gql `{
        entity(uref: "${perspectiveId}") {
          id
          ... on Perspective {
            head {
              id
            }
          }
          _context {
            object
            casID
          }
        }
      }`,
                data: {
                    entity: {
                        __typename: 'Perspective',
                        id: perspectiveId,
                        head: {
                            __typename: 'Commit',
                            id: headId
                        },
                        _context: {
                            __typename: 'EntityContext',
                            object,
                            casID: ''
                        }
                    }
                }
            });
        }
        cacheUpdateHead(client, update) {
            const perspectiveId = update.perspectiveId;
            // TODO: keep track of old head?...
            client.cache.writeQuery({
                query: apolloBoost.gql `{
        entity(uref: "${perspectiveId}") {
          id
          ... on Perspective {
            head {
              id
            }
          }
        }
      }`,
                data: {
                    entity: {
                        __typename: 'Perspective',
                        id: perspectiveId,
                        head: {
                            __typename: 'Commit',
                            id: update.newHeadId
                        }
                    }
                }
            });
        }
        /** takes the Evees actions and replicates them in another client  */
        async execute(client) {
            await this.executeCreate(client);
            await this.executeInit(client);
            return this.executeUpdate(client);
        }
        async executeCreate(client) {
            const create = this.entities.map(async (entity) => {
                const mutation = await client.mutate({
                    mutation: CREATE_ENTITY,
                    variables: {
                        id: entity.id,
                        object: entity.object,
                        casID: entity.casID
                    }
                });
                const dataId = mutation.data.createEntity.id;
                if (dataId !== entity.id) {
                    throw new Error(`created entity id ${dataId} not as expected ${entity.id}`);
                }
            });
            return Promise.all(create);
        }
        /* Takes the new perspectives and sets their head in the cache
           before the perspective is actually created */
        precacheInit(client) { }
        async executeInit(client) {
            const createPerspective = async (newPerspective) => {
                const result = await client.mutate({
                    mutation: CREATE_PERSPECTIVE,
                    variables: {
                        ...newPerspective.perspective.object.payload,
                        ...newPerspective.details,
                        remote: newPerspective.perspective.object.payload.remote,
                        path: newPerspective.perspective.object.payload.path,
                        parentId: newPerspective.parentId
                    }
                });
                if (result.data.createPerspective.id !== newPerspective.perspective.id) {
                    throw new Error(`created perspective id ${result.data.createPerspective.id} not as expected ${newPerspective.perspective.id}`);
                }
            };
            /** must run backwards and sequentially since new perspectives
             *  permissions depend on previous ones */
            await this.newPerspectives
                .reverse()
                .reduce((promise, action) => promise.then(_ => createPerspective(action)), Promise.resolve());
        }
        /** copies the new perspective data (head) in the workspace into the
         *  cache of an apollo client */
        async precacheNewPerspectives(client) {
            this.newPerspectives.reverse().map(newPerspective => {
                this.cacheInitPerspective(client, newPerspective);
            });
        }
        async executeUpdate(client) {
            const update = this.getUpdates().map(async (update) => {
                return client.mutate({
                    mutation: UPDATE_HEAD,
                    variables: {
                        perspectiveId: update.perspectiveId,
                        headId: update.newHeadId
                    }
                });
            });
            return Promise.all(update);
        }
    }

    const getContextPerspectives = async (context, container) => {
        if (context === undefined)
            return [];
        const eveesRemotes = container.getAll(EveesBindings.EveesRemote);
        const knownSources = container.get(multiplatform.DiscoveryModule.bindings.LocalKnownSources);
        const promises = eveesRemotes.map(async (remote) => {
            const thisPerspectivesIds = await remote.getContextPerspectives(context);
            thisPerspectivesIds.forEach(pId => {
                knownSources.addKnownSources(pId, [remote.store.casID], EveesBindings.PerspectiveType);
            });
            return thisPerspectivesIds;
        });
        const perspectivesIdsPerRemote = await Promise.all(promises);
        const perspectivesIds = [].concat(...perspectivesIdsPerRemote);
        // remove duplicates
        const map = new Map();
        perspectivesIds.forEach(id => map.set(id, null));
        return Array.from(map, key => key[0]);
    };
    const eveesResolvers = {
        Commit: {
            message(parent) {
                return parent.payload.message;
            },
            timestamp(parent) {
                return parent.payload.timestamp;
            },
            parentCommits(parent) {
                return parent.payload.parentsIds;
            },
            data(parent) {
                return parent.payload.dataId;
            },
            creatorsIds(parent) {
                return parent.payload.creatorsIds;
            }
        },
        Context: {
            id(parent) {
                return typeof parent === 'string' ? parent : parent.id;
            },
            async perspectives(parent, _, { container }) {
                const context = typeof parent === 'string' ? parent : parent.id;
                return getContextPerspectives(context, container);
            }
        },
        UpdateProposal: {
            toPerspective(parent) {
                return parent.toPerspectiveId;
            },
            fromPerspective(parent) {
                return parent.fromPerspectiveId;
            },
            toHead(parent) {
                return parent.toPerspectiveId;
            },
            fromHead(parent) {
                return parent.fromPerspectiveId;
            }
        },
        HeadUpdate: {
            toPerspective(parent) {
                return parent.perspectiveId;
            },
            fromPerspective(parent) {
                return parent.fromPerspectiveId;
            },
            newHead(parent) {
                return parent.newHeadId;
            },
            oldHead(parent) {
                return parent.oldHeadId;
            }
        },
        Perspective: {
            async head(parent, _, { container }) {
                const evees = container.get(EveesBindings.Evees);
                const remote = evees.getPerspectiveProvider(parent);
                const details = await remote.getPerspective(parent.id);
                return details && details.headId;
            },
            async name(parent, _, { container }) {
                const evees = container.get(EveesBindings.Evees);
                const remote = evees.getPerspectiveProvider(parent);
                const details = await remote.getPerspective(parent.id);
                return details && details.name;
            },
            async proposals(parent, _, { container }) {
                const evees = container.get(EveesBindings.Evees);
                const remote = evees.getPerspectiveProvider(parent);
                if (!remote.proposals)
                    return [];
                return remote.proposals.getProposalsToPerspective(parent.id);
            },
            async payload(parent, _, { container }) {
                return {
                    remote: parent.payload.remote,
                    path: parent.payload.path,
                    creatorId: parent.payload.creatorId,
                    timestamp: parent.payload.timestamp,
                    context: {
                        id: parent.payload.context
                    }
                };
            },
            async canWrite(parent, _, { container }) {
                const evees = container.get(EveesBindings.Evees);
                const remote = evees.getPerspectiveProvider(parent);
                return remote.canWrite(parent.id);
            }
        },
        Mutation: {
            async updatePerspectiveHead(parent, { perspectiveId, headId, name }, { container }) {
                const evees = container.get(EveesBindings.Evees);
                const multiSource = container.get(multiplatform.DiscoveryModule.bindings.MultiSourceService);
                const client = container.get(graphql.ApolloClientModule.bindings.Client);
                const provider = await evees.getPerspectiveRemoteById(perspectiveId);
                await provider.updatePerspective(perspectiveId, {
                    headId,
                    name
                });
                /** needed to return the current values in case one of the inputs is undefined */
                const detailsRead = await provider.getPerspective(perspectiveId);
                if (provider.knownSources) {
                    await multiSource.postEntityUpdate(provider, [headId]);
                }
                const result = await client.query({
                    query: apolloBoost.gql `{
          entity(uref: "${perspectiveId}") {
            id
            _context {
              object
            }
          }
        }`
                });
                const perspective = result.data.entity._context.object;
                if (!perspective)
                    throw new Error(`Perspective with id ${perspectiveId} not found`);
                return {
                    id: perspectiveId,
                    ...perspective,
                    head: {
                        id: detailsRead.headId
                    },
                    name: detailsRead.name
                };
            },
            async deletePerspective(parent, { perspectiveId }, { container, cache }) {
                const evees = container.get(EveesBindings.Evees);
                const remote = await evees.getPerspectiveRemoteById(perspectiveId);
                await remote.deletePerspective(perspectiveId);
                /** we need to remove the perspective from the cache.
                 * this code is based on
                 * https://www.apollographql.com/docs/tutorial/local-state/ */
                const queryResult = cache.readQuery({
                    query: GET_PERSPECTIVE_CONTEXTS(perspectiveId)
                });
                const entity = { ...queryResult.entity };
                /** remove this perspective from the perspectives array */
                entity.payload.context.perspectives = [
                    ...entity.payload.context.perspectives.filter(persp => persp.id !== perspectiveId)
                ];
                /** overwrite cache */
                cache.writeQuery({
                    query: GET_PERSPECTIVE_CONTEXTS(perspectiveId),
                    data: entity
                });
                return { id: perspectiveId };
            },
            async createEntity(_, { id, object, casID }, { container }) {
                const stores = container.getAll(multiplatform.CASModule.bindings.CASStore);
                const store = stores.find(d => d.casID === casID);
                if (!store)
                    throw new Error(`No store registered for casID ${casID}`);
                const newId = await store.create(object, id);
                const entity = {
                    id: newId,
                    object,
                    casID
                };
                if (id !== undefined) {
                    if (id !== newId) {
                        throw new Error(`Unexpected id ${newId} for object ${JSON.stringify(object)}, expected ${id}`);
                    }
                }
                const entityCache = container.get(multiplatform.DiscoveryModule.bindings.EntityCache);
                entityCache.cacheEntity(entity);
                return {
                    id: newId,
                    ...object
                };
            },
            async createPerspective(_, { remote, path, creatorId, timestamp, headId, context, name, parentId, fromPerspectiveId, fromHeadId }, { container }) {
                const remotes = container.getAll(EveesBindings.EveesRemote);
                const remoteInstance = remotes.find(instance => instance.id === remote);
                const perspective = await EveesHelpers.snapDefaultPerspective(remoteInstance, creatorId, context, timestamp, path, fromPerspectiveId, fromHeadId);
                const entityCache = container.get(multiplatform.DiscoveryModule.bindings.EntityCache);
                entityCache.cacheEntity({
                    ...perspective,
                    casID: remoteInstance.store.casID
                });
                const newPerspectiveData = {
                    perspective,
                    details: { headId, name },
                    parentId
                };
                await remoteInstance.createPerspective(newPerspectiveData);
                return {
                    id: perspective.id,
                    name: name,
                    head: headId,
                    payload: perspective.object.payload
                };
            },
            async forkPerspective(_, { perspectiveId, remote, parentId, name }, { container }) {
                const evees = container.get(EveesBindings.Evees);
                const client = container.get(graphql.ApolloClientModule.bindings.Client);
                const recognizer = container.get(cortex.CortexModule.bindings.Recognizer);
                const workspace = new EveesWorkspace(client, recognizer);
                const newPerspectiveId = await evees.forkPerspective(perspectiveId, workspace, remote);
                await workspace.execute(client);
                const headId = await EveesHelpers.getPerspectiveHeadId(client, newPerspectiveId);
                const perspective = await multiplatform.loadEntity(client, newPerspectiveId);
                if (!perspective)
                    throw new Error('perspective not found');
                return {
                    id: newPerspectiveId,
                    name: name,
                    head: headId,
                    payload: {
                        remote: perspective.object.payload.remote,
                        path: perspective.object.payload.path,
                        creatorId: perspective.object.payload.creatorId,
                        timestamp: perspective.object.payload.timestamp,
                        context: {
                            id: perspective.object.payload.context,
                            perspectives: {
                                newPerspectiveId
                            }
                        }
                    }
                };
            },
            async addProposal(_, { toPerspectiveId, fromPerspectiveId, toHeadId, fromHeadId, newPerspectives, updates }, { container }) {
                const evees = container.get(EveesBindings.Evees);
                const remote = await evees.getPerspectiveRemoteById(toPerspectiveId);
                if (!remote.proposals)
                    throw new Error('remote cant handle proposals');
                const proposal = {
                    fromPerspectiveId,
                    toPerspectiveId,
                    fromHeadId,
                    toHeadId,
                    details: {
                        updates: updates,
                        newPerspectives: newPerspectives
                    }
                };
                const proposalId = await remote.proposals.createProposal(proposal);
                return {
                    id: proposalId,
                    toPerspectiveId,
                    fromPerspectiveId,
                    updates: updates,
                    canExecute: false,
                    executed: false
                };
            }
        },
        Query: {
            async contextPerspectives(parent, { context }, { container }) {
                return getContextPerspectives(context, container);
            }
        }
    };

    const prettyAddress = (address) => {
        return litElement.html ` <span
    style="font-family: Lucida Console, Monaco, monospace; background-color: #d0d8db; padding: 3px 6px; font-size: 14px; border-radius: 3px; margin-right: 6px;"
  >
    ${address.substr(0, 4)}...${address.substr(address.length - 3, address.length)}
  </span>`;
    };
    const DEFAULT_COLOR = '#d0dae0';
    const eveeColor = (perspectiveId) => {
        return randomcolor.randomColor({ seed: perspectiveId });
    };

    class EveesPerspectivesList extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-PERSPECTIVES-LIST');
            this.hidePerspectives = [];
            this.canPropose = false;
            this.loadingPerspectives = true;
            this.otherPerspectivesData = [];
            this.canWrite = false;
            this.perspectivesData = [];
        }
        async firstUpdated() {
            if (!this.isConnected)
                return;
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            this.remotes = this.requestAll(EveesBindings.EveesRemote);
            this.load();
        }
        async load() {
            this.loadingPerspectives = true;
            const result = await this.client.query({
                query: apolloBoost.gql `{
        entity(uref: "${this.perspectiveId}") {
          id
          ... on Perspective {
            payload {
              remote
              context {
                id
                perspectives {
                  id
                  name
                  payload {
                    creatorId
                    timestamp
                    remote
                  }
                } 
              }
            }
          }
        }
      }`
            });
            /** data on other perspectives (proposals are injected on them) */
            const perspectivesData = result.data.entity.payload.context === null
                ? []
                : await Promise.all(result.data.entity.payload.context.perspectives.map(async (perspective) => {
                    /** data on this perspective */
                    const remote = this.remotes.find(r => r.id === perspective.payload.remote);
                    if (!remote)
                        throw new Error(`remote not found for ${perspective.payload.remote}`);
                    this.canWrite = await EveesHelpers.canWrite(this.client, this.perspectiveId);
                    return {
                        id: perspective.id,
                        name: perspective.name,
                        creatorId: perspective.payload.creatorId,
                        timestamp: perspective.payload.timestamp,
                        remote: perspective.payload.remote
                    };
                }));
            // remove duplicates
            const map = new Map();
            perspectivesData.forEach(perspectiveData => map.set(perspectiveData.id, perspectiveData));
            this.perspectivesData = Array.from(map, key => key[1]);
            this.otherPerspectivesData = this.perspectivesData.filter(perspectiveData => !this.hidePerspectives.includes(perspectiveData.id));
            this.loadingPerspectives = false;
            this.logger.info('getOtherPersepectives() - post', {
                persperspectivesData: this.perspectivesData
            });
        }
        perspectiveClicked(id) {
            this.dispatchEvent(new CustomEvent('perspective-selected', {
                bubbles: true,
                composed: true,
                detail: {
                    id
                }
            }));
        }
        perspectiveColor(creatorId) {
            return eveeColor(creatorId);
        }
        perspectiveButtonClicked(event, perspectiveData) {
            event.stopPropagation();
            this.dispatchEvent(new CustomEvent('merge-perspective', {
                bubbles: true,
                composed: true,
                detail: {
                    perspectiveId: perspectiveData.id
                }
            }));
        }
        renderLoading() {
            return litElement.html `
      <div class="loading-container">
        <uprtcl-loading></uprtcl-loading>
      </div>
    `;
        }
        renderPerspectiveRow(perspectiveData) {
            return litElement.html `
      <uprtcl-list-item
        style=${`--selected-border-color: ${this.perspectiveColor(perspectiveData.creatorId)}`}
        hasMeta
        ?selected=${this.perspectiveId === perspectiveData.id}
        @click=${() => this.perspectiveClicked(perspectiveData.id)}
      >
        <evees-author
          show-name
          color=${this.perspectiveColor(perspectiveData.creatorId)}
          user-id=${perspectiveData.creatorId}
        ></evees-author>
      </uprtcl-list-item>
    `;
        }
        render() {
            return this.loadingPerspectives
                ? this.renderLoading()
                : this.otherPerspectivesData.length > 0
                    ? litElement.html `
          <uprtcl-list activatable>
            ${this.otherPerspectivesData.map(perspectiveData => this.renderPerspectiveRow(perspectiveData))}
          </uprtcl-list>
        `
                    : litElement.html `
          <uprtcl-list-item>
            <i>No other perspectives found</i>
          </uprtcl-list-item>
        `;
        }
        static get styles() {
            return litElement.css `
      :host {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }

      .loading-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      uprtcl-list-item {
        user-select: none;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'perspective-id' }),
        __metadata("design:type", String)
    ], EveesPerspectivesList.prototype, "perspectiveId", void 0);
    __decorate([
        litElement.property({ type: Array }),
        __metadata("design:type", Array)
    ], EveesPerspectivesList.prototype, "hidePerspectives", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'can-propose' }),
        __metadata("design:type", Boolean)
    ], EveesPerspectivesList.prototype, "canPropose", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesPerspectivesList.prototype, "loadingPerspectives", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Array)
    ], EveesPerspectivesList.prototype, "otherPerspectivesData", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesPerspectivesList.prototype, "canWrite", void 0);

    class EveesInfoPopper extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-INFO-POPPER');
            this.officialOwner = undefined;
            this.checkOwner = false;
            this.showDraft = false;
            this.showProposals = false;
            this.showAcl = false;
            this.showInfo = false;
            this.showIcon = false;
            this.showDebug = false;
            this.emitProposals = false;
            this.dropdownShown = false;
        }
        async firstUpdated() {
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            await this.load();
        }
        async load() {
            const current = await multiplatform.loadEntity(this.client, this.uref);
            if (!current)
                throw new Error(`cant find current perspective ${this.uref}`);
            this.creatorId = current.object.payload.creatorId;
        }
        color() {
            return this.officialId && this.uref === this.officialId
                ? DEFAULT_COLOR
                : this.uref === this.firstRef
                    ? this.eveeColor
                    : eveeColor(this.creatorId);
        }
        updated(changedProperties) {
            if (changedProperties.has('uref')) {
                this.load();
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener('checkout-perspective', ((event) => {
                this.infoPopper.showDropdown = false;
                this.requestUpdate();
            }));
        }
        officialIdReceived(perspectiveId) {
            this.officialId = perspectiveId;
        }
        handleDragStart(e) {
            const dragged = { uref: this.uref, parentId: this.parentId };
            this.logger.info('dragging', dragged);
            e.dataTransfer.setData('text/plain', JSON.stringify(dragged));
        }
        render() {
            return litElement.html `
      <uprtcl-popper
        id="info-popper"
        position="right"
        @drop-down-changed=${e => (this.dropdownShown = e.detail.shown)}
      >
        <div draggable="false" @dragstart=${this.handleDragStart} slot="icon" class="evee-stripe">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill=${this.color()}
            width="18px"
            height="18px"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </div>
        ${this.dropdownShown
            ? litElement.html `
              <div class="evees-info">
                <evees-info-user-based
                  ?show-draft=${this.showDraft}
                  ?show-proposals=${this.showProposals}
                  ?show-info=${this.showInfo}
                  ?show-icon=${this.showIcon}
                  ?show-debug=${this.showDebug}
                  ?emit-proposals=${this.showInfo}
                  uref=${this.uref}
                  parent-id=${this.parentId}
                  first-uref=${this.firstRef}
                  official-owner=${this.officialOwner}
                  ?check-owner=${this.checkOwner}
                  @official-id=${e => this.officialIdReceived(e.detail.perspectiveId)}
                ></evees-info-user-based>
              </div>
            `
            : ``}
      </uprtcl-popper>
    `;
        }
        static get styles() {
            return [
                litElement.css `
        :host {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        uprtcl-popper {
          flex-grow: 1;
        }
        .evees-info {
          padding: 10px;
          display: block;
        }
        .evee-stripe {
          cursor: pointer;
          padding: 5px 6px 0px;
          height: 100%;
          border-radius: 15px;
          user-select: none;
          transition: background-color 100ms linear;
        }
        .evee-stripe:hover {
          background-color: #eef1f1;
        }
      `
            ];
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'uref' }),
        __metadata("design:type", String)
    ], EveesInfoPopper.prototype, "uref", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'first-uref' }),
        __metadata("design:type", String)
    ], EveesInfoPopper.prototype, "firstRef", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'parent-id' }),
        __metadata("design:type", String)
    ], EveesInfoPopper.prototype, "parentId", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'official-owner' }),
        __metadata("design:type", Object)
    ], EveesInfoPopper.prototype, "officialOwner", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'check-owner' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "checkOwner", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'evee-color' }),
        __metadata("design:type", String)
    ], EveesInfoPopper.prototype, "eveeColor", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-draft' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "showDraft", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-proposals' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "showProposals", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-acl' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "showAcl", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-info' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "showInfo", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-icon' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "showIcon", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-debug' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "showDebug", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'emit-proposals' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "emitProposals", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", String)
    ], EveesInfoPopper.prototype, "officialId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", String)
    ], EveesInfoPopper.prototype, "creatorId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoPopper.prototype, "dropdownShown", void 0);
    __decorate([
        litElement.query('#info-popper'),
        __metadata("design:type", commonUi.UprtclPopper)
    ], EveesInfoPopper.prototype, "infoPopper", void 0);

    var merge = "Merge";
    var permissions = "Permissions";
    var information = "Info";
    var en = {
    	"commit-history": "Version history",
    	"new-perspective": "New perspective",
    	merge: merge,
    	permissions: permissions,
    	information: information,
    	"other-perspectives": "Perspectives"
    };

    const getAuthority = (perspective) => {
        return `${perspective.remote}:${perspective.path}`;
    };
    const PROPOSAL_CREATED_TAG = 'evees-proposal';
    class ProposalCreatedEvent extends CustomEvent {
        constructor(eventInitDict) {
            super(PROPOSAL_CREATED_TAG, eventInitDict);
        }
    }

    class EveesDiff extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-DIFF');
            this.summary = false;
            this.loading = true;
            this.updatesDetails = {};
        }
        async firstUpdated() {
            this.logger.log('firstUpdated()');
            this.recognizer = this.request(cortex.CortexModule.bindings.Recognizer);
            this.loadUpdates();
        }
        async updated(changedProperties) {
            this.logger.log('updated()', changedProperties);
            if (changedProperties.has('workspace')) {
                this.loadUpdates();
            }
            if (changedProperties.has('rootPerspective')) {
                this.loadUpdates();
            }
        }
        async loadUpdates() {
            if (!this.workspace)
                return;
            this.loading = true;
            const getDetails = this.workspace.getUpdates().map(async (update) => {
                const newData = await EveesHelpers.getCommitData(this.workspace.workspace, update.newHeadId);
                const oldData = update.oldHeadId !== undefined
                    ? await EveesHelpers.getCommitData(this.workspace.workspace, update.oldHeadId)
                    : undefined;
                const hasDiffLenses = this.recognizer
                    .recognizeBehaviours(newData)
                    .find(b => b.diffLenses);
                if (!hasDiffLenses)
                    throw Error('hasDiffLenses undefined');
                this.updatesDetails[update.perspectiveId] = {
                    diffLense: hasDiffLenses.diffLenses()[0],
                    update,
                    oldData,
                    newData
                };
            });
            await Promise.all(getDetails);
            /** if a new perspective with the root id is found,
             *  shown as an update from undefined head */
            if (this.rootPerspective) {
                const newRoot = this.workspace
                    .getNewPerspectives()
                    .find(newPerspective => newPerspective.perspective.id === this.rootPerspective);
                if (newRoot) {
                    if (newRoot.details.headId) {
                        const newData = await EveesHelpers.getCommitData(this.workspace.workspace, newRoot.details.headId);
                        const hasDiffLenses = this.recognizer
                            .recognizeBehaviours(newData)
                            .find(b => b.diffLenses);
                        if (!hasDiffLenses)
                            throw Error('hasDiffLenses undefined');
                        this.updatesDetails[this.rootPerspective] = {
                            diffLense: hasDiffLenses.diffLenses()[0],
                            update: undefined,
                            oldData: undefined,
                            newData
                        };
                    }
                }
            }
            this.loading = false;
        }
        renderUpdateDiff(details) {
            // TODO: review if old data needs to be
            return litElement.html `
      <div class="evee-diff">
        ${details.diffLense.render(this.workspace, details.newData, details.oldData, this.summary)}
      </div>
    `;
        }
        render() {
            if (this.loading) {
                return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
            }
            const perspectiveIds = Object.keys(this.updatesDetails);
            return perspectiveIds.length === 0
                ? litElement.html `
          <span><i>no changes found</i></span>
        `
                : perspectiveIds.map(perspectiveId => this.renderUpdateDiff(this.updatesDetails[perspectiveId]));
        }
        static get styles() {
            return litElement.css `
      :host {
        display: block;
        text-align: center;
      }
      .evee-diff {
        overflow: auto;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'root-perspective' }),
        __metadata("design:type", String)
    ], EveesDiff.prototype, "rootPerspective", void 0);
    __decorate([
        litElement.property({ type: Boolean }),
        __metadata("design:type", Boolean)
    ], EveesDiff.prototype, "summary", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", EveesWorkspace)
    ], EveesDiff.prototype, "workspace", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesDiff.prototype, "loading", void 0);

    const UPDATE_CONTENT_TAG = 'update-content';
    const SPLICE_CHILDREN_TAG = 'splice-children';
    const CONTENT_UPDATED_TAG = 'content-updated';
    class UpdateContentEvent extends CustomEvent {
        constructor(init) {
            super(UPDATE_CONTENT_TAG, init);
        }
    }
    class SpliceChildrenEvent extends CustomEvent {
        constructor(init) {
            super(SPLICE_CHILDREN_TAG, init);
        }
    }
    class ContentUpdatedEvent extends CustomEvent {
        constructor(init) {
            super(CONTENT_UPDATED_TAG, init);
        }
    }

    class EveesInfoBase extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-INFO');
            this.defaultRemoteId = undefined;
            this.officialRemoteId = undefined;
            this.emitProposals = false;
            this.entityType = undefined;
            this.loading = false;
            this.isLogged = false;
            this.forceUpdate = 'true';
            this.showUpdatesDialog = false;
            this.loggingIn = false;
            this.creatingNewPerspective = false;
            this.proposingUpdate = false;
            this.makingPublic = false;
            this.merging = false;
            this.pullWorkspace = undefined;
            /** official remote is used to indentity the special perspective, "the master branch" */
            this.officialRemote = undefined;
            /** default remote is used to create new branches */
            this.defaultRemote = undefined;
        }
        async firstUpdated() {
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            this.config = this.request(EveesBindings.Config);
            this.merge = this.request(EveesBindings.MergeStrategy);
            this.evees = this.request(EveesBindings.Evees);
            this.recognizer = this.request(cortex.CortexModule.bindings.Recognizer);
            this.cache = this.request(multiplatform.DiscoveryModule.bindings.EntityCache);
            this.remotes = this.requestAll(EveesBindings.EveesRemote);
            this.defaultRemote =
                this.defaultRemoteId !== undefined
                    ? this.remotes.find(remote => remote.id === this.defaultRemoteId)
                    : this.request(EveesBindings.Config).defaultRemote;
            this.officialRemote =
                this.officialRemoteId !== undefined
                    ? this.remotes.find(remote => remote.id === this.officialRemoteId)
                    : this.request(EveesBindings.Config).officialRemote;
        }
        updated(changedProperties) {
            if (changedProperties.get('uref') !== undefined) {
                this.logger.info('updated() reload', { changedProperties });
                this.load();
            }
        }
        /** must be called from subclass as super.load() */
        async load() {
            this.logger.info('Loading evee perspective', this.uref);
            this.remote = await this.evees.getPerspectiveRemoteById(this.uref);
            const entity = await multiplatform.loadEntity(this.client, this.uref);
            if (!entity)
                throw Error(`Entity not found ${this.uref}`);
            this.entityType = this.recognizer.recognizeType(entity);
            this.loading = true;
            if (this.entityType === EveesBindings.PerspectiveType) {
                const headId = await EveesHelpers.getPerspectiveHeadId(this.client, this.uref);
                const head = headId !== undefined ? await multiplatform.loadEntity(this.client, headId) : undefined;
                const data = await EveesHelpers.getPerspectiveData(this.client, this.uref);
                const canWrite = await EveesHelpers.canWrite(this.client, this.uref);
                this.perspectiveData = {
                    id: this.uref,
                    details: {
                        headId: headId
                    },
                    perspective: entity.object.payload,
                    canWrite: canWrite,
                    head,
                    data
                };
                this.logger.info('load', { perspectiveData: this.perspectiveData });
            }
            if (this.entityType === EveesBindings.CommitType) {
                const head = await multiplatform.loadEntity(this.client, this.uref);
                const data = await EveesHelpers.getCommitData(this.client, this.uref);
                this.perspectiveData = {
                    head,
                    data
                };
            }
            this.isLogged = await this.remote.isLogged();
            if (this.defaultRemote)
                await this.defaultRemote.ready();
            this.isLoggedOnDefault =
                this.defaultRemote !== undefined ? await this.defaultRemote.isLogged() : false;
            this.loading = false;
            this.logger.log(`evee ${this.uref} loaded`, {
                perspectiveData: this.perspectiveData,
                isLogged: this.isLogged,
                isLoggedOnDefault: this.isLoggedOnDefault
            });
        }
        async checkPull(fromUref) {
            if (this.entityType !== EveesBindings.PerspectiveType) {
                this.pullWorkspace = undefined;
                return;
            }
            if (this.uref === fromUref || !this.perspectiveData.canWrite) {
                this.pullWorkspace = undefined;
                return;
            }
            if (this.perspectiveData.perspective === undefined)
                throw new Error('undefined');
            const config = {
                forceOwner: true,
                remote: this.perspectiveData.perspective.remote,
                path: this.perspectiveData.perspective.path,
                canWrite: this.remote.userId,
                parentId: this.uref
            };
            this.pullWorkspace = new EveesWorkspace(this.client, this.recognizer);
            await this.merge.mergePerspectivesExternal(this.uref, fromUref, this.pullWorkspace, config);
            this.logger.info('checkPull()', this.pullWorkspace);
        }
        async getContextPerspectives(perspectiveId) {
            perspectiveId = perspectiveId || this.uref;
            const result = await this.client.query({
                query: apolloBoost.gql `{
          entity(uref: "${perspectiveId}") {
            id
            ... on Perspective {
              payload {
                remote
                context {
                  id
                  perspectives {
                    id
                  } 
                }
              }
            }
          }
        }`
            });
            /** data on other perspectives (proposals are injected on them) */
            const perspectives = result.data.entity.payload.context === null
                ? []
                : result.data.entity.payload.context.perspectives;
            // remove duplicates
            const map = new Map();
            perspectives.forEach(perspective => map.set(perspective.id, null));
            return Array.from(map, key => key[0]);
        }
        connectedCallback() {
            super.connectedCallback();
            this.addEventListener('permissions-updated', ((e) => {
                this.logger.info('CATCHED EVENT: permissions-updated ', {
                    perspectiveId: this.uref,
                    e
                });
                e.stopPropagation();
                this.load();
            }));
        }
        async login() {
            if (this.defaultRemote === undefined)
                throw new Error('default remote undefined');
            this.loggingIn = true;
            await this.defaultRemote.login();
            await this.client.resetStore();
            this.load();
            this.loggingIn = false;
        }
        async logout() {
            if (this.defaultRemote === undefined)
                throw new Error('default remote undefined');
            await this.defaultRemote.logout();
            await this.client.resetStore();
            this.load();
        }
        async otherPerspectiveMerge(fromPerspectiveId, toPerspectiveId) {
            this.merging = true;
            this.logger.info(`merge ${fromPerspectiveId} on ${toPerspectiveId}`);
            const workspace = new EveesWorkspace(this.client, this.recognizer);
            const toRemoteId = await EveesHelpers.getPerspectiveRemoteId(this.client, toPerspectiveId);
            const config = {
                forceOwner: true,
                remote: toRemoteId,
                parentId: toPerspectiveId
            };
            const toHeadId = await EveesHelpers.getPerspectiveHeadId(this.client, toPerspectiveId);
            const fromHeadId = await EveesHelpers.getPerspectiveHeadId(this.client, fromPerspectiveId);
            await this.merge.mergePerspectivesExternal(toPerspectiveId, fromPerspectiveId, workspace, config);
            const canWrite = await EveesHelpers.canWrite(this.client, toPerspectiveId);
            const toRemote = this.remotes.find(r => r.id === toRemoteId);
            const canPropose = toRemote
                ? toRemote.proposals
                    ? await toRemote.proposals.canPropose(this.remote.userId)
                    : false
                : false;
            const options = {
                apply: {
                    text: canWrite ? 'merge' : 'propose',
                    icon: 'done',
                    disabled: !canWrite && !canPropose,
                    skinny: false
                },
                close: {
                    text: 'close',
                    icon: 'clear',
                    skinny: true
                }
            };
            const result = await this.updatesDialog(workspace, options, this.renderFromToPerspective(toPerspectiveId, fromPerspectiveId));
            if (result !== 'apply') {
                this.merging = false;
                return;
            }
            /* for some remotes the proposal is not created but sent to a parent component who will
               take care of executing it */
            const emitBecauseOfTarget = await EveesHelpers.checkEmit(this.config, this.client, this.remotes, toPerspectiveId);
            if (!canWrite && (emitBecauseOfTarget || this.emitProposals)) {
                /* entities are just cloned, not part of the proposal */
                await workspace.executeCreate(this.client);
                await workspace.precacheNewPerspectives(this.client);
                this.dispatchEvent(new ProposalCreatedEvent({
                    detail: {
                        remote: await EveesHelpers.getPerspectiveRemoteId(this.client, toPerspectiveId),
                        proposalDetails: {
                            newPerspectives: workspace.getNewPerspectives(),
                            updates: workspace.getUpdates()
                        }
                    },
                    bubbles: true,
                    composed: true
                }));
                this.merging = false;
                return;
            }
            /* if the merge execution is not delegated, it is done here. A proposal is created
               on the toPerspective remote, or the changes are directly applied.
               Note that it is assumed that if a user canWrite on toPerspectiveId, he can write
               on all the perspectives inside the workspace.updates array. */
            if (canWrite) {
                await workspace.execute(this.client);
                /* inform the world */
                workspace.getUpdates().map(update => {
                    this.dispatchEvent(new ContentUpdatedEvent({
                        detail: { uref: update.perspectiveId },
                        bubbles: true,
                        composed: true
                    }));
                });
            }
            else {
                /** create commits and data */
                await workspace.executeCreate(this.client);
                await workspace.precacheNewPerspectives(this.client);
                if (fromHeadId === undefined)
                    throw new Error(`undefined head for ${fromPerspectiveId}`);
                await this.createMergeProposal(fromPerspectiveId, toPerspectiveId, fromHeadId, toHeadId, workspace);
            }
            if (this.uref !== toPerspectiveId) {
                this.checkoutPerspective(toPerspectiveId);
            }
            this.merging = false;
        }
        async createMergeProposal(fromPerspectiveId, toPerspectiveId, fromHeadId, toHeadId, workspace) {
            // TODO: handle proposals and updates on multiple authorities.
            const toRemoteId = await EveesHelpers.getPerspectiveRemoteId(this.client, toPerspectiveId);
            const not = await workspace.isSingleAuthority(toRemoteId);
            if (!not)
                throw new Error('cant create merge proposals on multiple authorities yet');
            const result = await this.client.mutate({
                mutation: CREATE_PROPOSAL,
                variables: {
                    toPerspectiveId,
                    fromPerspectiveId,
                    toHeadId,
                    fromHeadId,
                    newPerspectives: workspace.getNewPerspectives(),
                    updates: workspace.getUpdates()
                }
            });
            const proposalId = result.data.addProposal.id;
            this.logger.info('created proposal', { proposalId });
        }
        async deletePerspective(perspectiveId) {
            const result = await this.client.mutate({
                mutation: DELETE_PERSPECTIVE,
                variables: {
                    perspectiveId: perspectiveId || this.uref
                }
            });
        }
        async forkPerspective(perspectiveId) {
            this.creatingNewPerspective = true;
            const result = await this.client.mutate({
                mutation: FORK_PERSPECTIVE,
                variables: {
                    perspectiveId: perspectiveId || this.uref,
                    remote: this.defaultRemoteId
                }
            });
            const newPerspectiveId = result.data.forkPerspective.id;
            this.dispatchEvent(new CustomEvent('new-perspective-created', {
                detail: {
                    oldPerspectiveId: this.uref,
                    newPerspectiveId: newPerspectiveId
                },
                bubbles: true,
                composed: true
            }));
            this.checkoutPerspective(newPerspectiveId);
            this.logger.info('newPerspectiveClicked() - perspective created', {
                id: newPerspectiveId
            });
            this.creatingNewPerspective = false;
        }
        checkoutPerspective(perspectiveId) {
            this.dispatchEvent(new CustomEvent('checkout-perspective', {
                detail: {
                    perspectiveId: perspectiveId
                },
                composed: true,
                bubbles: true
            }));
        }
        async proposeMergeClicked() {
            this.proposingUpdate = true;
            await this.otherPerspectiveMerge(this.uref, this.firstRef);
            this.proposingUpdate = false;
        }
        perspectiveTextColor() {
            if (this.uref === this.firstRef) {
                return '#37352f';
            }
            else {
                return '#ffffff';
            }
        }
        async delete() {
            if (!this.client)
                throw new Error('client undefined');
            await this.client.mutate({
                mutation: DELETE_PERSPECTIVE,
                variables: {
                    perspectiveId: this.uref
                }
            });
            this.checkoutPerspective(this.firstRef);
        }
        async updatesDialog(workspace, options, message = litElement.html ``) {
            this.showUpdatesDialog = true;
            await this.updateComplete;
            this.updatesDialogEl.options = options;
            this.eveesDiffEl.workspace = workspace;
            this.eveesDiffInfoMessage = message;
            return new Promise(resolve => {
                this.updatesDialogEl.resolved = value => {
                    this.showUpdatesDialog = false;
                    resolve(value);
                };
            });
        }
        renderUpdatesDialog() {
            return litElement.html `
      <uprtcl-dialog id="updates-dialog">
        <div>${this.eveesDiffInfoMessage}</div>
        <evees-update-diff id="evees-update-diff"></evees-update-diff>
      </uprtcl-dialog>
    `;
        }
        renderFromToPerspective(toPerspectiveId, fromPerspectiveId) {
            return litElement.html `
      <div class="row merge-message">
        <uprtcl-indicator label="To">
          <evees-perspective-icon perspective-id=${toPerspectiveId}></evees-perspective-icon>
        </uprtcl-indicator>
        <div class="arrow">
          <uprtcl-icon-button icon="arrow_back"></uprtcl-icon-button>
        </div>
        <uprtcl-indicator label="From">
          <evees-perspective-icon perspective-id=${fromPerspectiveId}></evees-perspective-icon>
        </uprtcl-indicator>
      </div>
    `;
        }
        renderLoading() {
            return litElement.html `
      <uprtcl-loading></uprtcl-loading>
    `;
        }
        /** overwrite */
        renderIcon() {
            return litElement.html `
      <evees-perspective-icon perspective-id=${this.uref}></evees-perspective-icon>
    `;
        }
        renderInfo() {
            return litElement.html `
      <div class="perspective-details">
        <div class="prop-name"><h2>${this.entityType}</h2></div>
        ${this.entityType === EveesBindings.PerspectiveType
            ? litElement.html `
              <div class="prop-name">perspective id</div>
              <pre class="prop-value">${this.perspectiveData.id}</pre>

              <div class="prop-name">perspective</div>
              <pre class="prop-value">
${JSON.stringify(this.perspectiveData.perspective, undefined, 2)}</pre
              >

              <div class="prop-name">authority</div>
              <pre class="prop-value">
${this.perspectiveData.perspective ? getAuthority(this.perspectiveData.perspective) : ''}</pre
              >
            `
            : ''}

        <div class="prop-name">head</div>
        <pre class="prop-value">${JSON.stringify(this.perspectiveData.head, undefined, 2)}</pre>

        <div class="prop-name">data</div>
        <pre class="prop-value">${JSON.stringify(this.perspectiveData.data, undefined, 2)}</pre>
      </div>
    `;
        }
        static get styles() {
            return [
                litElement.css `
        .perspective-details {
          padding: 5px;
          text-align: left;
          max-width: calc(100vw - 72px);
          min-width: 490px;
        }

        .prop-name {
          font-weight: bold;
          width: 100%;
        }

        .prop-value {
          font-family: Lucida Console, Monaco, monospace;
          font-size: 12px;
          text-align: left;
          background-color: #a0a3cb;
          color: #1c1d27;
          padding: 16px 16px;
          margin-bottom: 16px;
          border-radius: 6px;
          width: 100%;
          overflow: auto;
          width: calc(100% - 32px);
          overflow-x: auto;
        }
        .row {
          width: 100%;
          display: flex;
          margin-bottom: 20px;
        }
        .merge-message uprtcl-indicator {
          flex: 1 1 auto;
          margin: 5px;
        }
        .merge-message .arrow {
          flex: 0.3 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `
            ];
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'uref' }),
        __metadata("design:type", String)
    ], EveesInfoBase.prototype, "uref", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'first-uref' }),
        __metadata("design:type", String)
    ], EveesInfoBase.prototype, "firstRef", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'parent-id' }),
        __metadata("design:type", String)
    ], EveesInfoBase.prototype, "parentId", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'default-remote' }),
        __metadata("design:type", Object)
    ], EveesInfoBase.prototype, "defaultRemoteId", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'official-remote' }),
        __metadata("design:type", Object)
    ], EveesInfoBase.prototype, "officialRemoteId", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'evee-color' }),
        __metadata("design:type", String)
    ], EveesInfoBase.prototype, "eveeColor", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'emit-proposals' }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "emitProposals", void 0);
    __decorate([
        litElement.property({ type: String, attribute: false }),
        __metadata("design:type", Object)
    ], EveesInfoBase.prototype, "entityType", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "loading", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "isLogged", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Object)
    ], EveesInfoBase.prototype, "isLoggedOnDefault", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", String)
    ], EveesInfoBase.prototype, "forceUpdate", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "showUpdatesDialog", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "loggingIn", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "creatingNewPerspective", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "proposingUpdate", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "makingPublic", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "firstHasChanges", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoBase.prototype, "merging", void 0);
    __decorate([
        litElement.query('#updates-dialog'),
        __metadata("design:type", commonUi.UprtclDialog)
    ], EveesInfoBase.prototype, "updatesDialogEl", void 0);
    __decorate([
        litElement.query('#evees-update-diff'),
        __metadata("design:type", EveesDiff)
    ], EveesInfoBase.prototype, "eveesDiffEl", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", litElement.TemplateResult)
    ], EveesInfoBase.prototype, "eveesDiffInfoMessage", void 0);

    class EveesInfoPage extends EveesInfoBase {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-INFO-PAGE');
            this.showPerspectives = false;
            this.showProposals = false;
            this.showAcl = false;
            this.showInfo = false;
            this.showEditName = false;
            this.parentId = '';
        }
        async firstUpdated() {
            super.firstUpdated();
        }
        connectedCallback() {
            super.connectedCallback();
            this.logger.log('Connected', this.uref);
            this.addEventListener('keydown', event => {
                if (event.keyCode === 27) {
                    // 27 is esc
                    this.showEditName = false;
                }
                if (event.keyCode === 13) {
                    // 13 is enter
                    if (this.showEditName) {
                        this.saveName();
                    }
                }
            });
        }
        async disconnectedCallback() {
            super.disconnectedCallback();
            this.logger.log('Disconnected', this.uref);
        }
        async editNameClicked() {
            this.showEditName = true;
            await this.updateComplete;
            this.draftTextField.focus();
        }
        async saveName() {
            if (!this.shadowRoot)
                return;
            const client = this.client;
            const newName = this.draftTextField.value;
            this.showEditName = false;
            await client.mutate({
                mutation: UPDATE_HEAD,
                variables: {
                    perspectiveId: this.uref,
                    name: newName
                }
            });
            this.load();
        }
        optionClicked(e) {
            switch (e.detail.key) {
                case 'logout':
                    this.logout();
                    break;
                case 'login':
                    this.login();
                    break;
                case 'edit-profile':
                    if (this.defaultRemote) {
                        window.open(`https://3box.io/${this.defaultRemote.userId}`);
                    }
                    break;
                case 'edit':
                    this.editNameClicked();
                    break;
            }
        }
        async showPullChanges() {
            if (!this.pullWorkspace)
                throw new Error('pullWorkspace undefined');
            const options = {
                apply: {
                    text: 'apply',
                    icon: 'done',
                    skinny: false
                },
                close: {
                    text: 'close',
                    icon: 'clear',
                    skinny: true
                }
            };
            const result = await this.updatesDialog(this.pullWorkspace, options);
            if (result !== 'apply') {
                return;
            }
            await this.pullWorkspace.execute(this.client);
            this.checkoutPerspective(this.uref);
        }
        renderPermissions() {
            return litElement.html `
      <div class="perspectives-permissions">
        ${!this.loading
            ? this.remote.accessControl.lense().render({ uref: this.uref, parentId: this.parentId })
            : ''}
      </div>
    `;
        }
        renderNewPerspectiveButton() {
            return litElement.html `
      <uprtcl-button-loading
        class="section-button"
        skinny
        icon="call_split"
        @click=${this.forkPerspective}
        ?loading=${this.creatingNewPerspective}
      >
        new perspective
      </uprtcl-button-loading>
    `;
        }
        renderMakeProposalButton() {
            return litElement.html `
      <uprtcl-button-loading
        class="section-button"
        skinny
        icon="call_merge"
        @click=${this.proposeMergeClicked}
        ?loading=${this.proposingUpdate}
      >
        Propose Merge
      </uprtcl-button-loading>
    `;
        }
        renderPerspectiveActions() {
            /** most likely action button */
            const actionButton = litElement.html `
        ${this.isLogged && this.uref !== this.firstRef
            ? litElement.html `
                <div class="action-button">
                  ${this.renderMakeProposalButton()}
                </div>
              `
            : this.isLoggedOnDefault
                ? litElement.html `
                <div class="action-button">
                  ${this.renderNewPerspectiveButton()}
                </div>
              `
                : ''}
      </div>
    `;
            const contextButton = litElement.html `
      <div class="context-menu">
        <uprtcl-help>
          <span>
            To update the "Official Version" of this Wiki you need to create a new "Perspective"<br /><br />
            Once changes have been made to that perspectective, click "Propose Update" to update the
            "Official" perspective.
          </span>
        </uprtcl-help>
      </div>
    `;
            const pullButton = litElement.html `
      <div class="pull-menu">
        <uprtcl-icon-button @click=${this.showPullChanges} icon="play_for_work" button>
        </uprtcl-icon-button>
      </div>
    `;
            return litElement.html `
      ${this.showEditName ? '' : actionButton} ${contextButton}
      ${this.firstHasChanges ? pullButton : ''}
    `;
        }
        render() {
            if (this.perspectiveData === undefined)
                return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
            return litElement.html `
      <div class="container">
        <div class="column">
          ${this.showPerspectives
            ? litElement.html `
                <div class="section">
                  <div class="section-header perspective-title">
                    Perspectives
                  </div>

                  <div class="section-content">
                    ${this.renderPerspectiveActions()}
                    <div class="list-container">
                      ${!this.loading
                ? litElement.html `
                            <evees-perspectives-list
                              perspective-id=${this.uref}
                              ?can-propose=${this.isLogged}
                              @perspective-selected=${e => this.checkoutPerspective(e.detail.id)}
                              @merge-perspective=${e => this.otherPerspectiveMerge(e.detail.perspectiveId, this.uref)}
                            ></evees-perspectives-list>
                          `
                : litElement.html `
                            <uprtcl-loading></uprtcl-loading>
                          `}
                    </div>
                  </div>
                </div>
              `
            : ''}
          ${this.showProposals
            ? litElement.html `
                <div class="section">
                  <div class="section-header">
                    Proposals
                  </div>

                  <div class="section-content">
                    <div class="list-container">
                      ${!this.loading
                ? litElement.html `
                            <evees-proposals-list
                              perspective-id=${this.uref}
                            ></evees-proposals-list>
                          `
                : litElement.html `
                            <uprtcl-loading></uprtcl-loading>
                          `}
                    </div>
                  </div>
                </div>
              `
            : ''}
          ${this.showAcl
            ? litElement.html `
                <div class="section">
                  <div class="section-header">
                    Access Control
                  </div>
                  <div class="section-content">
                    ${this.renderPermissions()}
                  </div>
                  <div class="context-menu"></div>
                </div>
              `
            : ''}
          ${this.showInfo
            ? litElement.html `
                <div class="section">
                  <div class="section-header">
                    Evee Info
                  </div>
                  <div class="section-content info-text">
                    ${this.renderInfo()}
                  </div>
                </div>
              `
            : ''}
        </div>
      </div>
      ${this.showUpdatesDialog ? this.renderUpdatesDialog() : ''}
    `;
        }
        static get styles() {
            return super.styles.concat([
                litElement.css `
        .section-button {
          width: 220px;
          margin: 0 auto;
        }

        p {
          margin: 0;
        }
        .column {
          display: flex;
          flex-direction: column;
          padding: 0px 5vw;
        }
        .section {
          text-align: center;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
          margin-bottom: 36px;
          border-radius: 4px;
          background-color: rgb(255, 255, 255, 0.6);
          position: relative;
        }
        .user-icon {
          padding-top: 8px;
          width: 48px;
          height: 48px;
          cursor: pointer;
        }
        .section-header {
          font-weight: bold;
          padding: 2vw 0px 0.8vw 0px;
          font-size: 30px;
          border-style: solid 2px;
        }
        .section-header evees-author {
          margin: 0 auto;
        }
        .context-menu {
          position: absolute;
          top: 6px;
          right: 6px;
          display: flex;
        }
        .pull-menu {
          position: absolute;
          top: 6px;
          left: 6px;
        }
        .section-content {
          padding: 2.2vw 0px 2.2vw 0px;
        }
        .info-text {
          color: #4e585c;
          padding: 0px 2.5vw;
          min-height: 75px;
        }
        .action-button {
          margin-bottom: 24px;
        }
        .list-container {
          min-height: 200px;
          display: flex;
          flex-direction: column;
          text-align: left;
          padding: 6px 12px 0px 16px;
          color: #4e585c;
        }

        @media (max-width: 768px) {
          .section-header {
            margin-top: 33px;
          }
          .context-menu {
            top: 2px;
            right: 5px;
          }
          .pull-menu {
            top: 2px;
            left: 5px;
          }
          .mdc-icon-button {
            width: 35px !important;
            height: 35px !important;
          }
          .draft-mod-action uprtcl-button {
            margin-bottom: 10px;
          }
          .draft-name uprtcl-textfield {
            width: 85%;
          }
        }
      `
            ]);
        }
    }
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-perspectives' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPage.prototype, "showPerspectives", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-proposals' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPage.prototype, "showProposals", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-acl' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPage.prototype, "showAcl", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-info' }),
        __metadata("design:type", Boolean)
    ], EveesInfoPage.prototype, "showInfo", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoPage.prototype, "showEditName", void 0);
    __decorate([
        litElement.property({ attribute: true }),
        __metadata("design:type", String)
    ], EveesInfoPage.prototype, "parentId", void 0);
    __decorate([
        litElement.query('#draft-textfield'),
        __metadata("design:type", Object)
    ], EveesInfoPage.prototype, "draftTextField", void 0);

    class FindMostRecentCommonAncestor {
        constructor(client, commitsIds) {
            this.client = client;
            this.allCommits = {};
            this.paths = commitsIds.map((commitId) => ({
                visited: {},
                heads: [commitId],
            }));
        }
        getMostRecentCommonAncestor(pathToExplore) {
            // Do we have a commit that has already been visited by all other paths?
            const otherPaths = this.paths.filter((p) => p !== pathToExplore);
            return pathToExplore.heads.find((commitId) => otherPaths.every((path) => path.visited[commitId]));
        }
        /**
         * Explore the given path: get the parents of its heads and prepare the path for the next iteration
         */
        async explorePath(pathToExplore) {
            const promises = pathToExplore.heads.map(async (commitId) => {
                let commit = this.allCommits[commitId];
                if (!commit) {
                    commit = await this.getCommit(commitId);
                    if (!commit)
                        throw new Error('Could not get ancestor commit');
                    this.allCommits[commitId] = commit;
                }
                pathToExplore.visited[commitId] = true;
                return commit;
            });
            const commits = await Promise.all(promises);
            const nextCommits = commits.map((commit) => commit.object.payload.parentsIds.concat(commit.object.payload.forking ? [commit.object.payload.forking] : []));
            pathToExplore.heads = Array.prototype.concat.apply([], nextCommits);
            return pathToExplore;
        }
        async getCommit(commitId) {
            const result = await this.client.query({
                query: apolloBoost.gql `{
        entity(uref: "${commitId}") {
          id
          _context {
            object
          }
        }
      }`,
            });
            return { id: commitId, object: result.data.entity._context.object };
        }
        async compute() {
            // Iterate until there is no more parent commits to explore
            while (this.paths.find((path) => path.heads.length > 0)) {
                for (let i = 0; i < this.paths.length; i++) {
                    const commonAncestor = this.getMostRecentCommonAncestor(this.paths[i]);
                    // If so, we have the most recent common ancestor, return it
                    if (commonAncestor) {
                        return commonAncestor;
                    }
                    // Else, explore parents and prepare for next iteration
                    this.paths[i] = await this.explorePath(this.paths[i]);
                }
            }
            return undefined;
        }
    }
    function findMostRecentCommonAncestor(client) {
        return (commitsIds) => new FindMostRecentCommonAncestor(client, commitsIds).compute();
    }

    const diff = new diffMatchPatchTs.DiffMatchPatch();
    class DiffUtils {
        static charDiff(str1, str2) {
            const diffs = diff.diff_main(str1, str2);
            return this.toChars(diffs);
        }
        static toChars(diffs) {
            let result = [];
            for (const diff of diffs) {
                const charDiff = diff[1].split('').map((word) => [diff[0], word]);
                result = result.concat(charDiff);
            }
            return result;
        }
        static alignDiffs(diffs) {
            const chars = {
                original: [],
                news: diffs.map(() => []),
            };
            while (!diffs.every((diff) => diff.length === 0)) {
                const removalIndex = diffs.findIndex((diff) => diff.length > 0 && diff[0][0] === -1 /* Delete */);
                if (removalIndex !== -1 &&
                    diffs.every((diff, index) => removalIndex === index ||
                        diff[0][0] === 0 /* Equal */ ||
                        (diff[0][0] === -1 /* Delete */ && diff[0][1] === diffs[removalIndex][0][1]))) {
                    // There has been a removal
                    let original = diffs[removalIndex][0];
                    diffs.forEach((diff) => diff.shift());
                    chars.original.push(original);
                    chars.news.forEach((newChars) => newChars.push(original));
                }
                else {
                    const changeIndex = diffs.findIndex((diff) => diff.length > 0 && diff[0][0] !== 0 /* Equal */);
                    if (changeIndex !== -1) {
                        const change = diffs[changeIndex].shift();
                        chars.original.push(undefined);
                        for (let i = 0; i < diffs.length; i++) {
                            if (changeIndex === i) {
                                chars.news[i].push(change);
                            }
                            else {
                                chars.news[i].push(undefined);
                            }
                        }
                    }
                    else {
                        let original = undefined;
                        diffs.forEach((diff) => (original = diff.shift()));
                        chars.original.push(original);
                        chars.news.forEach((newChars) => newChars.push(original));
                    }
                }
            }
            return chars;
        }
        static applyDiff(str, diffs) {
            const patches = diff.patch_make(str, diffs, undefined);
            return diff.patch_apply(patches, str)[0];
        }
    }

    function mergeStrings(originalString, newStrings) {
        const diffs = newStrings.map((newString) => DiffUtils.charDiff(originalString, newString));
        const alignedDiffs = DiffUtils.alignDiffs(diffs);
        let mergeDiffs = [];
        for (let i = 0; i < alignedDiffs.original.length; i++) {
            const mergeDiff = mergeResult(alignedDiffs.original[i], alignedDiffs.news.map((newChar) => newChar[i]));
            mergeDiffs.push(mergeDiff);
        }
        return DiffUtils.applyDiff(originalString, mergeDiffs);
    }
    /**
     *
     * @param original
     * @param modifications
     * @returns the appropiate result of the merge
     */
    function mergeResult(original, modifications) {
        const changes = modifications.filter((modification) => !isEqual__default['default'](original, modification));
        switch (changes.length) {
            // Object has not changed
            case 0:
                return original;
            case 1:
                return changes[0];
            default:
                if (changes.every((change) => isEqual__default['default'](changes[0], change))) {
                    return changes[0];
                }
                throw new Error('conflict when trying to merge');
        }
    }

    exports.SimpleMergeStrategy = class SimpleMergeStrategy {
        constructor(evees, recognizer, client, entityCache) {
            this.evees = evees;
            this.recognizer = recognizer;
            this.client = client;
            this.entityCache = entityCache;
        }
        mergePerspectivesExternal(toPerspectiveId, fromPerspectiveId, workspace, config) {
            return this.mergePerspectives(toPerspectiveId, fromPerspectiveId, config, workspace);
        }
        async mergePerspectives(toPerspectiveId, fromPerspectiveId, workspace, config) {
            const promises = [toPerspectiveId, fromPerspectiveId].map(async (id) => EveesHelpers.getPerspectiveHeadId(this.client, id));
            const [toHeadId, fromHeadId] = await Promise.all(promises);
            const remote = await this.evees.getPerspectiveRemoteById(toPerspectiveId);
            let newHead;
            newHead = fromHeadId
                ? await this.mergeCommits(toHeadId, fromHeadId, remote.id, workspace, config)
                : toHeadId;
            /** prevent an update head to the same head */
            if (newHead === toHeadId) {
                return toPerspectiveId;
            }
            if (newHead === undefined) {
                throw new Error('New head is undefined');
            }
            const request = {
                fromPerspectiveId,
                perspectiveId: toPerspectiveId,
                oldHeadId: toHeadId,
                newHeadId: newHead
            };
            workspace.update(request);
            return toPerspectiveId;
        }
        async loadPerspectiveData(perspectiveId) {
            const result = await this.client.query({
                query: apolloBoost.gql `{
        entity(uref: "${perspectiveId}") {
          id
          ... on Perspective {
            head {
              id
              data {
                id 
                _context {
                  object
                }
              }
            }
          }
        }
      }`
            });
            const object = result.data.entity.head.data._context.object;
            return {
                id: result.data.entity.head.data.id,
                object
            };
        }
        async loadCommitData(commitId) {
            if (commitId === undefined)
                return undefined;
            const result = await this.client.query({
                query: apolloBoost.gql `{
        entity(uref: "${commitId}") {
          id
          data {
            id
            _context {
              object
            }
          }
        }
      }`
            });
            if (!result.data.entity.data)
                return undefined;
            const object = result.data.entity.data._context.object;
            return {
                id: result.data.entity.data.id,
                object
            };
        }
        async findLatestNonFork(commitId) {
            const commit = await multiplatform.loadEntity(this.client, commitId);
            if (commit === undefined)
                throw new Error('commit not found');
            if (commit.object.payload.forking !== undefined) {
                return this.findLatestNonFork(commit.object.payload.forking);
            }
            else {
                return commitId;
            }
        }
        async mergeCommits(toCommitIdOrg, fromCommitIdOrg, remote, workspace, config) {
            const toCommitId = toCommitIdOrg ? await this.findLatestNonFork(toCommitIdOrg) : undefined;
            const fromCommitId = await this.findLatestNonFork(fromCommitIdOrg);
            const commitsIds = [toCommitId, fromCommitId];
            const ancestorId = toCommitId
                ? await findMostRecentCommonAncestor(this.client)(commitsIds)
                : fromCommitId;
            const datasPromises = commitsIds.map(async (commitId) => this.loadCommitData(commitId));
            const newDatas = await Promise.all(datasPromises);
            const ancestorData = ancestorId !== undefined ? await this.loadCommitData(ancestorId) : newDatas[0];
            const mergedData = await this.mergeData(ancestorData, newDatas, workspace, config);
            const instance = this.evees.getRemote(remote);
            const sourceRemote = instance.store;
            const entity = await deriveEntity(mergedData, sourceRemote.cidConfig);
            entity.casID = sourceRemote.casID;
            /** prevent an update head to the same data */
            if (((!!newDatas[0] && entity.id === newDatas[0].id) || toCommitId === fromCommitId) &&
                toCommitIdOrg !== undefined) {
                return toCommitIdOrg;
            }
            workspace.create(entity);
            if (!instance.userId)
                throw new Error('Cannot create commits in a casID you are not signed in');
            /** some commits might be undefined */
            const parentsIds = commitsIds.filter(commit => !!commit);
            const newCommit = {
                dataId: entity.id,
                parentsIds: parentsIds,
                message: `Merging commits ${parentsIds.toString()}`,
                timestamp: Date.now(),
                creatorsIds: [instance.userId]
            };
            const securedCommit = await deriveSecured(newCommit, instance.store.cidConfig);
            securedCommit.casID = instance.store.casID;
            workspace.create(securedCommit);
            return securedCommit.id;
        }
        async mergeData(originalData, newDatas, workspace, config) {
            const merge = this.recognizer
                .recognizeBehaviours(originalData)
                .find(prop => !!prop.merge);
            if (!merge)
                throw new Error(`Cannot merge data ${JSON.stringify(originalData)} that does not implement the Mergeable behaviour`);
            return merge.merge(originalData)(newDatas, this, workspace, config);
        }
        async mergeLinks(originalLinks, modificationsLinks, workspace, config) {
            const allLinks = {};
            const originalLinksDic = {};
            for (let i = 0; i < originalLinks.length; i++) {
                const link = originalLinks[i];
                originalLinksDic[link] = {
                    index: i,
                    link: link
                };
            }
            const newLinks = [];
            for (let i = 0; i < modificationsLinks.length; i++) {
                const newData = modificationsLinks[i];
                const links = {};
                for (let j = 0; j < newData.length; j++) {
                    const link = newData[j];
                    links[link] = {
                        index: j,
                        link: link
                    };
                    allLinks[link] = true;
                }
                newLinks.push(links);
            }
            const resultLinks = [];
            for (const link of Object.keys(allLinks)) {
                const linkResult = mergeResult(originalLinksDic[link], newLinks.map(newLink => newLink[link]));
                if (linkResult) {
                    resultLinks.push(linkResult);
                }
            }
            const sortedLinks = resultLinks
                .sort((link1, link2) => link1.index - link2.index)
                .map(link => link.link);
            return sortedLinks;
        }
    };
    exports.SimpleMergeStrategy = __decorate([
        inversify.injectable(),
        __param(0, inversify.inject(EveesBindings.Evees)),
        __param(1, inversify.inject(cortex.CortexModule.bindings.Recognizer)),
        __param(2, inversify.inject(graphql.ApolloClientModule.bindings.Client)),
        __param(3, inversify.inject(multiplatform.DiscoveryModule.bindings.EntityCache)),
        __metadata("design:paramtypes", [exports.Evees,
            cortex.PatternRecognizer,
            apolloBoost.ApolloClient,
            multiplatform.EntityCache])
    ], exports.SimpleMergeStrategy);

    exports.RecursiveContextMergeStrategy = class RecursiveContextMergeStrategy extends exports.SimpleMergeStrategy {
        constructor() {
            super(...arguments);
            this.perspectivesByContext = undefined;
            this.allPerspectives = undefined;
        }
        async isPattern(id, type) {
            const entity = await multiplatform.loadEntity(this.client, id);
            if (entity === undefined)
                throw new Error('entity not found');
            const recongnizedType = this.recognizer.recognizeType(entity);
            return type === recongnizedType;
        }
        setPerspective(perspectiveId, context, to) {
            if (!this.perspectivesByContext)
                throw new Error('perspectivesByContext undefined');
            if (!this.allPerspectives)
                throw new Error('allPerspectives undefined');
            if (!this.perspectivesByContext[context]) {
                this.perspectivesByContext[context] = {
                    to: undefined,
                    from: undefined
                };
            }
            if (to) {
                this.perspectivesByContext[context].to = perspectiveId;
            }
            else {
                this.perspectivesByContext[context].from = perspectiveId;
            }
            this.allPerspectives[perspectiveId] = context;
        }
        async readPerspective(perspectiveId, to) {
            const result = await this.client.query({
                query: apolloBoost.gql `{
        entity(uref: "${perspectiveId}") {
          id
          ... on Perspective {
            payload {
              context {
                id
              }
            }
            head {
              id
              data {
                id
                _context {
                  object
                }
              }
            }
          }
        }
      }`
            });
            const context = result.data.entity.payload.context.id;
            this.setPerspective(perspectiveId, context, to);
            if (result.data.entity.head == null) {
                return;
            }
            /** read children recursively */
            const dataObject = result.data.entity.head.data._context.object;
            const dataId = result.data.entity.head.data.id;
            const data = { id: dataId, object: dataObject };
            const hasChildren = this.recognizer
                .recognizeBehaviours(data)
                .find(prop => !!prop.getChildrenLinks);
            if (hasChildren) {
                const links = hasChildren.getChildrenLinks(data);
                const promises = links.map(async (link) => {
                    const isPerspective = await this.isPattern(link, 'Perspective');
                    if (isPerspective) {
                        this.readPerspective(link, to);
                    }
                });
                await Promise.all(promises);
            }
        }
        async readAllSubcontexts(toPerspectiveId, fromPerspectiveId) {
            const promises = [
                this.readPerspective(toPerspectiveId, true),
                this.readPerspective(fromPerspectiveId, false)
            ];
            await Promise.all(promises);
        }
        async mergePerspectivesExternal(toPerspectiveId, fromPerspectiveId, workspace, config) {
            /** reset internal state */
            this.perspectivesByContext = undefined;
            this.allPerspectives = undefined;
            return this.mergePerspectives(toPerspectiveId, fromPerspectiveId, workspace, config);
        }
        async mergePerspectives(toPerspectiveId, fromPerspectiveId, workspace, config) {
            if (!this.perspectivesByContext) {
                this.perspectivesByContext = {};
                this.allPerspectives = {};
                await this.readAllSubcontexts(toPerspectiveId, fromPerspectiveId);
            }
            return super.mergePerspectives(toPerspectiveId, fromPerspectiveId, workspace, config);
        }
        async getPerspectiveContext(perspectiveId) {
            if (!this.allPerspectives)
                throw new Error('allPerspectives undefined');
            if (this.allPerspectives[perspectiveId]) {
                return this.allPerspectives[perspectiveId];
            }
            else {
                const secured = await multiplatform.loadEntity(this.client, perspectiveId);
                if (!secured)
                    throw new Error(`perspective ${perspectiveId} not found`);
                return secured.object.payload.context;
            }
        }
        async getLinkMergeId(link) {
            const isPerspective = await this.isPattern(link, 'Perspective');
            if (isPerspective) {
                return this.getPerspectiveContext(link);
            }
            else {
                return Promise.resolve(link);
            }
        }
        async mergeLinks(originalLinks, modificationsLinks, workspace, config) {
            if (!this.perspectivesByContext)
                throw new Error('perspectivesByContext undefined');
            /** The context is used as Merge ID for perspective to have a context-based merge. For other
             * type of entities, like commits or data, the link itself is used as mergeId */
            const originalPromises = originalLinks.map(link => this.getLinkMergeId(link));
            const modificationsPromises = modificationsLinks.map(links => links.map(link => this.getLinkMergeId(link)));
            const originalMergeIds = await Promise.all(originalPromises);
            const modificationsMergeIds = await Promise.all(modificationsPromises.map(promises => Promise.all(promises)));
            const mergedLinks = await super.mergeLinks(originalMergeIds, modificationsMergeIds, workspace, config);
            const dictionary = this.perspectivesByContext;
            const mergeLinks = mergedLinks.map(async (link) => {
                const perspectivesByContext = dictionary[link];
                if (perspectivesByContext) {
                    const needsSubperspectiveMerge = perspectivesByContext.to && perspectivesByContext.from;
                    if (needsSubperspectiveMerge) {
                        /** Two perspectives of the same context are merged, keeping the "to" perspecive id,
                         *  and updating its head (here is where recursion start) */
                        config = {
                            parentId: perspectivesByContext.to,
                            ...config
                        };
                        await this.mergePerspectives(perspectivesByContext.to, perspectivesByContext.from, workspace, config);
                        return perspectivesByContext.to;
                    }
                    else {
                        if (perspectivesByContext.to) {
                            /** if the perspective is only present in the "to", just keep it */
                            return perspectivesByContext.to;
                        }
                        else {
                            /** otherwise, if merge config.forceOwner and this perspective is only present in the
                             * "from", a fork will be created using parentId as the source for permissions*/
                            if (config.forceOwner) {
                                const newPerspectiveId = await this.evees.forkPerspective(perspectivesByContext.from, workspace, config.remote, config.parentId);
                                return newPerspectiveId;
                            }
                            else {
                                return perspectivesByContext.from;
                            }
                        }
                    }
                }
                else {
                    return link;
                }
            });
            const mergeResults = await Promise.all(mergeLinks);
            return mergeResults;
        }
    };
    exports.RecursiveContextMergeStrategy = __decorate([
        inversify.injectable()
    ], exports.RecursiveContextMergeStrategy);

    // The random number is a js implementation of the Xorshift PRNG
    var randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

    function seedrand(seed) {
      for (var i = 0; i < randseed.length; i++) {
        randseed[i] = 0;
      }
      for (var i = 0; i < seed.length; i++) {
        randseed[i % 4] =
          (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
      }
    }

    function rand() {
      // based on Java's String.hashCode(), expanded to 4 32bit values
      var t = randseed[0] ^ (randseed[0] << 11);

      randseed[0] = randseed[1];
      randseed[1] = randseed[2];
      randseed[2] = randseed[3];
      randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);

      return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
    }

    function createColor() {
      //saturation is the whole color spectrum
      var h = Math.floor(rand() * 360);
      //saturation goes from 40 to 100, it avoids greyish colors
      var s = rand() * 60 + 40 + '%';
      //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
      var l = (rand() + rand() + rand() + rand()) * 25 + '%';

      var color = 'hsl(' + h + ',' + s + ',' + l + ')';
      return color;
    }

    function createImageData(size) {
      var width = size; // Only support square icons for now
      var height = size;

      var dataWidth = Math.ceil(width / 2);
      var mirrorWidth = width - dataWidth;

      var data = [];
      for (var y = 0; y < height; y++) {
        var row = [];
        for (var x = 0; x < dataWidth; x++) {
          // this makes foreground and background color to have a 43% (1/2.3) probability
          // spot color has 13% chance
          row[x] = Math.floor(rand() * 2.3);
        }
        var r = row.slice(0, mirrorWidth);
        r.reverse();
        row = row.concat(r);

        for (var i = 0; i < row.length; i++) {
          data.push(row[i]);
        }
      }

      return data;
    }

    function buildOpts(opts) {
      var newOpts = {};

      newOpts.seed =
        opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);

      seedrand(newOpts.seed);

      newOpts.size = opts.size || 8;
      newOpts.scale = opts.scale || 4;
      newOpts.color = opts.color || createColor();
      newOpts.bgcolor = opts.bgcolor || createColor();
      newOpts.spotcolor = opts.spotcolor || createColor();

      return newOpts;
    }

    function renderIcon(opts, canvas) {
      opts = buildOpts(opts || {});
      var imageData = createImageData(opts.size);
      var width = Math.sqrt(imageData.length);

      canvas.width = canvas.height = opts.size * opts.scale;

      var cc = canvas.getContext('2d');
      cc.fillStyle = opts.bgcolor;
      cc.fillRect(0, 0, canvas.width, canvas.height);
      cc.fillStyle = opts.color;

      for (var i = 0; i < imageData.length; i++) {
        // if data is 0, leave the background
        if (imageData[i]) {
          var row = Math.floor(i / width);
          var col = i % width;

          // if data is 2, choose spot color, if 1 choose foreground
          cc.fillStyle = imageData[i] == 1 ? opts.color : opts.spotcolor;

          cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
        }
      }
      return canvas;
    }

    function createIcon(opts) {
      var canvas = document.createElement('canvas');

      renderIcon(opts, canvas);

      return canvas;
    }

    var blockies = {
      create: createIcon,
      render: renderIcon,
    };

    const styleMap = style => {
        return Object.entries(style).reduce((styleString, [propName, propValue]) => {
            propName = propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`);
            return `${styleString}${propName}:${propValue};`;
        }, '');
    };
    class EveesAuthor extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-AUTHOR');
            this.showName = false;
            this.short = false;
            this.loading = true;
            this.profile = {};
            this.image = undefined;
        }
        async firstUpdated() {
            this.load();
        }
        updated(changedProperties) {
            if (changedProperties.has('userId')) {
                this.load();
            }
        }
        async load() {
            this.image = undefined;
            this.profile = {};
            this.profile.userId = this.userId;
            /** wait so that the canvas blockie is alraedy rendered */
            this.requestUpdate();
            await this.updateComplete;
            if (this.blockie != null) {
                blockies.render({
                    seed: this.profile.userId,
                    size: 8,
                    scale: 4
                }, this.blockie);
            }
            // this.profile = await Box.getProfile(this.userId);
            this.profile.userId = this.userId;
            this.image = this.profile.image
                ? `https://ipfs.io/ipfs/${this.profile.image[0].contentUrl['/']}`
                : undefined;
            this.requestUpdate();
            // let provider = window['ethereum'];
            // await provider.enable();
            // const ensApi = new ENS(provider);
            // try {
            //   this.logger.log('ens', ens);
            //   const add = await ensApi.resolver(ens).addr();
            //   this.logger.log('add', add);
            // } catch (e) {
            //   this.logger.warn('error connecting to ensApi');
            // }
        }
        clicked() {
            if (this.profile.url) {
                window.location = this.profile.url;
            }
        }
        render() {
            if (this.profile.userId === undefined)
                return '';
            let addressBoxClasses = ['box-address-txt'];
            if (this.short) {
                addressBoxClasses.push('box-address-shorter');
            }
            else {
                addressBoxClasses.push('box-address-short');
            }
            return litElement.html `
      <div class="box-address">
        <div
          class="box-img"
          style="${styleMap({
            borderColor: this.color
        })}"
        >
          ${this.image !== undefined
            ? litElement.html `
                <img src=${this.image} />
              `
            : litElement.html `
                <canvas id="blockie-canvas"></canvas>
              `}
          }
        </div>

        ${this.showName
            ? litElement.html `
              <div class=${addressBoxClasses.join(' ')}>
                ${this.profile.name ? this.profile.name : this.profile.userId}
              </div>
            `
            : ''}
      </div>
    `;
        }
        static get styles() {
            const baseTileHeight = litElement.css `28px`;
            return litElement.css `
      :host {
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .box-address {
        background: transparent;
        height: fit-content;
        padding: 0px;
        position: relative;
        width: fit-content;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .box-address .box-img {
        background: rgb(7, 73, 136);
        height: ${baseTileHeight};
        width: ${baseTileHeight};
        border-radius: 50%;
        overflow: hidden;
        border-style: solid;
        border-width: 2px;
      }

      .box-address .box-img img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        background-color: white;
      }

      .box-address-txt {
        color: var(--color, rgb(99, 102, 104));
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.015em;
        display: block;
        padding: 0 16px 0px 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .box-address-short {
        max-width: 200px;
      }
      .box-address-shorter {
        max-width: 100px;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'user-id' }),
        __metadata("design:type", String)
    ], EveesAuthor.prototype, "userId", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-name' }),
        __metadata("design:type", Boolean)
    ], EveesAuthor.prototype, "showName", void 0);
    __decorate([
        litElement.property({ type: Boolean }),
        __metadata("design:type", Boolean)
    ], EveesAuthor.prototype, "short", void 0);
    __decorate([
        litElement.property({ type: String }),
        __metadata("design:type", String)
    ], EveesAuthor.prototype, "color", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesAuthor.prototype, "loading", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Object)
    ], EveesAuthor.prototype, "profile", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Object)
    ], EveesAuthor.prototype, "image", void 0);
    __decorate([
        litElement.query('#blockie-canvas'),
        __metadata("design:type", HTMLElement)
    ], EveesAuthor.prototype, "blockie", void 0);

    class ProposalsList extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-PERSPECTIVES-LIST');
            this.loadingProposals = true;
            this.proposalsIds = [];
        }
        async firstUpdated() {
            if (!this.isConnected)
                return;
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            this.load();
        }
        async load() {
            if (!this.isConnected)
                return;
            if (!this.client)
                return;
            this.loadingProposals = true;
            this.logger.info('loadProposals');
            const result = await this.client.query({
                query: apolloBoost.gql `{
          entity(uref: "${this.perspectiveId}") {
            id
            ... on Perspective {
              proposals
            }
          }
        }`
            });
            /** data on other perspectives (proposals are injected on them) */
            this.proposalsIds = result.data.entity.proposals;
            this.remoteId = await EveesHelpers.getPerspectiveRemoteId(this.client, this.perspectiveId);
            this.loadingProposals = false;
            this.logger.info('getProposals()', { proposalsIds: this.proposalsIds });
        }
        updated(changedProperties) {
            if (changedProperties.has('perspectiveId')) {
                this.logger.log('updating proposals');
                this.load();
            }
        }
        render() {
            return this.loadingProposals
                ? litElement.html `
          <div class="loading-container">
            <uprtcl-loading></uprtcl-loading>
          </div>
        `
                : litElement.html `
          ${this.proposalsIds.length > 0
                ? litElement.html `
                <uprtcl-list>
                  ${this.proposalsIds.map(id => litElement.html `
                        <uprtcl-list-item
                          ><evees-proposal-row
                            proposal-id=${id}
                            remote-id=${this.remoteId}
                          ></evees-proposal-row
                        ></uprtcl-list-item>
                      `)}
                </uprtcl-list>
              `
                : litElement.html `
                <uprtcl-list-item>
                  <i>No proposals found</i>
                </uprtcl-list-item>
              `}
        `;
        }
        static get styles() {
            return litElement.css `
      :host {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      .loading-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'perspective-id' }),
        __metadata("design:type", String)
    ], ProposalsList.prototype, "perspectiveId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], ProposalsList.prototype, "loadingProposals", void 0);

    class EveesProposalDiff extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-PROPOSAL-DIFF');
            this.summary = false;
            this.loading = true;
        }
        async firstUpdated() {
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            this.loadProposal();
        }
        async updated(changedProperties) {
            this.logger.log('updated()', changedProperties);
            if (changedProperties.has('proposalId')) {
                this.loadProposal();
            }
        }
        async loadProposal() {
            this.loading = true;
            const eveesRemote = this.requestAll(EveesBindings.EveesRemote).find(remote => remote.id === this.remoteId);
            if (eveesRemote === undefined)
                throw new Error(`remote ${this.remoteId} not found`);
            if (eveesRemote.proposals === undefined)
                throw new Error(`proposal of remote ${this.remoteId} undefined`);
            const proposal = await eveesRemote.proposals.getProposal(this.proposalId);
            if (proposal === undefined)
                throw new Error(`proposal ${this.proposalId} not found on remote ${this.remoteId}`);
            this.workspace = new EveesWorkspace(this.client);
            for (const update of proposal.details.updates) {
                this.workspace.update(update);
            }
            for (const newPerspective of proposal.details.newPerspectives) {
                this.workspace.newPerspective(newPerspective);
            }
            this.loading = false;
            await this.updateComplete;
            this.eveesDiffEl.workspace = this.workspace;
        }
        render() {
            if (this.loading) {
                return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
            }
            return litElement.html `
      <evees-update-diff id="evees-update-diff" ?summary=${this.summary}> </evees-update-diff>
    `;
        }
        static get styles() {
            return litElement.css `
      :host {
        display: block;
        padding: 30px 0px 30px 0px;
        text-align: center;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'proposal-id' }),
        __metadata("design:type", String)
    ], EveesProposalDiff.prototype, "proposalId", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'remote-id' }),
        __metadata("design:type", String)
    ], EveesProposalDiff.prototype, "remoteId", void 0);
    __decorate([
        litElement.property({ type: Boolean }),
        __metadata("design:type", Boolean)
    ], EveesProposalDiff.prototype, "summary", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesProposalDiff.prototype, "loading", void 0);
    __decorate([
        litElement.query('#evees-update-diff'),
        __metadata("design:type", EveesDiff)
    ], EveesProposalDiff.prototype, "eveesDiffEl", void 0);

    class EveesLoginWidget extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-LOGIN');
            this.loading = true;
            this.showAccountSelection = false;
        }
        async firstUpdated() {
            this.remotes = this.requestAll(EveesBindings.EveesRemote);
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            this.load();
        }
        async load() {
            this.loading = true;
            const loggedList = await Promise.all(this.remotes.map(remote => remote.isLogged()));
            this.logged = !loggedList.includes(false);
            await Promise.all(this.remotes.map(r => r.ready()));
            this.loading = false;
        }
        async reload() {
            await this.client.resetStore();
            this.dispatchEvent(new CustomEvent('changed'));
            await this.load();
        }
        async loginAll() {
            await Promise.all(this.remotes.map(async (remote) => {
                const isLogged = await remote.isLogged();
                if (!isLogged)
                    await remote.login();
            }));
            this.reload();
        }
        async logoutAll() {
            await Promise.all(this.remotes.map(async (remote) => {
                const isLogged = await remote.isLogged();
                if (isLogged) {
                    try {
                        await remote.logout();
                    }
                    catch (e) {
                        // TODO: dont swallow errors
                    }
                }
            }));
            this.reload();
        }
        render() {
            if (this.loading) {
                return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
            }
            if (!this.logged) {
                return litElement.html `
        <uprtcl-button @click=${() => this.loginAll()}>login</uprtcl-button>
      `;
            }
            return litElement.html `
      <uprtcl-button skinny @click=${() => this.logoutAll()}>logout</uprtcl-button>
      ${this.remotes.map(remote => {
            return remote.lense !== undefined
                ? remote.lense().render({ remoteId: remote.id })
                : litElement.html `
              <evees-author user-id=${remote.userId}></evees-author>
            `;
        })}
    `;
        }
        static get styles() {
            return litElement.css `
      :host {
        display: flex;
        align-items: center;
      }

      .account-list-title {
        text-align: center;
      }

      uprtcl-button {
        margin-right: 10px;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesLoginWidget.prototype, "loading", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesLoginWidget.prototype, "logged", void 0);
    __decorate([
        litElement.internalProperty(),
        __metadata("design:type", Boolean)
    ], EveesLoginWidget.prototype, "showAccountSelection", void 0);

    class EveesProposalRow extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-PROPOSAL-ROW');
            this.loading = true;
            this.loadingCreator = true;
            this.showDiff = false;
            this.authorId = undefined;
            this.canRemove = false;
            this.executed = false;
            this.canExecute = false;
        }
        async firstUpdated() {
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            this.recognizer = this.request(cortex.CortexModule.bindings.Recognizer);
            this.eveesRemotes = this.requestAll(EveesBindings.EveesRemote);
            const remote = this.requestAll(EveesBindings.EveesRemote).find(r => r.id === this.remoteId);
            if (remote === undefined)
                throw new Error(`remote ${this.remoteId} not found`);
            const proposals = remote.proposals;
            if (proposals === undefined)
                throw new Error(`remote ${this.remoteId} proposals provider not found`);
            this.remote = remote;
            this.proposals = proposals;
            this.load();
        }
        updated(changedProperties) {
            if (changedProperties.has('proposal-id')) {
                this.load();
            }
        }
        async load() {
            this.loading = true;
            this.loadingCreator = true;
            if (this.remote.proposals === undefined)
                throw new Error(`remote ${this.remoteId} cant handle proposals`);
            this.proposal = await this.proposals.getProposal(this.proposalId);
            const fromPerspective = this.proposal.fromPerspectiveId
                ? await multiplatform.loadEntity(this.client, this.proposal.fromPerspectiveId)
                : undefined;
            /** the author is the creator of the fromPerspective */
            this.authorId = fromPerspective ? fromPerspective.object.payload.creatorId : undefined;
            this.loadingCreator = false;
            await this.checkCanExecute();
            await this.checkExecuted();
            /** the proposal creator is set at proposal creation */
            this.canRemove = await this.remote.proposals.canRemove(this.proposalId);
            this.loading = false;
        }
        async checkIsOwner() { }
        async checkExecuted() {
            /* a proposal is considered accepted if all the updates are now ancestors of their target */
            const isAncestorVector = await Promise.all(this.proposal.details.updates.map(update => {
                return EveesHelpers.isAncestorCommit(this.client, update.perspectiveId, update.newHeadId, update.oldHeadId);
            }));
            this.executed = !isAncestorVector.includes(false);
        }
        async checkCanExecute() {
            /* check the update list, if user canWrite on all the target perspectives,
            the user can execute the proposal */
            const canExecuteVector = await Promise.all(this.proposal.details.updates.map(async (update) => {
                const remoteId = await EveesHelpers.getPerspectiveRemoteId(this.client, update.perspectiveId);
                const remote = this.eveesRemotes.find(remote => remote.id === remoteId);
                if (remote === undefined)
                    throw new Error('remote undefined');
                return EveesHelpers.canWrite(this.client, update.perspectiveId);
            }));
            this.canExecute = !canExecuteVector.includes(false);
        }
        async showProposalChanges() {
            const workspace = new EveesWorkspace(this.client, this.recognizer);
            for (const update of this.proposal.details.updates) {
                workspace.update(update);
            }
            for (const newPerspective of this.proposal.details.newPerspectives) {
                workspace.newPerspective(newPerspective);
            }
            /* new perspectives are added to the apollo cache to be able to read their head */
            await workspace.precacheNewPerspectives(this.client);
            this.showDiff = true;
            const options = {};
            if (this.canExecute && !this.executed) {
                options['accept'] = {
                    disabled: false,
                    text: 'accept',
                    icon: 'done'
                };
            }
            options['close'] = {
                disabled: false,
                text: 'close',
                icon: 'clear'
            };
            if (this.canExecute || this.canRemove) {
                options['delete'] = {
                    disabled: false,
                    text: 'delete',
                    icon: 'delete',
                    background: '#c93131'
                };
            }
            await this.updateComplete;
            this.eveesDiffEl.workspace = workspace;
            this.updatesDialogEl.options = options;
            const value = await new Promise(resolve => {
                this.updatesDialogEl.resolved = value => {
                    this.showDiff = false;
                    resolve(value);
                };
            });
            this.dispatchEvent(new CustomEvent('dialogue-closed', { bubbles: true, composed: true }));
            this.showDiff = false;
            if (value === 'accept') {
                /** run the proposal changes as the logged user */
                await workspace.execute(this.client);
                await this.proposals.deleteProposal(this.proposalId);
                this.load();
                this.dispatchEvent(new ContentUpdatedEvent({
                    detail: { uref: this.proposal.toPerspectiveId },
                    bubbles: true,
                    composed: true
                }));
            }
            if (value === 'delete') {
                await this.proposals.deleteProposal(this.proposalId);
                this.load();
            }
        }
        renderDiff() {
            return litElement.html `
      <uprtcl-dialog id="updates-dialog">
        <evees-update-diff id="evees-update-diff"> </evees-update-diff>
      </uprtcl-dialog>
    `;
        }
        renderDefault() {
            return litElement.html `
      <div @click=${() => this.showProposalChanges()} class="row-container">
        <div class="proposal-name">
          ${this.authorId !== undefined
            ? litElement.html `
                <evees-author user-id=${this.authorId} show-name></evees-author>
              `
            : 'unknown'}
        </div>
        <div class="proposal-state">
          ${this.loading
            ? litElement.html `
                <uprtcl-loading></uprtcl-loading>
              `
            : this.canExecute
                ? litElement.html `
                <uprtcl-icon-button
                  icon=${this.executed ? 'done' : 'call_merge'}
                  ?disabled=${this.executed}
                ></uprtcl-icon-button>
              `
                : ''}
        </div>
      </div>
      ${this.showDiff ? this.renderDiff() : ''}
    `;
        }
        render() {
            if (this.loadingCreator) {
                return litElement.html `
        <div class=""><uprtcl-loading></uprtcl-loading></div>
      `;
            }
            let renderDefault = true;
            let lense = undefined;
            if (this.remote && this.remote.proposals && this.remote.proposals.lense !== undefined) {
                renderDefault = false;
                lense = this.remote.proposals.lense;
            }
            return renderDefault ? this.renderDefault() : lense().render({ proposalId: this.proposalId });
        }
        static get styles() {
            return litElement.css `
      :host {
        width: 100%;
      }
      .row-container {
        height: 100%;
        display: flex;
        flex-direction: row;
      }
      .proposal-name {
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .proposal-state {
        width: 140px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .proposal-state uprtcl-button {
        margin: 0 auto;
      }
    `;
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'proposal-id' }),
        __metadata("design:type", String)
    ], EveesProposalRow.prototype, "proposalId", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'remote-id' }),
        __metadata("design:type", String)
    ], EveesProposalRow.prototype, "remoteId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesProposalRow.prototype, "loading", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesProposalRow.prototype, "loadingCreator", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesProposalRow.prototype, "showDiff", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Object)
    ], EveesProposalRow.prototype, "authorId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesProposalRow.prototype, "canRemove", void 0);
    __decorate([
        litElement.query('#updates-dialog'),
        __metadata("design:type", commonUi.UprtclDialog)
    ], EveesProposalRow.prototype, "updatesDialogEl", void 0);
    __decorate([
        litElement.query('#evees-update-diff'),
        __metadata("design:type", EveesDiff)
    ], EveesProposalRow.prototype, "eveesDiffEl", void 0);

    /** An evees info with
     *  - one official remote with the official perspective
     *  - one defaultRemote with one perspective per user */
    class EveesInfoUserBased extends EveesInfoBase {
        constructor() {
            super(...arguments);
            this.logger = new microOrchestrator.Logger('EVEES-INFO-UserBased');
            this.showProposals = false;
            this.showDraftControl = false;
            this.showEditDraft = false;
            this.showInfo = false;
            this.showIcon = false;
            this.showAcl = false;
            this.showDebugInfo = false;
            this.checkOwner = false;
            this.officialId = undefined;
            this.mineId = undefined;
            this.creatingMine = false;
        }
        async firstUpdated() {
            await super.firstUpdated();
            this.load();
        }
        connectedCallback() {
            super.connectedCallback();
            this.logger.log('Connected', this.uref);
        }
        async disconnectedCallback() {
            super.disconnectedCallback();
            this.logger.log('Disconnected', this.uref);
        }
        /** overwrite  */
        updated(changedProperties) {
            if (changedProperties.has('uref')) {
                this.logger.info('updated() UserBased reload', { changedProperties });
                this.load();
            }
        }
        async load() {
            this.logger.info('load() UserBased', { uref: this.uref, firstRef: this.firstRef });
            await super.firstUpdated();
            await super.load();
            this.loading = true;
            /** from all the perspectives of this evee we must identify the official perspective and this
             * user perspective in the default remote  */
            const first = await multiplatform.loadEntity(this.client, this.firstRef);
            if (!first)
                throw new Error(`first perspective ${this.firstRef}`);
            const perspectiveIds = await this.getContextPerspectives(this.firstRef);
            const perspectives = (await Promise.all(perspectiveIds.map(perspectiveId => multiplatform.loadEntity(this.client, perspectiveId))));
            if (!this.defaultRemote)
                throw new Error('default remote not found');
            const defaultRemote = this.defaultRemote;
            if (!this.officialRemote)
                throw new Error('official remote not found');
            const officialRemote = this.officialRemote;
            const sortOnTimestamp = (p1, p2) => p1.object.payload.timestamp - p2.object.payload.timestamp;
            if (this.checkOwner) {
                const officials = perspectives.filter(p => p.object.payload.remote === officialRemote.id &&
                    p.object.payload.creatorId === this.officialOwner);
                const officialsSorted = officials.sort(sortOnTimestamp).reverse();
                this.officialId = officialsSorted.length > 0 ? officialsSorted[0].id : undefined;
            }
            else {
                this.officialId = this.firstRef;
            }
            const mines = perspectives.filter(p => p.object.payload.remote === defaultRemote.id &&
                p.object.payload.creatorId === defaultRemote.userId);
            /** the latest perspective is considered the "mine", other perspectives might exist and are listed under other */
            const minesSorted = mines.sort(sortOnTimestamp).reverse();
            this.mineId = minesSorted.length > 0 ? minesSorted[0].id : undefined;
            /** inform the parent whose the official, a bit ugly... but */
            this.dispatchEvent(new CustomEvent('official-id', {
                detail: {
                    perspectiveId: this.officialId
                },
                bubbles: false,
                composed: false
            }));
            this.isTheirs = this.uref !== this.mineId && this.uref !== this.officialId;
            this.isMine = this.uref === this.mineId;
            this.isOfficial = this.uref === this.officialId;
            /** check pull from official*/
            if (this.isMine && this.officialId !== undefined) {
                this.checkPull(this.officialId).then(() => {
                    this.hasPull = this.pullWorkspace !== undefined && this.pullWorkspace.hasUpdates();
                });
            }
            /** get the current perspective author */
            const nowPerspective = await multiplatform.loadEntity(this.client, this.uref);
            if (!nowPerspective)
                throw new Error(`official perspective ${this.uref}`);
            this.author = nowPerspective.object.payload.creatorId;
            /** force load of perspectives and proposals lists */
            if (this.eveesProposalsList && this.eveesProposalsList !== null)
                this.eveesProposalsList.load();
            if (this.perspectivesList)
                this.perspectivesList.load();
            this.showInfo = false;
            await this.updateComplete;
            this.showInfo = true;
            this.loading = false;
        }
        draftClicked() {
            if (this.mineId) {
                this.seeDraft();
            }
            else {
                this.createDraft();
            }
        }
        closePoppers() {
            if (this.proposalsPopper)
                this.proposalsPopper.showDropdown = false;
            if (this.perspectivesPopper)
                this.perspectivesPopper.showDropdown = false;
        }
        async createDraft() {
            this.closePoppers();
            this.creatingMine = true;
            await this.forkPerspective(this.officialId);
            this.creatingMine = false;
        }
        seeDraft() {
            this.closePoppers();
            this.checkoutPerspective(this.mineId);
        }
        async proposeDraft() {
            this.logger.log('propose draft');
            if (!this.officialId)
                throw new Error('can only propose to official');
            this.closePoppers();
            await this.otherPerspectiveMerge(this.uref, this.officialId);
            if (this.eveesProposalsList && this.eveesProposalsList !== null)
                this.eveesProposalsList.load();
        }
        seeOfficial() {
            this.closePoppers();
            this.checkoutPerspective(this.officialId);
        }
        async showPull() {
            this.logger.log('show pull');
            if (!this.pullWorkspace)
                throw new Error('pullWorkspace undefined');
            const options = {
                apply: {
                    text: 'apply',
                    icon: 'done',
                    skinny: false
                },
                close: {
                    text: 'close',
                    icon: 'clear',
                    skinny: true
                }
            };
            const result = await this.updatesDialog(this.pullWorkspace, options, this.renderFromToPerspective(this.uref, this.officialId));
            if (result !== 'apply') {
                return;
            }
            await this.pullWorkspace.execute(this.client);
            this.dispatchEvent(new ContentUpdatedEvent({
                detail: {
                    uref: this.uref
                },
                bubbles: true,
                composed: true
            }));
        }
        async optionOnMine(option) {
            switch (option) {
                case 'delete':
                    await this.deletePerspective();
                    break;
            }
            this.checkoutPerspective(this.officialId);
        }
        checkoutPerspective(perspectiveId) {
            this.closePoppers();
            this.dispatchEvent(new CustomEvent('checkout-perspective', {
                detail: {
                    perspectiveId: perspectiveId
                },
                composed: true,
                bubbles: true
            }));
        }
        color() {
            if (this.isOfficial) {
                return DEFAULT_COLOR;
            }
            else {
                return eveeColor(this.author);
            }
        }
        renderOtherPerspectives() {
            const hidePerspectives = [];
            if (this.officialId)
                hidePerspectives.push(this.officialId);
            if (this.mineId)
                hidePerspectives.push(this.mineId);
            return litElement.html `
      <div class="list-container">
        <evees-perspectives-list
          id="evees-perspectives-list"
          perspective-id=${this.uref}
          .hidePerspectives=${hidePerspectives}
          ?can-propose=${this.isLogged}
          @perspective-selected=${e => this.checkoutPerspective(e.detail.id)}
          @merge-perspective=${e => this.otherPerspectiveMerge(e.detail.perspectiveId, this.uref)}
        ></evees-perspectives-list>
      </div>
    `;
        }
        renderDraftControl() {
            const mineConfig = {
                delete: {
                    disabled: false,
                    text: 'delete',
                    icon: 'delete'
                }
            };
            return litElement.html `
      <uprtcl-button
        class="tab-button"
        ?skinny=${!this.isOfficial}
        @click=${() => (this.officialId !== undefined ? this.seeOfficial() : undefined)}
        ?disabled=${this.officialId === undefined}
        transition
      >
        official
      </uprtcl-button>
      ${this.isLogged && this.isLoggedOnDefault
            ? litElement.html `
            <uprtcl-icon-button
              button
              class=${this.isTheirs || this.isMine
                ? 'margin-left-small highlighted'
                : 'margin-left-small'}
              icon="menu_open"
              @click=${() => (this.isTheirs || this.isMine ? this.proposeDraft() : undefined)}
              ?disabled=${this.isOfficial || this.officialId === undefined}
              style=${`--background-color: ${this.isTheirs || this.isMine ? this.color() : 'initial'}`}
              ?loading=${this.merging}
            >
            </uprtcl-icon-button>
            <uprtcl-icon-button
              button
              class=${this.hasPull ? 'margin-left-small highlighted' : 'margin-left-small'}
              icon="menu_open_180"
              @click=${() => (this.isMine && this.hasPull ? this.showPull() : undefined)}
              ?disabled=${!this.hasPull}
              style=${`--background-color: ${this.isTheirs || this.isMine ? this.color() : 'initial'}`}
            >
            </uprtcl-icon-button>
          `
            : ''}
      ${this.isLoggedOnDefault
            ? litElement.html `
            <div class="mine-and-settings">
              <uprtcl-button-loading
                ?skinny=${!this.isMine}
                @click=${() => this.draftClicked()}
                class="margin-left-small tab-button"
                style=${`--background-color: ${this.isMine ? this.color() : 'initial'}`}
                ?loading=${this.creatingMine}
                transition
              >
                mine
              </uprtcl-button-loading>
              ${this.isMine && this.showEditDraft
                ? litElement.html `
                    <div class="options-menu-container">
                      <uprtcl-options-menu
                        icon="settings"
                        class="options-menu"
                        style=${`--background-color: ${this.isMine ? this.color() : 'initial'}`}
                        @option-click=${e => this.optionOnMine(e.detail.key)}
                        .config=${mineConfig}
                      >
                      </uprtcl-options-menu>
                    </div>
                  `
                : ''}
            </div>
          `
            : ''}

      <uprtcl-popper
        id="perspectives-popper"
        position="bottom-left"
        class="perspectives-popper margin-left"
      >
        <uprtcl-button
          slot="icon"
          icon="arrow_drop_down"
          ?skinny=${!this.isTheirs}
          style=${`--background-color: ${this.isTheirs ? this.color() : 'initial'}`}
          class="tab-other"
          transition
          >${this.isTheirs
            ? litElement.html `
                <evees-author
                  show-name
                  user-id=${this.author}
                  show-name
                  short
                  color=${eveeColor(this.uref)}
                ></evees-author>
              `
            : litElement.html `
                other
              `}
        </uprtcl-button>
        ${this.renderOtherPerspectives()}
      </uprtcl-popper>
    `;
        }
        renderProposals() {
            return litElement.html `
      <div class="list-container">
        ${!this.loading && this.officialId
            ? litElement.html `
              <evees-proposals-list
                id="evees-proposals-list"
                perspective-id=${this.officialId}
                @dialogue-closed=${() => (this.proposalsPopper.showDropdown = false)}
              ></evees-proposals-list>
            `
            : litElement.html `
              <uprtcl-loading></uprtcl-loading>
            `}
      </div>
    `;
        }
        renderPermissions() {
            return litElement.html `
      <div class="perspectives-permissions">
        ${!this.loading
            ? this.remote.accessControl.lense().render({ uref: this.uref, parentId: this.parentId })
            : ''}
      </div>
    `;
        }
        render() {
            if (this.perspectiveData === undefined)
                return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
            return litElement.html `
      <div class="left-buttons">
        ${this.showInfo
            ? litElement.html `
              <uprtcl-popper
                icon="info"
                id="info-popper"
                position="bottom-left"
                class="info-popper margin-right"
              >
                ${this.showIcon
                ? litElement.html `
                      <div class="icon-container">${this.renderIcon()}</div>
                    `
                : ''}
                ${this.showAcl
                ? litElement.html `
                      <div class="permissions-container">${this.renderPermissions()}</div>
                    `
                : ''}
                ${this.showDebugInfo ? this.renderInfo() : ''}
              </uprtcl-popper>
            `
            : ''}
        ${this.showProposals
            ? litElement.html `
              <uprtcl-popper id="proposals-popper" position="bottom-left" class="proposals-popper">
                <uprtcl-button
                  slot="icon"
                  class="proposals-button"
                  icon="arrow_drop_down"
                  skinny
                  transition
                >
                  proposals
                </uprtcl-button>
                ${this.renderProposals()}
              </uprtcl-popper>
            `
            : ''}
      </div>
      <div class="center-buttons">
        ${this.showDraftControl ? this.renderDraftControl() : ''}
      </div>
      ${this.showUpdatesDialog ? this.renderUpdatesDialog() : ''}
    `;
        }
        static get styles() {
            return super.styles.concat([
                litElement.css `
        :host {
          display: flex;
          flex-direction: row;
        }
        .proposals-popper {
          --box-width: 340px;
        }
        .info-popper {
          --max-height: 70vh;
          --overflow: auto;
        }
        .perspectives-popper {
          --box-width: 340px;
        }
        .proposals-button {
          width: 150px;
        }
        .margin-left {
          margin-left: 10px;
        }
        .margin-left-small {
          margin-left: 4px;
        }
        .margin-right {
          margin-right: 10px;
        }
        .tab-button {
          width: 120px;
        }
        .mine-and-settings {
          width: 142px;
          display: flex;
          align-items: center;
        }
        .tab-other {
          width: 160px;
        }
        .left-buttons {
          flex: 0 0 auto;
          display: flex;
        }
        .center-buttons {
          flex: 1 1 auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .highlighted {
          --background-color: #00b31e;
        }
        .permissions-container {
          padding: 12px;
          border-bottom: solid 1px #cccccc;
        }
        .icon-container {
          margin: 0 auto;
          padding: 12px;
        }
        .options-menu-container {
          margin-left: -18px;
          border: solid 2px white;
          border-radius: 20px;
        }
      `
            ]);
        }
    }
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-proposals' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "showProposals", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-draft' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "showDraftControl", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-edit-draft' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "showEditDraft", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-info' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "showInfo", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-icon' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "showIcon", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-acl' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "showAcl", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'show-debug' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "showDebugInfo", void 0);
    __decorate([
        litElement.property({ type: String, attribute: 'official-owner' }),
        __metadata("design:type", String)
    ], EveesInfoUserBased.prototype, "officialOwner", void 0);
    __decorate([
        litElement.property({ type: Boolean, attribute: 'check-owner' }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "checkOwner", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Object)
    ], EveesInfoUserBased.prototype, "officialId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Object)
    ], EveesInfoUserBased.prototype, "mineId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", String)
    ], EveesInfoUserBased.prototype, "author", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "isTheirs", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "isMine", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "isOfficial", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "hasPull", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesInfoUserBased.prototype, "creatingMine", void 0);
    __decorate([
        litElement.query('#proposals-popper'),
        __metadata("design:type", commonUi.UprtclPopper)
    ], EveesInfoUserBased.prototype, "proposalsPopper", void 0);
    __decorate([
        litElement.query('#perspectives-popper'),
        __metadata("design:type", commonUi.UprtclPopper)
    ], EveesInfoUserBased.prototype, "perspectivesPopper", void 0);
    __decorate([
        litElement.query('#evees-perspectives-list'),
        __metadata("design:type", EveesPerspectivesList)
    ], EveesInfoUserBased.prototype, "perspectivesList", void 0);
    __decorate([
        litElement.query('#evees-proposals-list'),
        __metadata("design:type", ProposalsList)
    ], EveesInfoUserBased.prototype, "eveesProposalsList", void 0);

    /**
     * Configure a _Prtcl Evees module with the given service providers
     *
     * Example usage:
     *
     * ```ts
     * import { MicroOrchestrator } from '@uprtcl/micro-orchestrator';
     * import { IpfsStore } from '@uprtcl/ipfs-provider';
     * import { HttpConnection } from '@uprtcl/http-provider';
     * import { EthereumConnection } from '@uprtcl/ethereum-provider';
     * import { EveesModule, EveesEthereum, EveesHttp } from '@uprtcl/evees';
     *
     * const ipfsConfig = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' };
     *
     * const cidConfig = { version: 1, type: 'sha2-256', codec: 'raw', base: 'base58btc' };
     *
     * // Don't put anything on host to get from Metamask's ethereum provider
     * const ethConnection = new EthereumConnection({});
     *
     * const eveesEth = new EveesEthereum(ethConnection, ipfsConfig, cidConfig);
     *
     * const httpConnection = new HttpConnection();
     *
     * const httpEvees = new EveesHttp('http://localhost:3100/uprtcl/1', httpConnection, ethConnection, cidConfig);
     *
     * const evees = new EveesModule([httpEvees, eveesEth], httpEvees);
     *
     * const orchestrator = new MicroOrchestrator();
     *
     * await orchestrator.loadModule(evees);
     * ```
     *
     *
     * @param eveesProviders array of remote services that implement Evees behaviour
     * @param defaultRemote default remote service to which to create Perspective and Commits
     */
    class EveesModule extends microOrchestrator.MicroModule {
        constructor(eveesProviders, config) {
            super();
            this.eveesProviders = eveesProviders;
            this.config = config;
            this.dependencies = [];
        }
        async onLoad(container) {
            container.bind(EveesModule.bindings.Evees).to(exports.Evees);
            container.bind(EveesModule.bindings.MergeStrategy).to(exports.RecursiveContextMergeStrategy);
            /** set first remote as default remote, the second as official remote, and only the
             * first remote ad editable by default */
            this.config = this.config || {};
            this.config.defaultRemote = this.config.defaultRemote
                ? this.config.defaultRemote[0]
                : this.eveesProviders[0];
            this.config.officialRemote = this.config.officialRemote
                ? this.config.officialRemote
                : this.eveesProviders.length > 1
                    ? this.eveesProviders[1]
                    : this.eveesProviders[0];
            this.config.editableRemotesIds = this.config.editableRemotesIds
                ? this.config.editableRemotesIds
                : [this.eveesProviders[0].id];
            container.bind(EveesModule.bindings.Config).toConstantValue(this.config);
            for (const remote of this.eveesProviders) {
                container.bind(EveesModule.bindings.EveesRemote).toConstantValue(remote);
                container.bind(EveesModule.bindings.Remote).toConstantValue(remote);
            }
            customElements.define('evees-commit-history', CommitHistory);
            customElements.define('evees-info-popper', EveesInfoPopper);
            customElements.define('evees-info-page', EveesInfoPage);
            customElements.define('evees-info-user-based', EveesInfoUserBased);
            customElements.define('evees-perspectives-list', EveesPerspectivesList);
            customElements.define('evees-proposals-list', ProposalsList);
            customElements.define('evees-update-diff', EveesDiff);
            customElements.define('evees-proposal-diff', EveesProposalDiff);
            customElements.define('evees-author', EveesAuthor);
            customElements.define('evees-login-widget', EveesLoginWidget);
            customElements.define('evees-proposal-row', EveesProposalRow);
            customElements.define('evees-perspective-icon', EveesPerspectiveIcon);
        }
        get submodules() {
            return [
                new graphql.GraphQlSchemaModule(eveesTypeDefs, eveesResolvers),
                new microOrchestrator.i18nextModule('evees', { en: en }),
                new cortex.PatternsModule([
                    new CommitPattern([exports.CommitLinked]),
                    new PerspectivePattern([exports.PerspectiveLinks])
                ]),
                new multiplatform.CASModule(this.eveesProviders.map(p => p.store)),
                new commonUi.CommonUIModule()
            ];
        }
    }
    EveesModule.id = 'evees-module';
    EveesModule.bindings = EveesBindings;

    class EveesContentModule extends microOrchestrator.MicroModule {
        constructor(stores = []) {
            super();
            this.stores = stores;
            this.dependencies = [EveesModule.id];
        }
        async onLoad(container) {
            this.stores.forEach((storeOrId) => {
                const store = typeof storeOrId === 'object' && storeOrId.casID
                    ? storeOrId
                    : container.get(storeOrId);
                if (this.providerIdentifier) {
                    container.bind(this.providerIdentifier).toConstantValue(store);
                }
            });
        }
        get submodules() {
            return [new multiplatform.CASModule(this.stores.filter((store) => store.casID))];
        }
    }

    class EveesDB extends Dexie__default['default'] {
        constructor() {
            super('uprtcl');
            this.version(0.1).stores({
                drafts: ''
            });
            this.drafts = this.table('drafts');
        }
    }

    class EveesDraftsLocal {
        constructor() {
            this.eveesDB = new EveesDB();
        }
        removeDraft(objectId) {
            return this.eveesDB.drafts.delete(objectId);
        }
        getDraft(objectId) {
            return this.eveesDB.drafts.get(objectId);
        }
        async setDraft(objectId, draft) {
            delete draft['id'];
            await this.eveesDB.drafts.put(draft, objectId);
        }
    }

    class EveesPerspectiveIcon extends microOrchestrator.moduleConnect(litElement.LitElement) {
        constructor() {
            super(...arguments);
            this.loading = true;
        }
        async firstUpdated() {
            this.client = this.request(graphql.ApolloClientModule.bindings.Client);
            this.remotes = this.requestAll(EveesBindings.EveesRemote);
            this.load();
        }
        updated(changedProperties) {
            if (changedProperties.has('perspectiveId')) {
                this.load();
            }
        }
        async load() {
            this.loading = true;
            const perspective = await multiplatform.loadEntity(this.client, this.perspectiveId);
            if (!perspective)
                throw new Error('perspective undefined');
            const remote = this.remotes.find(r => r.id === perspective.object.payload.remote);
            if (!remote)
                throw new Error('remote undefined');
            this.perspective = perspective;
            this.remote = remote;
            this.loading = false;
        }
        render() {
            if (this.loading) {
                return litElement.html `
        <uprtcl-loading></uprtcl-loading>
      `;
            }
            return litElement.html `
      <div class="row">
        <b class="tag-text">id</b>
        <span class="perspective-id"
          >${this.perspectiveId.substr(0, 6)}...${this.perspectiveId.slice(this.perspectiveId.length - 6)}</span
        >
      </div>
      ${this.perspective.object.payload.creatorId
            ? litElement.html `
            <div class="row">
              ${this.remote.userId === this.perspective.object.payload.creatorId
                ? litElement.html `
                    <b class="tag-text">yours</b>
                  `
                : litElement.html `
                    <b class="tag-text">by</b>
                    <evees-author
                      user-id=${this.perspective.object.payload.creatorId}
                      show-name
                    ></evees-author>
                  `}
            </div>
          `
            : ''}
      <div class="row">
        <b class="tag-text">on</b>
        <div class="remote-icon">
          ${this.remote.icon
            ? litElement.html `
                ${this.remote.icon()}
              `
            : litElement.html `
                remote
                <pre>${this.perspective.object.payload.remote}</pre>
              `}
        </div>
      </div>
    `;
        }
        static get styles() {
            return [
                litElement.css `
        :host {
          display: flex;
          width: fit-content;
          flex-direction: column;
          align-items: start;
          width: 100%;
          font-size: 15px;
        }
        .row {
          display: flex;
          align-items: center;
          height: 35px;
        }
        .tag-text {
          color: #cccccc;
        }
        evees-author {
          margin-left: 8px;
        }
        .remote-icon {
          margin-left: 6px;
        }
        .perspective-id {
          color: var(--color, rgb(99, 102, 104));
          font-weight: 600;
          letter-spacing: 0.015em;
          display: block;
          overflow: hidden;
          white-space: nowrap;
          margin-left: 12px;
        }
      `
            ];
        }
    }
    __decorate([
        litElement.property({ type: String, attribute: 'perspective-id' }),
        __metadata("design:type", String)
    ], EveesPerspectiveIcon.prototype, "perspectiveId", void 0);
    __decorate([
        litElement.property({ attribute: false }),
        __metadata("design:type", Boolean)
    ], EveesPerspectiveIcon.prototype, "loading", void 0);

    const isAncestorOf = (client) => async (ancestorId, commitId) => {
        if (ancestorId === commitId)
            return true;
        const result = await client.query({
            query: apolloBoost.gql `{
      entity(uref: "${commitId}") {
        id
        ... on Commit {
          parentCommits {
            id
          }
        }
      }
    }`,
        });
        const parentsIds = result.data.entity.parentCommits.map((p) => p.id);
        if (parentsIds.includes(ancestorId)) {
            return true;
        }
        else {
            /** recursive call */
            for (let ix = 0; ix < parentsIds.length; ix++) {
                if (await isAncestorOf(client)(ancestorId, parentsIds[ix])) {
                    return true;
                }
            }
        }
        return false;
    };

    exports.CONTENT_UPDATED_TAG = CONTENT_UPDATED_TAG;
    exports.CREATE_ENTITY = CREATE_ENTITY;
    exports.CREATE_PERSPECTIVE = CREATE_PERSPECTIVE;
    exports.CREATE_PROPOSAL = CREATE_PROPOSAL;
    exports.CommitHistory = CommitHistory;
    exports.CommitPattern = CommitPattern;
    exports.ContentUpdatedEvent = ContentUpdatedEvent;
    exports.DEFAULT_COLOR = DEFAULT_COLOR;
    exports.EveesBindings = EveesBindings;
    exports.EveesContentModule = EveesContentModule;
    exports.EveesDiff = EveesDiff;
    exports.EveesDraftsLocal = EveesDraftsLocal;
    exports.EveesHelpers = EveesHelpers;
    exports.EveesInfoBase = EveesInfoBase;
    exports.EveesInfoPage = EveesInfoPage;
    exports.EveesInfoPopper = EveesInfoPopper;
    exports.EveesInfoUserBased = EveesInfoUserBased;
    exports.EveesModule = EveesModule;
    exports.EveesPerspectiveIcon = EveesPerspectiveIcon;
    exports.EveesPerspectivesList = EveesPerspectivesList;
    exports.EveesWorkspace = EveesWorkspace;
    exports.PROPOSAL_CREATED_TAG = PROPOSAL_CREATED_TAG;
    exports.PerspectivePattern = PerspectivePattern;
    exports.ProposalsList = ProposalsList;
    exports.SpliceChildrenEvent = SpliceChildrenEvent;
    exports.UPDATE_HEAD = UPDATE_HEAD;
    exports.UpdateContentEvent = UpdateContentEvent;
    exports.deriveEntity = deriveEntity;
    exports.deriveSecured = deriveSecured;
    exports.eveeColor = eveeColor;
    exports.extractSignedEntity = extractSignedEntity;
    exports.hashObject = hashObject;
    exports.isAncestorOf = isAncestorOf;
    exports.mergeResult = mergeResult;
    exports.mergeStrings = mergeStrings;
    exports.prettyAddress = prettyAddress;
    exports.signObject = signObject;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=uprtcl-evees.umd.js.map
