import OpenAI from 'openai';

let aiClient: OpenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    aiClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
    });
  }
  return aiClient;
};

export const generateMarketIntelligence = async () => {
  try {
    const ai = getAiClient();
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
    throw error;
  }
};

export const generateInvestmentCopilot = async (riskProfile: string) => {
  try {
    const ai = getAiClient();
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
    throw error;
  }
};

export const generateTradingSignals = async () => {
  try {
    const ai = getAiClient();
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
    throw error;
  }
};

export const generateWalletYield = async () => {
  try {
    const ai = getAiClient();
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
    throw error;
  }
};
