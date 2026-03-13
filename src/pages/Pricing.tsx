import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const features = [
  "Monitor ChatGPT, Grok, Claude, and Gemini simultaneously",
  "Detect hallucinations and incorrect AI answers",
  "Track competitor mentions in AI responses",
  "Real-time alerts for misinformation",
  "Historical visibility trend dashboards",
  "AI-driven recommendations to improve rankings in AI answers",
  "LLMs.txt and structured data optimization guidance",
  "Secure enterprise-grade infrastructure",
];

export default function Pricing() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      
      {/* NAV */}
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

            <Link to="/signup">
              <Button className="btn-teal text-sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-16 text-center">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

        <div className="container max-w-3xl relative">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
            Simple Pricing for{" "}
            <span className="bg-gradient-teal bg-clip-text text-transparent">
              AI Visibility
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Monitor how AI models describe your brand, detect hallucinations,
            and improve your presence in AI-generated answers.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            1 Month Free Trial • Cancel Anytime
          </div>
        </div>
      </section>

      {/* PRICING CARD */}
      <section className="pb-20">
        <div className="container max-w-4xl">

          <div className="relative rounded-3xl border border-primary/40 bg-gradient-to-br from-background/80 via-card/80 to-primary/10 backdrop-blur-xl shadow-[0_0_40px_rgba(56,189,248,0.25)] p-8 md:p-12">

            <div className="text-center mb-10">

              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                EmmaAI Platform
              </h2>

              <p className="text-muted-foreground mb-6">
                Everything you need to monitor and optimize your AI visibility
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6">

                <div className="text-center">
                  <div className="font-display text-5xl font-bold text-primary">
                    $449
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per month
                  </div>
                </div>

                <div className="text-muted-foreground">or</div>

                <div className="text-center">
                  <div className="font-display text-5xl font-bold text-primary">
                    $4,999
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per year
                  </div>
                </div>

              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Save $389 per year with annual billing
              </p>
            </div>

            {/* FEATURES */}

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <p className="text-sm text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>

            <div className="text-center">

              <Button
                onClick={handleStart}
                className="btn-teal text-base px-10 py-3 h-auto"
              >
                Start Free Trial →
              </Button>

              <p className="text-xs text-muted-foreground mt-3">
                No credit card required for trial
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="py-20 bg-card/30">
        <div className="container max-w-3xl">

          <h2 className="font-display text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                What does EmmaAI monitor?
              </h3>
              <p className="text-muted-foreground text-sm">
                EmmaAI continuously queries major AI models like ChatGPT,
                Claude, Gemini, and Grok to analyze how your brand and products
                appear in AI-generated answers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                What is hallucination detection?
              </h3>
              <p className="text-muted-foreground text-sm">
                AI models sometimes generate incorrect information about
                products. EmmaAI automatically detects incorrect pricing,
                outdated features, and misleading claims so you can fix them
                before customers see them.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes. You can cancel your subscription at any time from your
                dashboard.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="py-24">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Start Monitoring Your AI Visibility Today
          </h2>

          <p className="text-muted-foreground mb-8 text-lg">
            Know exactly how AI systems describe your brand — and make sure it’s
            always accurate.
          </p>

          <Button
            onClick={handleStart}
            className="btn-teal text-base px-10 py-3 h-auto"
          >
            Start Free Trial →
          </Button>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-border py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-teal flex items-center justify-center text-background text-xs font-bold font-mono">
              E
            </div>

            <span className="font-display font-semibold text-foreground">
              EmmaAI
            </span>
          </div>

          <p>© 2026 EmmaAI. Powering AI visibility for the modern enterprise.</p>

        </div>
      </footer>
    </div>
  );
}