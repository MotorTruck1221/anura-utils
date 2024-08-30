//This file exists solely to symlink your app to the anura_env/ folder.
//It is most likely not required to re-run it. (and it is auto deleted).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const packageJSON = fs.readJSONSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "package.json"));
const manifest = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "src/manifest.json")));

console.log("Creating symlink...");
fs.symlink(path.join(path.dirname(fileURLToPath(import.meta.url)), "src"), path.join(path.dirname(fileURLToPath(import.meta.url)), `anura_env/${manifest.package}.app`), 'dir', (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("Symlink created!");
        packageJSON.scripts.postinstall = "";
        fs.writeJSONSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "package.json"), packageJSON, {
            spaces: 2
        });
    }
});
