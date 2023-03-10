import { BodyInit } from 'node-fetch';
export declare class FetchWrapper<T extends FetchWrapper<T>> {
    static CONTENT_TYPE_HEADER: string;
    protected readonly __url: string;
    protected readonly __headers: Record<string, string>;
    protected readonly __queryParams: Map<string, string>;
    protected __urlExtend: string;
    constructor(baseUrl: string);
    setContentType(value: string): FetchWrapper<T>;
    setHeader(key: string, value: string): FetchWrapper<T>;
    clearHeaders(...excludeKeys: string[]): FetchWrapper<T>;
    extendUrl(key: string, value: string): FetchWrapper<T>;
    appendToUrl(urlTail: string): FetchWrapper<T>;
    clearUrlExtend(): FetchWrapper<T>;
    setQueryParams(map: Map<string, string>): FetchWrapper<T>;
    setQueryParam(key: string, value: string): FetchWrapper<T>;
    clearQueryParam(...excludeKeys: string[]): FetchWrapper<T>;
    sendRequest(method: string, body?: BodyInit | null): Promise<any>;
}
