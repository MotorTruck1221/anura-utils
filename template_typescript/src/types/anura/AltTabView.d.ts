type AltTabViewState = {
    windows: [App, WMWindow][];
    index: number;
    active: boolean;
};
declare class AltTabView {
    element: HTMLElement;
    state: AltTabViewState;
    viewWindow([app, win, index]: [App, WMWindow, number]): any;
    view(): any;
    constructor();
    update(): void;
    onComboPress(): void;
    onModRelease(): void;
}
