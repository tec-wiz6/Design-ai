"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import ChatPanel, { type ChatMessage, type GenerateOptions } from "@/components/ChatPanel";
import FilesPanel, { type GeneratedFile } from "@/components/FilesPanel";
import CanvasFrame from "@/components/CanvasFrame";
import type { ProviderMode } from "@/lib/types";

const PROVIDERS: { id: ProviderMode; label: string; color: string }[] = [
  { id: "auto",       label: "Auto",       color: "#cef044" },
  { id: "mistral",    label: "Mistral",    color: "#a78bfa" },
  { id: "openrouter", label: "OpenRouter", color: "#38bdf8" },
];

const STEP_LABELS = [
  "Reading brief…", "Fetching imagery…", "Selecting model…",
  "Writing HTML…", "Writing CSS…", "Writing JS…",
  "Splitting files…", "Rendering preview…",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "system",
    content: "Hey! Tell me what you want to build — a landing page, dashboard, app UI, anything. I'll ask a couple of quick questions if I need more detail, then generate the full code split across HTML, CSS, and JS files.",
  },
];

export default function StudioPage() {
  const [messages, setMessages]       = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [files, setFiles]             = useState<GeneratedFile[]>([]);
  const [activeFile, setActiveFile]   = useState("index.html");
  const [isGenerating, setGenerating] = useState(false);
  const [loadingStep, setStep]        = useState(0);
  const [provider, setProvider]       = useState<ProviderMode>("auto");
  const [modelUsed, setModelUsed]     = useState("");
  const [toast, setToast]             = useState("");
  const stepRef                       = useRef<ReturnType<typeof setInterval> | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function addMessage(msg: ChatMessage) {
    setMessages(prev => [...prev, msg]);
  }

  function updateLastSteps(steps: ChatMessage["steps"]) {
    setMessages(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last && last.role === "assistant") {
        copy[copy.length - 1] = { ...last, steps };
      }
      return copy;
    });
  }

  const handleGenerate = useCallback(async (opts: GenerateOptions) => {
    setGenerating(true);
    setStep(0);

    // Add assistant message with pending steps
    const stepsInit = STEP_LABELS.map((label, i) => ({
      label,
      status: i === 0 ? "active" as const : "pending" as const,
    }));

    const assistantMsgId = Date.now().toString();
    addMessage({
      id: assistantMsgId,
      role: "assistant",
      content: `Generating your design now.`,
      steps: stepsInit,
    });

    // Animate steps
    let stepIdx = 0;
    stepRef.current = setInterval(() => {
      stepIdx++;
      setStep(stepIdx);
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.id === assistantMsgId && last.steps) {
          const newSteps = last.steps.map((s, i) => ({
            ...s,
            status: i < stepIdx ? "done" as const : i === stepIdx ? "active" as const : "pending" as const,
          }));
          copy[copy.length - 1] = { ...last, steps: newSteps };
        }
        return copy;
      });
    }, 1200);

    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "preview",
          providerMode: provider,
          brief: {
            goal: opts.goal,
            tone: opts.tone as never,
            sections: opts.sections as never,
            imageryKeywords: opts.imageryKeywords,
            wantsPreview: true,
          },
        }),
      });

      const data = await res.json();
      if (data.error) {
        addMessage({ id: Date.now().toString(), role: "system", content: `Error: ${data.error}` });
        return;
      }

      const newFiles: GeneratedFile[] = data.files ?? [];
      setFiles(newFiles);
      setActiveFile(newFiles[0]?.name ?? "index.html");
      setModelUsed(data.modelUsed ?? "");

      // Mark all steps done
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.id === assistantMsgId && last.steps) {
          copy[copy.length - 1] = {
            ...last,
            steps: last.steps.map(s => ({ ...s, status: "done" as const })),
            content: `Done! Generated ${newFiles.length} file${newFiles.length !== 1 ? "s" : ""} via ${data.modelUsed}. You can preview on the right, click any file to view its code, and download individually or as a ZIP. Want to change anything?`,
          };
        }
        return copy;
      });

    } catch {
      addMessage({ id: Date.now().toString(), role: "system", content: "Network error — check your connection." });
    } finally {
      if (stepRef.current) clearInterval(stepRef.current);
      setGenerating(false);
    }
  }, [provider]);

  function handleChipSelect(group: string, value: string) {
    // When user clicks a chip option, treat it as a message
    // The chat panel will handle it
    showToast(`${group}: ${value} selected`);
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#090909", color: "#e8e8e8", overflow: "hidden", fontFamily: "var(--font-dm-mono)" }}>

      {/* Topbar */}
      <header style={{ height: 42, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, borderBottom: "1px solid #1c1c1c", background: "#111" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
          <div style={{ width: 22, height: 22, background: "#cef044", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", color: "#090909", fontSize: 10, fontWeight: 900, fontFamily: "var(--font-clash)" }}>P</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#e8e8e8", fontFamily: "var(--font-clash)" }}>Pixie</span>
        </Link>
        <div style={{ width: 1, height: 18, background: "#1c1c1c" }} />

        {/* Provider selector */}
        <div style={{ display: "flex", gap: 3, background: "#161616", borderRadius: 6, padding: 3, border: "1px solid #1c1c1c" }}>
          {PROVIDERS.map(p => (
            <button key={p.id} onClick={() => setProvider(p.id)}
              style={{
                padding: "3px 9px", borderRadius: 4, fontSize: 9, cursor: "pointer",
                background: provider === p.id ? `${p.color}15` : "transparent",
                color: provider === p.id ? p.color : "#444",
                border: provider === p.id ? `1px solid ${p.color}35` : "1px solid transparent",
                fontFamily: "var(--font-dm-mono)", transition: "all .15s",
              }}
            >{p.label}</button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {modelUsed && (
          <span style={{ fontSize: 9, color: "#2a2a2a", border: "1px solid #1c1c1c", padding: "3px 8px", borderRadius: 4, fontFamily: "var(--font-dm-mono)" }}>
            via {modelUsed}
          </span>
        )}
      </header>

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Chat — 260px */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <ChatPanel
            messages={messages}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onChipSelect={handleChipSelect}
            provider={provider}
          />
        </div>

        {/* Files — 155px */}
        <FilesPanel
          files={files}
          activeFile={activeFile}
          onSelect={setActiveFile}
        />

        {/* Canvas — fills rest */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <CanvasFrame
            files={files}
            activeFile={activeFile}
            isGenerating={isGenerating}
            loadingStep={loadingStep}
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 16, right: 16,
          padding: "8px 14px", background: "#111", border: "1px solid #1e1e1e",
          borderRadius: 7, fontSize: 10, fontFamily: "var(--font-dm-mono)", color: "#cef044",
          zIndex: 50, animation: "fadeUp .25s ease-out",
        }}>
          {toast}
        </div>
      )}

      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}