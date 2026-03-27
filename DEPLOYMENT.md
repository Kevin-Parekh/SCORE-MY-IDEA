# Deploying to GitHub Pages (Free)

Follow these steps to deploy your "Score My Idea" app to GitHub Pages for free.

## 1. Get a Free Gemini API Key
Since this app uses AI, you need an API key.
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a new API key (it's free for reasonable use).

## 2. Prepare your GitHub Repository
1. Create a new repository on GitHub (e.g., `score-my-idea`).
2. Initialize git in your local project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 3. Configure for GitHub Pages
1. Open `.env` (create it if it doesn't exist) and add your key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   VITE_BASE_PATH=/YOUR_REPO_NAME/
   ```
   *Note: If your repo is `https://github.com/john/my-app`, then `VITE_BASE_PATH` should be `/my-app/`.*

2. Update `package.json` (already done for you in this project) to include:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
   ```

## 4. Deploy
Run the following command in your terminal:
```bash
npm run deploy
```
This will build your app and push the `dist` folder to a `gh-pages` branch on GitHub.

## 5. Enable GitHub Pages on GitHub
1. Go to your repo on GitHub.
2. Settings > Pages.
3. Under "Build and deployment", ensure Source is "Deploy from a branch".
4. Select the `gh-pages` branch and `/ (root)` folder.
5. Save. Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME` in a few minutes!

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
