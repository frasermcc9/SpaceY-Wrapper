export declare function httpRequest(path: string): Promise<Object>;
export interface BaseRequest<K> {
    status: string;
    data?: K;
}
