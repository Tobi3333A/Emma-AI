import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

const features = [
  {
    icon: "🔍",
    title: "AI Answer Monitoring",
    description:
      "Continuously queries ChatGPT, Grok, Claude, and Gemini to track how your brand appears in AI-generated recommendations.",
  },
  {
    icon: "⚡",
    title: "Hallucination Detection",
    description:
      "Automatically detects wrong pricing, outdated features, and misleading claims about your products across all major AI models.",
  },
  {
    icon: "📊",
    title: "Competitor Intelligence",
    description:
      "See when competitors are recommended instead of you and understand exactly why AI systems prefer them.",
  },
  {
    icon: "🚀",
    title: "Content Optimization",
    description:
      "AI-generated recommendations to improve your llms.txt, structured data, and product pages for maximum AI visibility.",
  },
  {
    icon: "🛡️",
    title: "Ethics Monitoring",
    description:
      "Track accuracy scores over time and get alerts when AI systems spread misinformation about your products.",
  },
  {
    icon: "📈",
    title: "Visibility Trends",
    description:
      "Historical dashboards showing whether your optimization efforts are improving your inclusion rate in AI answers.",
  },
];

const stats = [
  { value: "73%", label: "of Gen Z starts shopping with AI" },
  { value: "4 Models", label: "monitored simultaneously" },
  { value: "Real-time", label: "hallucination detection" },
  { value: "100%", label: "RLS-secured data" },
];

export default function Landing() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/pricing");
  };

  async function handleChatInteract() {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: query }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResponse(data.summary);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatInteract();
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center text-background font-bold text-sm font-mono">
              E
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              EmmaAI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Sign In
              </Button>
            </Link>

            <Link to="/pricing">
              <Button className="btn-teal text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container relative text-center max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Your Brand,{" "}
            <span className="bg-gradient-teal bg-clip-text text-transparent">
              Accurately Represented
            </span>{" "}
            in Every AI Answer
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            EmmaAI monitors how AI assistants describe your products, detects
            hallucinations before they mislead customers, and gives you a clear
            roadmap to improve your AI visibility.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={handleGetStarted}
              className="btn-teal text-base px-8 py-3 h-auto"
            >
              Start Monitoring →
            </Button>

            <Link to="/login">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-secondary text-base px-6 py-3 h-auto"
              >
                View Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Chat Preview */}
          <div className="mt-10 max-w-2xl mx-auto text-left">
            <div className="rounded-3xl border border-primary/40 bg-card p-6 flex flex-col gap-4">

              <div className="text-xs text-muted-foreground">
                Ask EmmaAI anything about your brand's AI visibility.
              </div>

              {/* Input */}
              <div className="flex items-end gap-2">
                <Textarea
                  rows={2}
                  placeholder="Message EmmaAI..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="resize-none"
                />

                <Button
                  size="icon"
                  disabled={loading}
                  onClick={handleChatInteract}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Status */}
              {loading && (
                <div className="text-xs text-muted-foreground">
                  EmmaAI is thinking...
                </div>
              )}

              {error && (
                <div className="text-xs text-red-400">{error}</div>
              )}

              {/* Response */}
              {response && (
                <div className="rounded-xl bg-primary/10 border border-primary/30 px-4 py-3 text-sm text-primary/90">
                  {response}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="p-6 border rounded-xl">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Don't Let AI Misrepresent Your Brand
          </h2>

          <p className="text-muted-foreground mb-8 text-lg">
            Set up monitoring in minutes. Get your first AI visibility report
            today.
          </p>

          <Button
            onClick={handleGetStarted}
            className="btn-teal text-base px-10 py-3 h-auto"
          >
            Start Monitoring →
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}