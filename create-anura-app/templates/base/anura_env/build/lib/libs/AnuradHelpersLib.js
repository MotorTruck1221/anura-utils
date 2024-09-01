"use strict";
var AnuradHelpers;
(function (AnuradHelpers) {
    /**
     * This array will be updated at runtime as anura api's are registered
     */
    const apis = [];
    /**
     * This array will be updated at runtime as anura stages are completed
     * and init scripts are started
     */
    const stages = [];
    const apiListeners = {};
    const stageListeners = {};
    /**
     * Notify all init scripts that an api is ready
     */
    function setReady(api) {
        if (!apis.includes(api)) {
            apis.push(api);
        }
        if (apiListeners[api]) {
            apiListeners[api].forEach((listener) => listener());
        }
    }
    AnuradHelpers.setReady = setReady;
    /**
     * Notify all init scripts that a stage has been completed
     */
    function setStage(stage) {
        if (!stages.includes(stage)) {
            stages.push(stage);
        }
        if (stageListeners[stage]) {
            stageListeners[stage].forEach((listener) => listener());
        }
    }
    AnuradHelpers.setStage = setStage;
    /**
     * Wait for an api to be ready
     */
    async function need(api) {
        if (apis.includes(api)) {
            return;
        }
        return new Promise((resolve) => {
            if (!apiListeners[api]) {
                apiListeners[api] = [];
            }
            apiListeners[api].push(resolve);
        });
    }
    AnuradHelpers.need = need;
    /**
     * Wait for a stage to be completed
     */
    async function after(stage) {
        if (stages.includes(stage)) {
            return;
        }
        return new Promise((resolve) => {
            if (!stageListeners[stage]) {
                stageListeners[stage] = [];
            }
            stageListeners[stage].push(resolve);
        });
    }
    AnuradHelpers.after = after;
})(AnuradHelpers || (AnuradHelpers = {}));
class AnuradHelpersLib extends Lib {
    icon = "/assets/icons/generic.png";
    package = "anura.daemon.helpers";
    name = "Anurad Helpers";
    versions = {
        "0.1.0": AnuradHelpers,
    };
    latestVersion = "0.1.0";
    async getImport(version) {
        if (!version)
            version = this.latestVersion;
        if (!this.versions[version]) {
            throw new Error("Version not found");
        }
        return this.versions[version];
    }
}
//# sourceMappingURL=AnuradHelpersLib.js.map