#! /usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

type Struct = { [key: string]: any };

let cwd = process.cwd();
const argPath = process.argv[3];
if (argPath) {
  if (argPath[1] === ":" || argPath.startsWith("\\\\")) cwd = argPath;
  else cwd = path.join(cwd, argPath);
}

const sortPackageJsonProps = (pkg: Struct) => {
  const sorted: Struct = {};
  const keys = [
    "name",
    "version",
    "description",
    "repository",
    "bugs",
    "author",
    "homepage",
    "contributors",
    "license",
    "private",
    "main",
    "bin",
    "files",
    "scripts",
    "dependencies",
    "devDependencies",
    "build",
    "browser",
  ]
  for (const key of keys) {
    if (key in pkg) sorted[key] = pkg[key];
  }
  Object.keys(pkg).forEach((key) => {
    if (key in sorted) return;
    sorted[key] = pkg[key];
  });
  return sorted;
};

const init = () => {
  const destPkgPath = path.join(cwd, "src/package.json");
  let destPkg: Struct = {};
  if (existsSync(destPkgPath)) {
    destPkg = JSON.parse(readFileSync(destPkgPath).toString());
  }
  const srcPkgPath = path.join(cwd, "package.json");
  if (!existsSync(srcPkgPath)) {
    process.stderr.write("not found package.json");
    return;
  }
  const srcDirPath = path.join(cwd, "src");
  if (!existsSync(srcDirPath)) {
    mkdirSync(srcDirPath, { recursive: true });
  }
  const srcPkg = JSON.parse(readFileSync(srcPkgPath).toString());
  destPkg.name = srcPkg.name ?? destPkg.name ?? "";
  destPkg.version = srcPkg.version ?? destPkg.version ?? "0.0.0-alpha.0";
  destPkg.description = srcPkg.description ?? destPkg.description ?? "";
  destPkg.repository = srcPkg.repository ?? destPkg.repository ?? { type: "git", url: "" };
  destPkg.bugs = srcPkg.bugs ?? destPkg.bugs ?? "";
  destPkg.author = srcPkg.author ?? destPkg.author ?? "";
  destPkg.homepage = srcPkg.homepage ?? destPkg.homepage ?? "";
  destPkg.license = srcPkg.license ?? destPkg.license ?? "MIT";
  const files: Array<string> = [];
  if (existsSync(path.join(cwd, "src/bin/cli.ts")) || existsSync(path.join(cwd, "src/bin/cli.js"))) {
    destPkg.bin = "bin/cli.js";
    files.push("bin");
  } else if (existsSync(path.join(cwd, "src/cli.ts")) || existsSync(path.join(cwd, "src/cli.js"))) {
    destPkg.bin = "cli.js";
    files.push("cli.js");
  }
  if (existsSync(path.join(cwd, "src/dist/index.ts")) || existsSync(path.join(cwd, "src/dist/index.js"))) {
    destPkg.main = "dist/index";
    files.push("dist");
  } else if (existsSync(path.join(cwd, "src/index.ts")) || existsSync(path.join(cwd, "src/index.js"))) {
    destPkg.main = "index";
    files.push("index.js");
  } else if (existsSync(path.join(cwd, "src/dist"))) {
    destPkg.main = "dist";
    files.push("dist");
  }
  if (destPkg.files == null) destPkg.files = files;
  destPkg.keywords = srcPkg.keywords ?? destPkg.keywords ?? [];

  writeFileSync(destPkgPath, JSON.stringify(sortPackageJsonProps(destPkg), null, 2));
};

const pack = () => {
  const rootPkg = JSON.parse(readFileSync(path.join(cwd, "package.json")).toString());
  const npmPkg = JSON.parse(readFileSync(path.join(cwd, "src/package.json")).toString());
  npmPkg.version = rootPkg.version || "0.0.0-alpha.0";
  const destDirPath = path.join(cwd, "package");
  if (!existsSync(destDirPath)) {
    mkdirSync(destDirPath, { recursive: true });
  }
  writeFileSync(path.join(destDirPath, "package.json"), JSON.stringify(sortPackageJsonProps(npmPkg), null, 2));
  const srcCreditPath = path.join(cwd, "CREDIT");
  if (existsSync(srcCreditPath)) copyFileSync(srcCreditPath, path.join(destDirPath, "CREDIT"));
  const srcLicensePath = path.join(cwd, "LICENSE");
  if (existsSync(srcLicensePath)) copyFileSync(srcLicensePath, path.join(destDirPath, "LICENSE"));
  const srcReadmePath = path.join(cwd, "README.md");
  if (existsSync(srcReadmePath)) copyFileSync(srcReadmePath, path.join(destDirPath, "README.md"));
};

const command = process.argv[2];
process.stdout.write(`npm-package-utils:${command || "(unknown)"} ${cwd}\n`);

switch (command) {
  case "init":
    init();
    break;
  case "pack":
    pack();
    break;
  default:
    process.stderr.write(`unknown command\n`);
    break;
}