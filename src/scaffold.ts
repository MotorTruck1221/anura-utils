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
}

async function template(template: string, name: string) {
    try {
    } catch {}
}

async function scaffold(opts: options) {}

export { scaffold };
