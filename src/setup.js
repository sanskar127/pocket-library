import { exec } from 'child_process';
import path from 'path';

// Function to install FFmpeg based on the user's operating system
function installFFmpeg() {
    const osType = process.platform;

    console.log("Starting FFmpeg installation...");

    // For Linux-based systems (Ubuntu, Fedora, etc.)
    if (osType === 'linux') {
        console.log("Detecting your package manager to install FFmpeg...");
        exec(
            'if command -v apt-get &>/dev/null; then sudo apt-get install -y ffmpeg; \
                elif command -v dnf &>/dev/null; then sudo dnf install -y ffmpeg; \
                elif command -v pacman &>/dev/null; then sudo pacman -S --noconfirm ffmpeg; \
                elif command -v zypper &>/dev/null; then sudo zypper install -y ffmpeg; \
                elif command -v yum &>/dev/null; then sudo yum install -y ffmpeg; \
                else echo "No supported package manager found for Linux"; fi',
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Error during installation:", error);
                    return;
                }
                console.log("Installation result:", stdout);
                if (stderr) {
                    console.error("Installation warnings:", stderr);
                }
            }
        );

    // For macOS
    } else if (osType === 'darwin') {
        console.log("Checking if Homebrew is installed on macOS...");
        exec(
            'if command -v brew &>/dev/null; then brew install ffmpeg; else echo "Homebrew is not installed."; fi',
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Error during installation:", error);
                    return;
                }
                console.log("Installation result:", stdout);
                if (stderr) {
                    console.error("Installation warnings:", stderr);
                }
            }
        );

    // For Windows (using winget)
    } else if (osType === 'win32') {
        console.log("Checking if winget is available on Windows...");
        exec(
            'if command -v winget &>/dev/null; then winget install --id FFmpeg.FFmpeg; else echo "winget is not installed."; fi',
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Error during installation:", error);
                    return;
                }
                console.log("Installation result:", stdout);
                if (stderr) {
                    console.error("Installation warnings:", stderr);
                }
            }
        );
    
    // If the OS is not supported (not Linux, macOS, or Windows)
    } else {
        console.log("Sorry, your operating system is not supported by this script.");
    }
}

// Function to set .js files to open with Node.js by default
function setJsDefaultWithNode() {
    const osType = process.platform;

    // Path to node executable (ensure this path is correct for your system)
    const nodePath = path.resolve('C:', 'Program Files', 'nodejs', 'node.exe');

    // Commands based on OS type
    if (osType === 'linux' || osType === 'darwin') {
        console.log("Setting .js files to open with Node.js...");

        const assocCommand = 'assoc .js=jsfile';
        const ftypeCommand = `ftype jsfile="${nodePath}" "%1" %*`;

        exec(assocCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("Error during file association:", error);
                return;
            }
            console.log("Successfully associated .js files with 'jsfile' type:", stdout);
        });

        exec(ftypeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("Error linking 'jsfile' to Node.js:", error);
                return;
            }
            console.log("Now, .js files will open with Node.js by default.");
        });

    } else if (osType === 'win32') {
        console.log("Setting .js files to open with Node.js on Windows...");

        const assocCommand = 'assoc .js=jsfile';
        const ftypeCommand = `ftype jsfile="C:\\Program Files\\nodejs\\node.exe" "%1" %*`;

        exec(assocCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("Error during file association:", error);
                return;
            }
            console.log("Successfully associated .js files with 'jsfile' type:", stdout);
        });

        exec(ftypeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("Error linking 'jsfile' to Node.js:", error);
                return;
            }
            console.log("Now, .js files will open with Node.js by default.");
        });
    } else {
        console.log("File association with Node.js is not supported on this OS.");
    }
}

// Automated process to install FFmpeg and set .js files to open with Node.js
function automateSetup() {
    console.log("Automating the setup...");

    // Install FFmpeg
    installFFmpeg();

    // Set .js files to open with Node.js
    setJsDefaultWithNode();
}

// Run the automated setup
automateSetup();
