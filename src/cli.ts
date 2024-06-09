import * as prompt from '@clack/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { execa } from 'execa';

type ProjTypes = "ts" | "js" | "assemblyscript"

interface CliFlags {
    git: boolean,
    install: boolean,
    default: boolean,
    projType: ProjTypes,
    dreamland?: boolean,
    author: string,
    license: string
}

interface CliResults {
    dir: string,
    flags: CliFlags
}


const defaultOpts: CliResults = {
    dir: "anura-app",
    flags: {
        git: false,
        install: false,
        default: false,
        projType: "ts",
        dreamland: false,
        author: "",
        license: "MIT"
    }
}

async function project() {
    const cliResults = defaultOpts;
    const program = new Command();
    program.name("Create Anura App");
    program.description("Quickly scaffold an anura application");
    program.argument("[dir]", "The name of the project, and the directory to create");
    program.option("--git", "Init a Git repository", false);
    program.option("-i, --install", "Automatically install the dependencies", false);
    program.option("-y, --default", "Skip any questions and bootstrap with defaults", false);
    program.option("-p, --projectType <ts|js|assemblyscript>", "The project type", "ts");
    program.option("-d, --dreamland", "Whether to use dreamland.js or not", false);
    program.option("-a, --author <author>", "The author's name", "");
    program.option("-l, --license <license>", "The license you want to use", "MIT");
    const providedName = program.args[0];
    if (providedName) {
        cliResults.dir = providedName;
    }
    cliResults.flags = program.opts();
    program.parse(process.argv);
    console.log(cliResults);
}

async function cli() {
    prompt.intro(chalk.red("Let's get started with your anura app!"));
    await project();
}

export { cli };
