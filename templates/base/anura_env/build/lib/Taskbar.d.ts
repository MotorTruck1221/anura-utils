/// <reference types="dreamland" />
declare class Taskbar {
    #private;
    timeformat: Intl.DateTimeFormat;
    dateformat: Intl.DateTimeFormat;
    state: {
        pinnedApps: App[];
        activeApps: App[];
        showBar: boolean;
        rounded: boolean;
        time: string;
        date: string;
        bat_icon: string;
        net_icon: string;
    };
    rounded: string;
    maximizedWins: WMWindow[];
    dragged: null;
    insidedrag: boolean;
    element: JSX.Element;
    shortcut(app: App): JSX.Element | undefined;
    showcontext(app: App, e: MouseEvent): void;
    constructor();
    init(): Promise<void>;
    updateTaskbar(): void;
    updateRadius(): void;
}
