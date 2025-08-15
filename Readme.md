# 🧰 Full Setup Guide: Pocket Media Library (Experimental Prototype)

---

## 📦 Part 1: Link a Local Node.js Package Using `npm link`

This allows you to use a local package in another project for development without publishing it.

### 1️⃣ In Your Local Package Directory (e.g., `my-utils`)

```bash
cd path/to/pocket-media-library
npm link
```

This makes your package available globally under its name in `package.json`.

---

## 🪟 Part 2: Set `server.js` to Always Open with Node.js (Windows 10/11)

### Steps:

1. **Locate `server.js`**

   * Open File Explorer and go to your project folder (e.g., `path/to/pocket-media-library`)
   * Find `server.js`

2. **Right-Click `server.js` → "Open with" → "Choose another app"**

3. **Select Node.js:**

   * If listed, select **Node.js**
   * If not:

     * Click **"More apps"**
     * Scroll down and choose **"Look for another app on this PC"**
     * Navigate to:

       ```
       C:\Program Files\nodejs\node.exe
       ```
     * Select `node.exe` and click **Open**

4. **Set as Default:**

   * ✅ Check **"Always use this app to open .js files"**
   * Click **OK**

✅ You're all set!

---

## 🚀 Part 4: Start the Server with `pocket`

### 1️⃣ Open a Terminal in Your Media Directory

* Right-click your media folder while holding **Shift** and choose:

  * **"Open PowerShell window here"** or **"Open in Terminal"**

Or use:

```bash
cd path/to/pocket-media-library
```

### 2️⃣ Run the Server:

```bash
pocket
```

The server will start and show:

* A **QR code** (scan it with your phone)
* A **host IP address and port** (open it in any browser on the same network)

Example:

```
Host: http://192.168.1.42:3000
```
