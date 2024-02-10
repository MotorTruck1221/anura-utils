/// <reference types="node" />
declare class Networking {
    Socket: {
        new (): {
            ondata(data: Buffer): void;
            onconnect(): void;
            on(type: string, callback: () => void): void;
            write(data: Buffer): void;
            websocket: WebSocket;
            readyState: boolean;
            connecting: boolean;
            connect(port: number, host: string): void;
        };
    };
}
