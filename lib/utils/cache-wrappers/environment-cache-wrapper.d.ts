import { BaseBotCacheWrapper } from "./base-cache-wrapper";
import NodeCache from "node-cache";
export declare class EnvironmentCacheWrapper extends BaseBotCacheWrapper {
    constructor(cache: NodeCache);
    protected getPrefix(): string;
}
