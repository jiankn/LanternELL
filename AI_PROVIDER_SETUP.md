# AI Provider Setup

LanternELL supports multiple text-generation providers behind one runtime interface.

## Strategy

- Use `zhipuai` as the primary provider.
- Keep `openai` configured as the fallback provider.
- Switch providers through environment variables only.
- Store API keys in local env files or Wrangler secrets, never in source code.

## Local Development

Set these values in `.env.local`:

```env
AI_ACTIVE_PROVIDER=zhipuai
AI_FALLBACK_PROVIDER=openai

ZHIPUAI_API_KEY=your_zhipuai_api_key
ZHIPUAI_MODEL=glm-4.7
ZHIPUAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
OPENAI_BASE_URL=https://api.openai.com/v1
```

## Cloudflare

Use Wrangler `vars` for provider selection and model settings:

- `AI_ACTIVE_PROVIDER`
- `AI_FALLBACK_PROVIDER`
- `ZHIPUAI_MODEL`
- `ZHIPUAI_BASE_URL`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`

Use Wrangler secrets for API keys:

- `ZHIPUAI_API_KEY`
- `OPENAI_API_KEY`

## Runtime Behavior

- `AI_ACTIVE_PROVIDER` decides which provider is called first.
- `AI_FALLBACK_PROVIDER` is only used if the primary provider fails.
- If the selected provider has no key configured, requests fail fast with a config error.
- Admin generation responses include the active and fallback providers for debugging.
