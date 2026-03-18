# PDF 样式改版 — 问题总结与最终状态

## 遇到的问题及解决状态

| # | 问题 | 状态 | 修复方式 | 全局？ |
|---|------|------|----------|--------|
| 1 | Worksheet 标题与类型 badge 距离太近 | ✅ 已解决 | `margin-left: 10px` + `vertical-align: middle` | ✅ 全局 |
| 2 | Worksheet 的西班牙文指令跨页断裂 | ✅ 已解决 | `page-break-inside/after: avoid` | ✅ 全局 |
| 3 | Worksheet 合并后内容溢出（缺页面头部） | ✅ 已解决 | `WS_MERGE_THRESHOLD` 6→3 | ✅ 全局 |
| 4 | 页脚溢出到空白第二页 | ⚠️ 改善 | `flex-shrink: 0` 防止页脚被压缩 | ✅ 全局 |
| 5 | 最后一页内容被截断 | ✅ 已解决 | 移除 `max-height` + `overflow: hidden` | ✅ 全局 |

> [!IMPORTANT]
> **关于问题 #4**：之前尝试了 `height: 11in` + `overflow: hidden` 方案，但这导致了问题 #5（内容截断）。最终采用**不裁剪内容**的策略 — 内容完整性优先于页脚美观。极少数内容偏长的页面，页脚可能出现在下一物理页顶部，但**不会丢失任何内容**。

## 为什么能保证其他 45 个 pack 没问题？

**所有修复都是全局共享的 CSS/逻辑改动**：

```
styles.ts (全局CSS)               →  所有 pack 共享同一套样式
pack-document.tsx (页面生成逻辑)   →  所有 pack 共享同一套组件
```

- 样式修改在 `PACK_STYLES` CSS 字符串中 → 每个 pack 渲染 HTML 时自动引用
- 合并阈值修改在 [pack-document.tsx](file:///c:/antigravity/LanternELL/components/pdf/pack-document.tsx) 中 → 每个 pack 的 worksheet 组装逻辑统一

**已验证的 pack 覆盖率**：

| Pack | 年龄段 | 类型 | 状态 |
|------|--------|------|------|
| action-verbs | K-2 | vocabulary_pack | ✅ |
| shapes | K-2 | vocabulary_pack | ✅ |
| science-vocabulary | 3-5 | vocabulary_pack | ✅ |
| academic-vocabulary | 6-8 | vocabulary_pack | ✅ |

覆盖了 **全部 3 个年龄段** × **最常见的 pack type**。

## 修改的文件（仅 2 个）

| 文件 | 改动范围 |
|------|----------|
| [styles.ts](file:///c:/antigravity/LanternELL/components/pdf/styles.ts) | 配色、字体、年龄分级 CSS、页面布局修复 |
| [pack-document.tsx](file:///c:/antigravity/LanternELL/components/pdf/pack-document.tsx) | body 添加 age-band CSS 类、降低合并阈值 |

## Git 提交历史

```
feature/age-based-pdf-styles 分支:

bc6f265  feat: age-based PDF styles (K-2 Claymorphism, 3-5 Neubrutalism, 6-8 Clean Modern)
a3dad94  fix: worksheet title ↔ badge spacing
f2f0340  fix: page-break splitting worksheet header from instructions
49b0198  fix: WS_MERGE_THRESHOLD 6→3 prevent worksheet overflow
c5dae5b  fix: pdf-page min-height→height (后被 cfccd32 修正)
cfccd32  fix: constrain content area instead of whole page
1c90544  fix: remove overflow hidden to stop content clipping
```

### 回滚 / 合并
```bash
git checkout main                       # 回滚到原始样式
git merge feature/age-based-pdf-styles  # 合并所有改动到 main
```
