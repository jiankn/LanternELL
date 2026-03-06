# Bilingual / ELL Printable Packs 技术规格文档（Technical Spec）

**版本**：v1.0  
**日期**：2026-03-06  
**关联 PRD**：`ELL_Bilingual_Printables_PRD_v1.md`  
**适用范围**：Cloudflare 部署、GitHub 管理代码、Stripe 支付、D1 数据库、R2 文件分发

---

## 0. 文档目标

本文件不是市场或产品文档，而是给 AI 开发代理直接执行的技术规格。

本文件解决 4 类问题：

1. 项目必须使用哪些基础设施
2. 每个环境需要哪些 Cloudflare bindings / secrets / vars
3. 核心 API 如何定义
4. Stripe 支付、订阅、退款、权限发放如何落库与同步

如果 PRD 与本文件冲突，以本文件的技术决策为准。

---

## 1. 锁定技术决策

### 1.1 应用与运行时
- 前端框架：Next.js App Router + TypeScript
- 部署运行时：Cloudflare Workers
- Next.js 适配：`@opennextjs/cloudflare`
- UI：Tailwind CSS
- 代码管理：GitHub
- CI/CD：GitHub Actions

### 1.2 Cloudflare 资源
- 主数据库：Cloudflare D1
- 文件存储：Cloudflare R2
- 异步任务：Cloudflare Queues
- 定时任务：Cloudflare Cron Triggers
- PDF / 预览图：Cloudflare Browser Rendering

### 1.3 支付与交易
- 一次性支付：Stripe Checkout
- 订阅支付：Stripe Checkout + Stripe Billing
- 订阅自助管理：Stripe Customer Portal
- 支付结果可信源：Stripe Webhook
- 税务：Stripe Tax（默认开启 `automatic_tax`）

### 1.4 认证
- 首发不使用 Supabase Auth
- 首发采用邮箱密码less 登录
- 登录方式：magic link / one-time code via email
- 用户会话：D1 `sessions` 表 + HTTP-only signed cookie

### 1.5 AI 与内容流水线
- LLM 输出必须是结构化 JSON
- JSON 审核通过后才能进入渲染
- PDF、sample、preview 必须通过任务队列异步生成

### 1.6 语言与命名规范
- 网站 UI 默认语言：English
- 内容产品默认语言对：`en-es`
- 首发不实现整站 i18n routing
- URL slug、API path、数据库表名、字段名、代码变量名统一使用 English
- 邮件模板首发只要求 English 版本
- 后续若扩展西语站点，使用单独内容与 SEO 策略，不在首发阶段混入

---

## 2. 总体架构

### 2.1 架构概览

```txt
Browser
  -> Next.js app on Cloudflare Workers
     -> D1 (users, products, orders, entitlements, content metadata)
     -> R2 (pdf, sample pdf, preview images, cover images)
     -> Queues (content / render / email / webhook jobs)
     -> Browser Rendering (PDF / preview generation)
     -> Stripe API (checkout / portal / billing)
     -> Resend or Postmark (transactional email)
```

### 2.2 读写边界
- 所有前台读流量通过 Next.js route handlers / server components
- 所有支付、权限、下载发放只允许走服务端
- 客户端不得直接决定价格、权限、下载地址
- R2 正式文件不公开裸链

### 2.3 关键原则
- D1 是唯一业务真相源
- Stripe 是支付真相源
- Webhook 是支付状态同步入口
- Entitlement 表是下载权限真相源

---

## 3. Cloudflare 资源与 Binding 规范

### 3.1 必需 bindings

| Binding | 类型 | 用途 | 备注 |
| --- | --- | --- | --- |
| `DB` | D1 | 主业务数据库 | 用户、订单、权限、内容元数据 |
| `FILES` | R2 | PDF、sample、preview、封面图存储 | 正式文件不公开 |
| `BROWSER` | Browser Rendering | 生成 PDF、截图、预览图 | 本地开发建议 remote |
| `CONTENT_QUEUE` | Queue producer | AI 内容生成任务 | 管理批量生成 |
| `RENDER_QUEUE` | Queue producer | PDF / preview 渲染任务 | 避免请求阻塞 |
| `EMAIL_QUEUE` | Queue producer | 邮件任务 | 下载交付、magic link |
| `WEBHOOK_QUEUE` | Queue producer | Stripe webhook 后续处理 | 快速 ack，异步执行业务逻辑 |

