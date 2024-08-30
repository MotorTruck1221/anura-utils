"use strict";
class Fflate extends Lib {
    icon = "/assets/icons/generic.png";
    package = "npm:fflate";
    name = "fflate";
    src = "/libs/fflate/browser.js";
    versions = {};
    latestVersion = "0.0.0";
    async getImport(version) {
        if (this.latestVersion === "0.0.0") {
            this.latestVersion = await (await fetch("/libs/fflate/version")).json();
            this.versions[this.latestVersion] = await import(this.src);
        }
        if (!version) {
            version = this.latestVersion;
        }
        if (!this.versions[version]) {
            throw new Error("Version not found");
        }
        return this.versions[version];
    }
}
//# sourceMappingURL=Fflate.js.map