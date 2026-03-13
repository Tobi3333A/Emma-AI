import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, CheckCircle2, TrendingUp, Shield } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Ethics() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: comp } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      if (!comp) return;
      setCompany(comp);
      const { data: res } = await supabase
        .from("monitoring_results")
        .select("*")
        .eq("company_id", comp.id)
        .order("created_at", { ascending: false });
      setResults(res || []);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  // Compute stats
  const allIssues = results.flatMap(r => {
    const issues = r.accuracy_issues as any[];
    return (issues || []).map((issue: string) => ({
      issue,
      model: r.ai_model,
      query: r.query_text,
      date: new Date(r.created_at).toLocaleDateString(),
      id: r.id + issue,
    }));
  });

  const avgAccuracy = results.length > 0
    ? Math.round(results.reduce((a, r) => a + (r.accuracy_score || 100), 0) / results.length)
    : 100;

  const hallucinations = allIssues.length;
  const clean = results.filter(r => !(r.accuracy_issues as any[])?.length).length;

  // Accuracy over time (last 10 unique runs)
  const recentAccuracy = results.slice(0, 20).map((r, i) => ({
    run: `#${results.length - i}`,
    accuracy: r.accuracy_score || 100,
  })).reverse();

  return (
    <AppLayout>
      <div className="p-6 md:p-8 pt-16 md:pt-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Ethics & Accuracy Monitor</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track hallucinations, detect misinformation, and protect customer trust.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Accuracy Score</span>
            </div>
            <div className={`font-display text-3xl font-bold ${avgAccuracy >= 80 ? "text-emerald-400" : avgAccuracy >= 60 ? "text-amber-400" : "text-rose-400"}`}>
              {avgAccuracy}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average across all runs</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-400" />
              <span className="text-xs text-muted-foreground">Hallucinations</span>
            </div>
            <div className="font-display text-3xl font-bold text-amber-400">{hallucinations}</div>
            <p className="text-xs text-muted-foreground mt-1">Total issues detected</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-xs text-muted-foreground">Clean Runs</span>
            </div>
            <div className="font-display text-3xl font-bold text-emerald-400">{clean}</div>
            <p className="text-xs text-muted-foreground mt-1">Responses with no issues</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-violet-400" />
              <span className="text-xs text-muted-foreground">Total Checked</span>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{results.length}</div>
            <p className="text-xs text-muted-foreground mt-1">AI responses analyzed</p>
          </div>
        </div>

        {/* Accuracy over time chart */}
        {recentAccuracy.length > 0 && (
          <div className="stat-card">
            <h3 className="font-display font-semibold text-foreground text-sm mb-4">Accuracy Score Over Time</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={recentAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18%)" />
                <XAxis dataKey="run" tick={{ fill: "hsl(215 16% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(215 16% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: "hsl(220 24% 10%)", border: "1px solid hsl(220 20% 18%)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, "Accuracy"]}
                />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(175 84% 48%)" strokeWidth={2} dot={{ fill: "hsl(175 84% 48%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Issues log */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">
            Detected Hallucinations & Issues
          </h3>

          {allIssues.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">🛡️</div>
              <h4 className="font-semibold text-foreground">No issues detected yet</h4>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {results.length === 0
                  ? "Run your first monitoring query to start detecting hallucinations."
                  : "All analyzed AI responses appear accurate. Keep monitoring to stay ahead of any issues."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allIssues.map(issue => (
                <div key={issue.id} className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="score-pill badge-warning text-xs">{issue.model}</span>
                      <span className="text-xs text-muted-foreground truncate">{issue.query}</span>
                    </div>
                    <p className="text-sm text-amber-200">{issue.issue}</p>
                    <p className="text-xs text-muted-foreground mt-1">{issue.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ethics framework */}
        <div className="card-glow p-6">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">🛡️ EmmaAI Ethics Framework</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Accuracy Detection", desc: "Every AI response is cross-referenced against your verified product data to identify factual errors." },
              { title: "Hallucination Flagging", desc: "Fabricated features, wrong pricing, and outdated availability are automatically detected and logged." },
              { title: "Competitor Fairness", desc: "We monitor for biased comparisons and misleading claims about competitors across all AI models." },
              { title: "Continuous Improvement", desc: "Your accuracy score improves over time as you implement content optimizations recommended by EmmaAI." },
            ].map(item => (
              <div key={item.title} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-foreground">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-3.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