### 3.2 建议的 Wrangler 资源命名

| 环境 | D1 database_name | R2 bucket_name | Worker name |
| --- | --- | --- | --- |
| `preview` | `lanternell-preview` | `lanternell-files-preview` | `lanternell-web-preview` |
| `production` | `lanternell-prod` | `lanternell-files-prod` | `lanternell-web` |

### 3.3 推荐 `wrangler.jsonc` 结构

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "lanternell-web",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-03-06",
  "compatibility_flags": ["nodejs_compat"],
  "preview_urls": true,
  "observability": { "enabled": true },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "lanternell-prod",
      "database_id": "<prod-d1-id>",
      "preview_database_id": "<preview-d1-id>",
      "migrations_dir": "migrations"
    }
  ],
  "r2_buckets": [
    {
      "binding": "FILES",
      "bucket_name": "lanternell-files-prod",
      "preview_bucket_name": "lanternell-files-preview",
      "experimental_remote": true
    }
  ],
  "browser": {
    "binding": "BROWSER",
    "experimental_remote": true
  },
  "queues": {
    "producers": [
      { "binding": "CONTENT_QUEUE", "queue": "lanternell-content" },
      { "binding": "RENDER_QUEUE", "queue": "lanternell-render" },
      { "binding": "EMAIL_QUEUE", "queue": "lanternell-email" },
      { "binding": "WEBHOOK_QUEUE", "queue": "lanternell-webhook" }
    ]
  },
  "vars": {
    "APP_ENV": "production",
    "APP_URL": "https://lanternell.com"
  }
}
```

### 3.4 本地开发要求
- 日常开发使用 `npm run dev`
- Worker 运行时验证使用 `npm run preview`
- D1 / R2 / Browser Rendering 在本地开发中允许使用 remote bindings
- 所有和支付、下载、PDF 相关的验收必须至少走一次 `preview` 模式

---

## 4. 环境变量与 Secret 规范

### 4.1 原则
- 敏感值只放 Cloudflare secrets 或 GitHub secrets
- 非敏感配置放 Cloudflare `vars`
- `NEXT_PUBLIC_*` 只用于前端必须知道的值
- 价格、权限、商品映射不信任前端传入
- 所有配置 key 统一使用 English 命名

### 4.2 Cloudflare `vars`

| Key | 示例 | 用途 |
| --- | --- | --- |
| `APP_ENV` | `preview` / `production` | 当前环境 |
| `APP_URL` | `https://lanternell.com` | 站点绝对地址 |
| `COOKIE_DOMAIN` | `.lanternell.com` | cookie domain |
| `MAGIC_LINK_TTL_MIN` | `20` | 登录链接有效期 |
| `SESSION_TTL_DAYS` | `30` | 登录会话有效期 |
| `DOWNLOAD_TOKEN_TTL_SEC` | `300` | 下载 token 有效期 |
| `STRIPE_TAX_ENABLED` | `true` | 是否启用 automatic tax |
| `STRIPE_PORTAL_RETURN_PATH` | `/account/billing` | Portal 返回地址 |
| `FREE_SAMPLE_WATERMARK_TEXT` | `Sample Only` | sample 水印文案 |
| `ADMIN_EMAIL_ALLOWLIST` | `a@x.com,b@y.com` | 后台访问白名单 |

### 4.3 Cloudflare secrets

| Key | 用途 |
| --- | --- |
| `SESSION_SECRET` | 签名 session cookie |
| `MAGIC_LINK_SECRET` | 签名 magic link token |
| `STRIPE_SECRET_KEY` | 服务端 Stripe API |
| `STRIPE_WEBHOOK_SECRET` | 校验 webhook 签名 |
| `RESEND_API_KEY` | 事务邮件 |
| `OPENAI_API_KEY` | 内容生成 |
| `POSTMARK_SERVER_TOKEN` | 如选 Postmark |

