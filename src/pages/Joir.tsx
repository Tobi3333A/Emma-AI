import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Code, Copy, Globe, Sparkles, Github } from "lucide-react";


export default function CodeOptimizer() {
  const [code, setCode] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);


  async function handleOptimize() {
    if (!code.trim()) return;


    setLoading(true);


    try {
      const res = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: code }),
      });


      const data = await res.json();
      setOptimizedCode(data.summary);
    } catch (err) {
      console.error(err);
    }


    setLoading(false);
  }


  function copyCode() {
    navigator.clipboard.writeText(optimizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }


  return (
    <AppLayout>
        <div className="space-y-8 animate-in fade-in max-w-4xl p-6 md:p-8 duration-500">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Optimization</h1>
            <p className="text-zinc-500 mt-1">Improve your brand's visibility with AI-ready code and content.</p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 w-fit">
                <Code size={24} />
              </div>
              <h3 className="text-white font-bold">llms.txt Generator</h3>
              <p className="text-zinc-500 text-sm">Create a machine-readable summary of your brand for AI crawlers.</p>
              <button className="w-full py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm font-bold hover:bg-zinc-800 transition-colors">Generate File</button>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 w-fit">
                <Globe size={24} />
              </div>
              <h3 className="text-white font-bold">Structured Data</h3>
              <p className="text-zinc-500 text-sm">JSON-LD snippets optimized for product discovery in generative engines.</p>
              <button className="w-full py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm font-bold hover:bg-zinc-800 transition-colors">View Snippets</button>
            </div>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 w-fit">
                <Github size={24} />
              </div>
              <h3 className="text-white font-bold">Repo Analysis</h3>
              <p className="text-zinc-500 text-sm">Analyze your GitHub repo for AI-readiness and indexing barriers.</p>
              <button className="w-full py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm font-bold hover:bg-zinc-800 transition-colors">Run Audit</button>
            </div>
          </div>


          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <h3 className="text-white font-bold mb-4">Content Recommendations</h3>
            <div className="space-y-4">
              {[
                { title: "Clarify Pricing Structure", desc: "AI models are confused about your 'Enterprise' tier pricing. Add a clear table to your pricing page.", impact: "High" },
                { title: "Update Feature List", desc: "Recent updates to your API are not yet indexed. Update your /docs/api page.", impact: "Medium" },
                { title: "Add FAQ for AI", desc: "Create a page answering common natural language questions about your product.", impact: "High" }
              ].map((rec, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div>
                    <p className="text-white font-medium">{rec.title}</p>
                    <p className="text-zinc-500 text-sm">{rec.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${rec.impact === 'High' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {rec.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


      <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-4xl space-y-6">


        {/* Header */}
        <div>
          <p className="text-muted-foreground text-sm mt-1">
            Improve your code structure for AI discoverability. EmmaAI rewrites
            your code to follow AI Optimization (AIO) standards.
          </p>
        </div>


        {/* Input Card */}
        <div className="stat-card space-y-4">


          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles size={16} className="text-primary" />
            Paste Your Code
          </div>


          <textarea
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here (HTML, React, schema, metadata, etc.)..."
            className="w-full rounded-lg border border-border bg-background p-4 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />


          <button
            onClick={handleOptimize}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold transition"
          >
            {loading ? "Optimizing..." : "Optimize Code"}
          </button>
        </div>


        {/* Result Card */}
        {optimizedCode && (
          <div className="stat-card space-y-4">


            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm text-foreground">
                AI-Optimized Code
              </h3>


              <button
                onClick={copyCode}
                className="flex items-center gap-2 text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-md"
              >
                <Copy size={14} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>


            <div className="relative">
              <pre className="overflow-auto rounded-lg border border-border bg-muted/40 p-4 text-xs font-mono text-foreground max-h-[400px]">
                <code>{optimizedCode}</code>
              </pre>
            </div>
          </div>
        )}


      </div>
    </AppLayout>
  );
}
