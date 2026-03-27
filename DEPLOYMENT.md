# Deploying to GitHub Pages (Free)

Follow these steps to deploy your "Score My Idea" app to GitHub Pages for free.

## 1. Why do I need these variables?

- **`VITE_GEMINI_API_KEY`**: This is your "engine's fuel." Without it, the AI can't process your ideas. Since this is a static site (GitHub Pages), the key needs to be "baked in" to the code when it builds.
- **`VITE_BASE_PATH`**: This tells the app its "home address" on GitHub. GitHub Pages usually hosts apps at `https://username.github.io/repo-name/`. The `/repo-name/` part is the base path. If we don't set this, the app will try to load its styles and scripts from the root (`/`), which will fail on GitHub Pages.

## 2. How to set them (The Easy Way: GitHub Actions)

I have created a **GitHub Action** for you in `.github/workflows/deploy.yml`. This will automatically build and deploy your app every time you push code to GitHub.

### Step A: Add your API Key to GitHub
1. Go to your repository on GitHub.
2. Click **Settings** (top tab).
3. On the left sidebar, click **Secrets and variables** > **Actions**.
4. Click **New repository secret**.
5. Name: `VITE_GEMINI_API_KEY`
6. Value: (Paste your actual Gemini API key here).
7. Click **Add secret**.

### Step B: Enable GitHub Pages
1. In your repo, go to **Settings** > **Pages**.
2. Under "Build and deployment" > "Source", select **Deploy from a branch**.
3. Under "Branch", select **gh-pages** and **/(root)**.
4. Click **Save**.

### Step C: Trigger the build
1. Push any small change to your `main` branch (e.g., edit this `DEPLOYMENT.md` file).
2. Go to the **Actions** tab in your repo to see the progress.
3. Once it's green, your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

---

## Alternative: Deploying to Vercel (Recommended)
Vercel is often easier than GitHub Pages for React apps.

1. Create a [Vercel account](https://vercel.com).
2. Connect your GitHub repository.
3. In the project settings on Vercel, add your environment variable:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `your_actual_api_key_here`
4. Click "Deploy". Vercel will automatically build and host your app.

---

### Important Security Note
Since this is a static site (GitHub Pages), your API key will be embedded in the JavaScript code. This means anyone who knows how to use Browser DevTools can find it. 
- For a hackathon or personal demo, this is usually fine.
- For a real product, you should use a backend (like Vercel Functions or a Node.js server) to hide the key.
