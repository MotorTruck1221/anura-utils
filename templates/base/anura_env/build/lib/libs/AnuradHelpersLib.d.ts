declare namespace AnuradHelpers {
    /**
     * Notify all init scripts that an api is ready
     */
    function setReady(api: string): void;
    /**
     * Notify all init scripts that a stage has been completed
     */
    function setStage(stage: string): void;
    /**
     * Wait for an api to be ready
     */
    function need(api: string): Promise<unknown>;
    /**
     * Wait for a stage to be completed
     */
    function after(stage: string): Promise<unknown>;
}
declare class AnuradHelpersLib extends Lib {
    icon: string;
    package: string;
    name: string;
    versions: {
        [key: string]: any;
    };
    latestVersion: string;
    getImport(version: string): Promise<any>;
}
