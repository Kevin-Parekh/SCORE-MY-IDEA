import { ShipLogResult, SubmissionRewrite, PitchScript } from "../types";

export async function scoreProject(input: string): Promise<ShipLogResult> {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to score idea";
    try {
      const body = await response.text();
      try {
        const json = JSON.parse(body);
        errorMessage = json.error || json.message || body || errorMessage;
      } catch (e) {
        errorMessage = body || errorMessage;
      }
    } catch (e) {
      errorMessage = `Server Error: ${response.status} ${response.statusText}`;
    }
    if (errorMessage.length > 200) {
      errorMessage = errorMessage.substring(0, 200) + "...";
    }
    throw new Error(errorMessage);
  }
  return await response.json();
}

export async function rewriteAndPitch(input: string, previousResult: ShipLogResult): Promise<{ rewrite: SubmissionRewrite; pitch: PitchScript }> {
  const response = await fetch("/api/rewrite-and-pitch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, previousResult }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to rewrite and pitch";
    try {
      const body = await response.text();
      try {
        const json = JSON.parse(body);
        errorMessage = json.error || json.message || body || errorMessage;
      } catch (e) {
        errorMessage = body || errorMessage;
      }
    } catch (e) {
      errorMessage = `Server Error: ${response.status} ${response.statusText}`;
    }
    if (errorMessage.length > 200) {
      errorMessage = errorMessage.substring(0, 200) + "...";
    }
    throw new Error(errorMessage);
  }
  return await response.json();
}
