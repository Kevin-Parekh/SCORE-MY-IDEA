# Deploying to Vercel (Full-Stack - Recommended)

Your app is now a **Full-Stack Application**. This means it has a backend server (`server.ts`) that securely handles your Gemini API key so it's never exposed to the browser.

## 1. Why Vercel?
Vercel is the best platform for this app because it can host both your React frontend and your Node.js backend server seamlessly using the `vercel.json` configuration I've provided.

## 2. Setup Steps

### Step A: Add your API Key to Vercel
1. Go to your [Vercel Project Dashboard](https://vercel.com/dashboard).
2. Select your project.
3. Go to **Settings** > **Environment Variables**.
4. Add a new variable:
   - **Key**: `GEMINI_API_KEY` (Note: **DO NOT** use the `VITE_` prefix here!)
   - **Value**: (Paste your actual Gemini API key here).
5. Click **Save**.

### Step B: Redeploy
1. Go to the **Deployments** tab in Vercel.
2. Click the three dots (...) on your latest deployment and select **Redeploy**.
3. Once the build is finished, your app will be live and secure!

## 3. Verifying the Setup
You can verify if your server is running and has the API key by visiting:
`https://your-vercel-url.vercel.app/api/health`

It should return a JSON object like this:
```json
{
  "status": "ok",
  "hasApiKey": true,
  "vercel": true
}
```

---

# Deploying to GitHub Pages (Legacy/Static Only)
**Note:** GitHub Pages only supports static sites. Since this app now requires a backend server for security, GitHub Pages is **not recommended** unless you revert to the insecure "client-side only" version. If you must use GitHub Pages, you will need to use `VITE_GEMINI_API_KEY` in your GitHub Secrets, but be aware this is less secure.
