import { ethers } from 'ethers';
import IPFS from 'ipfs';
import { env } from '../env';

import {
  MicroOrchestrator,
  i18nextBaseModule,
} from '@uprtcl/micro-orchestrator';
import { LensesModule } from '@uprtcl/lenses';
import { DocumentsModule } from '@uprtcl/documents';
import { WikisModule } from '@uprtcl/wikis';

import { CortexModule } from '@uprtcl/cortex';
import { EveesModule } from '@uprtcl/evees';
import { IpfsStore } from '@uprtcl/ipfs-provider';

import {
  EveesBlockchainCached,
  EveesBlockchainModule,
} from '@uprtcl/evees-blockchain';
import {
  EthereumOrbitDBIdentity,
  EveesEthereumConnection,
} from '@uprtcl/evees-ethereum';

import { EthereumConnection } from '@uprtcl/ethereum-provider';

import { ApolloClientModule } from '@uprtcl/graphql';
import { DiscoveryModule } from '@uprtcl/multiplatform';

import { OrbitDBCustom, AddressMapping } from '@uprtcl/orbitdb-provider';
import {
  EveesOrbitDB,
  EveesOrbitDBModule,
  ProposalsOrbitDB,
  PerspectiveStore,
  ContextStore,
  ProposalStore,
  ProposalsToPerspectiveStore,
  getContextAcl,
  getProposalsAcl,
} from '@uprtcl/evees-orbitdb';

import { EveesReader } from '@uprtcl/evees-reader';

import { SimpleWiki } from './simple-wiki';

(async function () {
  const ipfsCidConfig = {
    version: 1,
    type: 'sha2-256',
    codec: 'raw',
    base: 'base58btc',
  };

  const ipfsJSConfig = {
    preload: { enabled: false },
    relay: { enabled: true, hop: { enabled: true, active: true } },
    EXPERIMENTAL: { pubsub: true },
    config: {
      init: true,
      Addresses: {
        Swarm: env.pinner.Swarm,
      },
      Bootstrap: env.pinner.Bootstrap,
    },
  };

  const orchestrator = new MicroOrchestrator();

  const ipfs = await IPFS.create(ipfsJSConfig);

  console.log('connecting to pinner peer');
  await ipfs.swarm.connect(env.pinner.peerMultiaddr);
  console.log(`connected to ${env.pinner.peerMultiaddr}`);

  const ipfsStore = new IpfsStore(ipfsCidConfig, ipfs, env.pinner.url);
  await ipfsStore.ready();

  const ethConnection = new EthereumConnection({
    provider: env.ethers.provider,
  });
  await ethConnection.ready();
  const identity = new EthereumOrbitDBIdentity(ethConnection);

  const identitySources = [identity];
  const contextAcl = getContextAcl(identitySources);
  const proposalsAcl = getProposalsAcl(identitySources);
  const customStores = [
    PerspectiveStore,
    ContextStore,
    ProposalStore,
    ProposalsToPerspectiveStore,
    AddressMapping,
  ];

  const orbitDBCustom = new OrbitDBCustom(
    customStores,
    [contextAcl, proposalsAcl],
    identity,
    env.pinner.url,
    env.pinner.peerMultiaddr,
    ipfs
  );
  await orbitDBCustom.ready();

  const orbitdbEvees = new EveesOrbitDB(orbitDBCustom, ipfsStore);
  await orbitdbEvees.connect();

  const proposals = new ProposalsOrbitDB(orbitDBCustom, ipfsStore);
  const ethEveesConnection = new EveesEthereumConnection(ethConnection);
  await ethEveesConnection.ready();

  const ethEvees = new EveesBlockchainCached(
    ethEveesConnection,
    orbitDBCustom,
    ipfsStore,
    proposals
  );
  await ethEvees.ready();

  const evees = new EveesModule([orbitdbEvees, ethEvees]);

  const documents = new DocumentsModule();
  const wikis = new WikisModule();

  const reader = new EveesReader([orbitdbEvees, ethEvees], ipfsStore);

  const uref = '';
  if (uref) {
    const read = await reader.resolve(uref);
    console.log(`Read ${uref}`, read);
  }

  const modules = [
    new i18nextBaseModule(),
    new ApolloClientModule(),
    new CortexModule(),
    new DiscoveryModule([orbitdbEvees.casID]),
    new LensesModule(),
    new EveesBlockchainModule(),
    new EveesOrbitDBModule(),
    evees,
    documents,
    wikis,
  ];

  await orchestrator.loadModules(modules);

  /*** add other services to the container */
  orchestrator.container
    .bind('official-connection')
    .toConstantValue(ethConnection);

  console.log(orchestrator);
  customElements.define('simple-wiki', SimpleWiki);
})();
