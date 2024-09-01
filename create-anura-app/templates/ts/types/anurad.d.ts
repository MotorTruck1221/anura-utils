interface InitScriptExports {
    name: string;
    provides: string[];
    description: string;
    depend: () => Promise<void>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
}
type InitScriptFrame = HTMLIFrameElement & {
    contentWindow: Window & {
        initScript: InitScriptExports;
    };
};
declare class Anurad extends Process {
    pid: number;
    initScripts: AnuradInitScript[];
    title: string;
    constructor(pid: number);
    addInitScript(script: string): Promise<void>;
    get alive(): boolean;
    kill(): Promise<void>;
}
declare class AnuradInitScript implements Process {
    pid: number;
    script: string;
    frame: InitScriptFrame;
    window: InitScriptFrame["contentWindow"];
    info?: InitScriptExports;
    get title(): string;
    set title(value: string);
    constructor(script: string, pid: number);
    get alive(): boolean;
    kill(): void;
    stdin: WritableStream<Uint8Array>;
    stderr: ReadableStream<Uint8Array>;
    stdout: ReadableStream<Uint8Array>;
}
//# sourceMappingURL=anurad.d.ts.map