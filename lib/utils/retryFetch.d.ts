import retry from 'retry';
export declare function retryFetch(url: string, fetchOptions?: RequestInit, retryOptions?: retry.OperationOptions): Promise<Response>;
