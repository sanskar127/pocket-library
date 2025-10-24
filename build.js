const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra'); // To copy the binary

// Modify build step
esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/server.js',
  external: [],
}).then(() => {
  const outputFilePath = path.join(__dirname, 'dist', 'server.js');
  
  // Read the built file content
  const content = fs.readFileSync(outputFilePath, 'utf8');

  // Prepend the shebang line
  const shebang = '#!/usr/bin/env node\n';
  fs.writeFileSync(outputFilePath, shebang + content, 'utf8');

  // Copy the ffmpeg binary from ffmpeg-static to the dist directory
  const ffmpegBinaryPath = require('ffmpeg-static'); // This will give the path to the binary
  const ffmpegDestinationPath = path.join(__dirname, 'dist', 'ffmpeg'); // Target path for binary

  // Make sure the directory exists before copying
  fsExtra.ensureDirSync(path.dirname(ffmpegDestinationPath));
  fsExtra.copySync(ffmpegBinaryPath, ffmpegDestinationPath); // Copy the binary

  // Generate package.json
  const packageJsonPath = path.join(__dirname, 'dist', 'package.json');
  const data = {
    name: "pocket",
    version: "1.0.0",
    main: "server.js",
    bin: {
      pocket: "server.js"
    },
    dependencies: {}
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Build successful and package.json generated.');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