### 4.4 前端公开变量

| Key | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 前端绝对地址 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 前端 SDK |
| `NEXT_PUBLIC_POSTHOG_KEY` | 前端事件埋点 |

### 4.5 GitHub Actions secrets

| Key | 用途 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | CI 部署 Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | CI 部署 Cloudflare |
| `STRIPE_SECRET_KEY` | 集成测试 / seed 同步 |
| `STRIPE_WEBHOOK_SECRET` | 回归测试 |
| `RESEND_API_KEY` | 预发环境邮件验证 |

---

## 5. 认证与账号系统

### 5.1 首发认证方式
- 用户以邮箱为唯一身份标识
- 支持未登录直接购买
- 购买后自动按 Stripe customer email 绑定或创建本地账号
- 用户通过 email magic link 登录查看历史订单与下载库

### 5.2 认证流程

#### Flow A：主动登录
1. 用户输入邮箱
2. 服务端创建一次性 token，写入 `auth_magic_links`
3. 邮件发送 magic link
4. 用户点击链接
5. 服务端校验 token、过期时间、使用状态
6. 创建或更新 `users`
7. 创建 `sessions`
8. 下发 HTTP-only cookie

#### Flow B：购买后激活账号
1. 用户完成 Stripe Checkout
2. `checkout.session.completed` webhook 到达
3. 系统用 Stripe email upsert `users`
4. 发出“查看下载库”的 magic link 邮件
5. 用户首次点击后进入 `/account/library`

### 5.3 会话规则
- cookie 名称：`__session`
- 必须是 `HttpOnly`、`Secure`、`SameSite=Lax`
- 服务端每次读取 session 时校验：
  - token 是否存在
  - 是否过期
  - 是否被吊销
  - user 是否仍有效

### 5.4 后台访问
- 后台只允许 allowlist 邮箱
- allowlist 校验在服务端完成
- 不做前端隐藏即视为安全

---

## 6. D1 数据库设计

### 6.1 数据库选择原则
- D1 作为主业务数据库
- 所有迁移使用 SQL 文件
- 不允许在 Dashboard 手工改表后不回写 migration

### 6.2 ID 规范
- 所有业务主键统一使用 text 类型 ID
- 推荐前缀化 ID，如：
  - `usr_`
  - `prd_`
  - `ord_`
  - `sub_`
  - `ent_`
  - `res_`
- 所有枚举值统一使用 English snake_case 或 kebab-case

### 6.3 必需数据表

#### 核心账号表
- `users`
- `sessions`
- `auth_magic_links`

#### 内容与商品表
- `resources`
- `packs_json`
- `products`
- `product_resources`
- `preview_assets`

#### 交易与权限表
- `orders`
- `order_items`
- `subscriptions`
- `entitlements`
- `downloads`
- `download_tokens`
- `webhook_events`

#### 运营与任务表
- `email_leads`
- `content_jobs`
- `render_jobs`

### 6.4 关键字段要求

#### `users`
- `id`
- `email` unique
- `name`
- `role` (`customer` / `admin`)
- `stripe_customer_id` nullable unique
- `created_at`
- `updated_at`

#### `sessions`
- `id`
- `user_id`
- `session_token_hash` unique
- `expires_at`
- `revoked_at`
- `created_at`

#### `auth_magic_links`
- `id`
- `email`
- `token_hash` unique
- `redirect_to`
- `expires_at`
- `used_at`
- `created_at`

#### `products`
- `id`
- `slug` unique
- `type` (`single` / `bundle` / `membership` / `license`)
- `name`
- `stripe_product_id`
- `stripe_price_id` unique
- `active`
- `created_at`

#### `orders`
- `id`
- `user_id`
- `stripe_checkout_session_id` unique
- `stripe_payment_intent_id` nullable
- `stripe_customer_id`
- `order_type`
- `status`
- `currency`
- `amount_subtotal`
- `amount_tax`
- `amount_total`
- `customer_email`
- `created_at`
- `updated_at`

