declare class Networking {
    libcurl: any;
    libcurl_src: string;
    libcurl_wasm: string;
    external: {
        fetch: ((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) & typeof fetch;
    };
    WebSocket: typeof WebSocket;
    Socket: any;
    TLSSocket: any;
    constructor(wisp_server: string);
    loopback: {
        addressMap: Map<any, any>;
        call: (port: number, request: Request) => Promise<any>;
        set: (port: number, handler: () => Response) => Promise<void>;
        deregister: (port: number) => Promise<void>;
    };
    fetch: (url: any, methods: any) => Promise<any>;
    setWispServer: (wisp_server: string) => void;
}
