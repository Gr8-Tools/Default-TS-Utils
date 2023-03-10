"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWrapper = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class FetchWrapper {
    constructor(baseUrl) {
        this.__url = baseUrl;
        this.__headers = {};
        this.__queryParams = new Map();
    }
    /* Устанавливает заголовок типа данных
    * @param value - значение типа данных
    */
    setContentType(value) {
        return this.setHeader(FetchWrapper.CONTENT_TYPE_HEADER, value);
    }
    /* Устанавливает заголовок
    * @param key - ключ заколовка
    * @param value - значение заголовка
    */
    setHeader(key, value) {
        this.__headers[key] = value;
        return this;
    }
    /* Очищает заголовки запроса
    */
    clearHeaders(...excludeKeys) {
        for (let key in this.__headers) {
            if (excludeKeys.length > 0 && excludeKeys.includes(key)) {
                continue;
            }
            delete this.__headers[key];
        }
        return this;
    }
    /*
    Дополняет урл запроса парами `/${KEY}/${VALUE}`
    */
    extendUrl(key, value) {
        this.__urlExtend += `/${key}/${value}`;
        return this;
    }
    /* Add to the end of url string one more part
    * @param urlTail - appended part to url
    */
    appendToUrl(urlTail) {
        this.__urlExtend += `/${urlTail}`;
        return this;
    }
    /* Очищает дополнение к базовому урлу */
    clearUrlExtend() {
        this.__urlExtend = "";
        return this;
    }
    /*
        Добавляет в QueryParams пары `{KEY}={VALUE}`
    */
    setQueryParams(map) {
        map.forEach((value, key) => {
            this.setQueryParam(key, value);
        });
        return this;
    }
    /*
        Добавляет в QueryParams пару `{KEY}={VALUE}`
    */
    setQueryParam(key, value) {
        this.__queryParams.delete(key);
        this.__queryParams.set(key, value);
        return this;
    }
    /* Удаляет все записи из QueryParams, кроме тех, что хранятся под ключами из excludeKeys
    * @param excludeKeys - массив ключей, который НЕ удаляется из QueryParams
    */
    clearQueryParam(...excludeKeys) {
        if (excludeKeys.length > 0) {
            const keysToRemove = new Array();
            for (let key of this.__queryParams.keys()) {
                if (!excludeKeys.includes(key)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => this.__queryParams.delete(k));
        }
        else {
            this.__queryParams.clear();
        }
        return this;
    }
    /* Отправляет запрос по сформированным данным
    * @param method - тип запроса
    */
    async sendRequest(method, body = null) {
        let url = this.__url + this.__urlExtend;
        const requestInit = {
            method: method
        };
        if (Object.keys(this.__headers).length > 0) {
            requestInit.headers = this.__headers;
        }
        if (this.__queryParams.size > 0) {
            function toString(entire) {
                return `${entire[0]}=${entire[1]}`;
            }
            const iterable = this.__queryParams.entries();
            let bufferString = `?${toString(iterable.next().value)}`;
            for (let v = iterable.next(); !v.done; v = iterable.next()) {
                bufferString += `&${toString(v.value)}`;
            }
            url += bufferString;
        }
        if (body != null) {
            requestInit.body = body;
        }
        const response = await (0, node_fetch_1.default)(url, requestInit);
        return await response.json();
    }
}
exports.FetchWrapper = FetchWrapper;
FetchWrapper.CONTENT_TYPE_HEADER = "Content-Type";
