import NodeCache from "node-cache";

export abstract class BaseBotCacheWrapper {
   private readonly __cache : NodeCache;

    protected constructor(cache: NodeCache) {
        this.__cache = cache
    }

    get<T>(key : string) : T | undefined {
        return this.__cache.get<T>(BaseBotCacheWrapper.getKey(this.getPrefix(), key));
    }

    getOrAdd<T>(key: string, createCall : () => T) : T  {
        return this.getOrAddWithTtl(key, createCall, 1000);
    }

    getOrAddWithTtl<T>(key: string, createCall : () => T, ttl : number) : T  {
        let result = this.get<T>(key);
        if (result == undefined) {
            result = createCall();
            this.setWithTtl(key, result, ttl);
        }

        return result;
    }

    set<T>(key: string, value : T) : boolean {
        return this.setWithTtl(key, value, 1000);
    }

    setWithTtl<T>(key: string, value : T, ttl : number ) : boolean {
        return this.__cache.set(BaseBotCacheWrapper.getKey(this.getPrefix(), key), value, ttl);
    }

    protected abstract getPrefix() : string;

    private static getKey(prefix : string, key: string) : string {
        return `${prefix}.${key}`;
    }
}
