# Bilingual / ELL Printable Packs 平台产品需求文档（PRD）

**版本**：v1.2  
**日期**：2026-03-08  
**项目代号**：Project Lantern  
**建议品牌方向**：面向教师 / 家长 / newcomer 支持的双语与 ELL printable 平台  
**目标读者**：AI 开发代理、独立开发者、产品负责人、SEO 内容负责人

---

## 0. 一句话结论

这不是“再做一个免费 worksheet 站”，而是做一个：

**面向双语/ELL/新移民学生场景的 printable 内容平台 + 轻订阅产品。**

核心不是卖 PDF 文件，而是卖：

- 老师今天就能打印、今天就能上手的教学包
- 家长今天就能用的家庭练习包
- newcomer 学生今天就能看懂、开口、参与课堂的支持材料

---

## 1. 第一性原理判断

### 1.1 用户到底在买什么
用户不是想买“PDF”本身，而是想买：

1. **省备课时间**
2. **降低课堂沟通摩擦**
3. **让 newcomer / ELL 学生更快进入课堂**
4. **让双语支持看起来更专业、更系统**
5. **立刻可打印、立刻可用**

### 1.2 为什么这个赛道成立
从市场本质看，这个赛道成立有 4 个硬前提：

- 美国公立学校 EL/ELL 学生规模大，需求长期存在
- 教师资源站、worksheet 站、TPT 说明“可打印教学材料”是成熟需求
- 双语/ELL 场景的用户意图比泛 coloring / 泛 worksheet 更强
- 这类内容可以模板化生产，并能同时做 SEO、广告、付费包、授权

### 1.3 为什么不是普通 printable 红海
普通 printable 红海的问题是：
- 泛关键词太卷
- 用户需求太散
- 价值主张太弱
- 只能靠广告

而双语 / ELL 的优势在于：
- 用户更精准（教师、家长、干预支持者）
- 场景更明确（newcomer、双语标签、句型、家校沟通、visual supports）
- 可直接扩展到 bundle、授权、学校版、TPT/Etsy 分发
- 结果不是“好看”，而是“好用”

---

## 2. 市场与竞争判断

### 2.1 市场机会
本产品优先面向美国英语学习者（EL/ELL）与双语课堂场景。

核心机会点：

- ELL / newcomer 学生数量持续可观
- 课堂实际需要大量可打印支持材料
- 现有资源分散在 TPT、Twinkl、ISLCollective、TeachThis、博客、Google Drive 之间
- 大量资源不是为 newcomer / bilingual 场景专门设计，而是通用 ESL 资源
- 用户愿意为“省时间、成套、可直接打印”的内容付费

### 2.2 竞品分层
#### A. 超大综合资源站
- Twinkl
- Education.com
- Liveworksheets

**特点**：内容量大、品牌强、范围广  
**弱点**：不够聚焦 newcomer / bilingual，用户常需自行筛选

#### B. ESL/ELL 专项资源站
- ISLCollective
- Teach This
- JimmyESL
- 各类 ESL worksheet 站

**特点**：有教师受众，SEO 基础好  
**弱点**：更多偏传统 ESL，而非“新来学生 + 双语支持 + printable pack”

#### C. Marketplace
- Teachers Pay Teachers
- Etsy

**特点**：需求与付费意愿已被验证  
**弱点**：站内竞争重、品牌难沉淀、SEO 不属于你

#### D. 非营利/教育机构资源
- Colorín Colorado
- U.S. Department of Education Newcomer Toolkit 相关资源

**特点**：权威、可信  
**弱点**：不以产品化、系统化 printable 交付为主

### 2.3 竞争结论
这个赛道 **不是蓝海**，但它仍然是 **可切的利基市场**。

最优切法不是做：
- 泛 ESL worksheet 站
- 泛 printable 素材站

而是做：
- **ELL newcomer**
- **双语 classroom supports**
- **English + Spanish 首发**
- **教师可直接打印的 pack**

---

## 3. 产品定位

### 3.1 产品定义
一个面向 **ELL / newcomer / bilingual classroom** 的 printable 平台，提供：

- 免费单页 SEO 落地页
- 成套 PDF 教学包
- 可打印 classroom supports
- 双语 / newcomer 入门资源
- 教师、家长、干预支持者可直接使用的即用型材料

### 3.2 核心定位语
**Print-ready bilingual & ELL resources for real classrooms.**

中文理解：
**为真实课堂准备的、可直接打印的双语与 ELL 教学包。**

### 3.3 不做什么
本产品不做：

- 泛成人英语学习 App
- 口语 AI 陪练
- 在线互动游戏为主的产品
- 医疗/诊断类干预产品
- 过度依赖 IP 角色的 printable 内容
- 纯广告站，没有内容产品化的模式

