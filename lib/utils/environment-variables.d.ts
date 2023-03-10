import { EnvironmentCacheWrapper } from "./cache-wrappers/environment-cache-wrapper";
export declare class EnvVar {
    static getCache(): EnvironmentCacheWrapper;
    static isProduction(cache: EnvironmentCacheWrapper): boolean;
    static tryGetString(key: string, raw?: boolean): string | null | undefined;
    static getString(key: string, raw?: boolean): string;
    static getInt(key: string, raw?: boolean): number;
    private static tryGetStringInternal;
    private static getStringInternal;
    private static getIntInternal;
    private static needLoadFromSecret;
}
