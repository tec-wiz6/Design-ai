import Link from "next/link";

const FEATURES = [
  { icon: "⚡", title: "Groq LPU Speed",     body: "Llama 3.3 70B on dedicated hardware. Full pages in under 10s." },
  { icon: "◈",  title: "NVIDIA NIM",          body: "Enterprise-grade inference. Consistent, high-quality output." },
  { icon: "◎",  title: "Mistral Large",        body: "Best-in-class instruction following. Precision design output." },
  { icon: "∞",  title: "OpenRouter fallback",  body: "Auto-switches providers. Zero downtime generation." },
  { icon: "✦",  title: "Unsplash imagery",     body: "Real photos pulled live. No stock photo sameness." },
  { icon: "↗",  title: "Export anywhere",      body: "HTML, ZIP, or data URL. Yours to use however you want." },
];

const STEPS = [
  { n: "01", title: "Describe",  body: "Type your idea — a page, a product, an app UI. As detailed or brief as you like." },
  { n: "02", title: "Configure", body: "Pick tone, sections, and model provider. Or let Auto mode decide for you." },
  { n: "03", title: "Generate",  body: "Watch it render live. Iterate with follow-up prompts until it's perfect." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg text-text overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 surface-glass border-b border-border flex items-center px-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-lime flex items-center justify-center text-bg text-sm font-bold">P</span>
          <span className="font-semibold text-sm">Pixie</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/studio"
            className="px-4 py-1.5 bg-lime text-bg text-sm font-bold rounded-lg hover:bg-lime/90 transition-all hover:-translate-y-0.5">
            Open Studio →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lime/5 blur-[120px] pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6 max-w-4xl">
          <div className="px-3 py-1 bg-lime/10 border border-lime/20 rounded-full text-xs font-mono text-lime">
            ✦ Powered by Groq · Mistral · NVIDIA · OpenRouter
          </div>
          <h1 className="text-[clamp(48px,8vw,96px)] font-bold leading-[0.95] tracking-tight">
            Turn ideas into<br />
            <span className="text-gradient-lime">polished UI</span><br />
            in seconds.
          </h1>
          <p className="text-sub text-lg max-w-xl font-light leading-relaxed">
            Describe any design. Pixie generates production-ready HTML — landing pages, dashboards, app UIs, pitch decks — instantly.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Link href="/studio"
              className="px-6 py-3 bg-lime text-bg font-bold rounded-xl hover:bg-lime/90 transition-all hover:-translate-y-0.5 text-sm">
              Start designing free →
            </Link>
            <span className="text-xs font-mono text-muted">No account needed</span>
          </div>
        </div>

        {/* Hero preview mockup */}
        <div className="relative mt-16 w-full max-w-4xl">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xl">
            <div className="h-8 bg-s2 flex items-center px-4 gap-2 border-b border-border">
              {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}} />)}
              <div className="mx-auto w-48 h-4 bg-s3 rounded-md" />
            </div>
            <div className="aspect-video bg-gradient-to-br from-bg via-s2 to-bg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-lime mb-2">Your design</div>
                <div className="text-sm font-mono text-muted">renders here, live</div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-px rounded-2xl border border-lime/10 pointer-events-none" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 px-6 max-w-5xl mx-auto">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-12 text-center">How it works</p>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.n} className="relative p-6 bg-surface border border-border rounded-2xl hover:border-b2 transition-all group">
              <div className="text-4xl font-bold text-gradient-lime mb-4 font-mono">{s.n}</div>
              <h3 className="font-semibold text-base mb-2">{s.title}</h3>
              <p className="text-sub text-sm leading-relaxed font-light">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-12 text-center">Capabilities</p>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="p-5 bg-bg border border-border rounded-xl hover:border-b2 transition-all">
                <div className="text-lime text-xl mb-3">{f.icon}</div>
                <h4 className="font-semibold text-sm mb-1.5">{f.title}</h4>
                <p className="text-sub text-xs leading-relaxed font-mono">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-5xl font-bold leading-tight">
            Design faster.<br /><span className="text-gradient-lime">Ship sooner.</span>
          </h2>
          <p className="text-sub font-light">Open the studio — start designing in under 60 seconds.</p>
          <Link href="/studio"
            className="px-8 py-4 bg-lime text-bg font-bold rounded-xl hover:bg-lime/90 transition-all hover:-translate-y-1 text-sm">
            Open Pixie Studio →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 flex items-center justify-between text-xs font-mono text-muted">
        <span>Pixie Design Studio</span>
        <span>Built with Next.js · Tailwind · Groq · Mistral · NVIDIA · OpenRouter</span>
      </footer>
    </main>
  );
}
