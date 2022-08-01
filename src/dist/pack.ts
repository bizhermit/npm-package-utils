import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { sortPackageJsonProps } from "./utils";

const packNpmPackage = (cwd: string) => {
  const destDirPath = path.join(cwd, "package");
  const rootPkg = JSON.parse(readFileSync(path.join(cwd, "package.json")).toString());
  const npmPkgPath = path.join(cwd, "src/package.json");
  const npmPkg = JSON.parse(readFileSync(npmPkgPath).toString());
  npmPkg.version = rootPkg.version || "0.0.0-alpha.0";
  let declaretionPath = path.join(cwd, "src/index.d.ts");
  if (existsSync(declaretionPath)) {
    copyFileSync(declaretionPath, path.join(destDirPath, "index.d.ts"));
    npmPkg.types = "index.d.ts";
    if ((npmPkg.files ?? []).length > 0 && npmPkg.files.indexOf("index.d.ts") < 0) {
      npmPkg.files.push("index.d.ts");
    }
  } else {
    declaretionPath = path.join(cwd, "src/dist/index.d.ts");
    if (existsSync(declaretionPath)) {
      copyFileSync(declaretionPath, path.join(destDirPath, "dist/index.d.ts"));
      npmPkg.types = "dist/index.d.ts";
      if ((npmPkg.files ?? []).length > 0 && npmPkg.files.indexOf("dist") < 0) {
        npmPkg.files.push("dist");
      }
    } else {
      if (existsSync(path.join(cwd, "package/index.d.ts"))) {
        npmPkg.types = "index.d.ts";
        if ((npmPkg.files ?? []).length > 0 && npmPkg.files.indexOf("index.d.ts") < 0) {
          npmPkg.files.push("index.d.ts");
        }
      } else if (existsSync(path.join(cwd, "package/dist/index.d.ts"))) {
        npmPkg.types = "dist/index.d.ts";
        if ((npmPkg.files ?? []).length > 0 && npmPkg.files.indexOf("dist") < 0) {
          npmPkg.files.push("dist");
        }
      }
    }
  }
  if (!existsSync(destDirPath)) {
    mkdirSync(destDirPath, { recursive: true });
  }
  writeFileSync(npmPkgPath, JSON.stringify(sortPackageJsonProps(npmPkg), null, 2));
  writeFileSync(path.join(destDirPath, "package.json"), JSON.stringify(sortPackageJsonProps(npmPkg), null, 2));
  const srcCreditPath = path.join(cwd, "CREDIT");
  if (existsSync(srcCreditPath)) copyFileSync(srcCreditPath, path.join(destDirPath, "CREDIT"));
  const srcLicensePath = path.join(cwd, "LICENSE");
  if (existsSync(srcLicensePath)) copyFileSync(srcLicensePath, path.join(destDirPath, "LICENSE"));
  const srcReadmePath = path.join(cwd, "README.md");
  if (existsSync(srcReadmePath)) copyFileSync(srcReadmePath, path.join(destDirPath, "README.md"));
};

export default packNpmPackage;