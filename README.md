# Create Anura App (CAA)

Easily setup and create an [AnuraOS](https://github.com/mercuryworkshop/anuraos) app.

# Usage

### npx
```bash
npx create-anura-app@latest
```

### npm
```bash 
npm init anura-app
```

### yarn 
```bash 
yarn create anura-app 
```

### pnpm 
```bash 
pnpm create anura-app
```

### pnpm (dlx)
```bash
pnpm dlx create-anura-app@latest 
```

## Flags

> [!NOTE]
> Anything with `< >` around them means it is a *required* option

- `[dir]` - Skip the project name questions
    - Usage: `npx create-anura-app@latest newProject`

<br>

- `--git` - Explicitly tell the CLI to init a Git repo
    - Usage: `npx create-anura-app@latest --git`

<br>

- `--install, -i` - Explicitly tell the CLI to install dependencies
    - Usage: `npx create-anura-app@latest --install`
    - `npx create-anura-app@latest -i`

<br>

- `--default, -y` - Scaffold a project with all defaults.
    - Usage: `npx create-anura-app@latest --default`
    - `npx create-anura-app@latest -y`

<br>

- `--projectType <ts|js|assemblyscript>, -p <ts|js|assemblyscript>` - Select the type of project you want to use
    - Usage: `npx create-anura-app@latest --projectType js`
    - `npx create-anura-app@latest -p assemblyscript`

<br>

- `--dreamland, -d` - Whether to use dreamland or not
    - Usage: `npx create-anura-app@latest --dreamland`
    - `npx create-anura-app@latest -d`

<br>

- `--author <author>, -a <author>` - The authors name
    - Usage: `npx create-anura-app@latest --author motortruck1221`
    - `npx create-anura-app@latest -a motortruck1221`

<br>

- `--license <license>, -l <license>` - The license you want to use
    - Usage: `npx create-anura-app@latest --license MIT`
    - `npx create-anura-app@latest -l MIT`
