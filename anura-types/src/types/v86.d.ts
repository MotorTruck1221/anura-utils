/// <reference types="dreamland" />
declare const decoder: TextDecoder;
declare const encoder: TextEncoder;
declare const SLICE_SIZE: number;
declare const BUF_SIZE = 256;
declare function InitV86Hdd(): Promise<FakeFile>;
declare class V86Backend {
    ptyNum: number;
    ready: boolean;
    vgacanvas: HTMLCanvasElement;
    screen_container: JSX.Element;
    virt_hda: FakeFile;
    netpty: number;
    xpty: number;
    runpty: number;
    emulator: any;
    saveinterval: number;
    sendWispFrame: any;
    constructor(virt_hda: FakeFile);
    onboot(): Promise<void>;
    openpty(command: string, cols: number, rows: number, onData: (string: string) => void): Promise<number>;
    openBinaryPty(command: string, cols: number, rows: number, onData: (data: Uint8Array) => void): Promise<number>;
    writeBinaryPTY(TTYn: number, data: Uint8Array): void;
    writepty(TTYn: number, data: string): void;
    resizepty(TTYn: number, cols: number, rows: number): void;
    closepty(TTYn: number): void;
    runcmd(cmd: string): void;
    startMouseDriver(): Promise<void>;
    twispinit(): Promise<void>;
}
interface FakeFile {
    slice: (start: number, end: number) => Promise<Blob>;
    save: (emulator?: any) => Promise<void>;
    delete: () => Promise<void>;
    resize: (size: number) => Promise<void>;
    size: number;
}
//# sourceMappingURL=v86.d.ts.map