import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, BrainCircuit, Send, User, Bot, 
  ChevronDown, ChevronUp, BarChart3, Zap, ShieldCheck
} from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reasoning?: string;
  confidence?: number;
  visualType?: 'chart' | 'scenario' | null;
}

const defaultPrompts = [
  "Why is my portfolio projected to grow 18%?",
  "What is the best move before Q4 dividend snapshot?",
  "Should I increase exposure to Financials?"
];

interface AQXAssistantProps {
  setActiveTab: (tab: string) => void;
}

export function AQXAssistant({ setActiveTab }: AQXAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AQX AI Assistant. I've analyzed your portfolio, current AQX market data, and macroeconomic signals. How can I help you optimize your strategy today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      
      // Construct context for the AI
      const context = `You are an elite financial AI assistant for the AfriQuant X (AQX) and global markets. 
      The user's portfolio is projected to grow 18% this quarter. 
      They have exposure to Technology (Naspers) which reduces volatility by 12%. 
      Financials sector shows pre-dividend momentum. 
      AQX Tech 100 index is trending bullish. 
      Risk profile is Low Risk.
      Provide concise, professional, and actionable financial advice.
      You have access to a tool to fetch real-time data from ANY public API. Use it to get live prices, news, or macroeconomic data when asked.`;

      const apiMessages: any[] = [
        { role: 'system', content: context },
        ...messages.filter(m => m.id !== 'welcome').map(m => ({
          role: m.role,
          content: m.content
        })),
        { role: 'user', content: text }
      ];

      const tools: OpenAI.Chat.ChatCompletionTool[] = [
        {
          type: "function",
          function: {
            name: "fetch_api",
            description: "Fetch data from a public API URL in real-time. Useful for getting live crypto prices (e.g. from CoinGecko), stock data, or news.",
            parameters: {
              type: "object",
              properties: {
                url: { type: "string", description: "The full URL of the API to fetch" }
              },
              required: ["url"]
            }
          }
        }
      ];

      let response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: apiMessages,
        tools: tools,
        tool_choice: "auto"
      });

      let responseMessage = response.choices[0].message;

      if (responseMessage.tool_calls) {
        apiMessages.push(responseMessage);
        for (const toolCall of responseMessage.tool_calls) {
          if (toolCall.type !== "function") continue;
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          
          let functionResponse = "";
          if (functionName === "fetch_api") {
            try {
              const res = await fetch(functionArgs.url);
              const data = await res.json();
              functionResponse = JSON.stringify(data).substring(0, 2000); // Limit length to avoid token limits
            } catch (e: any) {
              functionResponse = JSON.stringify({ error: e.message });
            }
          } else {
            functionResponse = JSON.stringify({ error: "Unknown function" });
          }

          apiMessages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: functionResponse,
          });
        }

        response = await openai.chat.completions.create({
          model: "openai/gpt-4o-mini",
          messages: apiMessages,
        });
        responseMessage = response.choices[0].message;
      }

      const finalContent = responseMessage.content || "I'm analyzing that request...";
      
      // Simulate reasoning and confidence generation
      const confidence = Math.floor(Math.random() * 15) + 80; // 80-95%
      const reasoning = responseMessage.tool_calls ? "Based on real-time data fetched from external APIs." : "Based on historical correlation and portfolio analysis.";
      
      // Determine if a visual should be shown (simulated logic)
      let visualType: 'chart' | 'scenario' | null = null;
      if (text.toLowerCase().includes('grow') || text.toLowerCase().includes('chart')) visualType = 'chart';
      if (text.toLowerCase().includes('move') || text.toLowerCase().includes('scenario')) visualType = 'scenario';

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalContent,
        timestamp: new Date(),
        reasoning: reasoning,
        confidence: confidence,
        visualType: visualType
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm currently experiencing connectivity issues with the AQX data feed. Please try again in a moment.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoning(expandedReasoning === id ? null : id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <button 
          onClick={() => setActiveTab('intelligence-ngx')}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[#0066FF]" />
            AQX AI Assistant
          </h1>
          <p className="text-sm text-zinc-400">Conversational intelligence trained on your portfolio and AQX data.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-[#0A0A0A] border border-white/10 rounded-3xl p-4 md:p-6 mb-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-[#0066FF]/20 border border-[#0066FF]/30' : 'bg-[#FFFFFF]/20 border border-[#FFFFFF]/30'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-[#0066FF]" /> : <Bot className="w-5 h-5 text-[#FFFFFF]" />}
            </div>
            
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-[#0066FF] text-white rounded-tr-sm' 
                  : 'bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {/* Visual Outputs (Simulated) */}
                {msg.visualType === 'chart' && (
                  <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center h-32">
                    <BarChart3 className="w-8 h-8 text-[#0066FF] mb-2" />
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Interactive Chart Generated</span>
                  </div>
                )}
                {msg.visualType === 'scenario' && (
                  <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center h-32">
                    <Zap className="w-8 h-8 text-[#FFFFFF] mb-2" />
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Scenario Simulation Ready</span>
                  </div>
                )}
              </div>

              {/* Assistant Metadata (Confidence & Reasoning) */}
              {msg.role === 'assistant' && msg.id !== 'welcome' && (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-3 px-2">
                    {msg.confidence && (
                      <span className="text-xs font-bold text-[#00C896] flex items-center gap-1 bg-[#00C896]/10 px-2 py-1 rounded-md border border-[#00C896]/20">
                        <ShieldCheck className="w-3 h-3" />
                        {msg.confidence}% Certainty
                      </span>
                    )}
                    {msg.reasoning && (
                      <button 
                        onClick={() => toggleReasoning(msg.id)}
                        className="text-xs text-zinc-500 hover:text-[#0066FF] transition-colors flex items-center gap-1"
                      >
                        Why this recommendation?
                        {expandedReasoning === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedReasoning === msg.id && msg.reasoning && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-[#0066FF]/5 border border-[#0066FF]/10 rounded-xl text-sm text-zinc-400 ml-2 border-l-2 border-l-[#0066FF]">
                          {msg.reasoning}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/20 border border-[#FFFFFF]/30 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-[#FFFFFF]" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 space-y-4">
        {/* Default Prompts */}
        <div className="flex flex-wrap gap-2">
          {defaultPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI about your portfolio..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-4 pr-14 py-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#0066FF]/50 transition-colors font-medium shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-[#0066FF] text-white hover:bg-[#0066FF]/80 disabled:opacity-50 disabled:hover:bg-[#0066FF] rounded-xl transition-colors shadow-[0_0_15px_rgba(0,102,255,0.3)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
