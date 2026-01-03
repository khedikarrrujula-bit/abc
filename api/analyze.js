export const config = {
  runtime: "edge",
};

const PATTERNS = {
  "share otp": 3,
  "account blocked": 3,
  "press 1": 2,
  "legal action": 3,
  "urgent": 1,
  "bank officer": 2,
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { text } = await req.json();
  const input = text.toLowerCase();

  let score = 0;
  let matches = [];

  for (const phrase in PATTERNS) {
    if (input.includes(phrase)) {
      score += PATTERNS[phrase];
      matches.push(phrase);
    }
  }

  let label =
    score >= 6 ? "HIGH RISK SCAM 🚨" :
    score >= 3 ? "SUSPICIOUS ⚠️" :
    "SAFE ✅";

  return new Response(
    JSON.stringify({
      label,
      score,
      confidence: Math.min(score * 15, 95),
      matches
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
