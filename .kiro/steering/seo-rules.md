---
inclusion: auto
description: SEO 建站全局规则，包含 10 条强制规则，涵盖关键词策略、内容结构、技术 SEO、结构化数据等方面
---

# SEO 建站规则（全局强制）

以下 10 条规则适用于本项目所有页面的创建和修改。任何涉及页面内容、路由、元数据、结构化数据的操作都必须遵守。

## 1. 一页一关键词

每个页面只聚焦一个主关键词（或一组同义关键词）。绝不在一个页面塞多个不相关的关键词。让搜索引擎清晰理解"这个页面在讲什么"。

## 2. 关键词 5 要素覆盖

主关键词必须出现在 5 个核心位置，缺一不可：

1. Title 标签（`<title>` / Next.js `metadata.title`）
2. Meta Description（`metadata.description`）
3. URL Slug（路由路径）
4. H1 标题（页面唯一 `<h1>`）
5. 正文前 100 字

## 3. 首页打内页（Pillar → Cluster）

用 Topic Cluster 架构建站：
- 首页做 Pillar Page，覆盖大关键词
- 子页面做 Cluster Pages，各自聚焦一个细分关键词
- 通过内链形成语义网络，建立话题权威

## 4. 内链矩阵

- 每个 Cluster Page 必须链回 Pillar Page（首页）
- Pillar Page 必须链向所有 Cluster Pages
- 相关 Cluster Pages 之间互相内链
- 每页至少 3-5 个内链

## 5. H2 覆盖长尾关键词

- 每页设置 5-8 个 H2 标题
- 覆盖主关键词的长尾变体和 LSI（语义相关）子话题
- H2 是 Google Featured Snippets 和 People Also Ask 的内容抓取入口

## 6. 内容够长够深

- 核心页面：1000-2000 词
- Teaching Tips 文章：800-1200 词
- 最低不少于 600 词
- 内容必须精确匹配搜索意图（教程型/工具型/对比型），不是堆关键词
- Google Helpful Content 系统专打"结构到位但内容空洞"的页面

## 7. JSON-LD 结构化数据

每个页面必须包含 JSON-LD：
- 产品页：`Product` 或 `SoftwareApplication`
- Teaching Tips 文章：`Article`
- FAQ 内容：`FAQPage`
- 首页：`WebSite` + `Organization`

结构化数据帮助搜索引擎理解页面内容并展示富媒体摘要。

## 8. Sitemap + Canonical

- 自动生成 XML Sitemap 包含所有页面 URL（已实现：`app/sitemap.ts`）
- 每个页面设置唯一 Canonical URL 防止重复内容稀释权重
- Sitemap 提交到 Google Search Console

## 9. 技术 SEO 基线

- Core Web Vitals 全绿：LCP ≤ 2.5s、CLS ≤ 0.1
- Mobile-First 响应式
- Open Graph / Twitter Card 每页设置
- 图片含 Alt 属性（包含关键词描述）

## 10. Teaching Tips 集群持续输出

- 用 Teaching Tips 文章覆盖长尾关键词（KD ≤ 30）
- 每篇链回最相关的 Cluster Page 形成外围内容网
- 优先覆盖搜索量有但竞争低的蓝海词
