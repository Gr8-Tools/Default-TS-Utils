import fetch, {BodyInit, RequestInit} from 'node-fetch'

export class FetchWrapper<T extends FetchWrapper<T>> {
    static CONTENT_TYPE_HEADER : string = "Content-Type";

    protected readonly __url : string;
    protected readonly __headers: Record<string, string>;
    protected readonly __queryParams: Map<string, string>;

    protected __urlExtend : string;

    constructor(baseUrl : string) {
        this.__url = baseUrl;
        this.__headers = {};
        this.__queryParams = new Map<string, string>();
    }

    /* Устанавливает заголовок типа данных
    * @param value - значение типа данных
    */
    setContentType(value: string) : FetchWrapper<T> {
        return this.setHeader(FetchWrapper.CONTENT_TYPE_HEADER, value);
    }

    /* Устанавливает заголовок
    * @param key - ключ заколовка
    * @param value - значение заголовка
    */
    setHeader(key: string, value: string) : FetchWrapper<T> {
        this.__headers[key] = value;
        return this;
    }

    /* Очищает заголовки запроса
    */
    clearHeaders(...excludeKeys: string[]) : FetchWrapper<T> {
        for (let key in this.__headers){
            if (excludeKeys.length > 0 && excludeKeys.includes(key)){
                continue;
            }

            delete this.__headers[key];
        }

        return this;
    }

    /*
    Дополняет урл запроса парами `/${KEY}/${VALUE}`
    */
    extendUrl(key: string, value: string) : FetchWrapper<T> {
        this.__urlExtend += `/${key}/${value}`;
        return this;
    }

    /* Add to the end of url string one more part
    * @param urlTail - appended part to url
    */
    appendToUrl(urlTail: string) : FetchWrapper<T> {
        this.__urlExtend += `/${urlTail}`;
        return this;
    }

    /* Очищает дополнение к базовому урлу */
    clearUrlExtend() : FetchWrapper<T> {
        this.__urlExtend = "";
        return this;
    }

    /*
        Добавляет в QueryParams пары `{KEY}={VALUE}`
    */
    setQueryParams(map: Map<string, string>) : FetchWrapper<T> {
        map.forEach((value, key) => {
            this.setQueryParam(key, value);
        })
        return this;
    }

    /*
        Добавляет в QueryParams пару `{KEY}={VALUE}`
    */
    setQueryParam(key: string, value: string) : FetchWrapper<T> {
        this.__queryParams.delete(key);
        this.__queryParams.set(key, value);
        return this;
    }

    /* Удаляет все записи из QueryParams, кроме тех, что хранятся под ключами из excludeKeys
    * @param excludeKeys - массив ключей, который НЕ удаляется из QueryParams
    */
    clearQueryParam(...excludeKeys: string[]) : FetchWrapper<T> {
        if(excludeKeys.length > 0) {
            const keysToRemove = new Array<string>();
            for (let key of this.__queryParams.keys()) {
                if (!excludeKeys.includes(key)){
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(k => this.__queryParams.delete(k));
        } else {
            this.__queryParams.clear()
        }

        return this;
    }

    /* Отправляет запрос по сформированным данным
    * @param method - тип запроса
    */
    async sendRequest(method: string, body: BodyInit | null = null) : Promise<any> {
        let url = this.__url + this.__urlExtend;

        const requestInit : RequestInit = {
            method : method
        };

        if(Object.keys(this.__headers).length > 0){
            requestInit.headers = this.__headers;
        }

        if(this.__queryParams.size > 0){
            function toString(entire: [string, string]): string {
                return `${entire[0]}=${entire[1]}`;
            }

            const iterable = this.__queryParams.entries();

            let bufferString : string = `?${toString(iterable.next().value)}`;
            for (let v = iterable.next(); !v.done; v = iterable.next()) {
                bufferString += `&${toString(v.value)}`;
            }

            url += bufferString;
        }

        if(body != null) {
            requestInit.body = body;
        }

        const response = await fetch(url, requestInit);
        return await response.json();
    }
}
