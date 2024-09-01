/// <reference types="dreamland" />
declare class ExploreApp extends App {
    hidden: boolean;
    constructor();
    css: string;
    whatsnew: JSX.Element;
    v86: JSX.Element;
    welcome: JSX.Element;
    state: Stateful<{
        screen?: HTMLElement;
    }>;
    page: () => Promise<JSX.Element>;
    open(args?: string[]): Promise<WMWindow | undefined>;
}
//# sourceMappingURL=ExploreApp.d.ts.map