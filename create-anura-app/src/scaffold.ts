import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import fs from 'fs-extra';
import { downloadTemplate } from 'giget';
import sortPackageJson from 'sort-package-json';
import { scaffold as scaffoldDreamland }  from "create-dreamland-app/dist/scaffold.js";

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
        newPath = newPath.replace(/^.*\/([^/]*)$/, '$1');
        return newPath.toLowerCase();
    } else {
        const newPath = path.replace(/^.*\/([^/]*)$/, '$1');
        return newPath.toLowerCase();
    }
}

async function template(
    template: string,
    name: string,
    dreamland: boolean,
    license: string,
    author: string
) {
    try {
        await downloadTemplate(
            `github:motortruck1221/create-anura-app/create-anura-app/templates/base`,
            { force: false, provider: 'github', cwd: name, dir: '.' }
        );
        if (template === 'js') {
            await downloadTemplate(
                `github:motortruck1221/create-anura-app/create-anura-app/templates/${template}`,
                { force: false, provider: 'github', cwd: name, dir: 'js' }
            );
            const packageJSON = fs.readJSONSync(`${name}/package.json`);
            const manifest = fs.readJSONSync(`${name}/src/manifest.json`);
            //we need to filter out directory paths and stuff.
            const newName = filterPath(name);
            //add the "dev" script, edit the name correctly.
            packageJSON.scripts.dev = 'node server.js';
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
        if (template === 'ts') {
            await downloadTemplate(
                `github:motortruck1221/create-anura-app/create-anura-app/templates/${template}`,
                {
                    force: false,
                    provider: 'github',
                    cwd: name,
                    dir: 'ts'
                }
            );
            if (dreamland === true) {
                //download the dreamland template as well if the user selected it.
                await downloadTemplate(
                    `github:motortruck1221/create-anura-app/create-anura-app/templates/dreamland`,
                    {
                        force: false,
                        provider: 'github',
                        cwd: name,
                        dir: 'dreamland'
                    }
                );
                //"scaffoldDreamland" is the function used to download the already made templates with dreamland (from: create-dreamland-app). We just want to use them here.
                await scaffoldDreamland({
                    projectName: `${name}/dreamland/files`,
                    scaffoldType: 'tsx/jsx',
                    tsScaffold: true
                });
            }
            const packageJSON = fs.readJSONSync(`${name}/package.json`);
            const manifest = fs.readJSONSync(`${name}/src/manifest.json`);
            const newName = filterPath(name);
            //move the necessary files out of the ts/ folder
            await fs.move(`${name}/ts/server.ts`, `${name}/server.ts`);
            await fs.move(`${name}/ts/types/`, `${name}/types/`);
            await fs.move(`${name}/src/manifest.json`, `${name}/manifest.json`);
            //specific files to ONLY dreamland
            if (dreamland) {
                fs.rmSync(`${name}/src/`, { recursive: true });
                fs.mkdirSync(`${name}/src/`);
                await fs.move(`${name}/dreamland/files/index.html`, `${name}/index.html`);
                await fs.move(`${name}/dreamland/files/src/index.css`, `${name}/src/index.css`);
                await fs.move(`${name}/dreamland/main.tsx`, `${name}/src/main.tsx`);
                await fs.move(`${name}/dreamland/files/src/vite-env.d.ts`, `${name}/src/vite-env.d.ts`);
                await fs.move(`${name}/dreamland/files/tsconfig.json`, `${name}/tsconfig.json`);
                await fs.move(`${name}/dreamland/files/vite.config.ts`, `${name}/vite.config.ts`);
                await fs.move(`${name}/manifest.json`, `${name}/src/manifest.json`);
                //add the required packages (only to dreamland)
                packageJSON.devDependencies['dreamland'] = '^0.0.24';
                packageJSON.devDependencies['vite'] = '^5.2.11';
                packageJSON.devDependencies['vite-plugin-dreamland'] = '^1.2.0';
                packageJSON.scripts.build = "tsc && vite build && copyfiles -u 1 src/manifest.json dist/";
                packageJSON.scripts.dev = "npm run build && JSX=true tsx server.ts";
                packageJSON.scripts.package = "JSX=true node scripts/package.js";
                //cleanup
                fs.rmSync(`${name}/dreamland/`, { recursive: true });
            }
            else {
                fs.rmSync(`${name}/src/`, { recursive: true });
                fs.mkdirSync(`${name}/src/`);
                await fs.move(`${name}/ts/index.html`, `${name}/src/index.html`);
                await fs.move(`${name}/ts/index.ts`, `${name}/src/index.ts`);
                await fs.move(`${name}/ts/tsconfig.json`, `${name}/tsconfig.json`);
                await fs.move(`${name}/manifest.json`, `${name}/src/manifest.json`);
                //required scripts
                packageJSON.scripts.build = "tsc && copyfiles -u 1 src/manifest.json dist/";
                packageJSON.scripts.dev = "npm run build && tsx server.ts";
                packageJSON.scripts.package = "node scripts/package.js";
            }
            //add the other neccessary files back
            await fs.move(`${name}/types/`, `${name}/src/types/`);
            await fs.rm(`${name}/ts/`, { recursive: true });
            //add all of the neccessary packages.
            packageJSON.devDependencies['typescript'] = '^5.4.5';
            packageJSON.devDependencies['@types/express'] = '^4.17.21';
            packageJSON.devDependencies['tsx'] = "^4.19.1";
            packageJSON.devDependencies['copyfiles'] = "^2.4.1";
            const sortedPackageJSON = sortPackageJson(packageJSON);
            fs.writeJSONSync(`${name}/package.json`, sortedPackageJSON, {
                spaces: 2
            });
            //update the manifest
            manifest.name = newName;
            manifest.package = `${author.toLowerCase()}.${newName}`;
            manifest.wininfo.title = newName;
            fs.writeJSONSync(`${name}/src/manifest.json`, manifest, {
                spaces: 2
            });
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
