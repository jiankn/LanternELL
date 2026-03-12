# 插画风格方案 & PDF 布局修复

## 问题一：PDF 空白页修复

当前 `.pdf-page` 设置了 `min-height: 11in`，某些内容刚好溢出时，Puppeteer 会把内容推到下一页，导致页面只剩 header/footer + 标题。

**修复方案：**
- 减小 `.page-content` 的上下 padding（`0.35in → 0.25in`）
- 缩小 section title 字号和底边距
- 调紧 vocab-card、frame-card、ws-item 等组件的 padding 和 gap
- 确保每页内容紧凑填满一整张纸

---

## 问题二：按年龄段设计插画风格

> [!IMPORTANT]
> 以下每个年龄段提供 3 种流行风格，请**每个年龄段选一个**告诉我。

### 🧒 K-2 年龄段（5~8 岁）

| 风格 | 描述 | Prompt 关键词 | 代表参考 |
|---|---|---|---|
| **A. Kawaii 可爱风** | 大眼睛、圆圆的、柔和粉彩色调，当前全球最受低龄儿童欢迎的画风 | `kawaii style, cute round character, soft pastel colors, simple clean illustration, white background` | Molang / Sumikko Gurashi |
| **B. Bluey 卡通风** | 明亮饱和色、粗线条、活泼有趣，像澳洲热门儿童动画 Bluey 的画风 | `children's cartoon illustration, bright saturated colors, bold outlines, playful style, white background` | Bluey / Peppa Pig |
| **C. 水彩绘本风** | 柔和的水彩质感、有温度的手绘感，适合课堂安静氛围 | `watercolor children's book illustration, soft warm colors, gentle brushstrokes, storybook style, white background` | Eric Carle 风格绘本 |

---

### 📚 3-5 年龄段（8~11 岁）

| 风格 | 描述 | Prompt 关键词 | 代表参考 |
|---|---|---|---|
| **D. 扁平矢量风** | 干净现代的科技感设计，色彩鲜明但不幼稚，中年级最流行的教育素材风格 | `flat vector illustration, modern clean design, vibrant colors, geometric shapes, white background` | Duolingo / Khan Academy |
| **E. 像素/游戏风** | Minecraft 一代孩子最熟悉的方块像素审美，极具吸引力 | `pixel art style, retro game aesthetic, colorful 16-bit style, crisp clean pixels, white background` | Minecraft / Terraria |
| **F. 漫画 Pop Art 风** | 漫画分镜、半调网点、对话泡泡感，充满活力和叙事感 | `comic book pop art style, halftone dots, bold colors, dynamic illustration, white background` | Marvel 漫画 / Dog Man |

---

### 🎓 6-8 年龄段（11~14 岁）

| 风格 | 描述 | Prompt 关键词 | 代表参考 |
|---|---|---|---|
| **G. 日系动漫 (Anime)** | 赛璐璐着色、大眼标志性画风，中学生最痴迷的视觉语言 | `anime style illustration, cell shaded, vibrant colors, detailed, Japanese animation style, white background` | 宫崎骏 / 新海诚 |
| **H. 写实渲染风** | 接近照片级的 3D 渲染质感，给中学生"高级感"和"科技感" | `photorealistic 3D render, studio lighting, high detail, professional product photography, white background` | Apple 产品图 |
| **I. 涂鸦手绘风 (Doodle)** | 笔记本涂鸦般的黑白线条 + 点缀荧光色，符合中学生"酷"的审美 | `hand drawn doodle style, black ink sketch with neon color accents, notebook paper aesthetic, white background` | 手帐 / Bullet Journal |

---

## 请回复选择

请为三个年龄段各选一种风格（例如："A, D, G"），我会立即：
1. 修复 PDF 空白页布局问题
2. 用你选的风格生成完整的 classroom-objects PDF（所有 20 个词汇全部由 Imagen 4 自动绘制）
3. 交付你审阅
