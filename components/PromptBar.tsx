"use client";
import { useRef, useState } from "react";

const TONES = ["minimal", "futuristic", "playful", "bold", "corporate", "brutalist"] as const;
const SECTIONS = ["hero", "features", "pricing", "faq", "cta", "footer"] as const;
const QUICK = [
  "Dark SaaS landing page",
  "Mobile app UI kit",
  "Analytics dashboard",
  "Startup pitch deck",
  "E-commerce homepage",
];

interface Props {
  onGenerate: (opts: {
    goal: string; tone: string; sections: string[];
    imageryKeywords: string[]; isRefinement: boolean; refinementNote?: string;
  }) => void;
  isGenerating: boolean;
  hasDesign: boolean;
}

export default function PromptBar({ onGenerate, isGenerating, hasDesign }: Props) {
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("bold");
  const [sections, setSections] = useState<string[]>(["hero", "features", "pricing", "cta", "footer"]);
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  function toggleSection(s: string) {
    setSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  }

  function handleSubmit() {
    if (!goal.trim() || isGenerating) return;
    const kw = goal.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    onGenerate({ goal, tone, sections, imageryKeywords: kw, isRefinement: false });
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  function autoResize() {
    const el = textRef.current; if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <div className="flex flex-col h-full border-r border-border bg-surface">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Brief</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        {/* Quick prompts */}
        <div>
          <p className="text-[10px] font-mono text-muted mb-2">Quick start</p>
          <div className="flex flex-col gap-1.5">
            {QUICK.map(q => (
              <button key={q} onClick={() => { setGoal(q); textRef.current?.focus(); }}
                className="text-left px-3 py-2 text-xs font-mono text-sub hover:text-text bg-s2 hover:bg-s3 border border-border hover:border-b2 rounded-lg transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <p className="text-[10px] font-mono text-muted mb-2">Tone</p>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map(t => (
              <button key={t} onClick={() => setTone(t)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                  tone === t ? "bg-lime/10 text-lime border border-lime/30" : "bg-s2 text-muted border border-border hover:border-b2"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div>
          <p className="text-[10px] font-mono text-muted mb-2">Sections</p>
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => toggleSection(s)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                  sections.includes(s) ? "bg-gold/10 text-gold border border-gold/30" : "bg-s2 text-muted border border-border hover:border-b2"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-3 border-t border-border flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textRef}
            value={goal}
            onChange={e => { setGoal(e.target.value); autoResize(); }}
            onKeyDown={handleKey}
            placeholder="Describe your design…"
            rows={2}
            className="flex-1 bg-s2 border border-border rounded-xl px-3 py-2.5 text-xs font-mono text-text placeholder:text-muted2 resize-none outline-none focus:border-lime/40 transition-colors min-h-[44px] max-h-[120px]"
          />
          <button
            onClick={handleSubmit}
            disabled={!goal.trim() || isGenerating}
            className="w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-base font-bold transition-all bg-lime text-bg hover:bg-lime/90 disabled:bg-muted2 disabled:cursor-not-allowed"
          >
            {isGenerating ? "…" : "→"}
          </button>
        </div>
      </div>
    </div>
  );
}
