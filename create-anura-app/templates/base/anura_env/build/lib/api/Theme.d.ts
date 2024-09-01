/// <reference types="dreamland" />
interface ThemeProps {
    foreground: string;
    secondaryForeground: string;
    border: string;
    darkBorder: string;
    background: string;
    secondaryBackground: string;
    darkBackground: string;
    accent: string;
}
declare class Theme implements ThemeProps {
    get foreground(): string;
    set foreground(value: string);
    get secondaryForeground(): string;
    set secondaryForeground(value: string);
    get border(): string;
    set border(value: string);
    get darkBorder(): string;
    set darkBorder(value: string);
    get background(): string;
    set background(value: string);
    get secondaryBackground(): string;
    set secondaryBackground(value: string);
    get darkBackground(): string;
    set darkBackground(value: string);
    get accent(): string;
    set accent(value: string);
    state: Stateful<ThemeProps>;
    cssPropMap: Record<keyof ThemeProps, string[]>;
    static new(json: {
        [key: string]: string;
    }): Theme;
    constructor(foreground?: string, secondaryForeground?: string, border?: string, darkBorder?: string, background?: string, secondaryBackground?: string, darkBackground?: string, accent?: string);
    reset(): void;
    apply(): void;
    css(): string;
}
