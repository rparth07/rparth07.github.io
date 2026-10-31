import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('.',import.meta.url));
await build({
  entryPoints:[`${directory}index.mjs`],
  bundle:true,
  platform:'node',
  target:'node24',
  format:'esm',
  outfile:`${directory}dist/index.mjs`,
  banner:{js:"import{createRequire as ___cr}from'node:module';const require=___cr(import.meta.url);"},
});
execFileSync('python',['-c',"import zipfile; z=zipfile.ZipFile('dist/function.zip','w',zipfile.ZIP_DEFLATED); z.write('dist/index.mjs','index.mjs'); z.close()"],{cwd:directory});
console.log('Built dist/function.zip for the Neon Functions deployment API.');
