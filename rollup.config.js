// Rollup plugins.
import typescript from 'rollup-plugin-typescript';
import tslint from "rollup-plugin-tslint";

const tsPlugin = typescript({
  "lib": [
    "es2017",
    "dom"
  ],
  "moduleResolution": "node",
  "target": "es6",
  "strict": true,
  "skipLibCheck": true,
  "noUnusedLocals": true,
  "noImplicitAny": false,
  "strictFunctionTypes": false,
  "strictPropertyInitialization": true,
  "strictNullChecks": true
});

const plugins = [
  tslint(),
  tsPlugin
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'build/app.js',
      format: 'iife',
      sourcemap: true
    },
    plugins
  },
  // {
  //   input: 'src/workers/spotifyApiHelper/index.ts',
  //   output: {
  //     file: 'build/workers/spotifyApiHelper.js',
  //     format: 'iife',
  //     sourcemap: true
  //   },
  //   plugins: [tsPlugin]
  // }
];
