"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.sortPackageJsonProps=void 0;const sortPackageJsonProps=e=>{const s={},o=["name","version","description","keywords","repository","bugs","author","homepage","contributors","license","private","main","bin","types","files","scripts","dependencies","devDependencies","build","browser"];for(const r of o)r in e&&(s[r]=e[r]);return Object.keys(e).forEach((o=>{o in s||(s[o]=e[o])})),s};exports.sortPackageJsonProps=sortPackageJsonProps;