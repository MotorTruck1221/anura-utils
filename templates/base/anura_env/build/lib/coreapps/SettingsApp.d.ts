/// <reference types="dreamland" />
declare const settingsCSS: string;
declare const SettingSwitch: Component<{
    title: string;
    setting: string;
    callback?: any;
    on?: boolean;
}, {}>;
declare const SettingText: Component<{
    title: string;
    setting: string;
    callback?: any;
    value?: string;
    type?: string;
}, {}>;
declare class SettingsApp extends App {
    name: string;
    package: string;
    icon: string;
    state: Stateful<{
        show_x86_install: any;
        x86_installing: boolean;
        resizing: boolean;
        settingsBody: HTMLDivElement;
    }>;
    win: WMWindow;
    page: () => Promise<JSX.Element>;
    constructor();
    open(): Promise<WMWindow | undefined>;
}
