/// <reference types="dreamland" />
declare class QuickSettings {
    dateformat: Intl.DateTimeFormat;
    state: Stateful<{
        showQuickSettings?: boolean;
        pinnedSettings: Array<{
            registry: string;
            icon?: string;
            type: string;
            name: string;
            description: string;
            value: any;
            onChange?: string;
        }>;
        date: string;
    }>;
    transition: string;
    show: string;
    hide: string;
    quickSettingsCss: string;
    quickSettingsElement: HTMLElement;
    notificationCenterCss: string;
    notificationCenterElement: JSX.Element;
    clickoffChecker: HTMLDivElement;
    updateClickoffChecker: (show: boolean) => void;
    open(): void;
    close(): void;
    toggle(): void;
    constructor(clickoffChecker: HTMLDivElement, updateClickoffChecker: (show: boolean) => void);
    init(): Promise<void>;
}
declare class QuickSettingsNotification {
    state: Stateful<{
        title: string;
        description: string;
        timeout: number | "never" | undefined;
        closeIndicator?: boolean | undefined;
        buttons: Array<{
            text: string;
            style?: "contained" | "outlined" | "text";
            callback: (notif: AnuraNotification) => void;
            close?: boolean;
        }>;
    }>;
    css: string;
    originalNotification: AnuraNotification;
    constructor(notif: AnuraNotification);
    element: JSX.Element;
    close(): void;
}
//# sourceMappingURL=QuickSettings.d.ts.map