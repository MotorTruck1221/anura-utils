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
}

async function template(template: string, name: string, dreamland: boolean, license: string) {
    try {
        await downloadTemplate(`github:motortruck1221/create-anura-app/templates/base`, {
            force: false,
            provider: 'github',
            cwd: name,
            dir: '.'
        });
        if (template === 'js') {
            await downloadTemplate(`github:motortruck1221/create-anura-app/templates/${template}`, {
                force: false,
                provider: 'github',
                cwd: name,
                dir: 'js'
            });
            const packageJSON = fs.readJSONSync(`${name}/package.json`);
            //add the "dev" script, edit the name correctly.
            packageJSON.scripts.dev = 'node server.js';
            packageJSON.name = name;
            packageJSON.license = license;
            const sortedPackageJSON = sortPackageJson(packageJSON);
            fs.writeJSONSync(`${name}/package.json`, sortedPackageJSON, {
                spaces: 2
            });
            //move the "server.js" file out of the js folder and remove the js folder
            fs.moveSync(`${name}/js/server.js`, `${name}/server.js`);
            fs.rmSync(`${name}/js/`, { recursive: true });
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
    await template(opts.type, opts.projectName, opts.dreamland, opts.license);
}

export { scaffold };
