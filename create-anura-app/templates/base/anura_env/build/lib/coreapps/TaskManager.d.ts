/// <reference types="dreamland" />
declare class TaskManager extends App {
    constructor();
    css: string;
    state: Stateful<{
        selected: number;
    }>;
    page: () => Promise<JSX.Element>;
    open(args?: string[]): Promise<WMWindow | undefined>;
}
declare const createResizableTable: (table: HTMLElement) => void;
