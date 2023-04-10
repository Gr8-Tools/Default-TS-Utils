import {assertInt, assertNonNullable} from "./assertions";
import NodeCache from "node-cache";
import {Container} from "typedi";
import {EnvironmentCacheWrapper} from "./cache-wrappers/environment-cache-wrapper";
import {readFileSync} from "fs";

export class EnvVar {
    static getCache() : EnvironmentCacheWrapper {
        if (!Container.has("cache")) {
            Container.set("cache", new NodeCache());
        }
        const cache = Container.get<NodeCache>("cache");
        return new EnvironmentCacheWrapper(cache);
    }

    static isProduction(cache: EnvironmentCacheWrapper) : boolean {
        function cacheProductionValue() : boolean {
            const value = EnvVar.tryGetStringInternal("ENVIRONMENT", false) ?? 'Production';
            return value === 'Production';
        }

        return cache.getOrAdd('prod', cacheProductionValue)
    }

    static tryGetString(key: string, raw : boolean = false) : string | null | undefined {
        const cache = this.getCache();
        function cacheValue() : string | null | undefined {
            return EnvVar.tryGetStringInternal(key, EnvVar.needLoadFromSecret(cache, raw)) ?? '';
        }
        return cache.getOrAdd(key, cacheValue);
    }

    static getString(key: string, raw : boolean = false) : string {
        const cache = this.getCache();
        function cacheValue() : string {
            return EnvVar.getStringInternal(key, EnvVar.needLoadFromSecret(cache, raw));
        }
        return cache.getOrAdd(key, cacheValue);
    }

    static getInt(key: string, raw : boolean = false) : number {
        const cache = this.getCache();
        function cacheValue() : number {
            return EnvVar.getIntInternal(key, EnvVar.needLoadFromSecret(cache, raw));
        }
        return cache.getOrAdd(key, cacheValue);
    }

    private static tryGetStringInternal(key: string, fromSecret: boolean) : string | null | undefined {
        const envValue = process.env[key];
        if(fromSecret && envValue != undefined) {
            return readFileSync(envValue, 'utf-8');
        } else {
            return envValue;
        }
    }

    private static getStringInternal(key: string, fromSecret: boolean) : string {
        const nullableEnvVar = this.tryGetStringInternal(key, fromSecret);
        assertNonNullable(key.toString(), nullableEnvVar);

        return nullableEnvVar!;
    }

    private static getIntInternal(key: string, fromSecret: boolean) : number {
        const keyName = key.toString();

        const envValue = process.env[key];
        let envVar: string | undefined;
        if(fromSecret && envValue != undefined) {
            envVar = readFileSync(envValue, 'utf-8');
        } else {
            envVar = envValue;
        }
        assertNonNullable(keyName, envVar);

        const result = parseInt(envVar);
        assertInt(keyName, result);

        return result;
    }

    private static needLoadFromSecret(cache: EnvironmentCacheWrapper, raw : boolean){
        return EnvVar.isProduction(cache) && !raw;
    }
}
