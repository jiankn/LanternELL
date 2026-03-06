// OpenAI Provider Adapter
// Supports: GPT-4, GPT-4o, GPT-4o-mini, GPT-3.5 Turbo

import type { AIProviderAdapter, AIProviderConfig, AIRequest, AIResponse } from '../ai-providers';

export class OpenAIAdapter implements AIProviderAdapter {
  private config: AIProviderConfig;
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  }

  validateConfig(): boolean {
    return !!this.config.apiKey && !!this.config.model;
  }

  getProviderName(): string {
    return 'openai';
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userPrompt },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 4096,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined,
      model: data.model || this.config.model,
    };
  }
}

// Register this adapter
import { registerProvider } from '../ai-providers';
registerProvider('openai', OpenAIAdapter);