### 3.4 语言策略
首发语言策略必须明确固定：

- 网站前台语言：English
- 商品页、SEO 页、博客页主语言：English
- printable 内容语言对：English-Spanish
- 后台、CMS、代码、API、数据库字段命名：English
- 首发邮件模板语言：English

这样定义的原因：
- 目标购买者主要是美国教师，搜索、判断、支付路径以英文为主
- 产品差异化在于英西双语 printable，不在于整站多语言切换
- 首发不引入整站 i18n，可显著降低 SEO、路由、维护、审核复杂度

首发阶段不做：
- 全站 English / Spanish UI 切换
- 中文后台字段命名
- 中英西三套页面并行维护

---

## 4. 目标用户（ICP）

### 4.1 核心用户
#### 用户 A：美国 K-5 ESL/ELL 教师 / newcomer teacher
需求：
- 明天上课就要用
- 需要 printable
- 需要 visual + bilingual supports
- 需要成套资源，不想东拼西凑
- K-5 是核心年级段，ELL newcomer 支持需求最集中

#### 用户 B：双语班 / Dual-language / Spanish-English 教师（K-8）
需求：
- Classroom labels
- Vocabulary cards
- bilingual supports
- parent communication printables
- 双语项目通常延伸到初中，因此覆盖 K-8

#### 用户 C：家长 / homeschool 家长 / newcomer 家庭
需求：
- 在家补充练习
- 低门槛 printable
- 能立即下载、打印、使用
- 实际需求集中在 K-5，但无严格年级限制

### 4.2 次级用户
- Pre-K 教师（学前班，内容覆盖但非营销重心）
- 6-8 年级教师（初中，双语项目和 newcomer 支持场景）
- paraprofessional / intervention staff
- SPED 教育者（视觉支持类资源与 ELL 有交叉，但不作为核心定位）
- speech/language support staff（仅做教育支持，不碰诊断）
- tutoring / after-school program
- 学校或机构采购者（后续）

### 4.3 用户定位边界
- 核心购买者：K-5 ESL/ELL 教师、双语教师、homeschool 家长
- 扩展购买者：Pre-K 教师、6-8 年级教师、SPED 教育者
- 内容覆盖范围：Pre-K–8（资源可以做这么宽，但营销重心在 K-5）
- 不做：成人英语学习、高中及以上、医疗/诊断类产品

---

## 5. Jobs To Be Done（JTBD）

### 5.1 教师的 Job
- 我今天下班前要准备明天的 newcomer 词汇课
- 我想快速打印一套学生能自己完成的活动页
- 我需要把教室物品贴成英西双语标签
- 我需要给不会英语的家庭发一张简单说明单

### 5.2 家长的 Job
- 我想在家帮孩子练课堂词汇
- 我想要一套结构清楚、打印就能练的 PDF
- 我不想在 Pinterest/TPT/Google 上翻半小时

### 5.3 产品的 Job
- 帮用户把“查资料 + 筛选 + 自己排版”的 30-60 分钟，压缩到 3 分钟
- 让用户感觉：**这不是下载一页纸，而是拿到一个现成教学包**

---

## 6. 商业模式

### 6.1 核心模式
采用 **免费 SEO 流量页 + 付费 bundle + 会员订阅 + 授权** 的混合模式。

### 6.2 变现结构
#### 模式 A：免费单页 + 广告
适用于：
- 长尾 SEO 页面
- 单张 worksheet / labels / mini-book sample

作用：
- 拉自然流量
- 收集邮箱
- 推付费包

#### 模式 B：单个 PDF pack 售卖
建议价格：
- $3.99
- $5.99
- $7.99
- $9.99

适用于：
- newcomer survival pack
- classroom labels pack
- vocabulary pack
- sentence frames pack

#### 模式 C：Bundle
建议价格：
- $19
- $29
- $49
- $79

适用于：
- Back to School newcomer bundle
- English-Spanish classroom essentials
- Kindergarten ELL starter bundle
- thematic year-round bundle

#### 模式 D：会员订阅
建议价格：
- $9/月
- $15/月
- $99/年
- $149/年（学校/教师版扩展）

会员权益：
- 每月新 pack
- 下载全部基础包
- 无水印 / 高分辨率 / editable bonus
- 提前访问季节资源

#### 模式 E：商业/机构授权
适用于：
- small school
- tutoring center
- district department
- bilingual program coordinator

### 6.3 为什么不能只靠广告
只靠广告的问题：
- 对流量依赖太高
- RPM 波动大
- 护城河弱

更好的做法：
- 免费流量页负责获客
- 付费 bundle 负责现金流
- 会员负责 LTV
- 授权负责高客单

---

