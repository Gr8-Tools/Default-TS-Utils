import {BaseCacheWrapper} from "./base-cache-wrapper";
import NodeCache from "node-cache";

export class EnvironmentCacheWrapper extends BaseCacheWrapper {
    constructor(cache: NodeCache) {
        super(cache);
    }

    protected override getPrefix(): string {
        return "envs";
    }
}
