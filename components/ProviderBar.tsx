"use client";
import type { ProviderMode } from "@/lib/types";

const PROVIDERS: { id: ProviderMode; label: string; color: string }[] = [
  { id: "auto",       label: "Auto",       color: "#c6f135" },
  { id: "groq",       label: "Groq",       color: "#f97316" },
  { id: "mistral",    label: "Mistral",    color: "#a78bfa" },
  { id: "nvidia",     label: "NVIDIA",     color: "#76b900" },
  { id: "openrouter", label: "OpenRouter", color: "#38bdf8" },
];

export default function ProviderBar({
  value, onChange,
}: { value: ProviderMode; onChange: (v: ProviderMode) => void }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-s2 rounded-lg border border-border">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className="relative px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-150"
          style={{
            background: value === p.id ? `${p.color}18` : "transparent",
            color: value === p.id ? p.color : "#555",
            border: value === p.id ? `1px solid ${p.color}40` : "1px solid transparent",
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
