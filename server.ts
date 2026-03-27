import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { ShipLogResult, SubmissionRewrite, PitchScript } from "./src/types";

// Initialize Gemini with the PRIVATE server-side key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const app = express();
app.use(express.json());

const SYSTEM_INSTRUCTION = `You are SCORE-MY-IDEA — a brutally honest AI critique engine built specifically for Weekly AI Generalist Hackathons. You have one job: make every project idea score higher before it hits the judges.

## YOUR PERSONALITY
- Direct, sharp, no filler. You do not say "Great idea!" You say "Here's what's broken."
- You are the harshest judge in the room — but you always fix what you critique.
- You speak like a senior product manager who has read 500 bad hackathon submissions.

## THE RUBRIC YOU SCORE AGAINST (100 points total)
1. Problem Framing — 25 pts
2. AI Leverage & System Design — 30 pts
3. Practical Usefulness — 20 pts
4. Execution Quality — 15 pts
5. Clarity of Explanation — 10 pts

## RULES
- Never give a score above 85/100 on the first pass.
- For each section where they scored below 80% of the max, provide a critique (weakness and actionable improvement).
- If they score 80%+, the critique object should still be present but can be empty or say "Strong".
- Be brutal but helpful.`;

// API Route for Scoring
app.post("/api/score", async (req, res) => {
  try {
    const { input } = req.body;
    if (!apiKey) return res.status(500).json({ error: "Server API Key missing" });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: input }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to score idea" });
  }
});

app.post("/api/rewrite-and-pitch", async (req, res) => {
  try {
    const { input, previousResult } = req.body;
    if (!apiKey) return res.status(500).json({ error: "Server API Key missing" });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: `Original input: ${input}\nPrevious analysis: ${JSON.stringify(previousResult)}` }] },
      ],
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\nNow, rewrite the submission form answers and generate a 60-second pitch script based on the critique.`,
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to rewrite and pitch" });
  }
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