#### `subscriptions`
- `id`
- `user_id`
- `product_id`
- `stripe_customer_id`
- `stripe_subscription_id` unique
- `stripe_price_id`
- `status`
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end`
- `canceled_at`
- `created_at`
- `updated_at`

#### `entitlements`
- `id`
- `user_id`
- `product_id`
- `resource_id` nullable
- `source_type`
- `source_id`
- `status`
- `starts_at`
- `ends_at`
- `revoked_at`
- `created_at`

#### `download_tokens`
- `id`
- `user_id`
- `resource_id`
- `token_hash` unique
- `expires_at`
- `used_at`
- `created_at`

#### `webhook_events`
- `id`
- `provider`
- `event_id` unique
- `event_type`
- `payload_json`
- `status`
- `processed_at`
- `created_at`

### 6.5 必需索引
- `users(email)`
- `users(stripe_customer_id)`
- `sessions(user_id, expires_at)`
- `products(slug)`
- `products(stripe_price_id)`
- `resources(slug)`
- `orders(user_id, created_at desc)`
- `orders(stripe_checkout_session_id)`
- `subscriptions(stripe_subscription_id)`
- `entitlements(user_id, status, ends_at)`
- `download_tokens(expires_at)`
- `webhook_events(event_id)`

### 6.6 Migrations 规则
- migration 目录固定为 `/migrations`
- 每次 schema 变更必须新增 SQL migration
- preview 与 production 必须使用同一套 migration 文件
- 远程执行 migration 时优先使用 `database_name`，不要依赖可能变更的 binding 名称

---

## 7. R2 文件组织与下载策略

### 7.1 文件路径规范

```txt
/resources/{language_pair}/{pack_type}/{resource_slug}/final.pdf
/resources/{language_pair}/{pack_type}/{resource_slug}/sample.pdf
/resources/{language_pair}/{pack_type}/{resource_slug}/preview/01.webp
/resources/{language_pair}/{pack_type}/{resource_slug}/preview/02.webp
/resources/{language_pair}/{pack_type}/{resource_slug}/cover.webp
```

### 7.2 下载授权策略
- 免费资源可直接发放 sample 或 free PDF
- 付费资源必须检查 `entitlements`
- 不向前端暴露永久 R2 URL
- 推荐实现：
  - 用户点击下载
  - 服务端校验权限
  - 写入 `download_tokens`
  - 返回一次性下载地址
  - Worker 根据 token 从 R2 读取并流式返回

### 7.3 下载边界
- token 默认 5 分钟有效
- 默认单 token 单次使用
- 过期或已使用 token 返回 `410` 或 `403`

---

## 8. API 契约

### 8.1 统一规则
- 所有写接口只接受 JSON
- 所有返回体使用统一结构：

```json
{
  "ok": true,
  "data": {},
  "error": null
}
```

- 失败返回：

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

- request / response 字段统一使用 English 命名
- `languagePair` 统一使用 `en-es` 这类标准值，不使用自然语言长文本

### 8.2 公开接口

#### `POST /api/auth/request-link`
- 认证：无需登录
- 用途：发送登录 magic link
- request:

```json
{
  "email": "teacher@example.com",
  "redirectTo": "/account/library"
}
```

- success:

```json
{
  "ok": true,
  "data": {
    "sent": true
  },
  "error": null
}
```

#### `POST /api/checkout/session`
- 认证：可匿名
- 用途：创建 Stripe Checkout Session
- request:

```json
{
  "productId": "prd_teacher_essentials_bundle",
  "quantity": 1,
  "successPath": "/checkout/success",
  "cancelPath": "/shop/teacher-essentials"
}
```

- 服务端规则：
  - 根据 `productId` 读取本地 `products`
  - 只使用数据库中的 `stripe_price_id`
  - 不接受前端传入价格
  - `single` / `bundle` / `license` 使用 `mode=payment`
  - `membership` 使用 `mode=subscription`

- success:

```json
{
  "ok": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/..."
  },
  "error": null
}
```

#### `POST /api/email-leads`
- 认证：无需登录
- 用途：收集 sample / newsletter 线索
- request:

```json
{
  "email": "teacher@example.com",
  "sourcePage": "/bilingual-classroom-labels-english-spanish/",
  "leadMagnet": "free-sample"
}
```

### 8.3 认证后接口

#### `GET /api/account/library`
- 认证：必须登录
- 用途：获取用户已拥有资源
- response:

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "resourceId": "res_newcomer_pack_001",
        "title": "Newcomer Survival Pack",
        "downloadable": true
      }
    ]
  },
  "error": null
}
```

