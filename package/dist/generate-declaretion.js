"use strict";var __importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});const fs_1=require("fs"),path_1=__importDefault(require("path")),utils_1=require("./utils"),generateDeclaretionFile=(t,e)=>{const r=JSON.parse((0,fs_1.readFileSync)(path_1.default.join(t,"package.json")).toString()).name;let s="";s=(0,utils_1.isAbsPath)(e?.outDir)?e?.outDir||"":path_1.default.join(t,e?.outDir??"src");let i="";const n=["node_modules","cli.ts",...e?.ignoreFileNames??[]],a=!0!==e?.quiet,o=e=>{(0,fs_1.readdirSync)(path_1.default.join(t,"src",e)).forEach((s=>{if(n.indexOf(s)>=0)return;if(s.startsWith("."))return;if((0,fs_1.statSync)(path_1.default.join(t,"src",e,s)).isDirectory())return void o(path_1.default.join(e,s));const u=path_1.default.extname(s);if(".ts"!==u&&".tsx"!==u)return;if(s.endsWith("d.ts"))return;const l=s.substring(0,s.length-u.length),c=`${path_1.default.join(e,l).replace(/\\/g,"/").replace(/\/\//g,"/")}`,d=(0,fs_1.readFileSync)(path_1.default.join(t,"src",e,s)).toString().match(/export default ([A-Za-z][A-Za-z0-9$_]*)/)?.[1];null!=d&&0!==d.length?(i.length>0&&(i+="\n"),i+=`declare module "${r}/${c}" {\n  const ${d}: typeof import("./${c}");\n  // tslint:disable-next-line:export-just-namespace\n  export = ${d};\n}`,a&&process.stdout.write(`- ${c} >> ${d}\n`)):a&&process.stdout.write(`[skip] ${s}\n`)}))};o(""),(0,fs_1.existsSync)(s)||(0,fs_1.mkdirSync)(s,{recursive:!0});const u=path_1.default.join(s,e?.outName||"index.d.ts");(0,fs_1.writeFileSync)(u,i),a&&process.stdout.write(`out: ${u}\n`)};exports.default=generateDeclaretionFile;