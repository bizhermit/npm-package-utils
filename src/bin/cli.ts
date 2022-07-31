#! /usr/bin/env node

import path from "path";
import generateDeclaretionFile from "../dist/generate-declaretion";
import initializeNpmPackageJson from "../dist/init";
import packNpmPackage from "../dist/pack";

let cwd = process.cwd();
const argPath = process.argv[3];
if (argPath && !argPath.startsWith("-")) {
  if (argPath[1] === ":" || argPath.startsWith("\\\\")) cwd = argPath;
  else cwd = path.join(cwd, argPath);
}

const command = process.argv[2];
process.stdout.write(`npm-package-utils:${command || "(unknown)"} ${cwd}\n`);

switch (command) {
  case "init":
    initializeNpmPackageJson(cwd);
    break;
  case "pack":
    packNpmPackage(cwd);
    break;
  case "d.ts":
    let ignoreFileNames: Array<string> = [];
    const ignoreFlagIndex = process.argv.findIndex(arg => arg === "--ignore");
    const quiet = process.argv.findIndex(arg => arg === "-quiet");
    if (ignoreFlagIndex > 0) {
      const ignoreFileNamesArg = process.argv[ignoreFlagIndex + 1];
      if (ignoreFileNamesArg?.length > 0) {
        ignoreFileNames = ignoreFileNamesArg.split(/,/);
      }
    }
    generateDeclaretionFile(cwd, { ignoreFileNames, quiet: quiet >= 0 });
    break;
  default:
    process.stderr.write(`unknown command\n`);
    break;
}