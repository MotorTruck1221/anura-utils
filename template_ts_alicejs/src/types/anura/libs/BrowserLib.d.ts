declare class BrowserLib extends Lib {
    name: string;
    package: string;
    icon: string;
    events: {
        openTab?: (path: string) => void;
    };
    constructor(app: BrowserApp, openTabEvent: (path: string) => void);
    getImport(version?: string): Promise<any>;
}
