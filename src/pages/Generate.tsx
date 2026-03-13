import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  FileCode2,
  Sparkles,
  Package,
  Copy,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function buildGeneratedSite(company: any, products: any[], tips: any[]) {
  const name = company?.name || "Your Company";
  const tagline = company?.description || `${name} – trusted in ${company?.industry || "our industry"}.`;
  const escapeHtml = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const highTips = (tips || []).filter((t: any) => t.priority === "high").slice(0, 5);
  const tipBlocks = highTips.map((t: any) => `<!-- ${escapeHtml(t.title)} -->\n${escapeHtml(t.description)}`).join("\n\n");

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${tagline.replace(/"/g, "&quot;")}" />
  <title>${name}</title>
</head>
<body>
  <header>
    <h1>${name}</h1>
    <p>${tagline}</p>
  </header>
  <main>
    <section aria-label="About">
      <h2>About ${name}</h2>
      <p>${tagline}</p>
    </section>
`;

  if (products.length > 0) {
    html += `
    <section aria-label="Products">
      <h2>Products</h2>
`;
    products.forEach((p: any) => {
      const price = p.price_usd ? ` — $${p.price_usd}` : "";
      const desc = (p.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      html += `      <article>
        <h3>${(p.name || "").replace(/</g, "&lt;")}${price}</h3>
        <p>${desc || "No description."}</p>
      </article>
`;
    });
    html += `    </section>
`;
  }

  if (tipBlocks) {
    html += `
    <section aria-label="AEO-optimized content">
      <h2>Why choose us</h2>
      <!-- Content informed by AEO suggestions -->
      ${tipBlocks.split("\n").join("\n      ")}
    </section>
`;
  }

  html += `  </main>
</body>
</html>`;

  return html;
}

export default function Generate() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [company, setCompany] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: comp } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      if (!comp) return;
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
  }, [user]);

  const handleGenerate = () => {
    const html = buildGeneratedSite(company, products, tips);
    setGeneratedHtml(html);
    setShowPreview(true);
    toast({ title: "Site generated", description: "Preview ready. Copy or download below." });
  };

  const handleCopy = async () => {
    if (!generatedHtml) return;
    await navigator.clipboard.writeText(generatedHtml);
    toast({ title: "Copied to clipboard", description: "Paste into your site or editor." });
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(company?.name || "site").replace(/\s+/g, "-")}-aeo.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Download started", description: "Check your downloads folder." });
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
      <div className="p-6 md:p-8 pt-16 md:pt-8 space-y-8 max-w-4xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Generate Site</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build a website draft from your optimization suggestions and product data. AEO-friendly structure, product descriptions, and meta copy included.
          </p>
        </div>

        {/* Suggestions applied */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm">Suggestions applied</h2>
          </div>
          {tips.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No optimization tips yet. Generate tips on the <strong>Optimization</strong> page first; they will be used here to shape your site content.
            </p>
          ) : (
            <ul className="space-y-2">
              {tips.slice(0, 10).map((t: any) => (
                <li key={t.id} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{t.title}</span>
                  <span className="text-muted-foreground text-xs">({t.priority})</span>
                </li>
              ))}
              {tips.length > 10 && (
                <li className="text-xs text-muted-foreground">+ {tips.length - 10} more</li>
              )}
            </ul>
          )}
        </div>

        {/* Product & entity content */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm">Product & entity content</h2>
          </div>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products in your profile. Add products in <strong>Settings</strong> or onboarding; they will appear here and in the generated site.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 text-muted-foreground font-medium">Product</th>
                    <th className="pb-2 text-muted-foreground font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/50">
                      <td className="py-2 pr-4 text-foreground font-medium">{p.name}</td>
                      <td className="py-2 text-muted-foreground max-w-md">{p.description || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Generate + Preview + Export */}
        <div className="stat-card space-y-4">
          <div className="flex items-center gap-2">
            <FileCode2 size={18} className="text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm">Generated website</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            One click builds a single HTML page with your company name, tagline, product blocks, and content informed by your AEO suggestions. Download or copy to use in your own site.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerate} className="btn-teal gap-2">
              <Sparkles size={14} />
              Generate site
            </Button>
            {generatedHtml && (
              <>
                <Button variant="outline" onClick={handleCopy} className="gap-2">
                  <Copy size={14} />
                  Copy to clipboard
                </Button>
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                  <Download size={14} />
                  Download HTML
                </Button>
              </>
            )}
          </div>

          {generatedHtml && (
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 text-sm font-medium text-foreground hover:bg-secondary/70"
              >
                {showPreview ? "Hide" : "Show"} preview
                {showPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showPreview && (
                <pre className="p-4 text-xs text-muted-foreground overflow-auto max-h-80 font-mono whitespace-pre-wrap break-words">
                  {generatedHtml}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Professional note */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Best practices included</p>
          <p>
            The generated page uses a clear heading hierarchy, meta description, and product blocks so AI crawlers and answer engines can parse your content. Use it as a starting point and add more pages (e.g. per-product, comparison tables) for stronger AEO.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
