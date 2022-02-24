import 'isomorphic-unfetch';
import { MintbaseAPIConfig, Network, Constants, MintMetadata } from './types';
import { ResponseData } from './utils/responseBuilder';
/**
 * Mintbase API.
 * Main entry point for users read Mintbase data.
 */
export declare class API {
    apiBaseUrl: string;
    defaultLimit: number;
    chainName: string;
    networkName: Network | undefined;
    constants: Constants;
    constructor(apiConfig: MintbaseAPIConfig);
    /**
     * Fetch marketplace and each token's metadata (w/ cursor offset pagination enabled).
     * @param limit number of results
     * @param offset number of records to skip
     */
    fetchMarketplace(offset?: number, limit?: number): Promise<ResponseData<any>>;
    fetchAccount(accountId: string): Promise<ResponseData<any>>;
    fetchTokenApprovals(tokenKey: string, contractAddress: string): Promise<ResponseData<any>>;
    fetchApprovals(offset?: number, limit?: number): Promise<ResponseData<any>>;
    /**
     * Fetch thing metadata.
     * @param thingId Thing Id
     * @returns token metadata
     */
    fetchThingMetadata(thingId: string): Promise<ResponseData<MintMetadata>>;
    /**
     * Fetch list by id.
     */
    fetchListById(id: string): Promise<ResponseData<any>>;
    fetchLists(offset?: number, limit?: number): Promise<ResponseData<any>>;
    /**
     * Fetch thing by Id
     * TODO: Not yet implemented
     */
    fetchThingById(thingId: string): Promise<ResponseData<any>>;
    /**
     * Fetch thing.
     */
    fetchThings(offset?: number, limit?: number): Promise<ResponseData<any>>;
    /**
     * Fetch token
     * @param tokenId token id
     * @returns the token data
     */
    fetchTokenById(tokenId: string): Promise<ResponseData<any>>;
    fetchTokens(offset?: number, limit?: number): Promise<ResponseData<any>>;
    fetchStoreById(storeId: string): Promise<ResponseData<any>>;
    fetchStores(offset?: number, limit?: number): Promise<ResponseData<any>>;
    fetchCategories(): Promise<ResponseData<any>>;
    fetchStats(): Promise<ResponseData<any>>;
    /**
     * Checks whether account owns a token or not.
     * @param tokenId token id
     * @param accountId account id
     * @returns whether an account owns a token or not.
     */
    isTokenOwner(accountId: string, tokenKey: string): Promise<ResponseData<boolean>>;
    /**
     * Fetch metadata from Arweave
     * @param id arweave content identifier
     * @returns metadata
     */
    fetchMetadata(url: string): Promise<ResponseData<any>>;
    /**
     * Makes custom GraphQL query
     * @param query custom GraphQL query
     * @param variables object with variables passed to the query
     * @returns result of query
     */
    custom<T>(query: string, variables?: unknown): Promise<ResponseData<T>>;
}