## 7. 产品范围与路线图

### 7.1 MVP（首发版本）
首发做 English-Spanish 单语言对切口，覆盖 K-8 全年级段：

**English-Spanish ELL / newcomer printable packs for K-8**

MVP 必须包含：

1. 网站首页
2. 主题聚合页
3. 单页 SEO 下载页（免费）
4. 付费 pack 页面
5. 购物 / 支付
6. 登录与订单下载
7. 内容后台（上传/生成/审核）
8. PDF 自动生成管线
9. 邮件订阅入口

### 7.2 MVP 核心内容 SKU（方案 C: 45 pack）
首发 45 个 English-Spanish pack，覆盖 K-8 三个年级段（详见 lib/seed-topics.ts）：

#### A 类：Classroom Survival
- classroom objects
- school routines
- feelings
- bathroom / help / basic needs
- numbers
- colors

#### B 类：Vocabulary Pack
- food
- family
- animals
- weather
- body parts
- community helpers

#### C 类：Print Supports
- classroom labels
- schedule cards
- sentence frames
- parent communication sheets
- mini books
- matching cards

### 7.3 v1
- **TODO: 新增语言对（按 ELL 学生占比优先级排序）**
  1. English-Chinese (Mandarin) — 学生占比第二 (~4%)
  2. English-Arabic — 学生占比第三 (~3%)
  3. English-Vietnamese — 学生占比第四 (~2%)
  4. English-Portuguese — 巴西社区需求
  5. English-French — 加拿大及西非社区
  - 每个新语言对复用现有 45 pack 模板，仅需翻译 + 审核
  - 预计每个语言对增量工作：2-3 周
- 新增账户页 / bundle library
- 新增“teacher planner”产品线
- 新增 TPT / Etsy 分发导流页

### 7.4 v2
- 会员区
- 学校/机构授权流程
- 用户自定义生成（输入主题 -> 生成 pack）
- 可编辑版本（PPT / Google Slides）
- AI assisted lesson-plan add-on

---

## 8. 内容产品结构（最关键）

### 8.1 为什么内容必须模板化
如果内容不模板化，AI 就只能做低效的一次性产出。  
要让 AI 真正为开发和运营服务，必须先固定：

- pack 类型
- 页型
- 字段结构
- 输出规范

### 8.2 标准 pack 类型
#### Pack Type A：Vocabulary Pack
包含：
1. Cover
2. Teacher Notes
3. Picture Vocabulary Cards
4. Matching Worksheet
5. Tracing / Copying Worksheet
6. Fill-in-the-Blank Worksheet
7. Mini-Book
8. Answer Key
9. Terms of Use

#### Pack Type B：Sentence Frames Pack
包含：
1. Cover
2. Teacher Notes
3. Sentence Cards
4. Dialogue Strips
5. Writing Practice Page
6. Speaking Prompt Cards
7. Answer / Sample Responses
8. Terms of Use

#### Pack Type C：Classroom Labels Pack
包含：
1. Cover
2. Full-size Labels
3. Small-size Labels
4. Visual Routine Cards
5. Classroom Rules Posters
6. Teacher Tips
7. Terms of Use

#### Pack Type D：Parent Communication Pack
包含：
1. Cover
2. Homework Note
3. Behavior Note
4. Supply Request Note
5. Attendance / Reminder Note
6. Parent Response Sheet
7. Terms of Use

---

## 9. AI 内容生产系统（AI 开发重点）

### 9.1 正确的自动化原则
不要让 AI 直接“生成完整 PDF”。

正确方式是：

**AI 先生成结构化内容 JSON -> 模板引擎排版 -> 批量导出 PDF**

### 9.2 AI 适合生成的内容
- 主题词汇表
- 双语对照词汇
- 初级句型
- worksheet 指令
- mini-book 短文
- teacher notes
- answer key
- related search phrases
- pack metadata

### 9.3 AI 不应直接决定的内容
- 最终页面排版
- 打印边距
- 年龄适配最终定稿
- 敏感翻译
- 版权合规
- 品牌视觉层级

### 9.4 内容 schema（建议）
每个 pack 存储为 JSON。

```json
{
  "pack_id": "ell_classroom_es_k2_001",
  "pack_type": "vocabulary_pack",
  "topic": "Classroom Objects",
  "age_band": "K-2",
  "language_pair": "en-es",
  "target_user": "ELL newcomer",
  "vocabulary": [
    {"en": "pencil", "l2": "lápiz"},
    {"en": "book", "l2": "libro"}
  ],
  "sentence_frames": [
    "This is a ___.",
    "I see a ___.",
    "I need a ___."
  ],
  "worksheets": [
    {
      "type": "matching",
      "instructions": "Match the word to the picture.",
      "items": []
    }
  ],
  "mini_book": {
    "title": "My Classroom",
    "pages": []
  },
  "teacher_notes": "Use with beginner newcomer students during classroom orientation.",
  "answer_key": {},
  "license": "personal-classroom-use"
}
```

