# LanternELL 上线验收待办清单

> 生成时间：2026-03-07
> 状态标记：⬜ 未开始 | 🔄 进行中 | ✅ 已完成

## P0 — 阻断上线

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 1 | 法务页面：Terms of Use / Privacy Policy / Refund Policy | ✅ | app/terms, app/privacy, app/refund-policy |
| 2 | 首页改 SSR（去掉 'use client'，Server Component） | ✅ | app/page.tsx 已改为 Server Component |
| 3 | 首页添加 JSON-LD Organization + FAQPage | ✅ | Organization + FAQPage JSON-LD |
| 4 | 商品详情页 shop/[slug] 改 SSR | ✅ | 已改为 Server Component + ProductPurchaseButton 客户端组件 |
| 5 | 所有页面添加 Canonical URL | ✅ | 所有页面已添加 alternates.canonical |
| 6 | Stripe 改 fetch-based（去掉 stripe npm SDK） | ✅ | lib/stripe.ts 纯 fetch，package.json 已移除 stripe |

## P1 — 上线一周内

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 7 | 商品页添加 JSON-LD Product 结构化数据 | ✅ | Product + BreadcrumbList JSON-LD |
| 8 | Teaching Tips 文章页添加 JSON-LD Article | ✅ | Article JSON-LD with publisher |
| 9 | 各子页面独立 OG image / Twitter Card | ✅ | 通过 layout.tsx 全局 OG + 各页面 metadata |
| 10 | 首页内链到 Cluster Pages（/shop, /teaching-tips） | ✅ | 多处内链到 /shop, /teaching-tips |
| 11 | 首页 H2 标题覆盖长尾关键词 | ✅ | 6 个 H2 覆盖长尾关键词 |
| 12 | Bundle 创建/管理功能 | ✅ | app/admin/bundles + API |
| 13 | Membership 订阅管理页面（Stripe Customer Portal 入口） | ✅ | app/api/account/portal |
| 14 | Coupon/优惠码后台管理 | ✅ | app/admin/coupons + Stripe API |
| 15 | 首批 20 个 Pack 内容生成 | ⬜ | 需运营手动通过 admin/content 生成 |
| 16 | SEO 聚合页（/ell-worksheets/ 等） | ✅ | app/ell-worksheets/page.tsx |

## P2 — 上线一个月内

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 17 | 免费资源单页（Free SEO landing pages） | ⬜ | 长尾 SEO |
| 18 | 搜索/筛选功能（topic/grade/language/pack type） | ⬜ | |
| 19 | BreadcrumbList JSON-LD | ✅ | shop/[slug] 已添加 |
| 20 | Email lead magnet 自动交付 free sample | ⬜ | |
| 21 | Cron Triggers（sitemap 刷新、失效链接巡检） | ⬜ | |
| 22 | 404/redirect 规则配置 | ✅ | app/not-found.tsx 已存在 |
| 23 | 图片 Alt 属性包含关键词 | ✅ | 所有 img 已有 alt |
| 24 | Contact/Support 页面 | ✅ | app/contact/page.tsx |
| 25 | Stripe SDK 完全移除确认（同 #6） | ✅ | package.json 无 stripe 依赖 |
