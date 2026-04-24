"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  html: string;
  isGenerating: boolean;
  loadingStep: number;
}

const STEPS = [
  "Reading brief…",
  "Fetching imagery…",
  "Picking best model…",
  "Designing layout…",
  "Polishing details…",
  "Rendering preview…",
];

export default function CanvasFrame({ html, isGenerating, loadingStep }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [tab, setTab] = useState<"preview" | "code">("preview");

  useEffect(() => {
    if (!html || !iframeRef.current) return;
    const iframe = iframeRef.current;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
    return () => URL.revokeObjectURL(url);
  }, [html]);

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-2 px-4 h-11 border-b border-border bg-surface flex-shrink-0">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              tab === t ? "bg-s3 text-text border border-border" : "text-muted hover:text-sub"
            }`}
          >
            {t}
          </button>
        ))}
        {html && (
          <span className="ml-auto text-xs font-mono text-muted2 text-sub">
            {(html.length / 1024).toFixed(1)} KB
          </span>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-[#0d0d0d]">
        {/* Empty state */}
        {!html && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-muted2 flex items-center justify-center text-2xl text-muted">
              ✦
            </div>
            <p className="text-sub font-mono text-sm max-w-xs">
              Describe your design in the panel — your live output renders here
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg/90 backdrop-blur-sm z-10">
            <div className="w-48 h-px bg-border overflow-hidden rounded">
              <div className="h-full bg-lime animate-bar rounded" />
            </div>
            <p className="text-xs font-mono text-sub animate-fade-in">
              {STEPS[loadingStep % STEPS.length]}
            </p>
          </div>
        )}

        {/* Preview iframe */}
        {html && tab === "preview" && (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {/* Code view */}
        {html && tab === "code" && (
          <div className="absolute inset-0 overflow-auto p-5">
            <pre className="font-mono text-[11px] leading-relaxed text-[#8aab80] whitespace-pre-wrap break-words">
              {html}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
