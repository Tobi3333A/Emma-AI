import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  CalendarRange,
  Sparkles,
  Lightbulb,
  Share2,
  CheckCircle2,
  Clock,
  Hash,
  FileText,
} from "lucide-react";

// Build content ideas from company, products, and tips (Hootsuite-style recommendations)
function buildContentIdeas(company: any, products: any[], tips: any[]) {
  const name = company?.name || "Your brand";
  const industry = company?.industry || "your industry";
  const ideas: { title: string; description: string; type: "post" | "theme" | "tip"; platform?: string }[] = [];

  // Post ideas from products
  (products || []).slice(0, 5).forEach((p: any) => {
    ideas.push({
      title: `Highlight: ${p.name}`,
      description: p.description
        ? `Share what makes ${p.name} stand out. Use this hook: "${(p.description as string).slice(0, 80)}..."`
        : `Create a short post introducing ${p.name} and why it matters for ${industry}.`,
      type: "post",
    });
  });

  // Themes from optimization tips
  (tips || []).filter((t: any) => t.priority === "high").slice(0, 4).forEach((t: any) => {
    ideas.push({
      title: t.title,
      description: t.description?.slice(0, 120) || "",
      type: "theme",
    });
  });

  // Generic AI-friendly content ideas
  ideas.push(
    {
      title: "FAQ for AI & search",
      description: `Answer common questions about ${name} in plain language. Helps AI answer engines cite you.`,
      type: "tip",
    },
    {
      title: "Behind the scenes",
      description: `Humanize your brand with a short "how we work" or "meet the team" post.`,
      type: "post",
    },
    {
      title: "Trend in your industry",
      description: `Comment on a recent trend in ${industry} and tie it back to what ${name} offers.`,
      type: "post",
    }
  );

  return ideas;
}

// Simple week slots for planning (placeholder)
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ContentPlanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plannedSlots, setPlannedSlots] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: comp } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      if (!comp) {
        navigate("/onboarding");
        return;
      }
      setCompany(comp);
      const [
        { data: prods },
        { data: savedTips },
      ] = await Promise.all([
        supabase.from("products").select("*").eq("company_id", comp.id),
        supabase.from("optimization_tips").select("*").eq("company_id", comp.id).order("created_at", { ascending: false }),
      ]);
      setProducts(prods || []);
      setTips(savedTips || []);
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const ideas = company ? buildContentIdeas(company, products, tips) : [];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm">Loading content planner...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 pt-16 md:pt-8 space-y-8 max-w-4xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Content Planner</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Plan and get recommendations for content that works for AI and social—post ideas, themes, and scheduling.
          </p>
        </div>

        {/* Content recommendations (Hootsuite-style) */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm">Content recommendations</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ideas based on your company, products, and optimization tips. Use them for social posts, blog hooks, or AEO-friendly copy.
          </p>
          <div className="space-y-3">
            {ideas.map((idea, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="shrink-0 mt-0.5">
                  {idea.type === "post" && <Share2 size={14} className="text-primary" />}
                  {idea.type === "theme" && <Hash size={14} className="text-primary" />}
                  {idea.type === "tip" && <FileText size={14} className="text-primary" />}
                </span>
                <div>
                  <p className="font-medium text-foreground text-sm">{idea.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{idea.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan your week */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <CalendarRange size={18} className="text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm">Plan your week</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Assign content ideas to days. Use this to keep a consistent presence and align with AI-friendly publishing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="rounded-lg border border-border p-3 bg-background">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{day}</p>
                <textarea
                  placeholder="Post idea or topic..."
                  className="w-full min-h-[72px] rounded border border-border bg-muted/30 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  value={plannedSlots[day] ?? ""}
                  onChange={(e) => setPlannedSlots((s) => ({ ...s, [day]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI roles / actions */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm">AI-assisted planning</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Use these actions to refine your content strategy. More AI features (e.g. generate captions, suggest best times) can be wired here later.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Lightbulb size={14} />
              Get more post ideas
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Hash size={14} />
              Suggest themes by topic
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 size={14} />
              Repurpose for platforms
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock size={14} />
              Best times to post
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            Recommendations above are based on your current company and product data. Add more in Settings for richer ideas.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
