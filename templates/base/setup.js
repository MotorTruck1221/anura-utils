//This file exists solely to symlink your app to the anura_env/ folder.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const manifest = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "src/manifest.json")));

console.log("Creating symlink...");
fs.symlink(path.join(path.dirname(fileURLToPath(import.meta.url)), "src"), path.join(path.dirname(fileURLToPath(import.meta.url)), `anura_env/apps/${manifest.package}.app`), 'dir', (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("Symlink created!");
    }
});
