"use client";
import { useState } from "react";

interface Props { html: string; onClose: () => void; }

export default function ExportPanel({ html, onClose }: Props) {
  const [copying, setCopying] = useState(false);

  async function downloadHtml() {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "design.html"; a.click();
  }

  async function downloadZip() {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, filename: "design-studio-export" }),
    });
    const blob = await res.blob();
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "design-studio-export.zip"; a.click();
  }

  async function copyCode() {
    await navigator.clipboard.writeText(html);
    setCopying(true); setTimeout(() => setCopying(false), 1800);
  }

  function openInTab() {
    const url = "data:text/html;charset=utf-8," + encodeURIComponent(html);
    window.open(url, "_blank");
  }

  const opts = [
    { icon: "↓", label: "HTML file",  sub: "Single .html",    fn: downloadHtml },
    { icon: "⬡", label: "ZIP bundle", sub: "With README",     fn: downloadZip  },
    { icon: copying ? "✓" : "⌘", label: copying ? "Copied!" : "Copy code", sub: "To clipboard", fn: copyCode },
    { icon: "↗", label: "Open in tab",sub: "Data URL",        fn: openInTab    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-80 flex flex-col gap-5 animate-fade-up"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Export design</h3>
          <button onClick={onClose} className="text-muted hover:text-text text-lg">×</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {opts.map(o => (
            <button key={o.label} onClick={o.fn}
              className="flex flex-col items-center gap-2 p-4 bg-s2 hover:bg-s3 border border-border hover:border-b2 rounded-xl text-center transition-all">
              <span className="text-xl text-lime">{o.icon}</span>
              <span className="text-xs font-semibold">{o.label}</span>
              <span className="text-[10px] font-mono text-muted">{o.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
