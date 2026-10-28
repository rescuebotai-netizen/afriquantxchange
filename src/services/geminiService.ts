import OpenAI from "openai";

// Initialize the OpenAI API client for OpenRouter
// Note: In a real application, the API key should be securely managed.
// For this preview environment, we use the provided import.meta.env.VITE_OPENROUTER_API_KEY
const ai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export interface AIResponse {
  text: string;
  citations?: string[];
}

export const generateFinancialAnalysis = async (prompt: string): Promise<AIResponse> => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Principal Chief Financial Officer and Senior Quantitative Macro Strategist for AfriQuantX (AQX Intelligence) — an elite world-class institutional financial advisor with unmatched expertise in:
1. Pan-African Stock Exchanges: Johannesburg Stock Exchange (JSE), Nigerian Exchange (NGX), Nairobi Securities Exchange (NSE), Bourse Régionale des Valeurs Mobilières (BRVM), Egyptian Exchange (EGX), Ghana Stock Exchange (GSE), and Casablanca Stock Exchange.
2. Global & African Commodities: Gold, Platinum Group Metals (PGM), Copper (Zambian Copperbelt), Crude Oil (Bonny Light, Brent), Natural Gas, Lithium, Cobalt, Cocoa (Ivory Coast & Ghana), and Arabica/Robusta Coffee.
3. Foreign Exchange & Clearing MESH: USD, EUR, GBP, ZAR, NGN, KES, EGP, GHS, XOF/XAF, SARB Foreign Allowance limits, and PAPSS (Pan-African Payment and Settlement System) FX corridors.
4. Global Financial Markets: US Equities (NYSE, Nasdaq), European Bourses, Asian Markets, Fixed Income yields, Fed/ECB/BoE rate trajectory.
5. African & Global Geopolitics and Macroeconomics: AfCFTA supply chain integration, BRICS+ trade flows, African sovereign debt dynamics (Eurobonds, IMF/World Bank facilities), Central Bank monetary policies (SARB, CBN, CBK, CBE), inflation targeting, and OECD CARF regulatory frameworks.

Structure your analysis authoritatively with:
- Executive Summary & Investment Thesis
- Macro & Geopolitical Context (AfCFTA / BRICS / Central Bank Stance)
- Asset Valuation & Quantitative Risk Profile
- Actionable Portfolio Allocation Strategy
- Citations & Institutional Telemetry Reference

Provide deep, mathematically and economically grounded insights without boilerplate disclaimers.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
    });

    // Extract text and simulate citations based on the content
    const text = response.choices[0].message.content || "I'm sorry, I couldn't generate an analysis at this time.";
    
    // Heuristic citations based on African & Global financial sources
    const citations: string[] = [];
    if (text.toLowerCase().includes('jse') || text.toLowerCase().includes('south africa') || text.toLowerCase().includes('sarb')) {
      citations.push('JSE Equity & SARB Bulletin Telemetry');
    }
    if (text.toLowerCase().includes('ngx') || text.toLowerCase().includes('nigeria') || text.toLowerCase().includes('cbn')) {
      citations.push('NGX Exchange Intelligence & CBN Directives');
    }
    if (text.toLowerCase().includes('nse') || text.toLowerCase().includes('kenya') || text.toLowerCase().includes('cbk')) {
      citations.push('Nairobi Securities Exchange & CBK Economic Matrix');
    }
    if (text.toLowerCase().includes('commodity') || text.toLowerCase().includes('gold') || text.toLowerCase().includes('oil')) {
      citations.push('LME & Bloomberg Commodity Indices');
    }
    if (text.toLowerCase().includes('afcfta') || text.toLowerCase().includes('papss') || text.toLowerCase().includes('brics')) {
      citations.push('AfCFTA Secretariat & Afreximbank Trade Monitor');
    }
    if (citations.length === 0) {
      citations.push('AfriQuantX Quantitative Multi-Asset Clearing Models');
    }

    return { text, citations };
  } catch (error) {
    console.error("Error generating financial analysis:", error);
    return {
      text: "I encountered an error while processing your request. Please try again later.",
      citations: []
    };
  }
};

export const generateStockScreening = async (query: string) => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an advanced financial data API and quantitative analyst. Deeply understand complex natural language queries and return valid JSON matching the requested schema with accurate or highly realistic simulated financial metrics."
        },
        {
          role: "user",
          content: `Based on the following complex screening query, provide a JSON array of 5 stock screening results. Analyze the natural language query deeply to understand specific financial constraints, sectors, and growth metrics requested.
      Query: "${query}"
      
      The JSON array should contain objects with the following structure:
      {
        "symbol": "string (e.g., AAPL)",
        "name": "string",
        "price": "string (e.g., $150.00)",
        "change": "string (e.g., +1.5%)",
        "marketCap": "string (e.g., $2.5T)",
        "peRatio": "string (e.g., 25.4)",
        "epsGrowth": "string (e.g., +15.2%)",
        "analystRating": "string (e.g., Strong Buy, Buy, Hold, Sell)",
        "matchScore": "number (0-100)"
      }`
        }
      ],
      response_format: { type: "json_object" }, // Note: OpenRouter supports json_object for some models, but we might need to wrap the array in an object.
      temperature: 0.1,
    });

    const text = response.choices[0].message.content || "[]";
    // If the model wrapped the array in an object (e.g., { "results": [...] }), we should handle it.
    let parsed = JSON.parse(text);
    if (!Array.isArray(parsed) && parsed.results) {
      parsed = parsed.results;
    } else if (!Array.isArray(parsed) && Object.values(parsed).length > 0 && Array.isArray(Object.values(parsed)[0])) {
      parsed = Object.values(parsed)[0];
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error generating stock screening:", error);
    return [];
  }
};