### 9.5 自动化流水线
1. 在 Airtable / Cloudflare D1 / Google Sheets 中存主题种子
2. 脚本逐行调用 LLM
3. 输出 JSON
4. 人工抽检
5. 模板系统渲染 HTML/CSS
6. Cloudflare Browser Rendering / Playwright / Puppeteer 导出 PDF
7. 上传对象存储
8. 自动生成商品页与 SEO 页

### 9.6 质检系统
#### 规则校验
- 词汇数量正确
- JSON 结构完整
- 页面字段不为空

#### 内容抽检
- 翻译准确
- 年龄适配
- 指令是否清晰
- 答案是否合理

#### 打印校验
- US Letter 正常
- A4 正常
- 黑白打印清晰
- 不费墨
- 页码和页边距正常

---

## 10. 产品功能需求

### 10.1 前台功能
#### 首页
- 明确价值主张
- 分类导航
- 热门资源
- 新用户 email capture
- 免费 sample 下载入口

#### 分类页
- By topic
- By grade / age
- By language pair
- By pack type
- By newcomer / bilingual / homeschool / parent support

#### 单页资源页
- SEO 标题
- 资源描述
- 预览图
- 免费下载按钮
- 相关 pack 推荐
- email capture
- FAQ

#### 商品页
- pack 封面
- 包含内容清单
- 适用年级
- 预览图
- 下载格式
- license 说明
- 加入购物车

#### 用户中心
- 我的下载
- 我的订单
- 会员权限
- 收藏资源

### 10.2 后台功能
- 内容条目录入
- AI 生成任务触发
- JSON 审核
- PDF 批量生成
- 资源发布
- 标签/分类管理
- SEO 字段编辑
- bundle 组合
- 订单与下载监控

### 10.3 上线必备系统能力
- Stripe Checkout Session 创建
- Stripe Webhook 处理与幂等校验
- 单次购买 / bundle / membership 的 entitlement 权限发放
- 基于签名 URL 或 Worker 鉴权的 PDF 下载
- R2 文件上传、预览图生成、sample 页生成
- 资源状态流转：draft / review / published / archived
- 优惠码 / 限时折扣 / launch offer 配置
- 订单失败、支付成功、退款、订阅取消的后台可见性
- 邮件触发：下载交付、支付确认、欢迎邮件、续费失败提醒
- 基础搜索索引与筛选缓存刷新

---

## 11. UI / UX 设计原则

### 11.1 设计目标
面向教师和家长，核心目标是：

- 快速理解
- 快速筛选
- 快速下载
- 相信内容是“可直接用”的

### 11.2 首页设计原则
首页不应像“素材堆积站”，而要像“教学工具入口”。

Hero 区建议文案方向：

**Printable bilingual & ELL resources teachers can use today.**

副标题强调：
- print-ready
- newcomer-friendly
- bilingual support
- no-prep packs

### 11.3 视觉风格
- 清晰、亲和、教育感
- 不要过度儿童化
- 不要过度“AI 感”
- 要像值得信任的教师资源站

### 11.4 搜索体验
必须支持：
- keyword search
- by topic
- by grade
- by language
- by pack type
- free vs premium

### 11.5 PDF 预览体验
用户通常先看是否“值不值得打印”。  
所以每个 pack 需要：
- 3-6 张预览图
- 目录清单
- 页数信息
- 年级建议
- printable size

### 11.6 转化与信任要素
每个资源页 / 商品页建议额外展示：
- 适用对象（grade / newcomer / language pair）
- 使用场景（first week / labels / parent note / vocabulary practice）
- prep time（如：print and cut / no prep）
- print mode（彩色 / 黑白可打）
- reviewed badge（AI generated + human reviewed）
- license 摘要（single teacher / classroom use）
- related pack / bundle 的明确升级路径

---

## 12. SEO 策略（Monday Mandala 模式，但避开红海）

### 12.1 SEO 核心原则
复制的不是“儿童泛 printable”，而是：

**高意图长尾 + 强场景 + 强目录结构**

### 12.2 站点信息架构
建议目录：

- /ell-worksheets/
- /newcomer-activities/
- /bilingual-classroom-labels/
- /english-spanish-printables/
- /sentence-frames/
- /parent-communication/
- /themes/classroom/
- /themes/food/
- /themes/family/
- /grades/kindergarten/
- /grades/1st-grade/

### 12.3 页面类型
#### Type 1：单资源免费页
用于 SEO 抢长尾。

