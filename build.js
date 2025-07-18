// build.js
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/server.bundle.js',
  external: [], // Add modules here if you want to exclude them
}).then(() => {
  const outputPath = path.join(__dirname, 'dist', 'package.json');
  const data = {
    name: "pocket",
    version: "1.0.0",
    main: "server.js",
    bin: {
      pocket: "node server.bundle.js"
    },
    dependencies: {}
  };

  // Convert data to JSON string before writing
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Build successful and package.json generated.');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
