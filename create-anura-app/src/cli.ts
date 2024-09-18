import * as prompt from '@clack/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { detect as whichPM } from 'detect-package-manager';
import { execa } from 'execa';
import { scaffold } from './scaffold.js';

interface CliFlags {
    git: boolean;
    install: boolean | undefined;
    default: boolean;
    projectType: string;
    dreamland: boolean;
    author: string;
    license: string;
    packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun';
}

interface CliResults {
    dir: string;
    flags: CliFlags;
}

const defaultOpts: CliResults = {
    dir: 'anura-app',
    flags: {
        git: false,
        install: undefined,
        default: false,
        projectType: 'ts',
        dreamland: false,
        author: '',
        license: 'MIT'
    }
};

async function project() {
    let failedInstall = false;
    const cliResults = defaultOpts;
    const program = new Command();
    program.name('Create Anura App');
    program.description('Quickly scaffold an anura application');
    program.argument('[dir]', 'The name of the project, and the directory to create');
    program.option('--git', 'Init a Git repository', false);
    program.option('-i, --install', 'Automatically install the dependencies', false);
    program.option('-y, --default', 'Skip everything and bootstrap with defaults', false);
    program.option('-p, --projectType <ts|js>', 'The project type');
    program.option('-d, --dreamland', 'Whether to use dreamland.js or not', false);
    program.option('-a, --author <author>', "The author's name", 'billy');
    program.option('-l, --license <license>', 'The license you want to use');
    program.option(
        '-pm --packageManager <npm|pnpm|yarn|bun>',
        'The package manager you would like to use'
    );
    program.parse(process.argv);
    const providedName = program.args[0];
    if (providedName) {
        cliResults.dir = providedName;
    }
    cliResults.flags = program.opts();
    //skip everything and scaffold with defaults (TODO: write scaffold code)
    if (cliResults.flags.default) {
        const defaultSpinner = prompt.spinner();
        defaultSpinner.start();
        defaultSpinner.message(chalk.yellow('Scaffold using all default options'));
        defaultSpinner.stop(chalk.green.bold('Scaffold complete'));
        return prompt.note(
            `cd ${providedName ?? 'anura-app'} \nnpm i \nnpm run dev`,
            chalk.bold.blue('Done Creating. Now Run:')
        );
    }
    if (process.env.TERM_PROGRAM?.toLowerCase().includes('mintty')) {
        prompt.note(
            chalk.yellow(
                'WARNING: It looks like you are using MinTTY which is not interactive. This is most likely because you are using Git Bash. \nIf you are using Git Bash, please use it from another terminal like Windows Terminal. \nOr use -y/--default to use all default options '
            )
        );
        throw new Error();
    }
    const questions = await prompt.group(
        {
            ...(!providedName && {
                path: () =>
                    prompt.text({
                        message: chalk.blue('What is the projects name?'),
                        placeholder: 'anura-app'
                    })
            }),
            ...(cliResults.flags.git == undefined && {
                git: () =>
                    prompt.confirm({
                        message: chalk.blueBright('Do you want to create a Git repository?'),
                        initialValue: false
                    })
            }),
            ...(!cliResults.flags.license && {
                license: () =>
                    prompt.text({
                        message: chalk.cyan('What is the license you are going to use?'),
                        placeholder: 'MIT'
                    })
            }),
            ...(!cliResults.flags.author && {
                author: () =>
                    prompt.text({
                        message: chalk.cyanBright('What is your name?'),
                        placeholder: 'Billy'
                    })
            }),
            ...(!cliResults.flags.projectType && {
                projType: () =>
                    prompt.select({
                        message: chalk.magenta('What project type do you want to use?'),
                        initialValue: 'ts',
                        maxItems: 2,
                        options: [
                            { value: 'ts', label: chalk.bold.blue('TS') },
                            { value: 'js', label: chalk.bgYellow.bold.black('JS') }
                            //Uncomment when supported: { value: 'assemblyscript', label: 'AssemblyScript' }
                        ]
                    })
            }),
            ...(!cliResults.flags.install && {
                install: () =>
                    prompt.confirm({
                        message: chalk.magentaBright(
                            'Do you want to automatically install dependencies?'
                        ),
                        initialValue: false
                    })
            }),
            ...(!cliResults.flags.dreamland &&
                !cliResults.flags.projectType && {
                    dreamland: () =>
                        prompt.confirm({
                            message: chalk.green('Do you want to use dreamland.js?'),
                            initialValue: false
                        })
                })
        },
        {
            onCancel: () => {
                prompt.cancel(chalk.red.bold('Operation canceled'));
                process.exit(0);
            }
        }
    );
    let promptToContinue;
    if (cliResults.flags.dreamland && cliResults.flags.projectType === 'js') {
        prompt.note(chalk.yellow('When using JavaScript dreamland.js is not supported.'));
        promptToContinue = await prompt.group(
            {
                continue: () =>
                    prompt.confirm({
                        message: chalk.bold.yellow('Do you want to continue without it?'),
                        initialValue: true
                    })
            },
            {
                onCancel: () => {
                    prompt.cancel('Process Canceled');
                    process.exit(0);
                }
            }
        );
        if (!promptToContinue.continue) {
            prompt.cancel(chalk.red('Ok, canceling'));
            process.exit(0);
        } else {
            prompt.note(chalk.green('Ok, ignoring dreamland option'));
        }
    } else if (questions.dreamland && questions.projType === 'js') {
        prompt.note(chalk.yellow('When using JS, dreamland.js is not supported'));
        promptToContinue = await prompt.group(
            {
                continue: () =>
                    prompt.confirm({
                        message: chalk.yellow.bold('Do you want to continue wihtout it?'),
                        initialValue: true
                    })
            },
            {
                onCancel: () => {
                    prompt.cancel(chalk.red('Process canceled'));
                    process.exit(0);
                }
            }
        );
        if (!promptToContinue.continue) {
            prompt.cancel(chalk.red('Ok, canceling'));
            process.exit(0);
        } else {
            prompt.note(chalk.green('Ok, ignoring dreamland selection'));
        }
    }
    const spinner = prompt.spinner();
    spinner.start();
    spinner.message(chalk.yellow('Scaffolding project'));
    let dreamland;
    if (promptToContinue?.continue) {
        dreamland = false;
    } else if (cliResults.flags.dreamland) {
        dreamland = true;
    } else if (questions.dreamland) {
        dreamland = true;
    } else {
        dreamland = false;
    }
    await scaffold({
        projectName: questions.path ?? cliResults.dir,
        type: questions.projType ?? cliResults.flags.projectType,
        dreamland: dreamland,
        license: questions.license ?? cliResults.flags.license,
        author: questions.author ?? cliResults.flags.author
    });
    if (cliResults.flags.git === true) {
        spinner.message(chalk.yellow('Initializing Git repo'));
        try {
            await execa('git', ['init'], { cwd: questions.path ?? cliResults.dir });
            await execa('git', ['add', '-A'], { cwd: questions.path ?? cliResults.dir });
            await execa(
                'git',
                [
                    'commit',
                    '-m',
                    'Initial commit from Create anura app',
                    '--author="create-anura-app[bot] <example@example.com>"'
                ],
                { cwd: cliResults.dir }
            );
        } catch (err: any) {
            spinner.message(
                chalk.red('Initialization of the git repo failed, you will have to do it manually')
            );
        }
    }
    if (cliResults.flags.install === true) {
        spinner.message(chalk.yellow('Installing dependencies'));
        whichPM().then(async (pm) => {
            console.log(
                chalk.blue(
                    `Using ${cliResults.flags.packageManager ? cliResults.flags.packageManager : pm} to install dependencies...`
                )
            );
            try {
                await execa(
                    cliResults.flags.packageManager ? cliResults.flags.packageManager : pm,
                    ['install'],
                    { cwd: questions.path ?? cliResults.dir }
                );
            } catch (err: any) {
                spinner.message(chalk.red('Install failed trying again with npm'));
                try {
                    await execa('npm', ['install'], { cwd: questions.path ?? cliResults.dir });
                } catch (err: any) {
                    spinner.message(
                        chalk.red('Install failed, you will have to manually install dependencies')
                    );
                    failedInstall = true;
                }
            }
        });
    }
    spinner.stop(chalk.green.bold('Scaffold complete'));
    whichPM().then(async (pm) => {
        if (cliResults.flags.install !== true || failedInstall === true) {
            prompt.note(
                `cd ${questions.path ?? cliResults.dir} \n${cliResults.flags.packageManager ? cliResults.flags.packageManager : pm} install \n${cliResults.flags.packageManager ? cliResults.flags.packageManager : pm} run dev \nAnd have fun!`,
                chalk.bold.magenta('Done. Now Do:')
            );
        } else {
            prompt.note(
                `cd ${questions.path ?? cliResults.dir} \nAnd have fun!`,
                chalk.bold.magenta('Done. Now Do:')
            );
        }
    });
}

async function cli() {
    prompt.intro(chalk.red("Let's get started with your anura app!"));
    await project();
}

export { cli };
