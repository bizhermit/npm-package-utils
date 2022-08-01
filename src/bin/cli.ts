#! /usr/bin/env node

import { getKeyArg, hasKeyArg } from "@bizhermit/cli-utils";
import path from "path";
import generateDeclaretionFile from "../dist/generate-declaretion";
import initializeNpmPackageJson from "../dist/init";
import packNpmPackage from "../dist/pack";
import { isAbsPath } from "../dist/utils";

let cwd = process.cwd();
const argPath = process.argv[3];
if (argPath && !argPath.startsWith("-")) {
  if (isAbsPath(argPath)) cwd = argPath;
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
    generateDeclaretionFile(cwd, {
      ignoreFileNames: getKeyArg("--ignore")?.split(",") ?? [],
      quiet: hasKeyArg("--quiet"),
      outDir: getKeyArg("--outDir"),
      outName: getKeyArg("--outName"),
    });
    break;
  default:
    process.stderr.write(`unknown command\n`);
    break;
}