例：
- /bilingual-classroom-labels-english-spanish/
- /ell-newcomer-worksheets-classroom-objects/

#### Type 2：主题聚合页
例：
- /english-spanish-vocabulary-printables/
- /newcomer-activities-for-kindergarten/

#### Type 3：付费 pack 页
例：
- /shop/newcomer-survival-pack/
- /shop/classroom-objects-vocabulary-pack/

#### Type 4：博客/指南页
例：
- /how-to-support-newcomer-students-with-printables/
- /best-visual-supports-for-english-learners/

### 12.4 内链策略
每个免费页至少内链到：
- 相关主题页
- 相同年级页
- 对应付费 bundle
- 相关指南页

### 12.5 不能做的 SEO
- AI 批量拼接低价值页面
- 无差异的模板页
- 只换语言名/主题名的 thin pages
- 抄 TPT 标题堆砌

### 12.6 技术 SEO 与索引控制
- 自动生成 sitemap index，并按 free pages / shop pages / blog pages 拆分子 sitemap
- robots.txt 明确屏蔽 cart、checkout、account、download token、preview-only utility 页面
- 每个内容页必须输出 canonical URL，避免语言对、bundle、分类页互相重复
- 输出结构化数据：Organization、WebSite、BreadcrumbList、FAQ、Product、Article
- OG image、Twitter Card、预览图 alt、文件名 slug 化必须自动生成
- 404 / 410 / redirect 规则必须可配置，避免下线 pack 造成死链
- 免费 sample 页与付费 pack 页要建立明确 canonical / related 关系，防止关键词互相抢排名

---

## 13. 5 个核心关键词（公开 SERP + marketplace 需求驱动的实战优先级）

> 说明：公开网页很难稳定拿到所有教育 printable 长尾的**精确 KD 数值**，尤其很多第三方工具需要登录或付费。  
> 本 PRD 使用的是 **实战型低难度 proxy**：  
> **长尾意图清晰 + SERP 未被单一巨头完全占死 + marketplace/TPT 有明确需求 + 教师/家长搜索场景明确。**

### Keyword 1
**ell newcomer worksheets**  
建议用途：核心聚合页 / 首批重点词  
理由：
- 意图非常明确
- 面向 newcomer 场景
- TPT 有明确搜索和付费商品需求
- 适合做聚合页 + pack 商品页

### Keyword 2
**esl newcomer activities**  
建议用途：核心主题页  
理由：
- 比 generic ESL worksheets 更聚焦
- 付费意图比普通“free worksheets”更强
- 可扩展到 workbooks / vocabulary / curriculum packs

### Keyword 3
**bilingual classroom labels**  
建议用途：免费流量页 + 低价转化页  
理由：
- 非常具体
- 可打印、易转化
- 教室场景强
- 可延展到多语言版本

### Keyword 4
**english spanish classroom labels**  
建议用途：直接商品页 + SEO 入口页  
理由：
- 语言对明确
- 搜索意图更强
- 适合首发 English-Spanish 微利基
- 容易直接卖 PDF pack

### Keyword 5
**esl worksheets for beginners**  
建议用途：流量入口页，但不作为唯一核心  
理由：
- 有需求
- 竞争相对更高
- 更适合作为流量入口，再往 newcomer / bilingual 细分导流

### 关键词优先级建议
首发优先顺序：
1. ell newcomer worksheets
2. esl newcomer activities
3. bilingual classroom labels
4. english spanish classroom labels
5. esl worksheets for beginners

---

## 14. 推荐域名（未做实时注册可用性验证，仅做品牌与 SEO 方向建议）

### 品牌型（更适合长期）
1. LanternELL.com
2. BrightBridgeELL.com
3. NewcomerPrints.com
4. BilingualPack.com
5. ClassreadyELL.com

### SEO + 品牌混合型
6. ELLPrintables.com
7. BilingualWorksheets.com
8. NewcomerWorksheets.com
9. EnglishSpanishPrintables.com
10. ClassroomLabelsHub.com

### 域名选择建议
如果你想做长期品牌，优先：
- <u>**LanternELL.com**</u>
- BrightBridgeELL.com
- ClassreadyELL.com

如果你想更直给 SEO，优先：
- ELLPrintables.com
- BilingualWorksheets.com
- NewcomerWorksheets.com

---

## 15. 推荐定价

### 15.1 免费层
- 单页 printable 免费下载
- 部分 sample pages 免费
- 需要邮箱才能下载高价值 sample

### 15.2 单 pack 定价
- 入门：$3.99
- 常规：$5.99
- 高价值：$7.99-$9.99

### 15.3 Bundle 定价
- Mini bundle：$19
- Teacher essentials：$29
- Seasonal / Back-to-school bundle：$49
- Mega bundle：$79+

