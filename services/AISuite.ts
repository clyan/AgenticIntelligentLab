
import { GoogleGenAI, Type, FunctionDeclaration, Modality } from "@google/genai";
import { Language } from "../types";

/**
 * AISuite: A production-ready abstraction for Agentic logic
 */
export class AISuite {
  private ai: any;
  private modelName: string = 'gemini-3-pro-preview';

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Basic Content Generation with reasoning capabilities
   */
  async generate(params: {
    prompt: string;
    systemInstruction?: string;
    thinkingBudget?: number;
    tools?: any[];
    responseMimeType?: string;
    responseSchema?: any;
  }) {
    const config: any = {
      systemInstruction: params.systemInstruction,
      thinkingConfig: params.thinkingBudget ? { thinkingBudget: params.thinkingBudget } : undefined,
      tools: params.tools ? [{ functionDeclarations: params.tools }] : undefined,
      responseMimeType: params.responseMimeType,
      responseSchema: params.responseSchema,
    };

    return await this.ai.models.generateContent({
      model: this.modelName,
      contents: params.prompt,
      config
    });
  }

  /**
   * Stream implementation for Stage 4
   */
  async *stream(prompt: string) {
    const response = await this.ai.models.generateContentStream({
      model: this.modelName,
      contents: prompt,
    });
    for await (const chunk of response) {
      yield chunk.text;
    }
  }
}
