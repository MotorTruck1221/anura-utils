/// <reference types="dreamland" />
declare class Processes {
    processesDiv: JSX.Element;
    constructor();
    get procs(): Stateful<WeakRef<Process>[]>;
    set procs(value: Stateful<WeakRef<Process>[]>);
    state: Stateful<{
        procs: Stateful<WeakRef<Process>[]>;
    }>;
    remove(pid: number): void;
    register(proc: Process): void;
    create(script: string, type?: "common" | "module"): IframeProcess;
    execute(path: string): Promise<IframeProcess>;
}
declare abstract class Process {
    abstract pid: number;
    abstract title: string;
    stdout: ReadableStream<Uint8Array>;
    stderr: ReadableStream<Uint8Array>;
    stdin: WritableStream<Uint8Array>;
    kill(): void;
    abstract get alive(): boolean;
}
declare class IframeProcess extends Process {
    pid: number;
    script: string;
    title: string;
    frame: HTMLIFrameElement;
    constructor(script: string, type: "module" | "common" | undefined, pid: number);
    kill(): void;
    get alive(): boolean;
    get window(): Window;
    get document(): Document;
}
