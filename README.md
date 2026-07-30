# AI-Powered CV Builder

This is a modern, free CV builder that uses AI to help you write professional summaries and job descriptions, ensuring your resume stands out.

## Running the Project Locally

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher is recommended)
- npm (usually comes with Node.js)

### 🖼️ Fixed Broken Logo Image on GitHub Pages

The logo image in the header was previously requested using `/logo.svg` (domain root path), which broke when hosted on subpaths like `https://suganthansuga405-collab.github.io/CV4U.github.io/`.

We have updated `Logo.tsx` to use `./logo.svg` (relative path) and re-compiled the `docs/` build. 

**When you re-upload or push the updated `docs/` folder to GitHub, the header logo image will render perfectly on GitHub Pages!**

---

### ❌ Why uploading a `.zip` file to GitHub does not work

As seen in your screenshot, uploading `CV4U Final 1.zip` directly to GitHub puts the compressed `.zip` file inside the repository. **GitHub and GitHub Pages cannot extract `.zip` files automatically.** Because GitHub cannot read inside the `.zip` file, it cannot find `index.html`, `package.json`, or the `docs/` folder, which is why GitHub Pages fell back to displaying `README.md`.

---

### ✅ How to fix it (3 Simple Steps)

1. **Delete `CV4U Final 1.zip` on GitHub**
   - Click on `CV4U Final 1.zip` in your GitHub repository.
   - Click the 🗑️ **Trash icon** (top right) to delete it, then click **Commit changes**.

2. **Extract the ZIP file on your computer**
   - Right-click the downloaded `.zip` file on your PC and choose **Extract All...**.
   - Open the extracted folder so you see files like `package.json`, `index.html`, `docs/`, `App.tsx`, etc.

3. **Upload the EXTRACTED FILES directly to GitHub**
   - In your GitHub repository, click **Add file** -> **Upload files**.
   - **Select ALL the individual files and folders inside your extracted folder** (including the `docs` folder) and drag them directly into the GitHub upload area.
   - Click **Commit changes**.

Once uploaded, GitHub Pages will instantly detect `docs/index.html` and **your live app will appear on `https://suganthansuga405-collab.github.io/CV4U.github.io/`!**

---

### ⚠️ Important: Do NOT double-click `index.html` directly

If you open `index.html` directly from your file browser (`file:///C:/Users/.../index.html`), it will show a **blank screen**. Modern Web/React applications use JavaScript modules (`import/export`) which modern browsers block when loaded directly from a local file path due to security restrictions (`file://` protocol CORS policy).

To run the application on your computer:

### Step-by-Step Local Run Instructions

1. **Extract the ZIP file**
   Right-click the downloaded `.zip` file and select **Extract All...** to an uncompressed folder.

2. **Install Node.js** (If not already installed)
   Download and install Node.js from [nodejs.org](https://nodejs.org/).

3. **Open Terminal / Command Prompt in the project folder**
   Open Command Prompt (Windows) or Terminal (Mac/Linux), and navigate into the extracted folder:
   ```cmd
   cd C:\path\to\extracted-folder
   ```

4. **Install Dependencies**
   Run:
   ```bash
   npm install
   ```

5. **Start the App**
   Run:
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   Copy the URL shown in your terminal (typically `http://localhost:5173` or `http://localhost:3000`) and paste it into Chrome.

### Fixing Vercel Error: `ENOENT: Could not read package.json`

If your Vercel deployment log shows `Could not read package.json: Error: ENOENT: no such file or directory, open '/vercel/path0/package.json'`, this happens because **`package.json` is inside a subfolder in your GitHub repository** (for example, if you uploaded a folder named `CV4U` or `ai-powered-cv-builder` directly onto GitHub).

#### Solution 1: Update Root Directory in Vercel Settings (Easiest)
1. Go to your project dashboard on **Vercel**.
2. Go to **Settings** -> **General**.
3. Scroll down to **Root Directory** and click **Edit**.
4. Type the exact folder name where your `package.json` is located in your GitHub repo (e.g. `CV4U` or `ai-powered-cv-builder`).
5. Click **Save**.
6. Go to the **Deployments** tab, click `...` next to the latest deployment, and select **Redeploy**.

#### Solution 2: Upload Files directly to the Root of GitHub
When uploading files to GitHub, do not drag and drop the parent folder itself. Instead, open the project folder, select all the files inside it (including `package.json`), and drag those directly into GitHub so `package.json` sits at the root (`/package.json`) of the repository.

### Vercel Build & Environment Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `GEMINI_API_KEY` in Vercel **Settings** -> **Environment Variables** if using AI features.
