# LanternELL 建设计划

**日期**：2026-03-07
**当前阶段**：MVP 功能完成 (~95%)
**目标**：完成所有剩余功能，达到可上线状态

---

## ✅ 已完成

- Phase 1: 前端页面样式打磨 + 响应式（11/11）
- Phase 2: 邮件集成（6/6）
- Phase 3: Cloudflare Queues 基础设施（6/6）
- Phase 4: Admin Dashboard + API + CRUD（全部完成）
- Phase 5: SEO 基础（sitemap、robots、schema、leads API）
- Sprint 1: Webhook 邮件闭环 + Queue 实际接入 ✅
- Sprint 2: Admin 产品/订单/用户管理 + AdminLayout ✅
- Sprint 3: Blog 框架（migration、列表页、详情页、管理API、sitemap） ✅
- Sprint 4: 测试框架（vitest + 25 tests passing） ✅
- Sprint 5: 监控 + Analytics（error boundaries、logger、Plausible、health check） ✅
- Sprint 6: CI/CD（GitHub Actions deploy + preview、preview env、env docs） ✅

---

## 🎯 上线前剩余事项

- [ ] 替换 `wrangler.toml` 中 preview D1 database_id
- [ ] 在 GitHub repo 设置 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID` secrets
- [ ] 在 Cloudflare 设置所有 secrets（`wrangler secret put`）
- [ ] 创建 Queues（运行 `scripts/create-queues.sh`）
- [ ] 创建 preview D1 数据库和 R2 bucket
- [ ] 配置 Plausible Analytics 域名（可选）
- [ ] 端到端手动测试：注册→购买→下载→邮件
- [ ] 配置自定义域名 DNS
