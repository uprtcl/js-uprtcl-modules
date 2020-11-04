import { EveesRemote, Perspective } from "@uprtcl/evees";
import { CASStore } from "@uprtcl/multiplatform";

export class EveesReader {
  constructor(protected remotes: EveesRemote[], protected store: CASStore) {}

  async resolve(uref: string) {
    const perspective = (await this.store.get(uref)) as any | undefined;
    if (!perspective) throw new Error(`Perspective payload not found ${uref}`);

    const remote = this.remotes.find(
      (r) => r.id === perspective.object.payload.remote
    );
    if (!remote) throw new Error(`Remote ${perspective.payload.remote}`);
    const details = await remote.getPerspective(uref);
    const commit = details.headId
      ? ((await this.store.get(details.headId)) as any)
      : undefined;
    const data =
      commit && commit.dataId ? await this.store.get(commit.dataId) : undefined;

    return {
      perspective,
      commit,
      data,
    };
  }
}