### 15.4 会员定价
- Monthly：$9-$15
- Yearly：$99-$149

### 15.5 License 定价
- 单教师
- 单学校
- 小机构

### 15.6 Stripe 计费与交付规则
- 单 pack / bundle 使用 Stripe Checkout（`mode=payment`）
- membership 使用 Stripe Checkout（`mode=subscription`）
- 会员自助管理使用 Stripe Customer Portal
- 推荐开启 Stripe Tax / `automatic_tax`，避免美国州税与国际税务遗漏
- 支付成功后的唯一可信来源为 Stripe Webhook，不以前端跳转页作为发货依据
- 每个商品必须在本地数据库映射 `stripe_product_id`、`stripe_price_id`、`entitlement_type`
- 退款、订阅取消、支付失败后必须同步权限状态与下载权限

---

## 16. 技术栈建议（适合 AI 开发）

### 16.1 代码管理
- GitHub 作为唯一代码仓库
- 推荐单仓库（monorepo 或单应用仓库均可），至少包含：`apps/web`、`packages/pdf-templates`、`scripts/content-pipeline`
- `main` 作为生产分支，Pull Request 作为唯一合并入口
- 开启 branch protection：禁止直接 push 到 `main`，要求至少 1 个 review 与必过 checks

### 16.2 前端与运行时
- Next.js（App Router + TypeScript）
- 部署到 Cloudflare Workers，使用 OpenNext Cloudflare 适配方案
- Tailwind CSS
- shadcn/ui（可选）
- React Server Components + Route Handlers + Server Actions（按场景使用）

### 16.3 边缘应用与异步任务
- Cloudflare Workers 负责前台请求、API、鉴权下载、Webhook 入口
- Cloudflare Queues 用于 AI 生成任务、预览图任务、PDF 导出任务、邮件任务解耦
- Cloudflare Cron Triggers 用于 sitemap 刷新、失效链接巡检、定时内容任务
- Wrangler 作为本地开发、环境配置、部署与资源绑定工具

### 16.4 数据库与认证
- Cloudflare D1（首选）
- SQLite-compatible SQL database
- 首发认证采用 email magic link / one-time code
- 用户会话存储在 D1，并通过 Worker 服务端校验下载、订单、会员权限

### 16.5 AI 内容生成
- OpenAI / Claude / Gemini
- 严格 JSON 输出
- 批量任务队列
- Prompt versioning + 内容审核日志

### 16.6 PDF 与预览图生成
- HTML/CSS templates
- Cloudflare Browser Rendering 生成 PDF 与预览图
- Playwright / Puppeteer 用于复杂排版控制或本地调试
- 同时输出：完整 PDF、watermarked sample PDF、商品预览图
- 所有模板必须兼容 US Letter 与 A4

### 16.7 存储与文件分发
- Cloudflare R2 作为 PDF、sample、preview、封面图主存储
- Cloudflare CDN / Cache 负责静态资源分发
- 下载链接通过签名 URL 或 Worker 鉴权转发发放，避免 R2 公链裸露
- 文件路径需按 `language_pair/pack_type/topic/sku` 规范化

### 16.8 支付与订阅
- Stripe Checkout 负责单次支付与订阅支付
- Stripe Billing / Customer Portal 负责订阅管理
- Stripe Webhooks 负责订单入库、权限发放、续费、取消、退款同步
- Stripe Tax 建议默认开启

### 16.9 邮件
- Resend 或 Postmark 负责事务性邮件
- Loops / ConvertKit（可选）负责 newsletter 与自动化营销
- 首发至少包含：订单确认、下载交付、欢迎邮件、续费失败、取消确认

### 16.10 分析、日志与监控
- Plausible 或 PostHog 作为产品分析
- Google Search Console 作为 SEO 基础监控
- Cloudflare Workers Observability / Logs 作为运行时日志基础
- Sentry（可选）用于前后端错误监控
- heatmap（可选）

### 16.11 部署与环境
- 开发环境：本地 `wrangler dev` + D1 / R2 本地或 remote bindings
- 预发环境：GitHub Pull Request 自动生成 preview deployment
- 生产环境：合并到 `main` 后自动部署到 Cloudflare
- 自定义域名、DNS、SSL 统一放在 Cloudflare 管理
- 环境至少分为：`local`、`preview`、`production`

### 16.12 CI / CD
- GitHub Actions 负责 lint、typecheck、test、build、deploy
- PR 阶段必须跑：`pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build`
- 合并到 `main` 后执行生产部署与 D1 数据库迁移
- Stripe Webhook secret、D1 配置、Cloudflare token 使用环境密钥管理

