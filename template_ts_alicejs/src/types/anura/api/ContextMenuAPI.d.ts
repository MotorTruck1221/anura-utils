declare class ContextMenuAPI {
    #private;
    item(text: string, callback: VoidFunction): any;
    constructor();
    removeAllItems(): void;
    addItem(text: string, callback: VoidFunction): void;
    show(x: number, y: number): any;
    hide(): void;
}
