"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBotCacheWrapper = void 0;
class BaseBotCacheWrapper {
    constructor(cache) {
        this.__cache = cache;
    }
    get(key) {
        return this.__cache.get(BaseBotCacheWrapper.getKey(this.getPrefix(), key));
    }
    getOrAdd(key, createCall) {
        return this.getOrAddWithTtl(key, createCall, 1000);
    }
    getOrAddWithTtl(key, createCall, ttl) {
        let result = this.get(key);
        if (result == undefined) {
            result = createCall();
            this.setWithTtl(key, result, ttl);
        }
        return result;
    }
    set(key, value) {
        return this.setWithTtl(key, value, 1000);
    }
    setWithTtl(key, value, ttl) {
        return this.__cache.set(BaseBotCacheWrapper.getKey(this.getPrefix(), key), value, ttl);
    }
    static getKey(prefix, key) {
        return `${prefix}.${key}`;
    }
}
exports.BaseBotCacheWrapper = BaseBotCacheWrapper;
