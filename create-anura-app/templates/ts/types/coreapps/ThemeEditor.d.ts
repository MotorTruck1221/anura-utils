/// <reference types="dreamland" />
declare class ThemeEditor extends App {
    state: Stateful<{
        resizing: boolean;
    }>;
    picker: any;
    css: string;
    colorEditors: {
        prop: keyof ThemeProps;
        name: string;
    }[];
    constructor();
    page: () => Promise<JSX.Element>;
    open(args?: string[]): Promise<WMWindow | undefined>;
    importTheme(): Promise<void>;
    exportTheme(theme: string): void;
}
//# sourceMappingURL=ThemeEditor.d.ts.map