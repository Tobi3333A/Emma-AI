import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Send } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

const features = [
  {
    icon: "🔍",
    title: "AI Answer Monitoring",
    description: "Continuously queries ChatGPT, Grok, Claude, and Gemini to track how your brand appears in AI-generated recommendations.",
  },
  {
    icon: "⚡",
    title: "Hallucination Detection",
    description: "Automatically detects wrong pricing, outdated features, and misleading claims about your products across all major AI models.",
  },
  {
    icon: "📊",
    title: "Competitor Intelligence",
    description: "See when competitors are recommended instead of you and understand exactly why AI systems prefer them.",
  },
  {
    icon: "🚀",
    title: "Content Optimization",
    description: "AI-generated recommendations to improve your llms.txt, structured data, and product pages for maximum AI visibility.",
  },
  {
    icon: "🛡️",
    title: "Ethics Monitoring",
    description: "Track accuracy scores over time and get alerts when AI systems spread misinformation about your products.",
  },
  {
    icon: "📈",
    title: "Visibility Trends",
    description: "Historical dashboards showing whether your optimization efforts are improving your inclusion rate in AI answers.",
  },
];

const stats = [
  { value: "73%", label: "of Gen Z starts shopping with AI" },
  { value: "4 Models", label: "monitored simultaneously" },
  { value: "Real-time", label: "hallucination detection" },
  { value: "100%", label: "RLS-secured data" },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
      navigate("/pricing");
  };

  const handleChatInteract = () => {
    
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center text-background font-bold text-sm font-mono">
              E
            </div>
            <span className="font-display font-bold text-lg text-foreground">EmmaAI</span>
          </div>
          <div className="flex items-center gap-3">
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button className="btn-teal text-sm">Get Started</Button>
                </Link>
              </>
          </div>
        </div>
      </nav>
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Monitors ChatGPT · Grok · Claude · Gemini
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fade-in leading-[1.1]">
            Your Brand,{" "}
            <span className="bg-gradient-teal bg-clip-text text-transparent">Accurately Represented</span>
            {" "}in Every AI Answer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in leading-relaxed">
            EmmaAI monitors how AI assistants describe your products, detects hallucinations before they mislead customers, and gives you a clear roadmap to improve your AI visibility.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in">
            <Button onClick={handleGetStarted} className="btn-teal text-base px-8 py-3 h-auto">
              Start Monitoring →
            </Button>
            <Link to="/login">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary text-base px-6 py-3 h-auto">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-10 max-w-2xl mx-auto text-left animate-fade-in">
            <div className="relative group rounded-3xl border border-primary/40 bg-gradient-to-br from-background/80 via-card/80 to-primary/10 backdrop-blur-xl shadow-[0_0_40px_rgba(56,189,248,0.25)] p-[1px]">
              <div className="absolute -top-4 left-6 h-7 rounded-full bg-black/60 px-3 flex items-center gap-2 border border-primary/40 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-teal text-[10px] font-mono text-background">
                  EA
                </span>
                <span className="text-[11px] font-medium tracking-wide text-primary/90">
                  EmmaAI Live Preview
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-background/90 via-card/95 to-primary/5 px-4 py-5 md:px-5 md:py-6 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="inline-flex max-w-xs rounded-2xl bg-primary/10 px-3 py-2 text-xs md:text-sm text-primary/90 shadow-[0_0_20px_rgba(56,189,248,0.25)] border border-primary/30">
                    &quot;How are AI models currently describing my products?&quot;
                  </div>
                  <p className="text-[11px] md:text-xs text-muted-foreground">
                    Ask EmmaAI anything about your brand&apos;s AI visibility. Sign in to see live answers from multiple models.
                  </p>
                </div>

                <div className="flex items-end gap-2">
                  <Textarea
                    rows={2}
                    placeholder="Message EmmaAI..."
                    className="resize-none bg-background/90 border-primary/40 text-sm md:text-base shadow-inner focus-visible:ring-primary/80"
                    onFocus={handleChatInteract}
                    onClick={handleChatInteract}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleChatInteract();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="rounded-full h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-shadow shrink-0"
                    onClick={handleChatInteract}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-[10px] md:text-[11px] text-muted-foreground/80">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    Powered by real multi-model monitoring
                  </span>
                  <span className="uppercase tracking-[0.16em] text-[9px] text-muted-foreground/70">
                    Futuristic Mode
                  </span>
                </div>
              </div>
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
                <div className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Real-time AI Visibility Intelligence
            </h2>
            <p className="text-muted-foreground">
              See exactly how your products appear across every major AI model — side by side.
            </p>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden shadow-glow">
            <img
              src={heroDashboard}
              alt="EmmaAI Dashboard — multi-model AI monitoring interface"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Everything You Need to Win in AI Search
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete platform for monitoring, analyzing, and improving your brand's presence in AI-generated answers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-glow p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
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
            Set up monitoring in minutes. Get your first AI visibility report today.
          </p>
          <Button onClick={handleGetStarted} className="btn-teal text-base px-10 py-3 h-auto">
            Start Monitoring Free →
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
