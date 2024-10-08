declare class Anura {
    version: {
        semantic: {
            major: string;
            minor: string;
            patch: string;
        };
        buildstate: string;
        codename: string;
        readonly pretty: string;
    };
    initComplete: boolean;
    x86: null | V86Backend;
    settings: Settings;
    fs: AnuraFilesystem;
    config: any;
    notifications: NotificationService;
    x86hdd: FakeFile;
    net: Networking;
    platform: Platform;
    ui: AnuraUI;
    processes: Processes;
    dialog: Dialog;
    sw: SWProcess;
    anurad: Anurad;
    private constructor();
    static new(config: any): Promise<Anura>;
    wm: WMAPI;
    apps: any;
    libs: any;
    logger: {
        log: any;
        debug: any;
        warn: any;
        error: any;
    };
    registerApp(app: App): Promise<App>;
    registerExternalApp(source: string): Promise<ExternalApp>;
    registerExternalAppHandler(id: string, handler: string): void;
    registerLib(lib: Lib): Promise<Lib>;
    registerExternalLib(source: string): Promise<ExternalLib>;
    ContextMenu: typeof ContextMenuAPI;
    removeStaleApps(): void;
    systray: Systray;
    import(packageName: string, searchPath?: string): Promise<any>;
    uri: URIHandlerAPI;
    files: FilesAPI;
    get wsproxyURL(): any;
}
interface AppManifest {
    /**
     * The name of the app.
     */
    name: string;
    /**
     * The type of the app. This can be "manual", "auto" or "webview". If it is "manual", the app will be handled by the
     * handler specified in the handler field. If it is "auto", the app will be handled by the index file
     * specified in the index field. If it is "webview", the app will be handled by the website specified in the src field.
     * If the type is not "manual", "auto", or "webview", it will be handled by the anura
     * library specified in the type field.
     */
    type: "manual" | "auto" | "webview" | string;
    /**
     * The package name of the app. This should be unique to the app and should be in reverse domain notation.
     * For example, if the app is called "My App" and is made by "My Company", the package name should be
     */
    package: string;
    /**
     * The index file for the app. This is the file that will be loaded when the app is launched when the app
     * is in auto mode.
     */
    index?: string;
    /**
     * The icon for the app. This should be a URL to an image file.
     */
    icon: string;
    /**
     * The handler for the app. This is the file that will be loaded when the app is launched when the app
     * is in manual mode.
     */
    handler?: string;
    /**
     * The link for the app. This is the website that will be loaded when the app is launched when the app
     * is in webview mode.
     */
    src?: string;
    /**
     * Whether or not the app should be hidden from the app list. This is useful for apps that are
     * only meant to be launched by other apps.
     */
    hidden?: boolean;
    /**
     * The background color of the element directly behind the app's window. This is optional and defaults
     * to the system theme's background color.
     */
    background?: string;
    /**
     * This contains the properties for the default app window.
     */
    wininfo: string | WindowInformation;
    /**
     * Whether or not the app should use the IDB wrapper. This option allows the app to access indexedDB without
     * worrying about the app purging anura's own databases.
     */
    useIdbWrapper?: boolean;
}
declare class SWProcess extends Process {
    pid: number;
    title: string;
    constructor();
    kill(): void;
    get alive(): boolean;
}
//# sourceMappingURL=Anura.d.ts.map