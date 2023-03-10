import NodeCache from "node-cache";
export declare abstract class BaseBotCacheWrapper {
    private readonly __cache;
    protected constructor(cache: NodeCache);
    get<T>(key: string): T | undefined;
    getOrAdd<T>(key: string, createCall: () => T): T;
    getOrAddWithTtl<T>(key: string, createCall: () => T, ttl: number): T;
    set<T>(key: string, value: T): boolean;
    setWithTtl<T>(key: string, value: T, ttl: number): boolean;
    protected abstract getPrefix(): string;
    private static getKey;
}