#### `POST /api/download/token`
- 认证：必须登录
- 用途：生成受控下载 token
- request:

```json
{
  "resourceId": "res_newcomer_pack_001"
}
```

- 服务端规则：
  - 校验用户是否存在有效 entitlement
  - 创建 `download_tokens`
  - 返回短时效下载 URL

#### `POST /api/account/logout`
- 认证：必须登录
- 用途：注销当前会话

### 8.4 Stripe webhook

#### `POST /api/stripe/webhook`
- 认证：Stripe signature
- 用途：接收支付、订阅、退款事件
- 规则：
  - 先校验签名
  - 先写 `webhook_events`
  - 尽快返回 `200`
  - 复杂逻辑推入 `WEBHOOK_QUEUE`

### 8.5 后台接口

#### `POST /api/admin/content/generate`
- 认证：admin
- 用途：创建内容生成任务

#### `POST /api/admin/content/publish`
- 认证：admin
- 用途：发布资源与商品

#### `POST /api/admin/render/rebuild`
- 认证：admin
- 用途：重建 PDF / preview / sample

---

## 9. Stripe 集成规格

### 9.1 Checkout Session 创建规则
- `mode=payment`：single / bundle / license
- `mode=subscription`：membership
- `automatic_tax.enabled=true`
- `allow_promotion_codes=true`
- payment 模式建议 `customer_creation=always`
- 成功页只做 UI 呈现，不作为发货依据

### 9.2 必填 metadata

每个 Checkout Session 必须写入：

```json
{
  "app_product_id": "prd_teacher_essentials_bundle",
  "app_product_type": "bundle",
  "app_user_id": "usr_xxx_or_empty",
  "app_source": "web",
  "app_env": "production"
}
```

- metadata key 和 value 中的程序字段统一使用 English
- `app_product_type`、`app_env`、`language_pair` 等值必须使用固定枚举

### 9.3 本地状态机：一次性支付

#### 订单状态
- `checkout_created`
- `payment_pending`
- `paid`
- `fulfilled`
- `failed`
- `refunded`
- `canceled`

#### 事件映射
- `checkout.session.completed`
  - 建立或更新 `orders`
  - 若 `payment_status=paid`，则直接进入发货逻辑
  - 若非 `paid`，记录为 `payment_pending`

- `checkout.session.async_payment_succeeded`
  - 将订单置为 `paid`
  - 发放 entitlements
  - 发送下载交付邮件

- `checkout.session.async_payment_failed`
  - 将订单置为 `failed`

- `charge.refunded`
  - 将订单置为 `refunded`
  - 如为全额退款，撤销相关 entitlements

### 9.4 本地状态机：订阅

#### 订阅状态
- `incomplete`
- `active`
- `past_due`
- `canceled`
- `unpaid`
- `expired`

#### 事件映射
- `checkout.session.completed`
  - 创建或更新本地 `subscriptions`
  - 若 session 已完成，则记录 Stripe subscription ID

- `invoice.paid`
  - 激活或续期 membership entitlement
  - 更新 `current_period_start` / `current_period_end`

- `invoice.payment_failed`
  - 标记 `past_due`
  - 触发失败提醒邮件

- `customer.subscription.updated`
  - 同步状态、周期结束时间、`cancel_at_period_end`

- `customer.subscription.deleted`
  - 标记 `canceled`
  - 到期后撤销 entitlement

### 9.5 幂等规则
- `webhook_events.event_id` 必须唯一
- 同一个 Stripe event 只允许处理一次
- 所有发货逻辑必须能安全重试

### 9.6 权限发放规则

#### single
- 为对应 `resource_id` 写 1 条 active entitlement

#### bundle
- 为 bundle 关联的所有 `resource_id` 各写 1 条 active entitlement

