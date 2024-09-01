declare class WMAPI {
    windows: WeakRef<WMWindow>[];
    hasFullscreenWindow: boolean;
    create(ctx: App, info: object): WMWindow;
    createGeneric(info: object): WMWindow;
}
//# sourceMappingURL=WmApi.d.ts.map