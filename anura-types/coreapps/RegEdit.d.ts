/// <reference types="dreamland" />
declare function hasChildren(entry: any[]): boolean;
declare const DisclosureGroup: Component<{
    entry: any[];
    sel: {
        [key: string]: any;
    };
    level?: number;
}>;
declare class RegEdit extends App {
    hidden: boolean;
    constructor();
    css: string;
    state: Stateful<{
        selected: {
            [key: string]: any;
        };
    }>;
    page: () => Promise<JSX.Element>;
    open(): Promise<WMWindow | undefined>;
}
//# sourceMappingURL=RegEdit.d.ts.map