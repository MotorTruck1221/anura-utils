import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import fs from 'fs-extra';
import { downloadTemplate } from 'giget';
import sortPackageJson from 'sort-package-json';

interface options {
    projectName: string;
    type: string;
    dreamland: boolean;
    license: string;
    author: string;
}

function filterPath(path: string) {
    if (path.endsWith('/')) {
        let newPath = path.slice(0, -1);
        newPath = newPath.replace(/^.*\/([^/]*)$/, "$1");
        return newPath.toLowerCase();
    }
    else {
        const newPath = path.replace(/^.*\/([^/]*)$/, "$1");
        return newPath.toLowerCase();
    }
}

async function template(template: string, name: string, dreamland: boolean, license: string, author: string) {
    try {
        await downloadTemplate(`github:motortruck1221/create-anura-app/create-anura-app/templates/base`,
            { force: false, provider: 'github', cwd: name, dir: '.' }
        )
        if (template === "js") {
            await downloadTemplate(`github:motortruck1221/create-anura-app/create-anura-app/templates/${template}`,
                { force: false, provider: 'github', cwd: name, dir: 'js' }
            )
            const packageJSON = fs.readJSONSync(`${name}/package.json`);
            const manifest = fs.readJSONSync(`${name}/src/manifest.json`);
            //we need to filter out directory paths and stuff.
            const newName = filterPath(name);
            //add the "dev" script, edit the name correctly.
            packageJSON.scripts.dev = "node server.js";
            packageJSON.name = newName;
            packageJSON.license = license;
            const sortedPackageJSON = sortPackageJson(packageJSON);
            fs.writeJSONSync(`${name}/package.json`, sortedPackageJSON, {
                spaces: 2
            });
            //modify the manifest.json file to include the correct information.
            manifest.name = newName;
            manifest.package = `${author.toLowerCase()}.${newName}`;
            manifest.wininfo.title = newName;
            fs.writeJSONSync(`${name}/src/manifest.json`, manifest, {
                spaces: 2
            });
            //move the files out of the js folder and into their respective folder and remove the js folder
            fs.moveSync(`${name}/js/server.js`, `${name}/server.js`);
            fs.moveSync(`${name}/js/index.html`, `${name}/src/index.html`);
            fs.moveSync(`${name}/js/example.js`, `${name}/src/example.js`);
            fs.rmSync(`${name}/js/`, { recursive: true });
        }
        if (template === "ts") {
            await downloadTemplate(`github:motortruck1221/create-anura-app/create-anura-app/templates/${template}`, {
                force: false, provider: 'github', cwd: name, dir: 'ts' 
            });
            const packageJSON = fs.readJSONSync(`${name}/package.json`);
            const manifest = fs.readJSONSync(`${name}/src/manifest.json`);
            const newName = filterPath(name);
            //add the correct "dev" script and dependencies
            packageJSON.scripts.dev = "npm run build && node dist/server.js";
            packageJSON.scripts.build = "tsc";
            packageJSON.scripts.package = "node dist/build.js";
            packageJSON.name = newName;
            packageJSON.license = license;
            packageJSON.devDependencies["typescript"] = "^5.4.5";
            const sortedPackageJSON = sortPackageJson(packageJSON);
            fs.writeJSONSync(`${name}/package.json`, sortedPackageJSON, {
                spaces: 2
            });
            manifest.name = newName;
            manifest.package = `${author.toLowerCase()}.${newName}`;
            manifest.wininfo.title = newName;
            fs.writeJSONSync(`${name}/src/manifest.json`, manifest, {
                spaces: 2
            });
            //only move the necessary files
            fs.moveSync(`${name}/ts/server.ts`, `${name}/server.ts`);
            if (!dreamland) {
                fs.moveSync(`${name}/ts/tsconfig.json`, `${name}/tsconfig.json`);
            }
            fs.rmSync(`${name}/ts/`, { recursive: true });
        }
    } catch (err: any) {
        //remove the dir if it's likely to be created by the CLI
         if (name !== '.' && name !== './' && name.startsWith('../')) {
            try {
                fs.rmdirSync(name);
            } catch (_) {}
        }
        if (err.message.includes('404')) {
            throw new Error(
                'It looks like we were not able to get the template. \n Please try again later'
            );
        } else {
            throw new Error(err.message);
        }
    }
    //doublecheck the folder to make sure it's not empty
    if (fs.readdirSync(name).length === 0) {
        throw new Error('It looks like the folder is empty. \n Please try again later');
    }
}

async function scaffold(opts: options) {
    await template(opts.type, opts.projectName, opts.dreamland, opts.license, opts.author);
}

export { scaffold };
