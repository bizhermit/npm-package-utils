import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import path from "path";

const generateDeclaretionFile = (cwd: string, ignoreFileNames: Array<string> = []) => {
  const rootPkg = JSON.parse(readFileSync(path.join(cwd, "package.json")).toString());
  const baseName = rootPkg.name;
  let contents = "";
  const ignoreFiles = [
    "node_modules",
    "cli.ts",
    ...ignoreFileNames,
  ];
  const impl = (relativePath: string) => {
    const files = readdirSync(path.join(cwd, "src", relativePath));
    files.forEach(file => {
      if (ignoreFiles.indexOf(file) >= 0) return;
      const fileStat = statSync(path.join(cwd, "src", relativePath, file));
      if (fileStat.isDirectory()) {
        impl(path.join(relativePath, file));
        return;
      }
      const ext = path.extname(file);
      if (ext !== ".ts") return;
      if (file.endsWith("d.ts")) return;
      const modName = file.substring(0, file.length - ext.length);
      const relativePathName = `${path.join(relativePath, modName).replace(/\\/g, "/").replace(/\/\//g, "/")}`;
      const fileContents = readFileSync(path.join(cwd, "src", relativePath, file)).toString();
      const defaultExportName = fileContents.match(/export default ([A-Za-z][A-Za-z0-9$_]*)/)?.[1];
      if (defaultExportName == null || defaultExportName.length === 0) return;
      if (contents.length > 0) contents += "\n";
      contents += `declare module "${baseName}/${relativePathName}" {\n  const ${defaultExportName}: "${relativePathName}";\n  export default ${defaultExportName};\n}`;
    });
  };
  impl("");
  writeFileSync(path.join(cwd, "src", "index.d.ts"), contents);
};

export default generateDeclaretionFile;