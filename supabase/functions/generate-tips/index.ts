import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { company_name, industry, products, competitors, website_url } = await req.json();

    // 1. CHANGE: Use a direct API Key (OpenAI example)
    const apiKey = Deno.env.get("OPENAI_API_KEY"); 
    if (!apiKey) throw new Error("API Key not configured");

    const prompt = `...your prompt logic...`; // Keep your existing prompt logic

    // 2. CHANGE: Point to the official API endpoint instead of ai.gateway.lovable.dev
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Or your preferred model
        messages: [
          { role: "system", content: "You are a JSON-only assistant." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }, // Ensures valid JSON output
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`AI Provider Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the JSON (OpenAI's json_object mode makes this much safer)
    const parsedData = JSON.parse(content);
    const tips = Array.isArray(parsedData) ? parsedData : (parsedData.tips || []);

    return new Response(JSON.stringify({ tips }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e: any) {
    console.error("Function error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});