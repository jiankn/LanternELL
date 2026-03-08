# LanternELL 项目 UI 视觉升级：图片需求清单与 Prompt 指南

为了提升网站“教育数字化电商”的真实感和转化率，我们需要将大量图标和纯色卡片升级为真实感的高清视觉素材。所有图片要求格式为 **`.webp`** 以保证加载速度和画质。

## 📁 1. 图片资产存放路径

所有的静态图片应放置在 Next.js 的 public 目录下。建议按照以下结构组织：

```text
/public
  /images
    /hero               # 首页各区域的大图
      - home-hero.webp
      - about-hero.webp
    /mockups            # 网站产品形态图（展示 PDF 打印出来是什么样）
      - bundle-showcase.webp
      - printer-demo.webp
    /categories         # 分类图标配图 (Vocabulary, Labels 等)
      - cat-vocabulary.webp
      - cat-labels.webp
      - cat-sentence.webp
      - cat-parents.webp
    /products           # (未来将从 R2/云端加载，但目前可放本地占位图)
      - placeholder-pack-1.webp
      - placeholder-pack-2.webp
      - placeholder-bundle.webp
```

---

## 🖼️ 2. 核心图片需求清单与 AI 提示词 (Midjourney / DALL-E 3)

我们设计的核心视觉风格 (Art Direction) 是：**“清新、现代、极简的教育桌面美学 (Clean, modern, minimalist educational desk aesthetic)”。** 避免出现过于复杂的背景，多用侧光、实物 Mockup 的效果。

### 2.1 首页头图 (Hero Image)
- **用途**：`/app/page.tsx` 的首页第一视觉（右侧或背景）。
- **目标**：一秒钟让老师看到网站卖的是“高质量打印版 ELL 教材”。
- **文件路径**：`/public/images/hero/home-hero.webp`
- **比例**：16:9 或 4:3
- **Prompt**:
  > A high-end product photography mockup of colorful bilingual educational flashcards and printable worksheets arranged neatly on a light oak wood desk. Top-down view. Surrounding the papers are aesthetic pastel scissors, a cup of colored pencils, and a small potted plant. Clean, bright, airy lighting, modern minimalist classroom aesthetic, ultra-realistic, 8k resolution, soft shadows. --ar 16:9

### 2.2 价值主张/演示图 (Value Proposition Mockup)
- **用途**：`/app/page.tsx` 详情介绍段落旁边的配图（“Save hours of prep time”）。
- **目标**：展示教师轻松拿到成品。
- **文件路径**：`/public/images/mockups/printer-demo.webp`
- **比例**：1:1 或 4:3
- **Prompt**:
  > A modern aesthetic photo of beautifully designed bilingual educational worksheets coming out of a sleek white printer. The worksheets feature colorful illustrations and English-Spanish text. Placed on a bright, minimalist white desk in a sunny room. Soft natural lighting, highly detailed, realistic, commercial photography style, depth of field. --ar 4:3

### 2.3 “完全捆绑包”展示图 (Complete Bundle Showcase)
- **用途**：放在 Homepage Featured 区域，或者 Pricing 页面的最高档位展示。
- **目标**：展示极具分量的“海量材料”集合。
- **文件路径**：`/public/images/mockups/bundle-showcase.webp`
- **比例**：16:9
- **Prompt**:
  > A massive, impressive beautifully fanned-out arrangement of dozens of colorful educational printables, flashcards, classroom labels, and worksheets on a bright soft background. High-quality graphic design mockup style, dynamic composition, floating papers effect, dropshadows, vibrant pastel colors, clean and professional, 8k, photorealistic. --ar 16:9

### 2.4 四大分类图 (Category Cards)
- **用途**：`/app/ell-worksheets/page.tsx` 和首页的分类卡片。将原先的 SVG 图标替换为有质感的背景大图。
- **路径**：
  - `/public/images/categories/cat-vocabulary.webp`
  - `/public/images/categories/cat-labels.webp`
  - `/public/images/categories/cat-sentence.webp`
  - `/public/images/categories/cat-parents.webp`
- **比例**：16:9 或 1:1

**分类 1: Vocabulary Packs (词汇包)**
- **Prompt**:
  > Close-up macro photography of beautifully designed interactive bilingual vocabulary flashcards (English and Spanish) featuring acute colorful illustrations of animals and food. Laying on a clean pastel blue background. Soft studio lighting, realistic paper texture, minimalist, 8k.

**分类 2: Classroom Labels (课堂标签)**
- **Prompt**:
  > A clean esthetic photo of a classroom supply bin and a clock, with clearly printed colorful bilingual labels (English/Spanish) attached to them. Bright classroom setting, soft depth of field, modern educational photography, realistic.

**分类 3: Sentence Frames (句型框架)**
- **Prompt**:
  > A close-up of colorful sentence starter strips printed on cardstock, arranged neatly on a desk. Words are visible in English and Spanish. Accompanied by a cute colorful pen. Clean white background, soft drop shadow, high end product photography.

**分类 4: Parent Communication (家校沟通)**
- **Prompt**:
  > A beautiful customized teacher's welcome letter template printed on high-quality paper, resting next to a coffee ceramic mug and a planner on a cozy wooden table. Bilingual text English and Spanish. Warm natural sunlight, inviting aesthetic, photorealistic.

### 2.5 临时产品封面占位图 (Placeholder Product Covers)
- **用途**：作为 `app/shop/page.tsx` 中产品列表的封面。在你有真实数据前，我们可以随机分配这三种占位图。
- **路径**：
  - `/public/images/products/placeholder-pack-1.webp`
  - `/public/images/products/placeholder-pack-2.webp`
  - `/public/images/products/placeholder-bundle.webp`
- **比例**：1:1 (正方形) 或 4:5

**单品占位图 (Pack)**
- **Prompt**:
  > A standard US Letter sized printable worksheet paper mockup floating over a soft solid pastel yellow background. The worksheet features colorful geometric educational illustrations. Clean, minimalist graphic design product presentation, soft drop shadow, 3d render feel, bright. --ar 1:1

**包占位图 (Bundle)**
- **Prompt**:
  > A stack of three beautifully illustrated printable worksheets slightly offset, floating over a soft solid pastel background. Clean graphic design product mockup, soft drop shadow, highly professional educational material presentation. --ar 1:1

---

## 📝 3. 接下来怎么落地？

1. **生图**: 你可以将我写的 Prompt 放进 Midjourney（推荐）或 OpenAI DALL-E 3 生成。或者**我可以调用我内置的图片生成工具**，直接把这几个关键的图给你生出来并直接存入对应目录。
2. **转换 WebP**: 如果你是在其他平台生成的，可以使用工具（如 Squoosh 或 Mac 终端的 `cwebp`）把 `png/jpg` 转成 `.webp` 以大幅压缩体积。
3. **前端 UI 重构**: 图片就位后，我会帮你把 `<Globe className="w-6 h-6" />` 这样的干瘪 UI 替换为高颜值的 `<Image src="..." />` 大卡片设计。

你需要**你自己去用 Midjourney 生成**，还是**让我现在通过 AI 为你生成这些图片并放进项目**？
