import { ShipLogResult, SubmissionRewrite, PitchScript } from "../types";

export async function scoreProject(input: string): Promise<ShipLogResult> {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) throw new Error("Failed to score idea");
  return await response.json();
}

export async function rewriteAndPitch(input: string, previousResult: ShipLogResult): Promise<{ rewrite: SubmissionRewrite; pitch: PitchScript }> {
  const response = await fetch("/api/rewrite-and-pitch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, previousResult }),
  });

  if (!response.ok) throw new Error("Failed to rewrite and pitch");
  return await response.json();
}
