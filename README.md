# AI-Powered CV Builder

This is a modern, free CV builder that uses AI to help you write professional summaries and job descriptions, ensuring your resume stands out.

## Running the Project Locally

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher is recommended)
- npm (usually comes with Node.js)

### 🚀 Why it showed `CV4U.github.io` & How to Fix It

In your screenshot, GitHub Pages is set to **`main` branch `/docs`**, but previously the **`docs` folder did not exist** in your GitHub repository, so GitHub Pages fell back to displaying the title of your `README.md` file.

We have now **built and added the `/docs` folder** (containing `docs/index.html`, `docs/assets/`, and `docs/.nojekyll`) directly into your project!

#### To complete the publish on GitHub Pages:

1. **Upload/Push the new `docs` folder to GitHub**:
   - Export or download the project files.
   - Commit and push the files (including the **`docs`** folder and **`.github`** folder) to your GitHub repository `CV4U.github.io`.

2. **Trigger GitHub Pages Deployment**:
   - Because your GitHub Pages is ALREADY configured to **`main` -> `/docs`** (as shown in your screenshot), as soon as GitHub detects the new commit containing the `docs/index.html` file, GitHub Pages will automatically build and publish your live React app!
   - Alternatively, you can change **Source** under **Build and deployment** to **"GitHub Actions"** to use the automated workflow in `.github/workflows/deploy.yml`.

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