### 16.13 推荐目录结构
```txt
/apps/web
/packages/ui
/packages/pdf-templates
/packages/content-schema
/scripts/content-pipeline
/scripts/stripe-sync
/docs
```

---

## 17. 数据模型（简化）

### 17.1 tables
#### resources
- id
- slug
- title
- pack_type
- topic
- age_band
- language_pair
- free_or_paid
- seo_title
- seo_description
- preview_images
- pdf_url
- created_at

#### packs_json
- id
- resource_id
- content_json
- status
- reviewed_by
- updated_at

#### products
- id
- name
- price
- type（single/bundle/membership/license）
- stripe_product_id

#### orders
- id
- user_id
- product_id
- amount
- status
- stripe_checkout_session_id
- stripe_payment_intent_id
- created_at

#### users
- id
- email
- role
- created_at

#### sessions
- id
- user_id
- session_token_hash
- expires_at
- revoked_at

#### auth_magic_links
- id
- email
- token_hash
- expires_at
- used_at

#### subscriptions
- id
- user_id
- stripe_customer_id
- stripe_subscription_id
- status
- current_period_end
- created_at

#### entitlements
- id
- user_id
- product_id
- resource_id
- source_type（purchase/subscription/manual/license）
- access_level
- starts_at
- ends_at

#### webhook_events
- id
- provider（stripe）
- event_id
- event_type
- processed_at
- status

#### download_tokens
- id
- user_id
- resource_id
- token
- expires_at
- used_at

#### downloads
- id
- user_id
- resource_id
- created_at

#### email_leads
- id
- email
- source_page
- lead_magnet
- created_at

---

## 18. AI 开发任务拆解

### 18.1 阶段一：内容系统
- 设计 JSON schema
- 搭建种子主题表
- 集成 LLM API
- 批量生成内容
- 基础审核台

### 18.2 阶段二：PDF 模板系统
- 设计 4 种页型模板
- 完成 cover / cards / worksheets / notes / answer key 模板
- 实现 HTML -> PDF

### 18.3 阶段三：网站与电商
- 首页
- 分类页
- 单资源页
- 商品页
- 账户页
- 订单下载

### 18.4 阶段四：SEO / growth
- sitemap
- schema
- internal links
- category landing pages
- email capture
- related resources

### 18.5 阶段五：部署、支付与运维
- 配置 Cloudflare Workers / R2 / Queues / Cron
- 配置 GitHub Actions 与 preview deployments
- 接入 Stripe Checkout、Billing、Customer Portal、Webhook
- 完成 entitlement 权限系统与下载鉴权
- 配置错误监控、日志、分析、Search Console
- 完成 robots、sitemap、canonical、结构化数据
- 编写上线回滚与故障处理 SOP

---

## 19. 上线顺序（最现实）

### Week 1
- 定义 pack schema
- 做 2 个模板
- 做 5 个首发 pack
- 搭建基本站点结构

### Week 2
- 批量生成 15-20 个 pack
- 接入 Stripe Checkout 基础支付链路
- 上线免费页 + 商品页
- 部署 Search Console / analytics

### Week 3
- 补 10 篇 supporting pages
- 做 bundle
- 做 email lead magnet
- 上 TPT / Etsy 做反向验证

### Week 4
- 完成 Stripe Webhook 与权限发放联调
- 完成 Cloudflare R2 下载鉴权与 sample 文件分发
- 配置 GitHub Actions + preview + production deploy
- 配置日志、监控、Search Console、邮件模板
- 做上线前 QA、支付回归、SEO 验收

---

## 20. KPI

### 内容 KPI
- 首月上线 20-30 个 pack
- 首月上线 30-50 个 SEO 页
- 每周新增 5-10 个 pack

### 流量 KPI
- 3 个月内 100-300 organic clicks/day
- 6 个月内 500-1,500 organic clicks/day

### 商业 KPI
- 首月：首批付费订单 10-30 单
- 3 个月：首批 bundle 收入 > 广告收入
- 6 个月：email list 1000+
- 12 个月：形成“广告 + 单 pack + bundle + 会员”四层结构

### 20.4 稳定性与交付 KPI
- 商品页到 Stripe Checkout 跳转成功率 > 98%
- 支付成功后 1 分钟内完成权限发放 > 99%
- 文件下载成功率 > 99%
- 关键页面 Core Web Vitals 达到可接受水平
- 首次上线后一周内 0 个 P1 支付 / 下载阻断事故

---

## 21. 核心风险

### 风险 1：做成泛 ESL 红海站
避免方法：
- 首发只做 newcomer + English-Spanish
- 不做“大而全”

### 风险 2：AI 批量内容质量不稳
避免方法：
- schema + 规则校验 + 人工抽检
- 先做小批量

