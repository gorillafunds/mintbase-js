import 'isomorphic-unfetch';
import firebase from 'firebase/app';
import 'firebase/storage';
import { Constants } from 'src/types';
import { ResponseData } from './responseBuilder';
interface StorageConfigProps {
    apiKey?: string;
    constants?: Constants;
}
export declare class Storage {
    firebase: firebase.app.App | undefined;
    storage: firebase.storage.Storage | undefined;
    apiKey: string;
    constants: Constants;
    constructor(storageConfig?: StorageConfigProps);
    /**
     * Uploads metadata to Arweave via a cloud function
     * @param metadata metadata object
     * @returns arweave content identifier
     */
    uploadMetadata(metadata: unknown): Promise<ResponseData<{
        id: string;
    }>>;
    /**
     * Upload file to Arweave via a cloud function
     * @param file the file to upload
     * @returns retunrns an object containing the arweave content identifier and the content type.
     */
    uploadToArweave(file: File): Promise<ResponseData<{
        id: string;
        contentType: string;
    }>>;
    /**
     * Uploads raw binary data to the cloud. This method is useful because
     * we can trigger an arweave upload via an http request with the returned file name.
     * @param buffer the raw binary data of the file to upload
     * @param contentType the content type
     * @returns the filename
     */
    private uploadCloud;
}
export {};
