export const sortPackageJsonProps = (pkg: { [key: string]: any }) => {
  const sorted: { [key: string]: any } = {};
  const keys = [
    "name",
    "version",
    "description",
    "keywords",
    "repository",
    "bugs",
    "author",
    "homepage",
    "contributors",
    "license",
    "private",
    "main",
    "bin",
    "types",
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

export const isAbsPath = (str: string | undefined | null) => {
  if (str == null) return false;
  return str[1] === ":" || str.startsWith("\\\\");
};