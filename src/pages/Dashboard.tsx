import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { TrendingUp, Eye, AlertTriangle, Users, ArrowUpRight, PlayCircle } from "lucide-react";

const MODEL_COLORS: Record<string, string> = {
  chatgpt: "#00C2FF",
    deepseek: "#00C2FF",
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

// Generate fake trend data for the chart
const generateTrendData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(day => ({
    day,
    visibility: Math.floor(Math.random() * 30) + 50,
    accuracy: Math.floor(Math.random() * 20) + 70,
  }));
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendData] = useState(generateTrendData);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: comp } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      if (!comp) { navigate("/onboarding"); return; }
      setCompany(comp);

      const { data: res } = await supabase
        .from("monitoring_results")
        .select("*")
        .eq("company_id", comp.id)
        .order("created_at", { ascending: false })
        .limit(40);
      setResults(res || []);
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Compute stats
  const totalRuns = results.length;
  const brandMentions = results.filter(r => r.brand_mentioned).length;
  const visibilityRate = totalRuns > 0 ? Math.round((brandMentions / totalRuns) * 100) : 0;
  const avgAccuracy = totalRuns > 0 ? Math.round(results.reduce((a, r) => a + (r.accuracy_score || 100), 0) / totalRuns) : 100;
  const hallucinations = results.reduce((a, r) => a + ((r.accuracy_issues as any[])?.length || 0), 0);

  // Per-model stats
  const modelStats = ["deepseek", "grok", "claude", "gemini"].map(model => {
    const modelResults = results.filter(r => r.ai_model === model);
    const mentions = modelResults.filter(r => r.brand_mentioned).length;
    return {
      model,
      label: model.charAt(0).toUpperCase() + model.slice(1),
      rate: modelResults.length > 0 ? Math.round((mentions / modelResults.length) * 100) : 0,
      count: modelResults.length,
      color: MODEL_COLORS[model],
    };
  });

  const recentResults = results.slice(0, 8);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 pt-16 md:pt-8 space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {company?.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {company?.industry} · AI Visibility Dashboard
            </p>
          </div>
          <Button onClick={() => navigate("/monitor")} className="btn-teal gap-2 text-sm">
            <PlayCircle size={15} />
            Run Query
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye size={15} className="text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">AI Visibility</span>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{visibilityRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Mentioned in {brandMentions}/{totalRuns} runs</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp size={15} className="text-emerald-400" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Accuracy Score</span>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{avgAccuracy}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all AI models</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle size={15} className="text-amber-400" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Hallucinations</span>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{hallucinations}</div>
            <p className="text-xs text-muted-foreground mt-1">Detected inaccuracies</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Users size={15} className="text-violet-400" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Total Queries</span>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{totalRuns}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitoring runs completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Trend chart */}
          <div className="lg:col-span-2 stat-card">
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm">Visibility & Accuracy Trend</h3>
            {totalRuns === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center gap-3">
                <div className="text-4xl">📊</div>
                <p className="text-muted-foreground text-sm">Run your first query to see trends here.</p>
                <Button onClick={() => navigate("/monitor")} className="btn-teal text-xs px-4 py-2 h-auto">
                  Run First Query →
                </Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(175 84% 48%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(175 84% 48%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215 16% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(215 16% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ background: "hsl(220 24% 10%)", border: "1px solid hsl(220 20% 18%)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="visibility" stroke="hsl(175 84% 48%)" strokeWidth={2} fill="url(#colorVis)" name="Visibility" />
                  <Area type="monotone" dataKey="accuracy" stroke="#34D399" strokeWidth={2} fill="url(#colorAcc)" name="Accuracy" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Per-model breakdown */}
          <div className="stat-card">
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm">Visibility by AI Model</h3>
            {totalRuns === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <p className="text-muted-foreground text-sm text-center">No data yet.<br />Run a query to populate.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modelStats.map(m => (
                  <div key={m.model}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-sm font-medium text-foreground">{MODEL_LABELS[m.model] || m.model}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: m.color }}>{m.rate}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${m.rate}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent monitoring results */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-foreground text-sm">Recent Monitoring Results</h3>
            <Button variant="ghost" onClick={() => navigate("/monitor")} className="text-primary hover:text-primary text-xs gap-1">
              Run New Query <ArrowUpRight size={12} />
            </Button>
          </div>

          {recentResults.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="font-semibold text-foreground">No monitoring data yet</h4>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Run your first AI monitoring query to see how ChatGPT, Grok, Claude, and Gemini describe your products.
              </p>
              <Button onClick={() => navigate("/monitor")} className="btn-teal text-sm mt-2">
                Run First Query →
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">Query</th>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">Model</th>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">Mentioned</th>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">Sentiment</th>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {recentResults.map(r => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="text-foreground truncate max-w-[200px] block">{r.query_text}</span>
                      </td>
                      <td className="py-3 pr-4">
                        {(() => {
                          const color = MODEL_COLORS[r.ai_model] || MODEL_COLORS.chatgpt;
                          const label = MODEL_LABELS[r.ai_model] || r.ai_model;
                          return (
                            <span
                              className="score-pill"
                              style={{
                                backgroundColor: `${color}20`,
                                color,
                                borderColor: `${color}40`,
                                border: "1px solid",
                              }}
                            >
                              {label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3 pr-4">
                        {r.brand_mentioned ? (
                          <span className="score-pill badge-success">✓ Yes{r.mention_rank ? ` (#${r.mention_rank})` : ""}</span>
                        ) : (
                          <span className="score-pill badge-danger">✗ No</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`score-pill ${r.sentiment === "positive" ? "badge-success" : r.sentiment === "negative" ? "badge-danger" : "badge-info"}`}>
                          {r.sentiment || "neutral"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`score-pill ${(r.accuracy_score || 100) >= 80 ? "badge-success" : (r.accuracy_score || 100) >= 60 ? "badge-warning" : "badge-danger"}`}>
                          {r.accuracy_score || 100}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
