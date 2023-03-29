import NodeCache from "node-cache";

const KEY_SEPARATOR : string = ".";

export abstract class BaseCacheWrapper {
   private readonly __cache : NodeCache;

    protected constructor(cache: NodeCache) {
        this.__cache = cache
    }

    get<T>(key : string) : T | undefined {
        return this.__cache.get<T>(BaseCacheWrapper.getKey(this.getPrefix(), key));
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

    getKeyValueMap<T>(valueFilter : (x : T) => boolean = x => true) : Map<string, T> {
        const map = new Map<string, T>();
        const keys = this.__cache.keys();
        const prefix = `${this.getPrefix()}${KEY_SEPARATOR}`;

        for(let key of keys) {
            if (key.startsWith(prefix)) {
                const keyWithoutPrefix = key.substring(prefix.length);
                const value = this.__cache.get<T>(key);
                if (value != undefined && valueFilter(value)) {
                    map.set(keyWithoutPrefix, value);
                }
            }
        }

        return map;
    }

    set<T>(key: string, value : T) : boolean {
        return this.setWithTtl(key, value, 1000);
    }

    setWithTtl<T>(key: string, value : T, ttl : number ) : boolean {
        return this.__cache.set(BaseCacheWrapper.getKey(this.getPrefix(), key), value, ttl);
    }

    protected abstract getPrefix() : string;

    private static getKey(prefix : string, key: string) : string {
        return `${prefix}${KEY_SEPARATOR}${key}`;
    }
}
