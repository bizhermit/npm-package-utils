import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { sortPackageJsonProps } from "./utils";

const init = (cwd: string) => {
  const destPkgPath = path.join(cwd, "src/package.json");
  let destPkg: { [key: string]: any } = {};
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

export default init;