#### membership
- 写 1 条 membership entitlement
- 资源访问通过 membership entitlement + 产品规则判定

#### refund
- 全额退款：撤销对应 entitlement
- 部分退款：默认不自动撤销，标记人工审核

---

## 10. Queue 消息契约

### 10.1 `CONTENT_QUEUE`

```json
{
  "jobId": "job_content_001",
  "topic": "Classroom Objects",
  "packType": "vocabulary_pack",
  "languagePair": "en-es",
  "ageBand": "K-2"
}
```

### 10.2 `RENDER_QUEUE`

```json
{
  "jobId": "job_render_001",
  "resourceId": "res_newcomer_pack_001",
  "renderTargets": ["final_pdf", "sample_pdf", "preview_images"]
}
```

### 10.3 `EMAIL_QUEUE`

```json
{
  "jobId": "job_email_001",
  "template": "purchase_delivery",
  "to": "teacher@example.com",
  "payload": {
    "userId": "usr_001",
    "orderId": "ord_001"
  }
}
```

### 10.4 `WEBHOOK_QUEUE`

```json
{
  "eventId": "evt_123",
  "eventType": "checkout.session.completed"
}
```

---

## 11. GitHub 与部署流程

### 11.1 分支规则
- `main`：生产分支
- 其他功能分支通过 PR 合并
- Pull Request 必须有可访问的 preview URL
- 如需共享预发环境，可额外保留 `preview` 分支，但不是必需

### 11.2 CI 必跑项
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

### 11.3 部署规则
- PR 阶段：运行 CI，并生成 Cloudflare preview URL 供验收
- push 到 `main`：先跑 D1 migration，再部署 production
- preview URL 建议使用 Cloudflare GitHub integration 或 `wrangler versions upload --preview-alias`
- 禁止先部署代码后补 migration

### 11.4 发布前检查
- Stripe Webhook secret 已配置
- D1 preview / production 都已迁移
- R2 bucket 与对象路径规则已验证
- 至少完成一次 end-to-end 支付回归

---

## 12. 非功能要求

### 12.1 安全
- 所有管理端接口必须服务端校验 admin
- 所有支付结果只信任 webhook
- 下载地址必须短时效
- Magic link token、session token 只存 hash，不存明文

### 12.4 语言一致性
- 不允许数据库字段、JSON schema、前端 props 中出现中英混合命名
- 不允许生成中文 slug、中文 API path、中文环境变量名
- 商品展示文案与 SEO 文案默认 English，双语信息仅出现在 printable 内容或说明字段中

### 12.2 性能
- webhook handler 在写入 `webhook_events` 后应尽快返回
- 商品页首屏不等待 preview 大图全部加载
- 预览图使用 webp / avif 优先

### 12.3 可运维性
- 所有订单状态变化要可追踪
- 所有 PDF 渲染任务要有状态
- 所有 webhook 失败要可重试
- 所有下载失败要能在日志中定位到 user / resource / token

---

## 13. AI 开发代理执行顺序

1. 初始化 Next.js + Cloudflare Workers 项目
2. 配置 D1、R2、Queues、Browser Rendering bindings
3. 建立 D1 migrations 与核心表
4. 实现 magic link 登录
5. 实现商品、资源、下载库基本页面
6. 接入 Stripe Checkout、Portal、Webhook
7. 实现 entitlements 与下载鉴权
8. 实现内容生成、渲染、邮件任务队列
9. 配置 CI/CD 与 preview / production 部署
10. 完成支付、下载、订阅回归测试

---

## 14. 直接落地结论

对 AI 开发来说，本文件已经把最容易产生歧义的 4 个问题锁死了：

1. 数据库就是 Cloudflare D1，不再使用 Supabase
2. 认证方式就是 email magic link
3. 支付发货只认 Stripe Webhook
4. 文件下载必须走 entitlement 校验 + 短时效 token

如果下一步还要继续补文档，优先级应为：
- `Database Spec`：D1 SQL schema + migration files
- `OpenAPI Spec`：把第 8 节接口转成 machine-readable schema
- `Runbook`：支付失败、webhook 堵塞、R2 文件缺失的处理手册
