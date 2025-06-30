const { execSync } = require('child_process');
const path = require('path');

// This will run the server by executing 'node dist/index.js' (assuming 'dist' is your output directory)
const startServer = () => {
  try {
    const distPath = path.join(__dirname, 'dist', 'index.js');
    execSync(`node ${distPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
