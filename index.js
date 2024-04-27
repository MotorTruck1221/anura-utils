#!/usr/bin/env node

import { sync } from "cross-spawn";
import {
  mkdirSync,
  cpSync,
  readdirSync,
  renameSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { resolve, join, dirname } from "path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "url";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({ input, output });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let [_, __, projectName, type, framework, author, license] = process.argv;

if (!projectName) {
  console.log("No project name provided.");
  projectName = await rl.question("Enter a project name: ");
  if (!projectName) {
    console.log("No project name provided.");
    console.log("Exiting...");
    process.exit(1);
  }
}

if (!type) {
  console.log("No project type provided.");
  type = await rl.question(
    "Enter a project type: (typescript|javascript|assemblyscript) "
  );
}

if (!["typescript", "javascript", "assemblyscript"].includes(type)) {
  console.log("Invalid project type.");
  console.log("defaulting to typescript");
  type = "typescript";
}

if (!framework) {
  console.log("No framework provided.");
  framework = await rl.question("Enter a framework: (dreamland|none) ");
}

if (type === "javascript" && framework === "dreamland") {
  console.log("Dreamland is not supported for javascript projects.");
  console.log("defaulting to none");
  framework = "none";
}
if (!["dreamland", "none"].includes(framework)) {
  console.log("Invalid framework.");
  console.log("defaulting to none");
  framework = "none";
}

if (!author) {
  console.log("No author provided.");
  author = await rl.question("Enter the author's name: ");
}

if (!license) {
  console.log("No license provided.");
  license = await rl.question("Enter a license: ");
}

// Create directory for the new project
const currentDir = process.cwd();
const projectDir = resolve(currentDir, projectName);
mkdirSync(projectDir, { recursive: true });

// Copy the static template files to the project directory

function copyTemplateFiles(templateDir) {
  cpSync(templateDir, projectDir, { recursive: true });

  // Dotfiles have the _DOT prefix so that they are not picked up by this
  // project's configuration.
  readdirSync(projectDir).forEach((file) => {
    if (file.startsWith("_DOT")) {
      const dotFile = file.replace("_DOT", ".");
      renameSync(join(projectDir, file), join(projectDir, dotFile));
    }
  });
}

copyTemplateFiles(resolve(__dirname, "template"));
if (framework === "none" && type === "javascript") {
  copyTemplateFiles(resolve(__dirname, "template_javascript"));
}
if (framework === "none" && type === "typescript") {
  copyTemplateFiles(resolve(__dirname, "template_typescript"));
}
if (framework !== "none" && type === "typescript") {
  copyTemplateFiles(resolve(__dirname, "template_ts_" + framework));
}

// Modify manifest.json
const manifestPath = join(projectDir, "public", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest.package =
  author.split(" ")[0].toLowerCase() +
  "." +
  projectName.toLowerCase().replace(/\s|\_/g, ".");
manifest.name = projectName;
manifest.wininfo.title = projectName;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// Read the template information file
const info = readFileSync(join(__dirname, "info.json"), "utf8");
const { template, overrides } = JSON.parse(info);

// Update the project's package.json with the new project name
Object.assign(template, {
  name: projectName,
  author,
  license,
  description: `A new ${type} anura app`,
});

if (framework === "dreamland") {
  template.dependencies["dreamland"] = "^0.0.14-patch";
  template.description += " using dreamland";
}

// Merge the template and overrides
const projectPackageJson = Object.assign({}, template, overrides[type]);

console.log(projectPackageJson);

writeFileSync(
  join(projectDir, "package.json"),
  JSON.stringify(projectPackageJson, null, 2)
);

// Run `npm install` in the project directory to install
// the dependencies. We are using a third-party library
// called `cross-spawn` for cross-platform support.
// (Node has issues spawning child processes in Windows).
sync("npm", ["install", "--prefix", projectName], { stdio: "inherit" });

console.log("Success! Your new project is ready.");
console.log(`Created ${projectName} at ${projectDir}`);
rl.close();
