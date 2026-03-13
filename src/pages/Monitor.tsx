import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlayCircle, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Minus } from "lucide-react";

const MODEL_COLORS: Record<string, string> = {
  chatgpt: "#00C2FF",
  grok: "#FF6B35",
  claude: "#C9B3FF",
  gemini: "#34D399",
};

const MODEL_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT",
  deepseek: "ChatGPT",
  grok: "Grok",
  claude: "Claude",
  gemini: "Gemini",
};

export default function Monitor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [company, setCompany] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [savedQueries, setSavedQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: comp } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      if (!comp) return;
      setCompany(comp);
      const [{ data: prods }, { data: comps }, { data: queries }] = await Promise.all([
        supabase.from("products").select("*").eq("company_id", comp.id),
        supabase.from("competitors").select("*").eq("company_id", comp.id),
        supabase.from("monitoring_queries").select("*").eq("company_id", comp.id).eq("is_active", true),
      ]);
      setProducts(prods || []);
      setCompetitors(comps || []);
      setSavedQueries(queries || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const runQuery = async (queryText: string) => {
    if (!queryText.trim() || !company) return;
    setRunning(true);
    setResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("monitor-query", {
        body: {
          query: queryText,
          company_name: company.name,
          products,
          competitors,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResults(data.results || []);

      // Save results to DB
      const rows = (data.results || []).map((r: any) => ({
        company_id: company.id,
        query_text: queryText,
        ai_model: r.model,
        ai_response: r.ai_response,
        brand_mentioned: r.brand_mentioned,
        mention_rank: r.mention_rank,
        sentiment: r.sentiment,
        competitors_mentioned: r.competitors_mentioned,
        accuracy_issues: r.accuracy_issues,
        accuracy_score: r.accuracy_score,
      }));
      await supabase.from("monitoring_results").insert(rows);

      toast({ title: "Query complete", description: `Analyzed across ${data.results?.length || 0} AI models.` });
    } catch (e: any) {
      toast({ title: "Query failed", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
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

  return (
    <AppLayout>
      <div className="p-6 md:p-8 pt-16 md:pt-8 space-y-6 max-w-5xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Run Monitoring Query</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit a query to see how ChatGPT, Grok, Claude, and Gemini respond.</p>
        </div>

        {/* Custom query input */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">Custom Query</h3>
          <div className="flex gap-3">
            <Input
              value={customQuery}
              onChange={e => setCustomQuery(e.target.value)}
              placeholder={`e.g. Best ${company?.industry || "software"} for small businesses`}
              className="bg-secondary border-border flex-1"
              onKeyDown={e => e.key === "Enter" && !running && runQuery(customQuery)}
            />
            <Button
              onClick={() => runQuery(customQuery)}
              disabled={running || !customQuery.trim()}
              className="btn-teal gap-2 flex-shrink-0"
            >
              <PlayCircle size={15} />
              {running ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        {/* Saved queries */}
        {savedQueries.length > 0 && (
          <div className="stat-card">
            <h3 className="font-display font-semibold text-foreground text-sm mb-4">Saved Monitoring Queries</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedQueries.map(q => (
                <button
                  key={q.id}
                  onClick={() => runQuery(q.query_text)}
                  disabled={running}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-secondary/50 hover:border-primary/30 transition-all group disabled:opacity-50"
                >
                  <div>
                    <div className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">{q.query_text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 capitalize">{q.category}</div>
                  </div>
                  <PlayCircle size={14} className="text-muted-foreground group-hover:text-primary ml-3 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {running && (
          <div className="card-glow p-10 text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              {["chatgpt", "grok", "claude", "gemini"].map((m, i) => (
                <div
                  key={m}
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: MODEL_COLORS[m], animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Querying AI models...</h3>
              <p className="text-muted-foreground text-sm mt-1">Analyzing ChatGPT, Grok, Claude & Gemini simultaneously</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !running && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground text-sm">Results — Side-by-Side Comparison</h3>

            {/* Summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {results.map(r => (
                <div key={r.model} className="stat-card relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: r.model_color }} />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.model_color }} />
                    <span className="text-xs font-semibold text-foreground">{MODEL_LABELS[r.model] || r.model_label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${r.brand_mentioned ? "text-emerald-400" : "text-rose-400"}`}>
                      {r.brand_mentioned ? <CheckCircle2 size={12} /> : <Minus size={12} />}
                      {r.brand_mentioned ? `Mentioned${r.mention_rank ? ` #${r.mention_rank}` : ""}` : "Not mentioned"}
                    </div>
                    <div className={`text-xs font-medium capitalize ${r.sentiment === "positive" ? "text-emerald-400" : r.sentiment === "negative" ? "text-rose-400" : "text-muted-foreground"}`}>
                      Sentiment: {r.sentiment}
                    </div>
                    {r.accuracy_issues?.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <AlertTriangle size={11} />
                        {r.accuracy_issues.length} issue{r.accuracy_issues.length > 1 ? "s" : ""}
                      </div>
                    )}
                    <div className={`text-xs font-semibold ${(r.accuracy_score || 100) >= 80 ? "text-emerald-400" : (r.accuracy_score || 100) >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                      Accuracy: {r.accuracy_score || 100}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full responses */}
            <div className="space-y-3">
              {results.map(r => (
                <div key={r.model} className="card-glow overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => setExpandedModel(expandedModel === r.model ? null : r.model)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.model_color }} />
                      <span className="font-semibold text-foreground text-sm">{MODEL_LABELS[r.model] || r.model_label} Response</span>
                      {r.error && <span className="text-xs text-rose-400">(Error)</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      {r.competitors_mentioned?.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Competitors: {r.competitors_mentioned.join(", ")}
                        </span>
                      )}
                      {expandedModel === r.model ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                    </div>
                  </button>

                  {expandedModel === r.model && (
                    <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                      {r.error ? (
                        <p className="text-rose-400 text-sm">{r.error}</p>
                      ) : (
                        <>
                          <div className="bg-secondary/50 rounded-lg p-4">
                            <p className="text-sm text-foreground leading-relaxed">{r.ai_response}</p>
                          </div>
                          {r.accuracy_issues?.length > 0 && (
                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={14} className="text-amber-400" />
                                <span className="text-xs font-semibold text-amber-400">Accuracy Issues Detected</span>
                              </div>
                              <ul className="space-y-1">
                                {r.accuracy_issues.map((issue: string, i: number) => (
                                  <li key={i} className="text-xs text-amber-300 flex items-start gap-2">
                                    <span className="mt-1 flex-shrink-0">•</span>{issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {r.competitors_mentioned?.length > 0 && (
                            <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-3">
                              <span className="text-xs text-violet-400 font-medium">
                                🏆 Competitors mentioned: {r.competitors_mentioned.join(", ")}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
