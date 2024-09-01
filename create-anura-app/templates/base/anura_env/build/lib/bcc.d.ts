declare const bare: any;
declare class AnuraBareClient {
    ready: boolean;
    constructor();
    init(): Promise<void>;
    meta(): Promise<void>;
    request(remote: URL, method: string, body: BodyInit | null, headers: any, signal: AbortSignal | undefined): Promise<any>;
    connect(url: URL, origin: string, protocols: string[], requestHeaders: any, onopen: (protocol: string) => void, onmessage: (data: Blob | ArrayBuffer | string) => void, onclose: (code: number, reason: string) => void, onerror: (error: string) => void): [
        (data: Blob | ArrayBuffer | string) => void,
        (code: number, reason: string) => void
    ];
}
