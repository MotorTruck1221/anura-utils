declare class ExternalApp extends App {
    manifest: AppManifest;
    source: string;
    constructor(manifest: AppManifest, source: string);
    open(): Promise<WMWindow | undefined>;
}
