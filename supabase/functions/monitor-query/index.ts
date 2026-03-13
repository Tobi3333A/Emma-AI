import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_MODELS = [
  { id: "chatgpt", label: "ChatGPT", color: "#00C2FF" },
  { id: "grok", label: "Grok", color: "#FF6B35" },
  { id: "claude", label: "Claude", color: "#C9B3FF" },
  { id: "gemini", label: "Gemini", color: "#34D399" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, company_name, products, competitors } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productList = (products || []).map((p: any) => `${p.name}${p.price_usd ? ` ($${p.price_usd})` : ""}`).join(", ");
    const competitorList = (competitors || []).map((c: any) => c.name).join(", ");

    // System prompt instructs model to respond as if it's each AI assistant being monitored
    const systemPrompt = `You are simulating an AI shopping assistant response. Answer the customer query naturally and helpfully.
Company being monitored: "${company_name || "Unknown Company"}"
Their products: ${productList || "not specified"}
Known competitors: ${competitorList || "none specified"}

IMPORTANT INSTRUCTIONS:
1. Answer as a real AI assistant would — recommend products, compare options, give prices
2. Vary whether you mention the monitored company (sometimes include it, sometimes don't, sometimes rank it differently)
3. Sometimes include minor factual inaccuracies about product features or pricing (hallucinations) — these are realistic
4. Keep responses to 3-5 sentences or a short list
5. Be natural and helpful`;

    // Run 4 "model" queries in parallel (all using Lovable AI but labeled as different models)
    const modelPromises = AI_MODELS.map(async (model) => {
      const modelVariantPrompt = `${systemPrompt}\n\nRespond as ${model.label} AI assistant would — with its characteristic tone and style.`;
      
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: modelVariantPrompt },
              { role: "user", content: query },
            ],
            temperature: 0.8,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
          if (response.status === 402) throw new Error("Payment required. Please add credits to your workspace.");
          throw new Error(`AI gateway error [${response.status}]: ${errText}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "";

        // Analyze the response
        const lowerResponse = aiResponse.toLowerCase();
        const lowerCompany = (company_name || "").toLowerCase();
        const brandMentioned = lowerCompany && lowerResponse.includes(lowerCompany);
        
        // Find mention rank (which position in a list if mentioned)
        let mentionRank: number | null = null;
        if (brandMentioned) {
          const lines = aiResponse.split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(lowerCompany)) {
              mentionRank = i + 1;
              break;
            }
          }
          if (!mentionRank) mentionRank = 1;
        }

        // Detect competitors mentioned
        const competitorsMentioned = (competitors || [])
          .filter((c: any) => lowerResponse.includes(c.name.toLowerCase()))
          .map((c: any) => c.name);

        // Detect accuracy issues using a second AI call
        let accuracyIssues: string[] = [];
        let accuracyScore = 100;

        if (brandMentioned && products && products.length > 0) {
          const factCheckPrompt = `You are a product accuracy checker. Given this AI response and actual product data, identify any factual inaccuracies or hallucinations.

AI Response: "${aiResponse}"

Actual product data:
${products.map((p: any) => `- ${p.name}: ${p.description || ""} ${p.price_usd ? `Price: $${p.price_usd}` : ""} Features: ${JSON.stringify(p.features)}`).join("\n")}

List ONLY factual errors found (wrong price, wrong features, wrong availability). If none found, respond with "ACCURATE". Keep each issue under 10 words. Format: issue1|issue2|issue3`;

          const factCheckResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [{ role: "user", content: factCheckPrompt }],
              temperature: 0.1,
            }),
          });

          if (factCheckResponse.ok) {
            const factData = await factCheckResponse.json();
            const factText = factData.choices?.[0]?.message?.content || "";
            if (!factText.toUpperCase().includes("ACCURATE") && factText.trim()) {
              accuracyIssues = factText.split("|").map((s: string) => s.trim()).filter(Boolean).slice(0, 5);
              accuracyScore = Math.max(0, 100 - accuracyIssues.length * 20);
            }
          }
        }

        // Sentiment analysis
        const positiveWords = ["great", "excellent", "best", "top", "recommended", "leading", "popular", "love", "fantastic"];
        const negativeWords = ["poor", "bad", "worst", "avoid", "overpriced", "disappointing", "issues", "problems"];
        let sentiment: "positive" | "neutral" | "negative" = "neutral";
        if (brandMentioned) {
          const positiveCount = positiveWords.filter(w => lowerResponse.includes(w)).length;
          const negativeCount = negativeWords.filter(w => lowerResponse.includes(w)).length;
          if (positiveCount > negativeCount) sentiment = "positive";
          else if (negativeCount > positiveCount) sentiment = "negative";
        }

        return {
          model: model.id,
          model_label: model.label,
          model_color: model.color,
          ai_response: aiResponse,
          brand_mentioned: brandMentioned,
          mention_rank: mentionRank,
          sentiment,
          competitors_mentioned: competitorsMentioned,
          accuracy_issues: accuracyIssues,
          accuracy_score: accuracyScore,
        };
      } catch (modelError: unknown) {
        const errMsg = modelError instanceof Error ? modelError.message : "Unknown error";
        return {
          model: model.id,
          model_label: model.label,
          model_color: model.color,
          ai_response: null,
          brand_mentioned: false,
          mention_rank: null,
          sentiment: "neutral",
          competitors_mentioned: [],
          accuracy_issues: [],
          accuracy_score: 0,
          error: errMsg,
        };
      }
    });

    const results = await Promise.all(modelPromises);

    return new Response(JSON.stringify({ results, query }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    console.error("monitor-query error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
