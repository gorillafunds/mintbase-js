declare const messageEncode: (decodedMessage: string) => Uint8Array;
declare const messageDecode: (encodedMessage: ArrayBuffer) => string;
export { messageEncode, messageDecode };
