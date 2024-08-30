/// <reference types="dreamland" />
declare class ContextMenuAPI {
    #private;
    large: boolean;
    item(text: string, callback: VoidFunction, icon?: string): JSX.Element;
    constructor(large?: boolean);
    removeAllItems(): void;
    addItem(text: string, callback: VoidFunction, icon?: string): void;
    show(x: number, y: number): JSX.Element;
    hide(): void;
}
