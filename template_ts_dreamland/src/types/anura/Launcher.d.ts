declare class Launcher {
    private search;
    css: string;
    element: any;
    clickoffChecker: any;
    constructor();
    handleSearch(event: Event): void;
    toggleVisible(): void;
    hide(): void;
    clearSearch(): void;
    addShortcut(app: App): void;
    shortcutElement(app: App): HTMLElement;
}
