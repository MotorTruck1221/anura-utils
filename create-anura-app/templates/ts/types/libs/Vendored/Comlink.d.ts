declare class Comlink extends Lib {
    icon: string;
    package: string;
    name: string;
    src: string;
    versions: {
        [key: string]: any;
    };
    latestVersion: string;
    getImport(version?: string): Promise<any>;
}
//# sourceMappingURL=Comlink.d.ts.map