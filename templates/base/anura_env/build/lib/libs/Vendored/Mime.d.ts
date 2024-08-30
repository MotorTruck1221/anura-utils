declare class Mime extends Lib {
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
