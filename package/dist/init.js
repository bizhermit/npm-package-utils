"use strict";var __importDefault=this&&this.__importDefault||function(s){return s&&s.__esModule?s:{default:s}};Object.defineProperty(exports,"__esModule",{value:!0});const fs_1=require("fs"),path_1=__importDefault(require("path")),utils_1=require("./utils"),initializeNpmPackageJson=s=>{const e=path_1.default.join(s,"src/package.json");let i={};(0,fs_1.existsSync)(e)&&(i=JSON.parse((0,fs_1.readFileSync)(e).toString()));const t=path_1.default.join(s,"package.json");if(!(0,fs_1.existsSync)(t))return void process.stderr.write("not found package.json");const n=path_1.default.join(s,"src");(0,fs_1.existsSync)(n)||(0,fs_1.mkdirSync)(n,{recursive:!0});const a=JSON.parse((0,fs_1.readFileSync)(t).toString());i.name=a.name??i.name??"",i.version=a.version??i.version??"0.0.0-alpha.0",i.description=a.description??i.description??"",i.repository=a.repository??i.repository??{type:"git",url:""},i.bugs=a.bugs??i.bugs??"",i.author=a.author??i.author??"",i.homepage=a.homepage??i.homepage??"",i.license=a.license??i.license??"MIT";const r=i.files??[];(0,fs_1.existsSync)(path_1.default.join(s,"src/bin/cli.ts"))||(0,fs_1.existsSync)(path_1.default.join(s,"src/bin/cli.js"))?(i.bin="bin/cli.js",r.indexOf("bin")<0&&r.push("bin")):(0,fs_1.existsSync)(path_1.default.join(s,"src/cli.ts"))||(0,fs_1.existsSync)(path_1.default.join(s,"src/cli.js"))?(i.bin="cli.js",r.indexOf("cli.js")<0&&r.push("cli.js")):delete i.bin,(0,fs_1.existsSync)(path_1.default.join(s,"src/dist/index.ts"))||(0,fs_1.existsSync)(path_1.default.join(s,"src/dist/index.js"))?(i.main="dist/index",r.indexOf("dist")<0&&r.push("dist")):(0,fs_1.existsSync)(path_1.default.join(s,"src/index.ts"))||(0,fs_1.existsSync)(path_1.default.join(s,"src/index.js"))?(i.main="index",r.indexOf("index.js")<0&&r.push("index.js")):(0,fs_1.existsSync)(path_1.default.join(s,"src/dist"))?(delete i.main,r.indexOf("dist")<0&&r.push("dist")):delete i.main,null==i.files&&(i.files=r),i.keywords=a.keywords??i.keywords??[],(0,fs_1.writeFileSync)(e,JSON.stringify((0,utils_1.sortPackageJsonProps)(i),null,2))};exports.default=initializeNpmPackageJson;