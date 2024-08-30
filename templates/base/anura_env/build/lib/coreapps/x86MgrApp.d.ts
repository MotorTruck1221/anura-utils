declare class x86MgrApp extends App {
    name: string;
    package: string;
    icon: string;
    constructor();
    open(): Promise<WMWindow | undefined>;
}
