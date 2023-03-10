"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVar = void 0;
const assertions_1 = require("./assertions");
const typedi_1 = require("typedi");
const environment_cache_wrapper_1 = require("./cache-wrappers/environment-cache-wrapper");
const fs_1 = require("fs");
class EnvVar {
    static getCache() {
        const cache = typedi_1.Container.get("cache");
        return new environment_cache_wrapper_1.EnvironmentCacheWrapper(cache);
    }
    static isProduction(cache) {
        function cacheProductionValue() {
            var _a;
            const value = (_a = EnvVar.tryGetStringInternal("ENVIRONMENT", false)) !== null && _a !== void 0 ? _a : 'Production';
            return value === 'Production';
        }
        return cache.getOrAdd('prod', cacheProductionValue);
    }
    static tryGetString(key, raw = false) {
        const cache = this.getCache();
        function cacheValue() {
            var _a;
            return (_a = EnvVar.tryGetStringInternal(key, EnvVar.needLoadFromSecret(cache, raw))) !== null && _a !== void 0 ? _a : '';
        }
        return cache.getOrAdd(key, cacheValue);
    }
    static getString(key, raw = false) {
        const cache = this.getCache();
        function cacheValue() {
            return EnvVar.getStringInternal(key, EnvVar.needLoadFromSecret(cache, raw));
        }
        return cache.getOrAdd(key, cacheValue);
    }
    static getInt(key, raw = false) {
        const cache = this.getCache();
        function cacheValue() {
            return EnvVar.getIntInternal(key, EnvVar.needLoadFromSecret(cache, raw));
        }
        return cache.getOrAdd(key, cacheValue);
    }
    static tryGetStringInternal(key, fromSecret) {
        const envValue = process.env[key];
        if (fromSecret && envValue != undefined) {
            return (0, fs_1.readFileSync)(envValue, 'utf-8');
        }
        else {
            return envValue;
        }
    }
    static getStringInternal(key, fromSecret) {
        const nullableEnvVar = this.tryGetStringInternal(key, fromSecret);
        (0, assertions_1.assertNonNullable)(key.toString(), nullableEnvVar);
        return nullableEnvVar;
    }
    static getIntInternal(key, fromSecret) {
        const keyName = key.toString();
        const envValue = process.env[key];
        let envVar;
        if (fromSecret && envValue != undefined) {
            envVar = (0, fs_1.readFileSync)(envValue, 'utf-8');
        }
        else {
            envVar = envValue;
        }
        (0, assertions_1.assertNonNullable)(keyName, envVar);
        const result = parseInt(envVar);
        (0, assertions_1.assertInt)(keyName, result);
        return result;
    }
    static needLoadFromSecret(cache, raw) {
        return EnvVar.isProduction(cache) && !raw;
    }
}
exports.EnvVar = EnvVar;
