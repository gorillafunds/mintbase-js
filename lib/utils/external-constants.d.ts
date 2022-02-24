import 'isomorphic-unfetch';
import { Constants, Network } from 'src/types';
export declare const initializeExternalConstants: ({ apiKey, networkName, }: {
    apiKey?: string | undefined;
    networkName?: Network | undefined;
}) => Promise<Constants>;
