import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { company_name, industry, products, competitors, website_url } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an AI visibility expert helping a business improve how AI assistants find and recommend their products.

Company: ${company_name}
Industry: ${industry || "not specified"}
Website: ${website_url || "not specified"}
Products: ${(products || []).map((p: any) => p.name).join(", ") || "not specified"}
Competitors: ${(competitors || []).map((c: any) => c.name).join(", ") || "none"}

Generate exactly 6 specific, actionable optimization recommendations to help this company appear more prominently and accurately in AI assistant responses.

For each recommendation provide:
- category: one of [structured_data, content, llms_txt, technical, reviews, comparison]
- priority: one of [high, medium, low]
- title: short action title (under 10 words)
- description: specific actionable description (2-3 sentences)

Respond ONLY with valid JSON array: [{"category":"...","priority":"...","title":"...","description":"..."}]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
      if (response.status === 402) throw new Error("Payment required. Please add credits to your workspace.");
      throw new Error(`AI gateway error [${response.status}]`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const tips = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return new Response(JSON.stringify({ tips }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    console.error("generate-tips error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
