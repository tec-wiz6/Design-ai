import type { DesignRequestPayload } from "./types";
import { buildSystemPrompt } from "./prompt";

const GROQ_KEY       = process.env.GROQ_API_KEY ?? "";
const MISTRAL_KEY    = process.env.MISTRAL_API_KEY ?? "";
const NVIDIA_KEY     = process.env.NVIDIA_API_KEY ?? "";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? "";

async function postChat(
  url: string,
  headers: Record<string, string>,
  body: object
): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function buildMessages(systemPrompt: string, userGoal: string) {
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Design goal: ${userGoal}\n\nGenerate the complete HTML now.` },
  ];
}

export async function callGroq(payload: DesignRequestPayload, imageUrls: string[]): Promise<{ html: string; model: string }> {
  const sp = buildSystemPrompt(payload.brief, payload.mode, imageUrls);
  const html = await postChat(
    "https://api.groq.com/openai/v1/chat/completions",
    { Authorization: `Bearer ${GROQ_KEY}` },
    { model: "llama-3.3-70b-versatile", messages: buildMessages(sp, payload.brief.goal), max_tokens: 8192, temperature: 0.7 }
  );
  return { html, model: "groq/llama-3.3-70b" };
}

export async function callMistral(payload: DesignRequestPayload, imageUrls: string[]): Promise<{ html: string; model: string }> {
  const sp = buildSystemPrompt(payload.brief, payload.mode, imageUrls);
  const html = await postChat(
    "https://api.mistral.ai/v1/chat/completions",
    { Authorization: `Bearer ${MISTRAL_KEY}` },
    { model: "mistral-large-latest", messages: buildMessages(sp, payload.brief.goal), max_tokens: 8192, temperature: 0.7 }
  );
  return { html, model: "mistral/large" };
}

export async function callNvidia(payload: DesignRequestPayload, imageUrls: string[]): Promise<{ html: string; model: string }> {
  const sp = buildSystemPrompt(payload.brief, payload.mode, imageUrls);
  const html = await postChat(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    { Authorization: `Bearer ${NVIDIA_KEY}` },
    { model: "meta/llama-3.3-70b-instruct", messages: buildMessages(sp, payload.brief.goal), max_tokens: 8192, temperature: 0.7 }
  );
  return { html, model: "nvidia/llama-3.3-70b" };
}

export async function callOpenRouter(payload: DesignRequestPayload, imageUrls: string[]): Promise<{ html: string; model: string }> {
  const sp = buildSystemPrompt(payload.brief, payload.mode, imageUrls);
  const html = await postChat(
    "https://openrouter.ai/api/v1/chat/completions",
    { Authorization: `Bearer ${OPENROUTER_KEY}`, "HTTP-Referer": "https://pixie.design", "X-Title": "Pixie Design Studio" },
    { model: "meta-llama/llama-3.3-70b-instruct", messages: buildMessages(sp, payload.brief.goal), max_tokens: 8192, temperature: 0.7 }
  );
  return { html, model: "openrouter/llama-3.3-70b" };
}

export async function callAutoModel(
  payload: DesignRequestPayload,
  imageUrls: string[]
): Promise<{ html: string; model: string }> {
  const mode = payload.providerMode;

  if (mode !== "auto") {
    const fn = { groq: callGroq, mistral: callMistral, nvidia: callNvidia, openrouter: callOpenRouter }[mode];
    if (!fn) throw new Error(`Unknown provider: ${mode}`);
    return fn(payload, imageUrls);
  }

  // Auto: try in order, skip if key missing
  const chain: Array<{ name: string; fn: typeof callGroq; key: string }> = [
    { name: "groq",       fn: callGroq,       key: GROQ_KEY },
    { name: "nvidia",     fn: callNvidia,     key: NVIDIA_KEY },
    { name: "openrouter", fn: callOpenRouter, key: OPENROUTER_KEY },
    { name: "mistral",    fn: callMistral,    key: MISTRAL_KEY },
  ];

  const errors: string[] = [];
  for (const { fn, key, name } of chain) {
    if (!key) { errors.push(`${name}: no key`); continue; }
    try { return await fn(payload, imageUrls); }
    catch (e) { errors.push(`${name}: ${(e as Error).message}`); }
  }
  throw new Error(`All providers failed:\n${errors.join("\n")}`);
}
