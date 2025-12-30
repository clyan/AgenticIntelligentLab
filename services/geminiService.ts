
import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration } from "@google/genai";
import { Language } from "../types";

// Always use process.env.API_KEY directly for initialization as per guidelines
export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Simulated Financial Tools for Stage 3
const stockPriceTool: FunctionDeclaration = {
  name: 'get_stock_price',
  parameters: {
    type: Type.OBJECT,
    description: 'Get the current stock price and change percentage for a given ticker.',
    properties: {
      ticker: {
        type: Type.STRING,
        description: 'The stock symbol (e.g., AAPL, TSLA, BTC).',
      },
    },
    required: ['ticker'],
  },
};

const marketSentimentTool: FunctionDeclaration = {
  name: 'get_market_sentiment',
  parameters: {
    type: Type.OBJECT,
    description: 'Get general market sentiment for a sector.',
    properties: {
      sector: {
        type: Type.STRING,
        description: 'The industry sector (e.g., Tech, Finance, Energy).',
      },
    },
    required: ['sector'],
  },
};

export const runAgenticCycle = async (
  prompt: string, 
  lang: Language,
  onLog: (log: { type: 'thought' | 'action' | 'observation' | 'system', content: string }) => void
) => {
  // Initialize AI client right before use to ensure updated configuration
  const ai = getGeminiClient();
  
  const initialLog = lang === 'en' 
    ? "Initializing Agent Brain... Planning steps for: "
    : "正在初始化智能体大脑... 规划步骤：";
    
  onLog({ type: 'thought', content: initialLog + prompt });

  try {
    const systemInstruction = lang === 'en'
      ? "Respond primarily in English. Use tools when appropriate."
      : "请主要使用中文回答。在适当的时候使用工具。";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 2000 },
        tools: [{ functionDeclarations: [stockPriceTool, marketSentimentTool] }]
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const fc of response.functionCalls) {
        const actionLog = lang === 'en'
          ? `Executing Tool: ${fc.name}(${JSON.stringify(fc.args)})`
          : `正在执行工具: ${fc.name}(${JSON.stringify(fc.args)})`;
        onLog({ type: 'action', content: actionLog });
        
        // Mocking tool responses for demonstration
        let result = "";
        if (fc.name === 'get_stock_price') {
          const price = (Math.random() * 1000).toFixed(2);
          result = lang === 'en' 
            ? `Price: $${price}, Change: +1.2%`
            : `价格: $${price}, 涨跌幅: +1.2%`;
        } else {
          result = lang === 'en'
            ? "Current sentiment is Bullish, high institutional interest detected."
            : "当前市场情绪看涨，探测到机构投资者的浓厚兴趣。";
        }
        
        const obsLog = lang === 'en' ? "Tool Observation: " : "工具观察结果: ";
        onLog({ type: 'observation', content: obsLog + result });
      }
    }

    // Use .text property to extract response content
    return response.text || (lang === 'en' ? "Task completed." : "任务已完成。");

  } catch (error: any) {
    const errorLog = lang === 'en' ? "Error encountered: " : "遇到错误: ";
    onLog({ type: 'system', content: errorLog + error.message });
    return lang === 'en' ? "Failed to complete task." : "无法完成任务。";
  }
};
