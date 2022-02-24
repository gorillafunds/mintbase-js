/** @hidden @module */
export declare const correctFileType: (file: File) => Promise<File>;
export declare const setMimeType: (type: string, file: File) => Promise<File>;
export declare const getFileExtension: (fileName: string) => string | undefined;
