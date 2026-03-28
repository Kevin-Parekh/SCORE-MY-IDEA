# SCORE-MY-IDEA 🚀
### The Brutally Honest AI Critique Engine for Hackathons

**SCORE-MY-IDEA** is a full-stack AI application built to help hackathon participants refine their project ideas before they hit the judges. It uses Google's Gemini AI to provide sharp, actionable, and "brutally honest" feedback based on a standard 100-point hackathon rubric.

## ✨ Features
- **Instant Scoring**: Get a score out of 100 across 5 key categories (Problem Framing, AI Leverage, Usefulness, Execution, Clarity).
- **Actionable Critique**: Not just a score, but a "Weakness" vs "Needs" breakdown for every section.
- **AI Rewrite**: Automatically rewrites your submission text to be more professional and impactful.
- **60-Second Pitch**: Generates a high-pressure pitch script based on your project's strengths.

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express (Serverless via Vercel).
- **AI**: Google Gemini 3.1 Flash.

## 🚀 Quick Start

### Prerequisites
- Node.js installed.
- A Google Gemini API Key.

### Local Development
1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
This app is optimized for **Vercel**. 
1. Connect your GitHub repo to Vercel.
2. Add `GEMINI_API_KEY` to your Vercel Environment Variables.
3. Deploy!

---
*Built for the Weekly AI Generalist Hackathon.*
