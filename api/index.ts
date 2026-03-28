import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import "dotenv/config";

const app = express();
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    vercel: !!process.env.VERCEL,
  });
});

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

const SCORE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    overallScore: { type: Type.NUMBER },
    verdict: { type: Type.STRING },
    sections: {
      type: Type.OBJECT,
      properties: {
        problemFraming: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            max: { type: Type.NUMBER },
            critique: {
              type: Type.OBJECT,
              properties: {
                weak: { type: Type.STRING },
                needs: { type: Type.STRING },
              },
              required: ["weak", "needs"],
            },
          },
          required: ["score", "max"],
        },
        aiLeverage: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            max: { type: Type.NUMBER },
            critique: {
              type: Type.OBJECT,
              properties: {
                weak: { type: Type.STRING },
                needs: { type: Type.STRING },
              },
              required: ["weak", "needs"],
            },
          },
          required: ["score", "max"],
        },
        practicalUsefulness: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            max: { type: Type.NUMBER },
            critique: {
              type: Type.OBJECT,
              properties: {
                weak: { type: Type.STRING },
                needs: { type: Type.STRING },
              },
              required: ["weak", "needs"],
            },
          },
          required: ["score", "max"],
        },
        executionQuality: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            max: { type: Type.NUMBER },
            critique: {
              type: Type.OBJECT,
              properties: {
                weak: { type: Type.STRING },
                needs: { type: Type.STRING },
              },
              required: ["weak", "needs"],
            },
          },
          required: ["score", "max"],
        },
        clarity: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            max: { type: Type.NUMBER },
            critique: {
              type: Type.OBJECT,
              properties: {
                weak: { type: Type.STRING },
                needs: { type: Type.STRING },
              },
              required: ["weak", "needs"],
            },
          },
          required: ["score", "max"],
        },
      },
      required: ["problemFraming", "aiLeverage", "practicalUsefulness", "executionQuality", "clarity"],
    },
  },
  required: ["projectName", "overallScore", "verdict", "sections"],
};

const REWRITE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    rewrite: {
      type: Type.OBJECT,
      properties: {
        problemStatement: { type: Type.STRING },
        whoIsThisFor: { type: Type.STRING },
        howAiIsUsed: { type: Type.STRING },
        howItHelps: { type: Type.STRING },
        solutionExplanation: { type: Type.STRING },
      },
      required: ["problemStatement", "whoIsThisFor", "howAiIsUsed", "howItHelps", "solutionExplanation"],
    },
    pitch: {
      type: Type.OBJECT,
      properties: {
        hook: { type: Type.STRING },
        problem: { type: Type.STRING },
        solution: { type: Type.STRING },
        demoMoment: { type: Type.STRING },
        ask: { type: Type.STRING },
      },
      required: ["hook", "problem", "solution", "demoMoment", "ask"],
    },
  },
  required: ["rewrite", "pitch"],
};

// API Route for Scoring
app.post("/api/score", async (req, res) => {
  try {
    const { input } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server API Key missing" });

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{ role: "user", parts: [{ text: input }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: SCORE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Scoring Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to score idea" });
  }
});

app.post("/api/rewrite-and-pitch", async (req, res) => {
  try {
    const { input, previousResult } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server API Key missing" });

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [
        { role: "user", parts: [{ text: `Original input: ${input}\nPrevious analysis: ${JSON.stringify(previousResult)}` }] },
      ],
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\nNow, rewrite the submission form answers and generate a 60-second pitch script based on the critique.`,
        responseMimeType: "application/json",
        responseSchema: REWRITE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Rewrite Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to rewrite and pitch" });
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// For Vercel, we export the app. For local, we listen.
if (process.env.VERCEL !== "1") {
  if (process.env.NODE_ENV !== "production") {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((vite) => {
      app.use(vite.middlewares);
      const PORT = 3000;
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Development server running on http://localhost:${PORT}`);
      });
    });
  } else {
    // Production mode (not on Vercel, e.g. local npm run start)
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Production server running on http://localhost:${PORT}`);
    });
  }
}

export default app;
