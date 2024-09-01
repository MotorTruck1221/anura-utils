/// <reference types="dreamland" />
declare const channel: BroadcastChannel;
declare let activetab: boolean;
declare const clickoffCheckerState: Stateful<{
    active: boolean;
}>;
declare const clickoffChecker: JSX.Element;
declare const updateClickoffChecker: (show: boolean) => void;
declare let taskbar: Taskbar;
declare let launcher: Launcher;
declare let oobeview: OobeView;
declare let quickSettings: QuickSettings;
declare let calendar: Calendar;
declare const alttab: AltTabView;
declare let anura: Anura;
declare function bootx86(): Promise<void>;
declare function bootUserCustomizations(): Promise<void>;
