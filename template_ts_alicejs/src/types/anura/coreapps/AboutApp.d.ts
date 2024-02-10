declare class AboutApp extends App {
    name: string;
    package: string;
    icon: string;
    page: () => Promise<any>;
    constructor();
    open(): Promise<WMWindow | undefined>;
    getOSBuild(): string;
}
