"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentCacheWrapper = void 0;
const base_cache_wrapper_1 = require("./base-cache-wrapper");
class EnvironmentCacheWrapper extends base_cache_wrapper_1.BaseBotCacheWrapper {
    constructor(cache) {
        super(cache);
    }
    getPrefix() {
        return "envs";
    }
}
exports.EnvironmentCacheWrapper = EnvironmentCacheWrapper;
