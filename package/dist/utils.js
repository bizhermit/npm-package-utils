"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isAbsPath=exports.sortPackageJsonProps=void 0;const sortPackageJsonProps=s=>{const e={},o=["name","version","description","keywords","repository","bugs","author","homepage","contributors","license","private","main","bin","types","files","scripts","dependencies","devDependencies","build","browser"];for(const t of o)t in s&&(e[t]=s[t]);return Object.keys(s).forEach((o=>{o in e||(e[o]=s[o])})),e};exports.sortPackageJsonProps=sortPackageJsonProps;const isAbsPath=s=>null!=s&&(":"===s[1]||s.startsWith("\\\\"));exports.isAbsPath=isAbsPath;