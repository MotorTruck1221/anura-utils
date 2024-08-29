/// <reference types="dreamland" />
declare class Launcher {
    state: Stateful<{
        active: boolean;
        apps?: App[];
        appsView?: HTMLDivElement;
        search?: HTMLInputElement;
    }>;
    private popupTransition;
    private gridTransition;
    css: string;
    activeCss: string;
    element: JSX.Element;
    clickoffChecker: HTMLDivElement;
    updateClickoffChecker: (show: boolean) => void;
    handleSearch(event: Event): void;
    toggleVisible(): void;
    setActive(active: boolean): void;
    hide(): void;
    clearSearch(): void;
    addShortcut(app: App): void;
    constructor(clickoffChecker: HTMLDivElement, updateClickoffChecker: (show: boolean) => void);
    init(): Promise<void>;
}
declare const LauncherShortcut: Component<{
    app: App;
    onclick: () => void;
}, Record<string, never>>;
//# sourceMappingURL=Launcher.d.ts.map