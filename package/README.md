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

copy files from `./src` into `./package`  
- `package.json`
- `README.md`
- `LICENSE`
- `CREDIT`

```bash
npx npm-package-utils pack
```