### 风险 3：SEO 被判定为低价值模板页
避免方法：
- 每页要有真实用途说明
- 加预览、说明、相关资源、教师建议
- 不做纯模板堆叠页

### 风险 4：只能靠广告
避免方法：
- 早期就上付费 pack
- 用免费 sample 做转化
- Bundle 优先于会员，会员优先于纯广告依赖

### 风险 5：版权 / IP 风险
避免方法：
- 不碰热门卡通角色
- 不生成侵权风格页
- 自有图形体系或合规素材库

### 风险 6：支付状态与权限不同步
避免方法：
- 所有订单状态以 Stripe Webhook 为准
- webhook event 做幂等处理与事件落库
- entitlement 单独建表，不把权限逻辑散落在前端

### 风险 7：Cloudflare 运行时兼容性
避免方法：
- 选型时优先兼容 Workers runtime 的依赖
- PR 阶段必须跑 Cloudflare 目标环境构建与预发验证
- PDF 与异步任务通过 Queues / Browser Rendering 解耦

### 风险 8：上线后运维空白
避免方法：
- 配置日志、错误监控、告警、回滚流程
- 对支付、下载、PDF 生成建立后台状态面板
- 为失败 webhook、失败任务提供可重试机制

---

## 22. 最终战略判断

### 这是好生意吗？
对个人开发者来说，**是一个有机会做成“低成本内容资产 + 可复购数字产品”的好生意**。  
但前提是：

- 不做泛 printable 红海
- 不只靠广告
- 先从 newcomer / bilingual 这类高意图切口切入
- 用模板化 + AI 自动化做内容工厂

### 最适合的首发切口
**English-Spanish ELL newcomer printable packs**

原因：
- 语言对明确
- classroom / newcomer 场景强
- TPT / 教师需求已经被验证
- 容易先做 20 个 pack 起盘
- 比泛 ESL worksheets 更适合切 SEO + 商品化

---

## 23. 给 AI 开发代理的一句话任务书

请基于本 PRD 构建一个：

**以 English-Spanish newcomer / ELL printable packs 为首发切口的内容产品网站**，  
具备以下能力：

1. 管理主题与 pack schema  
2. 批量调用 LLM 生成结构化内容 JSON  
3. 使用模板引擎自动生成 PDF  
4. 发布免费 SEO 页与付费商品页  
5. 支持 bundle 与用户下载  
6. 支持后续扩展到多语言 / 多 pack 类型 / 会员订阅

---

## 24. 上线前验收清单

### 24.1 产品与内容
- 首批 pack、sample、bundle、free pages 已全部生成并人工审核
- 每个商品页都有预览图、包含内容、license、FAQ、相关资源
- 每个 free SEO 页都有下载按钮、用途说明、内链、邮件入口

### 24.2 支付与权限
- Stripe 产品、价格、Webhook、Customer Portal 已联通
- 单 pack、bundle、membership 三类购买链路全部回归通过
- 权限发放、退款回收、取消订阅、续费失败流程均已验证

### 24.3 文件与下载
- R2 文件命名、目录结构、缓存策略已定稿
- sample、preview、正式文件全部可访问且权限正确
- 下载链接过期、重复点击、未登录访问等边界情况已验证

### 24.4 SEO 与分析
- sitemap、robots、canonical、schema、OG 已生效
- Search Console、Plausible / PostHog、关键事件埋点已配置
- 404 / redirect / noindex 页面规则已验证

### 24.5 工程与运维
- GitHub branch protection、CI checks、preview deploy、production deploy 已配置
- Cloudflare 环境变量、R2、Queues、Cron、域名、SSL 已配置
- 日志、错误监控、告警、回滚 SOP 已准备

### 24.6 法务与页面基础
- Terms of Use、Privacy Policy、Refund Policy、License 页面已上线
- 联系方式、支持邮箱、版权声明、DMCA / takedown 联系入口已就位
- Stripe 收据、发票、税务配置符合目标销售地区要求

---

## 25. Research basis（供内部参考）
本 PRD 的市场判断主要参考了以下公开信息类型：

- NCES：美国 English Learners 学生规模
- Teachers Pay Teachers：7M+ educators worldwide
- Monday Mandala：10,000+ printables + 广告变现模型
- Similarweb / Semrush：Twinkl、Monday Mandala 等站点的搜索依赖度
- Colorín Colorado / U.S. DOE Newcomer Toolkit：newcomer 支持需求
- TPT / Etsy 现有商品页：bilingual classroom labels、ELL newcomer packs、ESL newcomer activities 的真实付费供给

> 说明：关键词部分使用的是“公开 SERP + marketplace demand + intent clarity”的实战筛选法，
> 不是登录付费工具后的精确 KD 导出表。
