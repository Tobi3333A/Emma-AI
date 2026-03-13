import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, CheckCircle2, Clock, ArrowRight, RefreshCw } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  structured_data: "🏗️",
  content: "📝",
  llms_txt: "🤖",
  technical: "⚙️",
  reviews: "⭐",
  comparison: "⚖️",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-info",
};

export default function Optimize() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [company, setCompany] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: comp } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      if (!comp) return;
      setCompany(comp);
      const [{ data: prods }, { data: comps }, { data: savedTips }] = await Promise.all([
        supabase.from("products").select("*").eq("company_id", comp.id),
        supabase.from("competitors").select("*").eq("company_id", comp.id),
        supabase.from("optimization_tips").select("*").eq("company_id", comp.id).order("created_at", { ascending: false }),
      ]);
      setProducts(prods || []);
      setCompetitors(comps || []);
      setTips(savedTips || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const generateTips = async () => {
    if (!company) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-tips", {
        body: {
          company_name: company.name,
          industry: company.industry,
          website_url: company.website_url,
          products,
          competitors,
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const newTips: any[] = Array.isArray(data.tips) ? data.tips : [];

      // Save to DB
      const rows = newTips.map((t: any) => ({
        company_id: company.id,
        category: t.category,
        title: t.title,
        description: t.description,
        priority: t.priority || "medium",
        status: "pending",
      }));
      const { data: saved } = await supabase.from("optimization_tips").insert(rows).select();
      setTips(prev => [...(saved || []), ...prev]);
      toast({ title: "Recommendations generated!", description: `${newTips.length} new tips ready.` });
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("optimization_tips").update({ status }).eq("id", id);
    setTips(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const grouped = tips.reduce((acc: Record<string, any[]>, tip) => {
    const cat = tip.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tip);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="p-6 md:p-8 pt-16 md:pt-8 space-y-6 max-w-4xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Content Optimization</h1>
            <p className="text-muted-foreground text-sm mt-1">AI-generated recommendations to improve your visibility across AI models.</p>
          </div>
          <Button onClick={generateTips} disabled={generating} className="btn-teal gap-2 text-sm flex-shrink-0">
            {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {generating ? "Generating..." : "Generate New Tips"}
          </Button>
        </div>

        {tips.length === 0 && !generating ? (
          <div className="card-glow p-16 text-center space-y-4">
            <div className="text-5xl mb-2">🚀</div>
            <h3 className="font-display text-xl font-semibold text-foreground">Get AI-Powered Optimization Tips</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              EmmaAI will analyze your company profile and generate specific recommendations to improve how AI models find and describe your products.
            </p>
            <Button onClick={generateTips} className="btn-teal gap-2">
              <Sparkles size={15} /> Generate Recommendations
            </Button>
          </div>
        ) : generating ? (
          <div className="card-glow p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <h3 className="font-display font-semibold text-foreground">Analyzing your profile...</h3>
            <p className="text-muted-foreground text-sm">Generating personalized recommendations for {company?.name}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Tips", value: tips.length, color: "text-foreground" },
                { label: "In Progress", value: tips.filter(t => t.status === "in_progress").length, color: "text-amber-400" },
                { label: "Completed", value: tips.filter(t => t.status === "done").length, color: "text-emerald-400" },
              ].map(s => (
                <div key={s.label} className="stat-card text-center">
                  <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tips by category */}
            {Object.entries(grouped).map(([category, catTips]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CATEGORY_ICONS[category] || "💡"}</span>
                  <h3 className="font-display font-semibold text-foreground text-sm capitalize">{category.replace("_", " ")}</h3>
                  <span className="text-xs text-muted-foreground">({(catTips as any[]).length})</span>
                </div>
                <div className="space-y-2">
                  {(catTips as any[]).map((tip: any) => (
                    <div key={tip.id} className={`card-glow p-4 ${tip.status === "done" ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`score-pill text-xs ${PRIORITY_STYLES[tip.priority] || "badge-info"}`}>
                              {tip.priority}
                            </span>
                            <h4 className="font-semibold text-foreground text-sm">{tip.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {tip.status === "done" ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                              <CheckCircle2 size={13} /> Done
                            </span>
                          ) : tip.status === "in_progress" ? (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-xs text-amber-400">
                                <Clock size={13} /> In Progress
                              </span>
                              <Button
                                variant="ghost"
                                onClick={() => updateStatus(tip.id, "done")}
                                className="text-xs text-emerald-400 hover:text-emerald-300 h-7 px-2"
                              >
                                Mark done
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              onClick={() => updateStatus(tip.id, "in_progress")}
                              className="text-xs text-primary hover:text-primary/80 h-7 px-2 gap-1"
                            >
                              Start <ArrowRight size={11} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
