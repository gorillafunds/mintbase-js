import 'isomorphic-unfetch';
import { KeyPair, Near, Account, WalletConnection } from 'near-api-js';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { API } from './api';
import { Chain, WalletLoginProps, Network, Split, Royalties, NEARConfig, Constants, WalletConfig } from './types';
import { Minter } from './minter';
import { ResponseData } from './utils/responseBuilder';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
/**
 * Mintbase Wallet.
 * Main entry point for users to sign and interact with NEAR and Mintbase infrastructure.
 */
export declare class Wallet {
    api: API | undefined;
    activeWallet?: WalletConnection;
    activeNearConnection?: Near;
    activeAccount?: Account;
    networkName: Network;
    chain: Chain;
    keyStore: KeyStore | undefined;
    nearConfig: NEARConfig | undefined;
    minter: Minter | undefined;
    constants: Constants;
    /**
     * Mintbase wallet constructor.
     * Creates an instance of a Mintbase wallet.
     * @param apiConfig api confuguration options.
     * @returns the wallet instance
     */
    constructor();
    init(walletConfig: WalletConfig): Promise<ResponseData<{
        wallet: Wallet;
        isConnected: boolean;
    }>>;
    isConnected(): boolean;
    /**
     * Creates a connection to a NEAR smart contract
     * @param props wallet connection properties - the config to create a connection with
     *
     */
    connect(props?: WalletLoginProps): Promise<ResponseData<string>>;
    /**
     * Disconnects user. Removes the LocalStorage entry that
     * represents an authorized wallet account but leaves private keys intact.
     */
    disconnect(): ResponseData<string>;
    /**
     * Connects to a wallet stored on local storage.
     * @param accountId the account identifier to connect.
     * @returns whether connection was successful or not.
     */
    connectTo(accountId: string): Promise<ResponseData<boolean>>;
    /**
     * Fetches connected account details.
     * @returns details of the current connection.
     */
    details(): Promise<ResponseData<{
        accountId: string;
        balance: string;
        allowance: string;
        contractName: string;
    }>>;
    /**
     * Transfer one or more tokens.
     * @param tokenIds The mapping of transfers, defined by: [[accountName1, tokenId1], [accountName2, tokenId2]]
     * @param contractName The contract name to transfer tokens from.
     */
    transfer(tokenIds: [string, string][], contractName: string): Promise<ResponseData<boolean>>;
    /**
     * Transfer one token.
     * @param tokenId The token id to transfer.
     * @param receiverId The account id to transfer to.
     * @param contractName The contract name to transfer tokens from.
     */
    simpleTransfer(tokenId: string, receiverId: string, contractName: string): Promise<ResponseData<boolean>>;
    /**
     * Burn one or more tokens from the same contract.
     * @param contractName The contract name to burn tokens from.
     * @param tokenIds An array containing token ids to be burnt.
     */
    burn(tokenIds: string[]): Promise<ResponseData<boolean>>;
    /**
     * List an item for sale in the market.
     * @param tokenId The token id list.
     * @param storeId The token store id (contract name).
     * @param price The listing price.
     * @param splitOwners List of splits.
     */
    batchList(tokenId: string[], storeId: string, price: string, options?: {
        autotransfer?: boolean;
        marketAddress?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    /**
     * List an item for sale in the market.
     * @param tokenId The token id.
     * @param storeId The token store id (contract name).
     * @param price The listing price.
     * @param splitOwners List of splits.
     */
    list(tokenId: string, storeId: string, price: string, options?: {
        autotransfer?: boolean;
        marketAddress?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    revokeAccount(tokenId: string, storeId: string, accountRevokeId: string): Promise<ResponseData<boolean>>;
    revokeAllAccounts(tokenId: string, storeId: string): Promise<ResponseData<boolean>>;
    /**
     * Make an offer to a token from a group.
     * @param groupId
     * @param price
     */
    makeGroupOffer(groupId: string, price?: string, options?: {
        marketAddress?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    /**
     * Make an offer to multiple tokens.
     * @param tokenIds: Array of tokenIds
     * @param price: Price of each token
     */
    batchMakeOffer(tokenIds: string[], prices: string[], options?: {
        marketAddress?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    /**
     * Make an offer to a token.
     * @param tokenId
     * @param price
     */
    makeOffer(tokenId: string, price: string, options?: {
        marketAddress?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    /**
     * Make an offer to a token.
     * @param tokenId
     * @param price
     */
    acceptAndTransfer(tokenId: string, options?: {
        marketAddress?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    /**
     *  Withdraw the escrow deposited for an offer.
     * @param tokenKey The token key. `<tokenId>:<contractName>`
     */
    withdrawOffer(tokenKey: string, options?: {
        marketAddress?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    /**
     * Creates a store
     * @param storeId Store name
     * @param symbol Store symbol
     */
    deployStore(storeId: string, symbol: string, options?: {
        attachedDeposit?: string;
        icon?: string;
        gas?: string;
    }): Promise<ResponseData<boolean>>;
    /**
     * Transfers ownership of a store
     * @param newOwner
     * @param keepOldMinters
     */
    transferStoreOwnership(newOwner: string, contractName: string, options?: {
        keepOldMinters: boolean;
    }): Promise<ResponseData<boolean>>;
    /**
     * Mint a token
     * @param amount The number of tokens to mint.
     * @param contractName The contract in which tokens will be minted.
     */
    mint(amount: number, contractName: string, royalties?: Royalties, splits?: Split, category?: string): Promise<ResponseData<boolean>>;
    /**
     * Batch mint serveral tokens
     */
    batchMint(): void;
    /**
     * Mint more pieces of tokens of a thing.
     * @param amount The number of tokens to mint.
     * @param id The thing id
     * @param splits The contract in which tokens will be minted.
     */
    mintMore(amount: number, id: string, splits?: Split): Promise<ResponseData<boolean>>;
    grantMinter(minterAccountId: string, contractName: string): Promise<ResponseData<boolean>>;
    revokeMinter(minterAccountId: string, contractName: string): Promise<ResponseData<boolean>>;
    setSessionKeyPair(accountId: string, privateKey: string): Promise<ResponseData<KeyStore>>;
    getSessionKeyPair(): Promise<ResponseData<KeyPair>>;
    signMessage(message: string): Promise<ResponseData<{
        signature: number[];
        publicKey: number[];
        accountId: string;
        publicKey_str: string;
    }>>;
    verifySignature(requestBody: {
        publicKey: number[];
        signature: number[];
        accountId: string;
        message: string;
    }): Promise<boolean>;
    private getKeyStore;
    /**
     * Fetch local storage connections
     */
    getLocalAccounts(): ResponseData<{
        [accountId: string]: {
            accountId?: string;
            contractName?: string;
        };
    }>;
    /**
     * Fetch transaction result given a transaction hash.
     * @param txHash the transaction's hash
     * @returns the transaction result
     */
    fetchTransactionResult(txHash: string): Promise<ResponseData<FinalExecutionOutcome>>;
    private rpcCall;
    /**
     * Fetch access key information
     * @param accountId account id
     * @param publicKey public key
     * @returns Access Key information
     */
    viewAccessKey: (accountId: string, publicKey: string) => Promise<ResponseData<any>>;
    /**
     * Fetch list of access keys for a given account
     * @param accountId account id
     * @returns List of access keys
     */
    viewAccessKeyList: (accountId: string) => Promise<ResponseData<any>>;
    /**
     * Fetch a transaction status.
     * @param transactionHash The transactions' hash.
     * @param accountId The account who initiated the transation. TODO: Might not be really necessary to pass this.
     * @returns The transaction result
     */
    transactionStatus: (transactionHash: string, accountId: string) => Promise<ResponseData<any>>;
    /**
     * Fetch transaction status with all receipts.
     * @param transactionHash The transactions' hash.
     * @param accountId The account who initiated the transation. TODO: Might not be really necessary to pass this.
     * @returns The transaction result with all receipts.
     */
    transactionStatusWithReceipts: (transactionHash: string, accountId: string) => Promise<ResponseData<any>>;
    /**
     * Get NEAR configuration object. Defaults to testnet.
     * @param networkName
     * @param contractAddress
     */
    private getNearConfig;
}
