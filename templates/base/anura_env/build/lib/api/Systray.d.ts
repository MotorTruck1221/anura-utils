declare class SystrayIcon {
    element: HTMLImageElement;
    onclick: (event: MouseEvent) => void;
    onrightclick: (event: MouseEvent) => void;
    constructor(template: any);
    get icon(): string;
    set icon(value: string);
    get tooltip(): string;
    set tooltip(value: string);
    destroy: () => void;
}
declare class Systray {
    element: HTMLSpanElement;
    icons: SystrayIcon[];
    constructor();
    create: (template?: any) => SystrayIcon;
}
