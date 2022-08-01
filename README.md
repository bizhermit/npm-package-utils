# npm Package Utils

**Install**  

```bash
npm i -D @bizhermit/npm-package-utils
```

**Usage**  

generate or update `src/package.json` from `./package.json`

```bash
npx npm-package-utils init
```

---

generate index declaretion file.  
target extension is `.ts` and `.tsx`.  

```bash
npx npm-package-utils d.ts <options>
```

* `--ignore` ignore file or dir name.  `cli.ts` and `node_modules`, start width `.` directories are absolutely ignored.
* `--outDir` out dir name. default: `./src`
* `--outName` out file name. default: `index.d.ts`
* `--quiet` no console.

```bash
npx npm-package-utils d.ts --quiet --ignore hgoe.ts,fuga.ts --outDir ../package --outName custom.d.ts
```

---

copy files from `./src` into `./package`  
- `package.json`
- `README.md`
- `LICENSE`
- `CREDIT`

```bash
npx npm-package-utils pack
```