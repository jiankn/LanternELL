// Gemini Provider Adapter
// API Docs: https://ai.google.dev/gemini-api/docs
// Gemini uses its own REST format (NOT OpenAI-compatible)

import type { AIProviderAdapter, AIProviderConfig, AIRequest, AIResponse } from '../ai-providers';

export class GeminiAdapter implements AIProviderAdapter {
  private config: AIProviderConfig;
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
  }

  validateConfig(): boolean {
    return !!this.config.apiKey && !!this.config.model;
  }

  getProviderName(): string {
    return 'gemini';
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const url = `${this.baseUrl}/models/${this.config.model}:generateContent`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.config.apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: request.systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: request.userPrompt }],
          },
        ],
        generationConfig: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens ?? 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini');
    }

    const text = data.candidates[0].content.parts[0].text;
    const usage = data.usageMetadata;

    return {
      content: text,
      usage: usage
        ? {
            promptTokens: usage.promptTokenCount || 0,
            completionTokens: usage.candidatesTokenCount || 0,
            totalTokens: usage.totalTokenCount || 0,
          }
        : undefined,
      model: data.modelVersion || this.config.model,
    };
  }
}

// Register this adapter
import { registerProvider } from '../ai-providers';
registerProvider('gemini', GeminiAdapter);
