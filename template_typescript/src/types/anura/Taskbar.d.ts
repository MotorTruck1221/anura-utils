declare class Taskbar {
    #private;
    state: {
        pinnedApps: App[];
        activeApps: App[];
        showBar: boolean;
        radius: string;
        time: string;
        bat_icon: string;
    };
    maximizedWins: WMWindow[];
    dragged: null;
    insidedrag: boolean;
    element: any;
    footerStyle(radius: string): string;
    shortcut(app: App): any;
    showcontext(app: App, e: MouseEvent): void;
    constructor();
    addShortcut(app: App): void;
    killself(): void;
    updateTaskbar(): void;
    updateRadius(): void;
}
