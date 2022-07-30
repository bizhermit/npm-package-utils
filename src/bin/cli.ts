#! /usr/bin/env node

import path from "path";
import generateDeclaretionFile from "../dist/generate-declaretion";
import init from "../dist/init";
import pack from "../dist/pack";

let cwd = process.cwd();
const argPath = process.argv[3];
if (argPath) {
  if (argPath[1] === ":" || argPath.startsWith("\\\\")) cwd = argPath;
  else cwd = path.join(cwd, argPath);
}

const command = process.argv[2];
process.stdout.write(`npm-package-utils:${command || "(unknown)"} ${cwd}\n`);

switch (command) {
  case "init":
    init(cwd);
    break;
  case "pack":
    pack(cwd);
    break;
  case "d.ts":
    let ignoreFileNames: Array<string> = [];
    const ignoreFlagIndex = process.argv.findIndex(arg => arg === "--ignore");
    if (ignoreFlagIndex > 0) {
      const ignoreFileNamesArg = process.argv[ignoreFlagIndex + 1];
      if (ignoreFileNamesArg?.length > 0) {
        ignoreFileNames = ignoreFileNamesArg.split(/,/);
      }
    }
    generateDeclaretionFile(cwd, ignoreFileNames);
    break;
  default:
    process.stderr.write(`unknown command\n`);
    break;
}