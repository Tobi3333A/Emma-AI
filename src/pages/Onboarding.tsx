import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, X, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = ["Company", "Products", "Competitors", "Queries"];

const INDUSTRIES = ["Software / SaaS", "E-commerce", "Financial Services", "Healthcare", "Consumer Electronics", "Retail", "Travel", "Other"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Company
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");

  // Products
  const [products, setProducts] = useState([{ name: "", description: "", price_usd: "", features: "" }]);

  // Competitors
  const [competitors, setCompetitors] = useState([{ name: "", website_url: "" }]);

  // Queries
  const [queries, setQueries] = useState([{ query_text: "", category: "general" }]);

  const addProduct = () => setProducts([...products, { name: "", description: "", price_usd: "", features: "" }]);
  const removeProduct = (i: number) => setProducts(products.filter((_, idx) => idx !== i));

  const addCompetitor = () => setCompetitors([...competitors, { name: "", website_url: "" }]);
  const removeCompetitor = (i: number) => setCompetitors(competitors.filter((_, idx) => idx !== i));

  const addQuery = () => setQueries([...queries, { query_text: "", category: "general" }]);
  const removeQuery = (i: number) => setQueries(queries.filter((_, idx) => idx !== i));

  const canNext = () => {
    if (step === 0) return companyName.trim().length > 0;
    if (step === 1) return products.every(p => p.name.trim());
    if (step === 2) return competitors.every(c => c.name.trim());
    return queries.every(q => q.query_text.trim());
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Create company
      const { data: company, error: companyErr } = await supabase
        .from("companies")
        .insert({ user_id: user.id, name: companyName, industry, website_url: websiteUrl, description })
        .select()
        .single();
      if (companyErr) throw companyErr;

      const companyId = company.id;

      // Insert products
      const productRows = products
        .filter(p => p.name.trim())
        .map(p => ({
          company_id: companyId,
          name: p.name,
          description: p.description,
          price_usd: p.price_usd ? parseFloat(p.price_usd) : null,
          features: p.features ? p.features.split(",").map(f => f.trim()).filter(Boolean) : [],
        }));
      if (productRows.length > 0) await supabase.from("products").insert(productRows);

      // Insert competitors
      const compRows = competitors.filter(c => c.name.trim()).map(c => ({ company_id: companyId, ...c }));
      if (compRows.length > 0) await supabase.from("competitors").insert(compRows);

      // Insert queries
      const queryRows = queries.filter(q => q.query_text.trim()).map(q => ({ company_id: companyId, ...q }));
      if (queryRows.length > 0) await supabase.from("monitoring_queries").insert(queryRows);

      toast({ title: "Setup complete!", description: "Your monitoring dashboard is ready." });
      navigate("/dashboard");
    } catch (e: any) {
      toast({ title: "Setup failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center text-background font-bold font-mono text-sm">E</div>
            <span className="font-display font-bold text-lg text-foreground">EmmaAI</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Set up your monitoring</h1>
          <p className="text-muted-foreground text-sm mt-1">Takes about 3 minutes</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                i < step ? "bg-primary text-primary-foreground" :
                i === step ? "bg-primary/20 text-primary border border-primary" :
                "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        <div className="card-glow p-8">
          {/* Step 0: Company */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground">Tell us about your company</h2>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company Name *</Label>
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Corp" className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Industry</Label>
                  <select value={industry} onChange={e => setIndustry(e.target.value)}
                    className="w-full rounded-lg bg-secondary border border-border text-foreground text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Website URL</Label>
                  <Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://acmecorp.com" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Brief Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="What does your company sell? Who are your customers?" rows={3}
                  className="bg-secondary border-border resize-none text-sm" />
              </div>
            </div>
          )}

          {/* Step 1: Products */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground">Add your key products</h2>
              <p className="text-sm text-muted-foreground">These will be used for accuracy verification — we'll check if AI models describe them correctly.</p>
              {products.map((p, i) => (
                <div key={i} className="rounded-lg border border-border p-4 space-y-3 bg-secondary/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product {i + 1}</span>
                    {products.length > 1 && (
                      <button onClick={() => removeProduct(i)} className="text-muted-foreground hover:text-foreground">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Product Name *</Label>
                      <Input value={p.name} onChange={e => { const n = [...products]; n[i].name = e.target.value; setProducts(n); }}
                        placeholder="e.g. Pro CRM Suite" className="bg-secondary border-border text-sm h-9" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Price (USD)</Label>
                      <Input value={p.price_usd} onChange={e => { const n = [...products]; n[i].price_usd = e.target.value; setProducts(n); }}
                        placeholder="e.g. 49" type="number" className="bg-secondary border-border text-sm h-9" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Input value={p.description} onChange={e => { const n = [...products]; n[i].description = e.target.value; setProducts(n); }}
                      placeholder="Brief product description" className="bg-secondary border-border text-sm h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Key Features (comma-separated)</Label>
                    <Input value={p.features} onChange={e => { const n = [...products]; n[i].features = e.target.value; setProducts(n); }}
                      placeholder="e.g. Pipeline tracking, Email automation, Analytics" className="bg-secondary border-border text-sm h-9" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" onClick={addProduct} className="text-primary hover:text-primary hover:bg-primary/10 text-sm gap-2">
                <PlusCircle size={15} /> Add another product
              </Button>
            </div>
          )}

          {/* Step 2: Competitors */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground">Track your competitors</h2>
              <p className="text-sm text-muted-foreground">We'll alert you when AI models recommend competitors instead of you.</p>
              {competitors.map((c, i) => (
                <div key={i} className="rounded-lg border border-border p-4 space-y-3 bg-secondary/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Competitor {i + 1}</span>
                    {competitors.length > 1 && (
                      <button onClick={() => removeCompetitor(i)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Company Name *</Label>
                      <Input value={c.name} onChange={e => { const n = [...competitors]; n[i].name = e.target.value; setCompetitors(n); }}
                        placeholder="e.g. Salesforce" className="bg-secondary border-border text-sm h-9" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Website (optional)</Label>
                      <Input value={c.website_url} onChange={e => { const n = [...competitors]; n[i].website_url = e.target.value; setCompetitors(n); }}
                        placeholder="https://..." className="bg-secondary border-border text-sm h-9" />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" onClick={addCompetitor} className="text-primary hover:text-primary hover:bg-primary/10 text-sm gap-2">
                <PlusCircle size={15} /> Add another competitor
              </Button>
            </div>
          )}

          {/* Step 3: Queries */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground">Define monitoring queries</h2>
              <p className="text-sm text-muted-foreground">These are the questions we'll ask AI models — like what real customers would type.</p>
              {queries.map((q, i) => (
                <div key={i} className="rounded-lg border border-border p-4 space-y-3 bg-secondary/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Query {i + 1}</span>
                    {queries.length > 1 && (
                      <button onClick={() => removeQuery(i)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Query *</Label>
                    <Input value={q.query_text} onChange={e => { const n = [...queries]; n[i].query_text = e.target.value; setQueries(n); }}
                      placeholder={`e.g. Best ${industry || "software"} for small businesses`}
                      className="bg-secondary border-border text-sm h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <select value={q.category} onChange={e => { const n = [...queries]; n[i].category = e.target.value; setQueries(n); }}
                      className="w-full rounded-lg bg-secondary border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option value="general">General</option>
                      <option value="pricing">Pricing</option>
                      <option value="comparison">Comparison</option>
                      <option value="features">Features</option>
                      <option value="reviews">Reviews</option>
                    </select>
                  </div>
                </div>
              ))}
              <Button variant="ghost" onClick={addQuery} className="text-primary hover:text-primary hover:bg-primary/10 text-sm gap-2">
                <PlusCircle size={15} /> Add another query
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="text-muted-foreground hover:text-foreground gap-2">
              <ChevronLeft size={16} /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-teal gap-2">
                Continue <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={!canNext() || loading} className="btn-teal gap-2">
                {loading ? "Saving..." : "Launch Dashboard →"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
