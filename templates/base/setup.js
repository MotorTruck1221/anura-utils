//This file exists solely to symlink your app to the anura_env/ folder.
//It is most likely not required to re-run it. (and it can be deleted).
import { symlinkSync } from "node:fs";

console.log("Symlink setting up...");
symlinkSync("./src/", './anura_env/', 'dir');
