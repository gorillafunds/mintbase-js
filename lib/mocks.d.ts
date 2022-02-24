export declare const marketplaceAPIResponseMock: {
    list: {
        id: string;
        price: number;
        groupId: string;
        ownerId: string;
        createdAt: string;
        token: {
            thing: {
                id: string;
                metaId: string;
                store: {
                    baseUri: string;
                };
            };
            splits: {
                id: string;
                account: string;
                txId: string;
            }[];
            royaltys: {
                id: string;
                account: string;
                txId: string;
            }[];
        };
    }[];
};
export declare const thingByIdMock: {
    thing: {
        id: string;
        memo: string;
        metaId: string;
        storeId: string;
        tokens: {
            id: string;
            ownerId: string;
        }[];
        store: {
            baseUri: string;
            owner: string;
        };
    }[];
};
export declare const arweaveReplyMock: {
    category: string;
    description: string;
    copies: number;
    media_hash: string;
    lock: null;
    visibility: string;
    youtube_url: null;
    animation_url: null;
    animation_hash: null;
    document: null;
    document_hash: null;
    royalty: {
        'mintbase.testnet': number;
    };
    royalty_perc: number;
    split_revenue: null;
    tags: string[];
    media: string;
    extra: never[];
    title: string;
    store: string;
    external_url: string;
    type: string;
};
export declare const fetchMarketplaceReplyMock: {
    metadata: {
        category: string;
        description: string;
        copies: number;
        media_hash: string;
        lock: null;
        visibility: string;
        youtube_url: null;
        animation_url: null;
        animation_hash: null;
        document: null;
        document_hash: null;
        royalty: {
            'mintbase.testnet': number;
        };
        royalty_perc: number;
        split_revenue: null;
        tags: string[];
        media: string;
        extra: never[];
        title: string;
        store: string;
        external_url: string;
        type: string;
    };
    id: string;
    price: number;
    groupId: string;
    ownerId: string;
    createdAt: string;
    token: {
        thing: {
            id: string;
            metaId: string;
            store: {
                baseUri: string;
            };
        };
        splits: {
            id: string;
            account: string;
            txId: string;
        }[];
        royaltys: {
            id: string;
            account: string;
            txId: string;
        }[];
    };
}[];
