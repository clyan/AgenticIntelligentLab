
import { AISuite } from "./AISuite";
import { StageId, Language } from "../types";
import { Type } from "@google/genai";

// Initialize the suite with the environment key
const getAgent = () => new AISuite(process.env.API_KEY);

/**
 * Maps the curriculum steps to actual executable logic.
 * This ensures that when a user clicks "Execute", the sandbox runs the code shown on screen.
 */
export const executeStepLogic = async (
  stageId: StageId,
  stepIndex: number,
  input: string,
  lang: Language,
  onLog: (log: { type: 'thought' | 'action' | 'observation' | 'system', content: string }) => void
) => {
  const agent = getAgent();

  try {
    // --- STAGE 1: BRAIN BUILDING ---
    if (stageId === StageId.BRAIN) {
      if (stepIndex === 0) {
        // Step 1.1: CoT & ReAct
        const systemInstruction = lang === 'en' 
          ? "You are a high-reasoning Agent. Use Thought/Action/Observation/Conclusion format." 
          : "你是一个具备深度推理能力的智能体。请遵循：思考/行动/观察/结论 的逻辑循环。";
        
        onLog({ type: 'system', content: lang === 'en' ? "Configuring CoT with 2000 token budget..." : "正在配置 2000 Token 预算的思维链..." });
        
        const res = await agent.generate({
          prompt: input,
          systemInstruction,
          thinkingBudget: 2000
        });
        return res.text;
      }

      if (stepIndex === 1) {
        // Step 1.2: JSON Mode
        const schema = {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            entities: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER }
          },
          required: ["analysis", "entities"]
        };
        onLog({ type: 'system', content: "Enforcing JSON Schema output..." });
        const res = await agent.generate({
          prompt: input,
          responseMimeType: "application/json",
          responseSchema: schema
        });
        return res.text;
      }

      if (stepIndex === 2) {
        // Step 1.3: Function Calling
        const tools = [{
          name: "query_user_db",
          description: "Queries internal database for user history.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              user_id: { type: Type.STRING },
              query_type: { type: Type.STRING, enum: ["purchases", "profile"] }
            },
            required: ["user_id", "query_type"]
          }
        }];
        onLog({ type: 'system', content: "Registering tools for detection..." });
        const res = await agent.generate({ prompt: input, tools });
        if (res.functionCalls) {
          const call = res.functionCalls[0];
          onLog({ type: 'action', content: `Call: ${call.name}(${JSON.stringify(call.args)})` });
          return `Tool Requested: ${call.name}`;
        }
        return res.text;
      }
    }

    // --- STAGE 3: PRACTICE (Specialized Tools) ---
    if (stageId === StageId.PRACTICE) {
       // Mocked execution for financial assistant
       onLog({ type: 'thought', content: "Analyzing market data vectors..." });
       const res = await agent.generate({ prompt: input, thinkingBudget: 1000 });
       return res.text;
    }

    // Default fallback for other stages
    const genericRes = await agent.generate({ prompt: input });
    return genericRes.text;

  } catch (error: any) {
    onLog({ type: 'system', content: `Error: ${error.message}` });
    return `Execution Failed: ${error.message}`;
  }
};

// Keep old export for compatibility if needed, but point to new logic
export const runAgenticCycle = executeStepLogic;
