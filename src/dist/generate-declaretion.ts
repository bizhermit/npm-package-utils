import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import path from "path";
import { isAbsPath } from "./utils";

const generateDeclaretionFile = (cwd: string, options?: {
  ignoreFileNames: Array<string>;
  quiet?: boolean;
  outDir?: string;
  outName?: string;
}) => {
  const rootPkg = JSON.parse(readFileSync(path.join(cwd, "package.json")).toString());
  const baseName = rootPkg.name;
  let outDir = "";
  if (isAbsPath(options?.outDir)) outDir = options?.outDir || "";
  else outDir = path.join(cwd, options?.outDir ?? "src");
  let contents = "";
  const ignoreFiles = [
    "node_modules",
    "cli.ts",
    ...(options?.ignoreFileNames ?? []),
  ];
  const writeLog = options?.quiet !== true;
  const impl = (relativePath: string) => {
    const files = readdirSync(path.join(cwd, "src", relativePath));
    files.forEach(file => {
      if (ignoreFiles.indexOf(file) >= 0) return;
      if (file.startsWith(".")) return;
      const fileStat = statSync(path.join(cwd, "src", relativePath, file));
      if (fileStat.isDirectory()) {
        impl(path.join(relativePath, file));
        return;
      }
      const ext = path.extname(file);
      if (ext !== ".ts" && ext !== ".tsx") return;
      if (file.endsWith("d.ts")) return;
      const modName = file.substring(0, file.length - ext.length);
      const relativePathName = `${path.join(relativePath, modName).replace(/\\/g, "/").replace(/\/\//g, "/")}`;
      const fileContents = readFileSync(path.join(cwd, "src", relativePath, file)).toString();
      const defaultExportName = fileContents.match(/export default ([A-Za-z][A-Za-z0-9$_]*)/)?.[1];
      if (defaultExportName == null || defaultExportName.length === 0) {
        if (writeLog) process.stdout.write(`[skip] ${file}\n`);
        return;
      }
      if (contents.length > 0) contents += "\n";
      contents += `declare module "${baseName}/${relativePathName}" {\n  const ${defaultExportName}: typeof import("./${relativePathName}");\n  // tslint:disable-next-line:export-just-namespace\n  export = ${defaultExportName};\n}`;
      if (writeLog) process.stdout.write(`- ${relativePathName} >> ${defaultExportName}\n`);
    });
  };
  impl("");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  const outFileName = path.join(outDir, options?.outName || "index.d.ts");
  writeFileSync(outFileName, contents);
  if (writeLog) process.stdout.write(`out: ${outFileName}\n`);
};

export default generateDeclaretionFile;