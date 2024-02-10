declare const settingsCSS: string;
declare class SettingsApp extends App {
    name: string;
    package: string;
    icon: string;
    state: {
        show_x86_install: any;
        x86_installing: boolean;
        resizing: boolean;
    };
    page: () => Promise<any>;
    constructor();
    open(): Promise<WMWindow | undefined>;
}
