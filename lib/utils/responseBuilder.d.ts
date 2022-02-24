interface ResponseParams<T> {
    data?: T;
    error?: string;
}
export interface ResponseData<T> {
    data: T;
    error: string;
}
export declare const formatResponse: <T>(params: ResponseParams<T>) => ResponseData<T>;
export {};
