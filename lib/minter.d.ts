import { Constants, MetadataField } from './types';
import { Storage } from './utils/storage';
import { ResponseData } from './utils/responseBuilder';
interface MinterConfigProps {
    apiKey?: string;
    constants?: Constants;
}
/**
 * A programmatic metadata generator.
 */
export declare class Minter {
    latestMints: any;
    currentMint: any;
    storage: Storage | undefined;
    apiKey: string;
    constants: Constants;
    constructor(minterConfig?: MinterConfigProps);
    /**
     * Uploads the current metadata object and returns its content identifier.
     */
    getMetadataId(): Promise<ResponseData<string>>;
    /**
     * Set a field in metadata.
     * @param key The field key.
     * @param value The field value.
     */
    setField(key: MetadataField, value: unknown, override?: boolean): ResponseData<boolean>;
    setMetadata(metadata: any, override?: boolean): ResponseData<boolean>;
    /**
     * Uploads file and sets its corresponding URI to a field.
     * @param field The metadata field.
     * @param file The file to upload.
     */
    uploadField(field: MetadataField, file: File): Promise<ResponseData<boolean>>;
    /**
     * Uploads file and returns corresponding URI.
     * @param file The file to upload.
     */
    upload(file: File): Promise<ResponseData<{
        uri: string;
        hash: string;
    }>>;
    private fieldChecks;
}
export {};