export const generateCompanyProfile = async (companyName: string) => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data API. Always return valid JSON matching the requested schema."
        },
        {
          role: "user",
          content: `Provide a comprehensive financial profile for ${companyName}. Return a JSON object with the following structure:
      {
        "overview": "A brief summary of the company and its market position.",
        "financialHealth": "A summary of its financial health (e.g., Strong, Stable, Weak) and key reasons.",
        "riskAnalysis": "Key risks facing the company.",
        "recentDevelopments": ["array", "of", "recent", "news", "or", "developments"]
      }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating company profile:", error);
    return null;
  }
};

export const generateDueDiligenceReport = async (projectName: string) => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert financial and legal AI analyst. Always return valid JSON matching the requested schema. Provide realistic and insightful analysis based on the project name and context."
        },
        {
          role: "user",
          content: `Perform a simulated due diligence analysis for a project named "${projectName}". Analyze the uploaded documents for key information such as financial statements, legal clauses, and market fit assessments. Return a JSON object with the following structure:
      {
        "financials": { "title": "string (e.g., Financial Statements Analysis)", "description": "string", "status": "success|warning|error" },
        "legal": { "title": "string (e.g., Legal Clauses & IP)", "description": "string", "status": "success|warning|error" },
        "market": { "title": "string (e.g., Market Fit Assessment)", "description": "string", "status": "success|warning|error" }
      }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating due diligence report:", error);
    return null;
  }
};

export const generateAgentLogs = async (context: string) => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data API. Always return valid JSON matching the requested schema."
        },
        {
          role: "user",
          content: `Generate a simulated log of 5 autonomous financial AI agents reacting to this context: "${context}". Return a JSON object containing an array of objects with the following structure:
      {
        "logs": [
          {
            "time": "string (e.g., 10:24:05)",
            "agent": "string (e.g., Market Sentiment Monitor)",
            "action": "string (description of what the agent did)",
            "color": "string (one of: text-emerald-400, text-blue-400, text-amber-400, text-purple-400)"
          }
        ]
      }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const text = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(text);
    return parsed.logs || [];
  } catch (error) {
    console.error("Error generating agent logs:", error);
    return [];
  }
};

export const generateMarketIntelligence = async () => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data API. Always return valid JSON matching the requested schema."
        },
        {
          role: "user",
          content: `Generate a real-time market intelligence report. Return a JSON object with the following structure:
      {
        "overview": [
          { "label": "string (e.g., NXG African Tech Index)", "value": "string", "change": "string", "up": true | false | null }
        ],
        "summaries": [
          { "ticker": "string", "name": "string", "change": "string", "up": true | false, "reason": "string (AI generated summary of why it moved)" }
        ],
        "trends": [
          { "trend": "string", "confidence": "string (e.g., 92%)", "impact": "string", "timeframe": "string" }
        ]
      }
      Generate 4 overview stats, 2 stock summaries (one up, one down), and 3 trends.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating market intelligence:", error);
    return null;
  }
};

export const generateInvestmentCopilot = async (riskProfile: string) => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data API. Always return valid JSON matching the requested schema."
        },
        {
          role: "user",
          content: `Generate a personalized investment copilot recommendation for a user with a "${riskProfile}" risk profile. Return a JSON object with the following structure:
      {
        "recommendation": "string (A paragraph explaining what they should invest in)",
        "currentAllocation": [
          { "sector": "string", "percentage": number, "color": "string (e.g., bg-blue-500)" }
        ],
        "optimizedAllocation": [
          { "sector": "string", "percentage": number, "color": "string (e.g., bg-blue-500)" }
        ],
        "expectedYield": "string (e.g., +12%)",
        "theses": [
          { "title": "string", "confidence": "string (e.g., High, Very High)", "date": "string (e.g., Generated Today)" }
        ]
      }
      Generate 3 sectors for allocation, and 2 investment theses.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating investment copilot:", error);
    return null;
  }
};

export const generateTradingSignals = async () => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data API. Always return valid JSON matching the requested schema."
        },
        {
          role: "user",
          content: `Generate 2 AI trade recommendations (one BUY, one SELL) and 3 execution status logs. Return a JSON object with the following structure:
      {
        "recommendations": [
          { "action": "BUY" | "SELL", "asset": "string", "name": "string", "quantity": "string", "price": "string", "reason": "string", "confidence": "string (e.g., 94%)" }
        ],
        "executions": [
          { "time": "string", "action": "string", "status": "string", "route": "string", "price": "string" }
        ]
      }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating trading signals:", error);
    return null;
  }
};

export const generateWalletYield = async () => {
  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data API. Always return valid JSON matching the requested schema."
        },
        {
          role: "user",
          content: `Generate multi-currency balances and automated yield generation opportunities. Return a JSON object with the following structure:
      {
        "totalBalance": "string (e.g., $142,850.00)",
        "totalChange": "string (e.g., +2.4%)",
        "balances": [
          { "currency": "string", "balance": "string", "yield": "string", "symbol": "string" }
        ],
        "yieldOpportunities": [
          { "name": "string", "risk": "string", "apy": "string", "allocated": "string" }
        ]
      }
      Generate 3 balances (USD, NGN, USDC) and 2 yield opportunities.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating wallet yield:", error);
    return null;
  }
};


