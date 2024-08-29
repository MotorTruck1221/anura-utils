declare class Dialog extends App {
    name: string;
    package: string;
    icon: string;
    source: string;
    hidden: boolean;
    css: string;
    constructor();
    alert(message: string, title?: string): void;
    confirm(message: string, title?: string): Promise<boolean>;
    prompt(message: string, defaultValue?: any): Promise<any>;
}
//# sourceMappingURL=Dialog.d.ts.map