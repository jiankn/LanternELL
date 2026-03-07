// Multi-Provider AI Architecture
// Supports the providers currently wired into the app runtime.

import type { PackContent } from './content-schema';

export const SUPPORTED_AI_PROVIDERS = ['zhipuai', 'openai', 'deepseek', 'gemini'] as const;
export type AIProvider = (typeof SUPPORTED_AI_PROVIDERS)[number];

const PROVIDER_METADATA: Record<
  AIProvider,
  {
    label: string;
    envKey: string;
    modelEnvKey: string;
    baseUrlEnvKey: string;
    defaultModel: string;
    defaultBaseUrl: string;
  }
> = {
  zhipuai: {
    label: 'ZhipuAI',
    envKey: 'ZHIPUAI_API_KEY',
    modelEnvKey: 'ZHIPUAI_MODEL',
    baseUrlEnvKey: 'ZHIPUAI_BASE_URL',
    defaultModel: 'glm-4.7',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  },
  openai: {
    label: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    modelEnvKey: 'OPENAI_MODEL',
    baseUrlEnvKey: 'OPENAI_BASE_URL',
    defaultModel: 'gpt-4o',
    defaultBaseUrl: 'https://api.openai.com/v1',
  },
  deepseek: {
    label: 'DeepSeek',
    envKey: 'DEEPSEEK_API_KEY',
    modelEnvKey: 'DEEPSEEK_MODEL',
    baseUrlEnvKey: 'DEEPSEEK_BASE_URL',
    defaultModel: 'deepseek-chat',
    defaultBaseUrl: 'https://api.deepseek.com',
  },
  gemini: {
    label: 'Gemini',
    envKey: 'GEMINI_API_KEY',
    modelEnvKey: 'GEMINI_MODEL',
    baseUrlEnvKey: 'GEMINI_BASE_URL',
    defaultModel: 'gemini-2.5-flash',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
};

// ============================================
// Provider Types & Interfaces
// ============================================

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

export interface AIProviderAdapter {
  generate(request: AIRequest): Promise<AIResponse>;
  validateConfig(): boolean;
  getProviderName(): string;
}

// ============================================
// Environment Configuration
// ============================================

export interface AIConfig {
  ACTIVE_PROVIDER: AIProvider;
  FALLBACK_PROVIDER?: AIProvider;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  OPENAI_BASE_URL?: string;
  ZHIPUAI_API_KEY?: string;
  ZHIPUAI_MODEL?: string;
  ZHIPUAI_BASE_URL?: string;
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  DEEPSEEK_BASE_URL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_BASE_URL?: string;
}

export function getAIConfig(): AIConfig {
  return {
    ACTIVE_PROVIDER: parseProvider(process.env.AI_ACTIVE_PROVIDER, 'zhipuai'),
    FALLBACK_PROVIDER: parseOptionalProvider(process.env.AI_FALLBACK_PROVIDER),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || PROVIDER_METADATA.openai.defaultModel,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || PROVIDER_METADATA.openai.defaultBaseUrl,
    ZHIPUAI_API_KEY: process.env.ZHIPUAI_API_KEY,
    ZHIPUAI_MODEL: process.env.ZHIPUAI_MODEL || PROVIDER_METADATA.zhipuai.defaultModel,
    ZHIPUAI_BASE_URL: process.env.ZHIPUAI_BASE_URL || PROVIDER_METADATA.zhipuai.defaultBaseUrl,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || PROVIDER_METADATA.deepseek.defaultModel,
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL || PROVIDER_METADATA.deepseek.defaultBaseUrl,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || PROVIDER_METADATA.gemini.defaultModel,
    GEMINI_BASE_URL: process.env.GEMINI_BASE_URL || PROVIDER_METADATA.gemini.defaultBaseUrl,
  };
}

export function getActiveProviderConfig(): AIProviderConfig {
  return getProviderConfigForType(getAIConfig().ACTIVE_PROVIDER);
}

export function getProviderConfigForType(provider: AIProvider): AIProviderConfig {
  const config = getAIConfig();

  switch (provider) {
    case 'openai':
      if (!config.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not configured');
      }
      return {
        provider: 'openai',
        apiKey: config.OPENAI_API_KEY,
        baseUrl: config.OPENAI_BASE_URL,
        model: config.OPENAI_MODEL || PROVIDER_METADATA.openai.defaultModel,
      };
    case 'zhipuai':
      if (!config.ZHIPUAI_API_KEY) {
        throw new Error('ZHIPUAI_API_KEY is not configured');
      }
      return {
        provider: 'zhipuai',
        apiKey: config.ZHIPUAI_API_KEY,
        baseUrl: config.ZHIPUAI_BASE_URL,
        model: config.ZHIPUAI_MODEL || PROVIDER_METADATA.zhipuai.defaultModel,
      };
    case 'deepseek':
      if (!config.DEEPSEEK_API_KEY) {
        throw new Error('DEEPSEEK_API_KEY is not configured');
      }
      return {
        provider: 'deepseek',
        apiKey: config.DEEPSEEK_API_KEY,
        baseUrl: config.DEEPSEEK_BASE_URL,
        model: config.DEEPSEEK_MODEL || PROVIDER_METADATA.deepseek.defaultModel,
      };
    case 'gemini':
      if (!config.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
      }
      return {
        provider: 'gemini',
        apiKey: config.GEMINI_API_KEY,
        baseUrl: config.GEMINI_BASE_URL,
        model: config.GEMINI_MODEL || PROVIDER_METADATA.gemini.defaultModel,
      };
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function getConfiguredProviders(config = getAIConfig()): AIProvider[] {
  return SUPPORTED_AI_PROVIDERS.filter((provider) => {
    switch (provider) {
      case 'openai':
        return Boolean(config.OPENAI_API_KEY);
      case 'zhipuai':
        return Boolean(config.ZHIPUAI_API_KEY);
      case 'deepseek':
        return Boolean(config.DEEPSEEK_API_KEY);
      case 'gemini':
        return Boolean(config.GEMINI_API_KEY);
      default:
        return false;
    }
  });
}

export function getProviderLabel(provider: AIProvider): string {
  return PROVIDER_METADATA[provider].label;
}

// ============================================
// Provider Registry
// ============================================

const providerRegistry: Map<AIProvider, new (config: AIProviderConfig) => AIProviderAdapter> = new Map();

export function registerProvider(
  provider: AIProvider,
  adapterClass: new (config: AIProviderConfig) => AIProviderAdapter
) {
  providerRegistry.set(provider, adapterClass);
}

export function getProvider(): AIProviderAdapter {
  return getProviderFromConfig(getActiveProviderConfig());
}

// ============================================
// Unified Generate Function
// ============================================

export async function generateWithAI(
  request: AIRequest,
  config?: Partial<AIProviderConfig>
): Promise<PackContent> {
  const primaryConfig = { ...getActiveProviderConfig(), ...config };

  try {
    const provider = getProviderFromConfig(primaryConfig);
    const response = await provider.generate(request);
    return parseJSONResponse(response.content);
  } catch (primaryError) {
    console.error(`Primary provider ${primaryConfig.provider} failed:`, primaryError);

    const fallbackProvider = getAIConfig().FALLBACK_PROVIDER;
    if (fallbackProvider && fallbackProvider !== primaryConfig.provider) {
      console.log(`Trying fallback provider: ${fallbackProvider}`);

      try {
        const response = await getProviderFromConfig({
          ...getProviderConfigForType(fallbackProvider),
          ...config,
        }).generate(request);
        return parseJSONResponse(response.content);
      } catch (fallbackError) {
        console.error(`Fallback provider also failed:`, fallbackError);
        throw primaryError;
      }
    }

    throw primaryError;
  }
}

function getProviderFromConfig(config: AIProviderConfig): AIProviderAdapter {
  const AdapterClass = providerRegistry.get(config.provider);
  if (!AdapterClass) {
    throw new Error(`Provider ${config.provider} not registered`);
  }
  return new AdapterClass(config);
}

function parseJSONResponse(content: string): PackContent {
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No valid JSON found in AI response');
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    const now = new Date().toISOString();
    return {
      ...parsed,
      created_at: parsed.created_at || now,
      updated_at: now,
    };
  } catch {
    throw new Error(`Failed to parse JSON: ${content.substring(0, 200)}`);
  }
}

function parseProvider(value: string | undefined, fallback: AIProvider): AIProvider {
  return isAIProvider(value) ? value : fallback;
}

function parseOptionalProvider(value: string | undefined): AIProvider | undefined {
  return isAIProvider(value) ? value : undefined;
}

function isAIProvider(value: string | undefined): value is AIProvider {
  return SUPPORTED_AI_PROVIDERS.includes(value as AIProvider);
}

// ============================================
// Provider Health Check
// ============================================

export interface ProviderHealth {
  provider: AIProvider;
  status: 'healthy' | 'unhealthy' | 'unconfigured';
  latency?: number;
  error?: string;
}

export async function checkProviderHealth(provider: AIProvider): Promise<ProviderHealth> {
  try {
    if (!getConfiguredProviders().includes(provider)) {
      return { provider, status: 'unconfigured' };
    }

    const adapter = getProviderFromConfig(getProviderConfigForType(provider));

    const start = Date.now();
    await adapter.generate({
      systemPrompt: 'You are a helpful assistant.',
      userPrompt: 'Say "ok" in exactly one word.',
      maxTokens: 5,
    });

    return {
      provider,
      status: 'healthy',
      latency: Date.now() - start,
    };
  } catch (error) {
    return {
      provider,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
