// build.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/server.js',
  external: [], // Add modules here if you want to exclude them
}).catch(() => process.exit(1));
