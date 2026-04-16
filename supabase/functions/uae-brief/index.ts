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

    const systemPrompt = `אתה יועץ אוטומציה עסקית בכיר. אתה מנתח עסקים ומזהה הזדמנויות לאוטומציה, ייעול תהליכים וחיסכון בעלויות.

אתה חייב להשיב ב-JSON תקין בלבד, ללא markdown, ללא טקסט נוסף. השתמש במבנה הבא בדיוק:

{
  "fitSummary": {
    "level": "Low" | "Medium" | "High",
    "reasoning": "2-3 משפטים שמסבירים את פוטנציאל האוטומציה של העסק"
  },
  "automations": [
    {"process": "שם התהליך", "description": "תיאור קצר", "savingsEstimate": "הערכת חיסכון חודשי בשקלים או שעות", "complexity": "קל" | "בינוני" | "מורכב"},
    {"process": "שם התהליך", "description": "תיאור קצר", "savingsEstimate": "הערכת חיסכון", "complexity": "קל" | "בינוני" | "מורכב"},
    {"process": "שם התהליך", "description": "תיאור קצר", "savingsEstimate": "הערכת חיסכון", "complexity": "קל" | "בינוני" | "מורכב"}
  ],
  "totalSavings": {
    "monthlyCostSaving": "טווח חיסכון חודשי מוערך בשקלים",
    "monthlyTimeSaving": "שעות חודשיות שנחסכות",
    "revenueGrowthPotential": "אחוז גידול פוטנציאלי בהכנסות",
    "assumptions": "1-2 משפטים על הבסיס להערכות"
  },
  "quickWins": ["שיפור מהיר 1", "שיפור מהיר 2", "שיפור מהיר 3"],
  "roadmap": [
    {"step": "כותרת שלב", "detail": "1-2 משפטים", "timeline": "טווח זמן"},
    {"step": "כותרת שלב", "detail": "1-2 משפטים", "timeline": "טווח זמן"},
    {"step": "כותרת שלב", "detail": "1-2 משפטים", "timeline": "טווח זמן"}
  ],
  "risks": ["סיכון 1", "סיכון 2", "סיכון 3"]
}

התמקד בזיהוי תהליכים ספציפיים שניתן לאוטמט, כמה כל אחד יחסוך, ומתן תמונה ברורה של ROI. כל התשובות בעברית.`;

    const userPrompt = `נתח את העסק הבא וזהה הזדמנויות לאוטומציה וחיסכון:

חברה: ${companyName}
${website ? `אתר: ${website}` : ""}
תחום: ${vertical}
שלב: ${stage}
שוק: ${primaryMarket}
מודל עסקי: ${businessModel}
${revenueRange ? `טווח הכנסות: ${revenueRange}` : ""}
תיאור: ${description}

ספק ניתוח מעמיק של הזדמנויות אוטומציה, חיסכון בעלויות והגדלת הכנסות.`;


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
