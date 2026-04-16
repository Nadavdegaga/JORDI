import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vertical, companyName, website, stage, primaryMarket, businessModel, revenueRange, description } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a senior UAE market strategist at RoyalX, an institutional-grade commercial advisory firm. You produce confidential executive briefs for companies exploring the UAE market.

You MUST respond with valid JSON only, no markdown, no extra text. Use this exact structure:

{
  "fitSummary": {
    "level": "Low" | "Medium" | "High",
    "reasoning": "2-3 sentence explanation"
  },
  "marketSize": {
    "tam": "range estimate",
    "sam": "range estimate",
    "som": "range estimate",
    "assumptions": "1-2 sentence basis for estimates"
  },
  "growthDrivers": ["driver 1", "driver 2", "driver 3", "driver 4"],
  "goToMarket": [
    {"step": "Step title", "detail": "1-2 sentence explanation"},
    {"step": "Step title", "detail": "1-2 sentence explanation"},
    {"step": "Step title", "detail": "1-2 sentence explanation"}
  ],
  "risks": ["risk 1", "risk 2", "risk 3"]
}

Be specific to the UAE/GCC region. Reference real programs (D33, Dubai Economic Agenda, ADIO incentives, free zones like DIFC, ADGM, DAFZA) when relevant. Be authoritative but indicate estimates are indicative.`;

    const userPrompt = `Generate a confidential UAE market brief for:

Company: ${companyName}
${website ? `Website: ${website}` : ""}
Vertical: ${vertical}
Stage: ${stage}
Primary Market: ${primaryMarket}
Business Model: ${businessModel}
${revenueRange ? `Revenue Range: ${revenueRange}` : ""}
Description: ${description}

Provide a thorough, executive-level analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Failed to generate brief." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse the JSON from the AI response
    let briefData;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      briefData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse brief data." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(briefData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("uae-brief error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
