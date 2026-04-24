"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import PromptBar from "@/components/PromptBar";
import CanvasFrame from "@/components/CanvasFrame";
import ProviderBar from "@/components/ProviderBar";
import ExportPanel from "@/components/ExportPanel";
import type { ProviderMode } from "@/lib/types";

export default function StudioPage() {
  const [html, setHtml]               = useState("");
  const [isGenerating, setGenerating] = useState(false);
  const [loadingStep, setStep]        = useState(0);
  const [provider, setProvider]       = useState<ProviderMode>("auto");
  const [modelUsed, setModelUsed]     = useState("");
  const [showExport, setShowExport]   = useState(false);
  const [toast, setToast]             = useState("");
  const stepInterval                  = useRef<ReturnType<typeof setInterval> | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  async function handleGenerate(opts: {
    goal: string; tone: string; sections: string[];
    imageryKeywords: string[]; isRefinement: boolean; refinementNote?: string;
  }) {
    setGenerating(true); setStep(0);
    stepInterval.current = setInterval(() => setStep(s => s + 1), 900);

    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "preview",
          providerMode: provider,
          brief: {
            goal: opts.goal,
            tone: opts.tone,
            sections: opts.sections,
            imageryKeywords: opts.imageryKeywords,
            wantsPreview: true,
            ...(opts.isRefinement && { existingHtml: html, refinementNote: opts.refinementNote }),
          },
        }),
      });
      const data = await res.json();
      if (data.error) { showToast(`Error: ${data.error}`); return; }
      setHtml(data.previewHtml ?? "");
      setModelUsed(data.modelUsed ?? "");
      showToast(`Generated with ${data.modelUsed}`);
    } catch (e) {
      showToast("Network error — check console");
    } finally {
      if (stepInterval.current) clearInterval(stepInterval.current);
      setGenerating(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-bg text-text overflow-hidden">
      {/* Topbar */}
      <header className="h-12 flex-shrink-0 flex items-center px-4 gap-4 border-b border-border bg-surface">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-6 h-6 rounded-md bg-lime flex items-center justify-center text-bg text-xs font-bold">P</span>
          <span className="text-sm font-semibold group-hover:text-lime transition-colors">Pixie</span>
        </Link>
        <div className="w-px h-5 bg-border" />
        <ProviderBar value={provider} onChange={setProvider} />
        <div className="ml-auto flex items-center gap-2">
          {modelUsed && (
            <span className="text-[10px] font-mono text-muted px-2 py-1 bg-s2 rounded border border-border">
              {modelUsed}
            </span>
          )}
          {html && (
            <button
              onClick={() => setShowExport(true)}
              className="px-3 py-1.5 bg-lime text-bg text-xs font-bold rounded-lg hover:bg-lime/90 transition-colors"
            >
              ↗ Export
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0">
          <PromptBar onGenerate={handleGenerate} isGenerating={isGenerating} hasDesign={!!html} />
        </div>
        <div className="flex-1 overflow-hidden">
          <CanvasFrame html={html} isGenerating={isGenerating} loadingStep={loadingStep} />
        </div>
      </div>

      {/* Export panel */}
      {showExport && html && <ExportPanel html={html} onClose={() => setShowExport(false)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-mono text-lime animate-fade-up z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
