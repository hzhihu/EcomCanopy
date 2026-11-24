# EcomCanopy V1.0 GEO 与 SEO 方案

**版本：** v1.1（2026-11-24 确认稿，未实施）
**状态：** 13 项待确认问题已全部确认（§12.4）；等待用户批准后进入阶段 1a
**适用范围：** EcomCanopy 主站 V1.0，当前 3 个页面：`/`、`/cases/`、`/cases/fulfillment-ai/`
**约束优先级：** `docs/decisions.md`（冻结决策）→ 本文 → 其他文档

---

## 0. 术语说明：GEO 不是地理定位

本文中的 **GEO = Generative Engine Optimization（生成式引擎优化）**，指让 Google AI Overviews、Bing Copilot、ChatGPT Search、Perplexity 等生成式搜索/答案引擎能够准确理解站点实体、页面主题与可引用内容。

**不是** Geo Targeting / Geolocation（地理定位）。本文不涉及任何地理位置定向内容。

---

## 1. 目标、非目标与成功指标

### 1.1 目标

1. 让 Google、Bing、百度能够抓取、理解并收录当前 3 个页面。
2. 让生成式答案引擎能准确识别站点实体（EcomCanopy / 易贸森 / hzhihu）与页面主题，并能引用站内可验证的内容。
3. 用**零依赖、3 页面规模的最小方案**补齐 SEO 基础能力，避免为 3 个 URL 引入重型依赖。

### 1.2 非目标（本次不做）

- 不做多语言（hreflang）、不做国际化（冻结决策第 6 条）。
- 不新增页面、路由、业务功能或后端接口。
- 不承诺任何关键词排名、流量数字或收录时间。
- 不引入付费工具、不购买外链、不做灰帽/黑帽操作。
- 不为尚未设计的后续页面（旧需求中的项目页/文章页）实施具体 SEO，只写扩展原则。

### 1.3 成功指标（可测量）

| # | 指标 | 测量方式 | 通过标准 |
| --- | --- | --- | --- |
| 1 | 全站可抓取 | `curl -fsS https://ecomcanopy.site/robots.txt`、`/sitemap.xml` | 均返回 200，内容合法 |
| 2 | 收录页面数 | GSC 页面索引报告、Bing Webmaster、百度 `site:ecomcanopy.site` | 3/3 被收录（观察期通常数天至数周，不作时间承诺） |
| 3 | GSC 展现与点击 | GSC 效果报告 | > 0 且在观察期内上升趋势；**不设具体数值** |
| 4 | 结构化数据通过 | Google Rich Results Test / GSC 增强功能 + 本地 JSON-LD 校验（§11.6） | Article、BreadcrumbList、Organization 无错误 |
| 5 | canonical 一致性 | 线上 `curl` 与源码比对 | 3 个页面的 canonical 与线上实际 URL 一致（含尾斜杠） |
| 6 | 链内无多余跳转 | 全站链接扫描（§11.5） | 站内链接不触发 308/301 跳转（见第 2.4 节） |
| 7 | 抓取预算健康 | GSC 抓取统计 | 无大量 404/软 404 被重复抓取 |
| 8 | Core Web Vitals | PageSpeed Insights / GSC 核心网页指标 | LCP、INP、CLS 达到「良好」档 |
| 9 | OG 分享可读 | LinkedIn Post Inspector / 飞书预览（微信另作人工确认，不作为 OG 验收依据） | 出图（1200×630）、标题、描述正确 |

> 不把「排名第 X」或「流量翻倍」写进成功指标。需要量级判断时，统一写「需用 Google Search Console / Bing Webmaster / 百度搜索资源平台验证」。

---

## 2. 现状审计

审计分两层：**源码审计**（唯一权威）与**线上实测**（只读 `curl`，2026-11-24）。每条结论标注依据。

### 2.1 公共布局现状（`src/layouts/BaseLayout.astro`）

| 项 | 现状 | 依据 |
| --- | --- | --- |
| `<html lang>` | `lang="zh-CN"`，正确 | `BaseLayout.astro:20` |
| `<title>` | 每页由 props 传入，独立 | `BaseLayout.astro:32` |
| `meta description` | 每页独立 | `BaseLayout.astro:25` |
| `canonical` | `new URL(Astro.url.pathname, Astro.site)` | `BaseLayout.astro:15,26` |
| OG | 仅 `og:type=website`、`og:title`、`og:description`、`og:url`、`og:site_name` | `BaseLayout.astro:27-31` |
| OG 图 | **无** `og:image` | 全文检索无 |
| Twitter Card | **无** | 全文检索无 |
| `og:locale` | **无** | — |
| favicon | **无** `<link rel="icon">`，`public/` 下无 favicon 文件 | `public/` 仅含 `images/` |
| robots meta | **无** `<meta name="robots">`（默认全可索引，可接受） | — |
| 结构化数据 | **无** JSON-LD | 全文检索无 |

### 2.2 逐页审计

#### 首页 `/`（`src/pages/index.astro`）

| 项 | 现状 | 评价 |
| --- | --- | --- |
| title | `EcomCanopy 易贸森｜跨境电商 × AI 一人技术工作室`（`:18`） | 品牌+定位，可用 |
| description | `EcomCanopy（易贸森）以 FDE 的方式，为跨境电商团队端到端交付 AI Agent 与业务系统。`（`:19`） | 可用 |
| H1 | `hero__title`：从订单到海外仓，把 AI 交付到现场。（`:34`）1 个 H1 | 正确 |
| H2 | `section__title`×3（能力/交付物/信任）、`cta-panel__title`×1，共 4 个 | 层级合理 |
| 图片 alt | 3 张能力图 + 1 张交付物图均带 `alt` | 完整 |
| canonical | 线上实测 `https://ecomcanopy.site/` | 正确 |
| 内链 | 导航 3 个锚点 + `/cases`×5、邮箱 mailto | 见第 2.4 节 |

#### 案例与笔记 `/cases/`（`src/pages/cases.astro`）

| 项 | 现状 | 评价 |
| --- | --- | --- |
| title | `案例与笔记｜EcomCanopy 易贸森`（`:15`） | 可用 |
| description | `跨境履约、数据治理、库存同步与异常预测的工程记录，以及现场笔记与方法随想。`（`:16`） | 可用 |
| H1 | `page-header__title`：案例与笔记（`:28`）1 个 H1 | 正确 |
| H2 | `notes-section__title`、`contact-band__title` 共 2 个 | 合理 |
| 图片 alt | 案例卡片图均带 `alt`（`CaseCard` 使用 `item.imageAlt`） | 完整 |
| canonical | 线上实测 `https://ecomcanopy.site/cases/` | 正确 |
| 内链 | featuredCase → `/cases/fulfillment-ai`；其余 3 张卡与「查看全部」→ `/cases`（自引用） | 见第 2.4、8 节 |

#### 文章详情 `/cases/fulfillment-ai/`（`src/pages/cases/[slug].astro`）

| 项 | 现状 | 评价 |
| --- | --- | --- |
| title | `从订单到海外仓， 把 AI 交付到跨境履约现场｜EcomCanopy`（`:24`） | 注意：`\n` 被替换成空格后，中文逗号后多一个空格，建议改为顿号或无空格 |
| description | 复用 `article.intro`（`:25`） | 可用 |
| H1 | `article-header__title` 1 个 H1 | 正确 |
| H2 | 3 个正文小节 + `results-section__title` + `related-section__title` | 合理 |
| og:type | `website`（`BaseLayout.astro:27`），未按文章类型设为 `article` | 建议改为 `article` |
| 作者/时间 | 页面可见 `文 / hzhihu`、`2026.11.18`、`8 MIN READ`（`content.ts:228-230`），但无结构化标记 | 有信息，缺 JSON-LD |
| canonical | 线上实测 `https://ecomcanopy.site/cases/fulfillment-ai/` | 正确 |
| 内链 | 面包屑 `/`、`/cases`；「上一篇/下一篇」与「相关阅读」3 张卡**均不可点击** | 见第 2.4、8 节 |

### 2.3 站点级缺口（源码 + 线上实测）

| 项 | 现状 | 依据 |
| --- | --- | --- |
| robots.txt | **无**，线上 404 | 线上 `curl` 404；`public/` 无文件 |
| sitemap.xml | **无**，线上 404 | 线上 `curl` 404；无 `sitemap.xml.ts` / `public/sitemap.xml` |
| RSS | **无** | `ARCHITECTURE.md` 第 7 节「当前未实现」 |
| JSON-LD | **无** | 全文检索无 |
| 404 页面 | **无**，Caddy 返回默认 404 | `ARCHITECTURE.md` 第 7 节；`src/pages` 无 404 |
| OG 图 | **无** | 见 2.1 |
| favicon | **无** | 见 2.1 |

### 2.4 canonical 与尾斜杠：关键结论

**机制说明**（对应任务要求）：

- Astro `build.format` 默认 `directory`，产物为 `dist/cases/index.html`、`dist/cases/fulfillment-ai/index.html`；Caddy `file_server` 实际以 `/cases/`、`/cases/fulfillment-ai/`（带尾斜杠）对外服务。
- `BaseLayout.astro:15` 用 `Astro.url.pathname` 拼 canonical。

**实测结论（2026-11-24 只读 curl）：**

- 首页 canonical = `https://ecomcanopy.site/` ✅
- `/cases/` canonical = `https://ecomcanopy.site/cases/` ✅（带尾斜杠）
- `/cases/fulfillment-ai/` canonical = `https://ecomcanopy.site/cases/fulfillment-ai/` ✅（带尾斜杠）

即：**当前构建产物中 canonical 已带尾斜杠，与线上服务 URL 一致，未发现 canonical 与实际 URL 的线上不一致。**

**真正的不一致在站内链接（无尾斜杠）：**

- `content.ts:30` `navItems` 的「案例与笔记」= `/cases`
- `CaseCard.astro:16,39` 详情链接 = `/cases/fulfillment-ai`
- 首页、案例页、文章页多处 CTA/返回/面包屑链接 = `/cases`（精确行号见第 8.1 节）

线上实测这些无斜杠链接会被 Caddy **308 跳转**到带斜杠版本：

```text
GET /cases                -> 308 -> /cases/
GET /cases/fulfillment-ai -> 308 -> /cases/fulfillment-ai/
```

影响：每次点击多一跳、爬虫信号不统一、抓取日志里出现冗余 308。**结论：站内统一使用尾斜杠。**

### 2.5 线上实测汇总（只读，2026-11-24）

| 检查 | 结果 |
| --- | --- |
| `https://ecomcanopy.site/` | 200，真实站点内容（非 Demo Site） |
| `/cases/` | 200，真实内容 |
| `/cases/fulfillment-ai/` | 200，真实内容 |
| `https://www.ecomcanopy.site/` | **301 → `https://ecomcanopy.site/`（www 已启用并跳转）** |
| `http://ecomcanopy.site` | 308 → HTTPS（runbook 记载，本轮已实测确认；列入 §11.3 回归） |
| `robots.txt` / `sitemap.xml` | 404 |
| `/cases`（无斜杠） | 308 → `/cases/` |
| 响应头 | 含 HSTS、`X-Content-Type-Options`、`Referrer-Policy`、`X-Frame-Options`、`Permissions-Policy`、`Cache-Control: no-cache`；`Server` 已隐藏 |

> 注意：`CONTEXT.md`（快照日期 2026-11-24）原记载「首页为 Demo Site、`/cases/` 404、www 不可用」与本次线上实测不符。线上实际已是真实内容且 www 已 301。**该快照已于 2026-11-24 按实测更新**（§12.4 #11），避免后续误判。

---

## 3. 站点级技术决策

| # | 决策 | 结论 | 责任方 |
| --- | --- | --- | --- |
| 1 | canonical 主机 | `https://ecomcanopy.site`（apex，无 www） | 代码（`astro.config.mjs:5` 已正确） |
| 2 | 尾斜杠策略 | 全站统一**带尾斜杠**：`/cases/`、`/cases/fulfillment-ai/` | 代码（改链接 + 防御性规范化 canonical） |
| 3 | http→https | 由 Caddy 处理（runbook 记载 308）；不改代码 | 管理员（已就绪，验收确认） |
| 4 | www→apex | 301（线上已生效）；不改代码 | 管理员（已就绪，验收确认） |
| 5 | 404 页面 | **本次实施**（用户 2026-11-24 确认）；代码侧新增 `404.astro`，`BaseLayout` 增加 `noCanonical` 开关；接线由管理员改 Caddyfile | 代码 + 管理员（已确认） |
| 6 | robots.txt | `public/robots.txt` 静态文件，零依赖 | 代码 |
| 7 | sitemap.xml | `src/pages/sitemap.xml.ts` Astro 端点生成，零新依赖 | 代码 |
| 8 | 缓存策略 | HTML `no-cache`（已生效）；`/_astro/*` immutable、`/images/*` 7 天（已生效） | 管理员（已就绪，验收确认） |
| 9 | 抓取预算 | 3 个页面无预算问题，**不做任何额外优化** | — |
| 10 | RSS | 本次不做（无文章列表页支撑）；用户 2026-11-24 确认接受偏离需求文档 §10.1 | 用户（已确认） |
| 11 | hreflang | 不需要（单语言 zh-CN） | — |

### 3.1 canonical 防御性规范化建议（可选）

当前 canonical 已正确，本项**仅在未来修改 `build.format` / `trailingSlash` 配置时才需要**，本次不强制。为避免未来配置变动导致 canonical 漂移，届时可在 `BaseLayout.astro` 显式规范化（属于代码阶段，见第 10 节）：

```ts
const pathname = Astro.url.pathname.endsWith("/")
    ? Astro.url.pathname
    : Astro.url.pathname + "/";
const canonicalUrl = new URL(pathname, Astro.site);
```

理由：当前 3 个路由均为目录型，规范化后 canonical 恒带尾斜杠，与 Caddy 服务路径一致，消除对 Astro 内部行为的隐性依赖。

### 3.2 为什么用零依赖方案

- `public/robots.txt`：纯静态文本，一次到位。
- `src/pages/sitemap.xml.ts`：Astro 原生端点能力，构建期生成 XML，**不新增任何 npm 依赖**。
- **`lastmod` 规则（关键）：** 文章页用 `content.ts › article.date`（`2026-11-18`）；`/` 与 `/cases/` 在 `content.ts` 中**没有日期字段**，这两页**省略 `lastmod`**（Google 接受省略；错日期比没有更糟）。
- 备选（不推荐）：引入 `@astrojs/sitemap`。对 3 个 URL 来说收益为零，反而增加依赖面，违反「最小必要修改」。

---

## 4. 关键词与搜索意图地图

对齐 `docs/requirements/website-plan-v1.2.md` 第 10.2 节核心关键词。**只把关键词分配到实际存在对应内容的页面，禁止为不存在的内容堆词。** 例如 `Agent Skills`、`MCP`、`RAG`、`Workflow`、`n8n` 属于旧需求关键词，但当前 3 页正文未展开这些主题，本次**不**给任何页面硬塞这些词。

### 4.1 首页 `/`

- **主关键词：** 跨境电商 AI、跨境电商 AI Agent、AI FDE
- **次关键词：** 跨境电商技术服务、海外仓、跨境电商自动化
- **搜索意图：** 品牌/服务了解（Navigational + Informational）——「这家工作室做什么、靠不靠谱」
- **现有内容支撑：** hero 定位、能力三块（业务建模/现场交付/Agent 工程）、交付物、FAQ（`index.astro` 全文）
- **注意：** 关键词必须自然出现在 H1/H2/正文中，不作刻意堆砌；hero H1 已含「AI」「订单/海外仓」，description 已含「AI Agent」「跨境电商」。

### 4.2 案例与笔记 `/cases/`

- **主关键词：** 跨境电商系统开发、OMS/WMS 开发、海外仓系统
- **次关键词：** 库存同步、订单管理、数据治理、异常预测
- **搜索意图：** 证据/案例查找（Investigational）——「有没有做过类似的事、做得怎么样」
- **现有内容支撑：** 精选案例 `content.ts › featuredCase（162-174）` + 3 张案例卡 `content.ts › caseStudies（176-206）`
- **注意：** 页面上「24 案例 / 52 笔记 / 16 随笔 / 覆盖 8 行业」是设计稿数字（`content.ts › caseStats（155-160）`），SEO 上不把「24 个案例」当作真实可索引内容量；当前实际只有 1 篇可读详情。诚实呈现，不夸大。

### 4.3 文章详情 `/cases/fulfillment-ai/`

- **主关键词：** 海外仓、跨境履约、订单归集、库存同步、异常件预测
- **次关键词：** AI 调度、系统交付
- **搜索意图：** 深度阅读/技术验证（Informational + Transactional 前置）——「具体怎么做的、能不能信」
- **现有内容支撑：** 正文 3 小节与结果区（`content.ts › article（217 起）`）
- **注意（真实性红线）：** 文中「6 条渠道」「6 min」「0 张 Excel」「8 个行业」「90 天」来自 Ardot 设计稿文案，其内容真实性由用户在设计与上线验收时确认（`decisions.md` 2026-11-22）。本方案**不替用户断言这些数字的来源**；它们**不进入 JSON-LD**（JSON-LD 用不含数字的描述，见 §6.3），数字留在正文并保留 `resultNote`（`content.ts:297`）。

### 4.4 明确不做的关键词操作

- 不做关键词密度优化、不做隐藏文本。
- 不购买外链、不参加链接农场。
- 不给尚未上线的「AI Skills Hub / 差评洞察 / Listing 体检」页面抢注关键词（这些是后续内容）。

---

## 5. 逐页 Metadata 方案

> 以下 title/description 为**可直接使用**的建议值；H1/H2 基本沿用现有内容，仅在必要时微调。品牌分隔符统一用 `｜`。

### 5.1 首页 `/`

- **title（建议）：** `EcomCanopy 易贸森｜跨境电商 × AI 一人技术工作室`
  - 现有值已合格，保持。
- **description（建议）：** `EcomCanopy（易贸森）是一人技术工作室，以 FDE 方式为跨境电商团队端到端交付 AI Agent 与业务系统，覆盖订单、库存、海外仓与物流。`
  - 在现有基础上补充业务场景词（订单/库存/海外仓/物流），控制在约 80 字。
- **H1：** 保持 `从订单到海外仓，把 AI 交付到现场。`
- **H2：** 保持 4 个（能力/交付物/信任与合作/案例 CTA）。
- **canonical：** `https://ecomcanopy.site/`
- **OG/Twitter：**
  - `og:type` = `website`
  - `og:image` = `https://ecomcanopy.site/images/og-home.jpg`
  - `twitter:card` = `summary_large_image`，`twitter:title`、`twitter:description`、`twitter:image` 同 OG
  - `og:image:width=1200`、`og:image:height=630`、`og:image:alt="EcomCanopy 易贸森 — 跨境电商 × AI 一人技术工作室"`

### 5.2 案例与笔记 `/cases/`

- **title（建议）：** `案例与笔记｜EcomCanopy 易贸森`
  - 现有值合格，保持。
- **description（建议）：** `跨境履约、数据治理、库存同步与异常预测的工程记录，以及现场笔记与方法随想。`
  - 现有值合格，保持。
- **H1：** 保持 `案例与笔记`
- **H2：** 保持 2 个 + 各卡片标题为 H3。
- **canonical：** `https://ecomcanopy.site/cases/`
- **OG/Twitter：**
  - `og:type` = `website`
  - `og:image` = `https://ecomcanopy.site/images/og-cases.jpg`
  - 其余同 5.1 模式。

### 5.3 文章详情 `/cases/fulfillment-ai/`

- **title（建议）：** `从订单到海外仓，把 AI 交付到跨境履约现场｜EcomCanopy`
  - 修掉现有 `\n`→空格产生的「海外仓， 把」多空格（`[slug].astro:24` 改为把 `\n` 替换成空串或顿号）。
- **description（建议）：** 复用 `article.intro`，保持。
- **H1：** 保持文章标题（含 `<br />`）。
- **H2：** 保持正文 3 小节 + 结果区 + 相关阅读。
- **canonical：** `https://ecomcanopy.site/cases/fulfillment-ai/`
- **OG/Twitter：**
  - `og:type` = **`article`**（从 `website` 改为 `article`）
  - `og:image` = `https://ecomcanopy.site/images/og-fulfillment-ai.jpg`
  - `twitter:card` = `summary_large_image`
  - 日期与署名**通过 JSON-LD `Article` 表达**（§6.3），不额外写 `article:author` OG 元数据；如确需 `article:author`，按 ogp.me 规范填作者主页 URL（此处无独立作者主页，故省略）。

### 5.4 OG 图规格（统一）

| 项 | 规格 |
| --- | --- |
| 尺寸 | 1200 × 630 px |
| 格式 | JPEG（质量 88、渐进式；§11 检查按 `.jpg` 文件名与尺寸断言） |
| 中文可读 | 最终版：标题用 Noto Sans SC / Noto Serif SC，保证缩略图下可读；本次裁切版无文字 |
| 内容 | 最终版：品牌 wordmark `EcomCanopy` + 中文名 `易贸森` + 页面主题一句话；本次裁切版无文字（见下方说明） |
| 文件 | `public/images/og-home.jpg`、`og-cases.jpg`、`og-fulfillment-ai.jpg` |
| 体积 | **必须** < 300 KB（§11.11 断言 < 307200 字节；JPEG q88 实测 144–158 KB） |

**本次已定（2026-11-24 用户确认）：先用现有图片裁切出图**——文章页用 `article-cover-warehouse.jpg`（1488×620）、首页/列表页用 `home-warehouse-wide.jpg`（1840×502）。

**格式已改为 JPEG（同批确认）：** 照片裁切后无损 PNG 为 888–1015 KB，压到 64 色仍有 316 KB 且出现明显色带；JPEG q88 为 144–158 KB，缩略尺度看不出差别。因此最终产物用 `.jpg`，体积上限 300 KB 得以保留。

- 代价：缩略预览里没有品牌文字，分享时认不出是谁。
- 后续可替换为品牌图，替换后需重新走 1a 验收。
- 裁切方案同样要经过 1a 候选稿验收（§10 阶段 1a），未经确认不得直接接入。

OG 图属于**图片资产**，不是依赖。中文 OG 图在 LinkedIn/飞书的适配需人工预览验收（§11.9）；微信分享不走 OG 协议，另作人工确认。

---

## 6. 结构化数据方案（JSON-LD）

全部用内联 `<script type="application/ld+json">`，**零依赖**。放置策略：

- 首页：`WebSite` + `Organization`（同一 `@graph`）
- `/cases/`：`CollectionPage`（**本次不做**，见 §6.5）
- 文章页：`Article` + `Organization`（同页重定义）+ `WebPage` + `BreadcrumbList`（同一 `@graph`）

> **实现要点：** JSON-LD 用 `is:inline` 或 `set:html={JSON.stringify(data)}` 输出，避免被 Astro 构建流程转义/打包；以 §11.6 通过为准。

> **关键约束：** JSON-LD 按**单页**解析，`@id` 引用必须在**同一页面**内有定义。文章页不能引用只在首页定义的 `#organization` 节点，因此文章页的 `@graph` 里要**重新定义** `Organization`（`@id` 与首页一致即可）。

### 6.1 实体表达：不暴露真实姓名、不暗示在职

- **组织实体：** `Organization`，`name=EcomCanopy`，`alternateName=易贸森`，`url`，`logo`，`email`。**不写 founder 真实姓名。**
- **作者实体：** `Person`，`name=hzhihu`（页面已公开的签名，`content.ts:228`、`[slug].astro` 正文底部），**不写真实姓名、不写 jobTitle / worksFor 现值**，避免「暗示在职」。`url` 用站内地址，`sameAs` 固定为 `https://github.com/hzhihu`（2026-11-24 用户确认；已核实该主页公开、姓名栏为空，不暴露真实姓名）。
- **不写** `jobTitle`、`worksFor`、`alumniOf` 等可能泄露雇佣状态的字段。

### 6.2 首页 JSON-LD 示例

```json
{
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://ecomcanopy.site/#organization",
            "name": "EcomCanopy",
            "alternateName": "易贸森",
            "url": "https://ecomcanopy.site/",
            "logo": "https://ecomcanopy.site/images/logo-512.png",
            "email": "hzhihu@ecomcanopy.site",
            "description": "跨境电商 × AI 的一人技术工作室，以 FDE 方式交付 AI Agent 与业务系统。"
        },
        {
            "@type": "WebSite",
            "@id": "https://ecomcanopy.site/#website",
            "name": "EcomCanopy",
            "url": "https://ecomcanopy.site/",
            "inLanguage": "zh-CN",
            "publisher": { "@id": "https://ecomcanopy.site/#organization" }
        }
    ]
}
```

> - `logo` 用**方形组织标志**（`logo-512.png`，≥112×112），不是 1200×630 的 OG 卡片图（二者语义不同）。
> - 不加 `potentialAction/SearchAction`：站点没有站内搜索，加上属于虚构能力。

### 6.3 文章页 JSON-LD 示例（`/cases/fulfillment-ai/`）

单块 `@graph`，同页内定义 `Organization`、`WebPage`、`Article`、`BreadcrumbList` 四个节点，`publisher` 只引用同页 `@id`：

```json
{
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://ecomcanopy.site/#organization",
            "name": "EcomCanopy",
            "alternateName": "易贸森",
            "url": "https://ecomcanopy.site/",
            "logo": "https://ecomcanopy.site/images/logo-512.png",
            "email": "hzhihu@ecomcanopy.site",
            "description": "跨境电商 × AI 的一人技术工作室，以 FDE 方式交付 AI Agent 与业务系统。"
        },
        {
            "@type": "WebPage",
            "@id": "https://ecomcanopy.site/cases/fulfillment-ai/#webpage",
            "url": "https://ecomcanopy.site/cases/fulfillment-ai/",
            "inLanguage": "zh-CN"
        },
        {
            "@type": "Article",
            "headline": "从订单到海外仓，把 AI 交付到跨境履约现场",
            "description": "从订单归集、库存同步到异常件预测的跨境履约工程记录。",
            "image": "https://ecomcanopy.site/images/article-cover-warehouse.jpg",
            "datePublished": "2026-11-18",
            "dateModified": "2026-11-18",
            "inLanguage": "zh-CN",
            "author": {
                "@type": "Person",
                "name": "hzhihu",
                "url": "https://ecomcanopy.site/",
                "sameAs": ["https://github.com/hzhihu"]
            },
            "publisher": { "@id": "https://ecomcanopy.site/#organization" },
            "mainEntityOfPage": { "@id": "https://ecomcanopy.site/cases/fulfillment-ai/#webpage" }
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "首页",
                    "item": "https://ecomcanopy.site/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "案例与笔记",
                    "item": "https://ecomcanopy.site/cases/"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "CASE 001 · 跨境履约"
                }
            ]
        }
    ]
}
```

> - `Article.description` **故意不含数字**：结果区数字（6 条/6 min/0 张/8 行业/90 天）已于 2026-11-24 由用户确认真实（§12.4 #3），但仍不进入机器可读断言；数字留在正文并保留 `resultNote`。
> - `BreadcrumbList` 第 3 项 `name` 与页面可见面包屑末项 `CASE 001 · 跨境履约`（`[slug].astro:33`）一致，满足「结构化数据与可见内容一致」。

### 6.4 Article 与 TechArticle 的边界（全文统一为 Article）

- **结论：全文统一用 `Article`。** 本文所有示例、实体链、成功指标均指 `Article`，不再出现 `TechArticle`。
- `TechArticle` 是 schema.org 的**可选语义细分**（`proficiencyLevel`、`dependencies` 等均为可选属性，不是必填），但本页没有「读者水平/前置知识」等对应内容，**暂不使用**。若后续文章补全这些字段，再升级为 `TechArticle`。
- 结果区（`content.ts:280-297`）是**正文事实**，不是结构化评测数据；**不添加 `aggregateRating`、`review`、`HowTo`、`FAQPage`** 等会触发 Google 富媒体审核但站内无对应交互语义的类型。

### 6.5 案例列表页 `/cases/`

- **本次不做**（2026-11-24 用户确认）。若日后要加，用最小 `CollectionPage`（name、url、inLanguage），**不生成 `ItemList`**。
- 理由：`content.ts` 中只有 `fulfillment-ai` 有 `slug` 和真实详情页（`content.ts:163,218`），其余 3 张卡无 `slug`、链接回 `/cases`。若用 `ItemList` 列出 4 个「项目」，等于把 3 个不存在的详情 URL 标成可索引实体，属于误导。

---

## 7. GEO 方案（生成式引擎优化）

> 诚实分级：标注【共识】= 行业已有共识、【实验】= 效果未证实。不得夸大 llms.txt、AI 爬虫白名单等手段。

### 7.1 实体一致性【共识，最高优先级】

生成式引擎靠「实体 + 属性 + 关系」构建知识。要做到三处一致：

1. 品牌名：全站统一 `EcomCanopy`（英文）/ `易贸森`（中文）。
2. 个人签名：全站统一 `hzhihu`（小写），不要混用其他大小写。
3. 实体关系在 JSON-LD 中显式表达：`Organization`（EcomCanopy）→ `Person`（hzhihu，author）→ `WebSite` → `WebPage` → `Article`。

### 7.2 可引用段落【共识】

生成式引擎倾向于引用「能独立成段、有明确断言、可验证」的句子：

- 现有 FAQ（`content.ts › faqs（140-153）`）是优质可引用素材（问题式 + 短答）。
- 文章正文的小节标题 + 第一段（`content.ts › article.sections`）适合被直接引用。
- **建议（代码阶段可选）：** 每个正文小节保留一句「观点句」，不新增文案，仅确认现有 `quote`（`content.ts › sections[].quote（247-250）`）等金句可被独立理解。

### 7.3 作者与更新时间【共识】

- 文章页已有署名 `hzhihu`、日期 `2026.11.18`（`content.ts:228-229`）。
- 用 JSON-LD 补 `author`、`datePublished`、`dateModified`（第 6.3 节）。
- 首页/列表页不虚构「最新更新时间」。

### 7.4 数据与结论的可验证表述【共识，真实性红线】

- 结果区已带 `resultNote`（`content.ts:297`）声明「单一客户案例，不代表通用基准」，保留并确保其可见。
- 结构化数据与 GEO 描述中**不新增**任何页面未出现的数字、不把案例说成通用结论。
- 不添加「业界第一」「权威」「最专业」等无法验证的最高级表述。

### 7.5 AI 爬虫策略【共识 + 实验边界】

**robots.txt 中的 AI 爬虫白名单**（行业共识做法，效果不可控）：

```text
# 未列出的爬虫沿用 robots 默认规则：允许。
# 下列 Allow 条目用于在未来可能出现的 `User-agent: *` 收紧规则中保留白名单。
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Bytespider
Allow: /

# 用户确认（2026-11-24）：不放行 Google-Extended，即不授权内容用于 Gemini/Vertex AI 训练。
# 注意：robots.txt 默认允许，必须显式 Disallow 才是「不放行」。
User-agent: Google-Extended
Disallow: /

Sitemap: https://ecomcanopy.site/sitemap.xml
```

说明：

- 放行 ≠ 一定会被引用。生成式引擎的引用取决于其自身索引与权重，robots.txt 只是「允许抓取」的门票。
- 上述 `Allow` 条目在没有任何 `User-agent: *` 规则时**不改变行为**（默认即允许），作用是「显式白名单」，便于日后收紧时不被误伤。
- `Google-Extended` 控制是否被用于 Gemini/Vertex AI 训练，不影响 Google 搜索收录。用户已确认**不放行**，因此写成显式 `Disallow: /`。
- `Bytespider`（字节/豆包）、`Baiduspider` 相关策略同样只影响抓取许可，不影响收录承诺。

### 7.6 llms.txt【实验，P2 可选】

- llms.txt 是社区提案（`llmstxt.org`），主流引擎尚未承诺遵循，效果未证实。
- **成本：** 极低（一个静态文本文件，列站点结构与关键页面摘要）。
- **风险：** 几乎无；但维护成本会随页面增多上升，且可能误导「AI 专供内容」与真实页面不一致。
- **结论：** 列为 P2 可选实验。**本次不做**（2026-11-24 用户确认），等 P1 稳定后再单独决定是否试点。若做，内容必须与线上页面逐字一致，不写任何「仅供 AI」的夸大描述。

### 7.7 FAQ 结构化【实验，不建议】

- 首页 FAQ 用 `FAQPage` 结构化数据曾在 Google 上触发富媒体，但 Google 已收紧（仅限权威健康/政府站点），普通站点收益低且有误导风险。
- **结论：** 本次**不**加 `FAQPage` 结构化数据；FAQ 文本本身保持可见、可引用即可。

---

## 8. 内链与内容结构

### 8.1 现有内链问题（含精确行号）

| 位置 | 现状 | 问题 | 建议 |
| --- | --- | --- | --- |
| `content.ts:30` navItems | `/cases` | 无尾斜杠，308 跳转 | 改 `/cases/` |
| `index.astro:43,224` | `/cases` | 无尾斜杠，308 跳转 | 改 `/cases/` |
| `cases.astro:107` | `/cases`（「查看全部 52 篇笔记」） | 无尾斜杠，308 跳转 | 改 `/cases/` |
| `[slug].astro:32,35,220,232` | `/cases`（面包屑、返回、尾部、相关阅读「查看全部」） | 无尾斜杠，308 跳转 | 改 `/cases/` |
| `CaseCard.astro:16,39` | `/cases/fulfillment-ai` | 无尾斜杠，308 跳转 | 改 `/cases/fulfillment-ai/`；无 slug 卡保持回 `/cases/`（自引用） |
| 案例页「查看全部」、无 slug 的 3 张卡 | 链接回 `/cases`（自引用） | 指向自身，爬虫视为弱链接 | 保留但标记：未写详情前，自引用可接受，**不要**指向不存在的 URL |
| 文章页「上一篇/下一篇」「相关阅读」3 卡 | 纯文本，不可点击 | 有信息但无链接，无法形成内容网络 | 见 8.3 |

### 8.2 3 页之间的链接策略（本次实施）

1. 首页 → `/cases/`：已有（导航、hero CTA、CTA panel）。
2. `/cases/` → `/cases/fulfillment-ai/`：已有（featuredCase）。
3. 文章页 → `/cases/`：已有（面包屑、返回、尾部按钮）。
4. **补：** 文章页「上一篇/下一篇」与「相关阅读」3 张卡目前不可点击。**本次不新增页面**，因此这些链接无法指向真实详情页。**方案：** 保持不可点击，但把「相关阅读」卡片的标题/分类作为**可见文本**保留（已满足可引用性）；等后续真实文章页落地后再加链接。**不要**为凑链接而指向 `/cases` 自身或虚构 URL。

### 8.3 锚文本规范

- 指向 `/cases/` 的锚文本统一用「案例与笔记」或「阅读案例与笔记」，**不要**用「点击这里」这类无语义锚文本。
- 指向 `/cases/fulfillment-ai/` 用文章标题或「阅读全文」+ 可见标题（`CaseCard` 已用 `aria-label={item.title}`，可保留）。

### 8.4 Skills Hub 子域名链接策略（本次不实施，已确认）

- 冻结决策第 5 条：Skills Hub 用独立子域名，主站**仅提供链接**，不得嵌入。
- **当前仓库无任何 Skills Hub 链接或子域名 URL**（`rg` 检索：仅文档提及「独立子域名」，无实际域名）。
- **本次不实施**（2026-11-24 用户确认）。子域名 URL 未定义，且该外链与本方案 SEO 目标无直接因果关系。**确认 URL 后另开任务**；届时在 `content.ts › siteMeta` 加 `skillsHubUrl` 字段、页脚加 `rel="noopener"` 外链即可。

---

## 9. 索引与提交

### 9.1 前置条件（先完成第 10 节 P1 再提交）

只有 `robots.txt`、`sitemap.xml`、canonical、JSON-LD 上线并验收通过后，才去提交索引，否则等于把不完整站点交给搜索引擎。

### 9.2 Google Search Console（GSC）

| 步骤 | 操作 | 说明 |
| --- | --- | --- |
| 1 | 选「网域」资源 `ecomcanopy.site` | 覆盖所有子域名，推荐 |
| 2 | DNS TXT 验证 | Cloudflare 添加 `google-site-verification=...` TXT 记录 |
| 3 | 灰云注意 | TXT 记录与 Proxy 状态无关，灰云即可正常验证；确认记录已生效（`dig TXT`） |
| 4 | 提交 sitemap | 属性 → Sitemap → 提交 `https://ecomcanopy.site/sitemap.xml` |
| 5 | URL 检查 | 依次「请求编入索引」3 个 URL |
| 6 | 观察 | 页面索引报告 + 效果报告 + 核心网页指标 |

### 9.3 Bing Webmaster Tools

| 步骤 | 操作 |
| --- | --- |
| 1 | 从 GSC 一键导入（推荐），或 DNS TXT 验证 |
| 2 | 提交 sitemap `https://ecomcanopy.site/sitemap.xml` |
| 3 | 提交 3 个 URL 的「URL 提交」 |

### 9.4 百度搜索资源平台

| 步骤 | 操作 |
| --- | --- |
| 1 | 注册并添加站点 `ecomcanopy.site` |
| 2 | 验证：HTML 文件验证（需发布 `public/baidu_verify_*.html`）或 CNAME/TXT |
| 3 | 提交 sitemap（百度支持 XML sitemap，路径同 `/sitemap.xml`） |
| 4 | 普通收录 + 手动推送（可选，用百度提供的 API，但需后端密钥，本站静态无后端，**本次不做主动推送**） |

**灰云 + 境外 VPS 对百度的注意（如实说明）：**

- Cloudflare 灰云 = 直接解析到 VPS 公网 IP，百度爬虫能直连，无 Cloudflare 拦截问题。
- 但站点托管在**境外 VPS** 且**无 ICP 备案**，百度对境外站点的抓取与收录通常更慢、排名竞争力可能受限。**不承诺百度收录效果**；若百度为重要渠道，后续需评估是否备案/使用国内托管，这超出本方案范围。

---

## 10. 实施计划

按「先文档确认 → 资产候选稿 → 代码 → 部署 → 提交 → 监控」拆解。**本规划稿本身是第 0 步，不修改任何代码。**

### 阶段 0：本方案确认（当前）

- 13 项待确认问题已于 2026-11-24 全部确认（结论见 §12.4）。
- 剩余动作：用户批准后进入阶段 1a。

### 阶段 1a：视觉资产候选稿（先验收，再接入）

`AGENTS.md` §5 要求视觉资产需人工验收。OG 图、logo、favicon 属于品牌视觉资产，先出候选稿：

| 资产 | 说明 | 验收 |
| --- | --- | --- |
| `og-home.jpg` / `og-cases.jpg` / `og-fulfillment-ai.jpg` | 1200×630 JPEG q88，本次用现有图裁切（§5.4，已确认） | 桌面/手机预览 + 平台分享预览（§11.9） |
| `logo-512.png` | 深色圆角底 + `TreeMark` 图标，仅图形不含文字，512×512（§6.2 用） | 60–112px 下仍可辨认 |
| `favicon.svg` | 由 `TreeMark` 简化导出，与 logo 同源 | 浏览器 tab 显示正常 |

用户确认候选稿后，才进入阶段 1b 接入。**未经确认不得直接接入。**

### 阶段 1b：代码阶段（开发执行者）

文件级改动清单（`必做`/`可选` 标记；全部在代码侧，不需管理员）：

| # | 文件 | 改动 | 优先级 |
| --- | --- | --- | --- |
| 1 | `src/layouts/BaseLayout.astro` | canonical 尾斜杠规范化（§3.1）；新增可选 props `ogImage`、`pageType`、`noCanonical`（3 个）；补 `og:image`/`og:image:width`/`og:image:height`/`og:image:alt`、`og:locale`、Twitter Card meta；按 `pageType` 切 `og:type`；按 `noCanonical` 跳过 canonical；加 favicon link | 必做 |
| 2 | `src/data/content.ts` | `navItems` 的 `href="/cases"`（`:30`）→ `/cases/` | 必做 |
| 3 | `src/pages/index.astro` | 传 `ogImage`/`pageType`；硬编码 `/cases` 改 `/cases/`（`:43`、`:224`） | 必做 |
| 4 | `src/pages/cases.astro` | 传 `ogImage`；硬编码 `/cases` 改 `/cases/`（`:107`） | 必做 |
| 5 | `src/pages/cases/[slug].astro` | title 的 `\n` 处理修正（`:24`）；传 `pageType="article"` + `ogImage`；硬编码 `/cases` 改 `/cases/`（`:32`、`:35`、`:220`、`:232`）；加 Article + Organization + WebPage + BreadcrumbList JSON-LD（§6.3，用 `is:inline`/`set:html` 原样输出） | 必做 |
| 6 | `src/components/CaseCard.astro` | 详情链接 `/cases/${slug}` → `/cases/${slug}/`；`:16` 的兜底分支 `"/cases"` 同时改 `"/cases/"`（`:16`、`:39`） | 必做 |
| 7 | `public/robots.txt` | 新增（含 AI 爬虫白名单 §7.5；`Sitemap:` 指向 sitemap.xml） | 必做 |
| 8 | `src/pages/sitemap.xml.ts` | 新增 Astro 端点，生成 3 个 URL；文章页带 `lastmod`，`/` 与 `/cases/` 省略（§3.2） | 必做 |
| 9 | `public/images/logo-512.png` + OG 图 + favicon | 阶段 1a 验收通过的资产接入 | 必做（接 1a 产物） |
| 10 | `/cases/` 加 `CollectionPage` | §6.5 | 不做（已确认） |
| 11 | `llms.txt` | §7.6 | P2，本次不做（已确认） |
| 12 | `src/pages/404.astro` | 新增 404 页面：`noindex`、无 canonical、提供返回首页与 `/cases/` 的链接（§11.10） | 必做 |

**不做：** 代码阶段不修改 `astro.config.mjs`、`package.json`、`pnpm-lock.yaml`、Caddyfile、`scripts/release.sh`、`.github/workflows/deploy.yml`。不新增依赖、不新增页面路由（`sitemap.xml.ts` 是数据端点，不是 HTML 页面；`404.astro` 不是新路由，产物为 `dist/404.html`）。

### 阶段 2：部署阶段（管理员）

- 静态产物部分（robots/sitemap/JSON-LD/OG/logo/favicon/`404.html`）随构建自动上线，`deploy` 用户即可完成，**不需要管理员**。
- **404 接线（已确认实施，§12.4 #6）**：在 Caddyfile 的 `ecomcanopy.site` 块加 `handle_errors`（指向 `/404.html`）。流程：先备份 Caddyfile → `caddy validate` → 通过后 `reload`；失败则恢复备份再 `reload`（`runbook.md` 第 3.3 节）。

### 阶段 3：提交阶段（用户，需登录对应平台）

- GSC、Bing、百度按第 9 节步骤提交。

### 阶段 4：监控阶段（用户/运营）

- 观察 2–4 周：收录、展现/点击、结构化数据增强功能、抓取统计、Core Web Vitals。
- 每轮记录数据，不承诺具体排名。

### 依赖与责任边界

| 事项 | 责任方 |
| --- | --- |
| 代码（robots/sitemap/JSON-LD/OG/logo/favicon/链接修正/404 页） | 开发执行者 |
| OG 图/logo/favicon 候选稿 | 设计/开发出稿，用户验收 |
| Caddyfile 404 接线（已确认实施） | 管理员 |
| DNS TXT/HTML 验证记录 | 用户（Cloudflare + 搜索引擎后台） |
| GSC/Bing/百度账号与提交 | 用户 |
| Skills Hub 子域名 URL | 用户（另开任务，已确认） |
| 是否放行 `Google-Extended`（AI 训练） | 已确认：不放行（§12.4 #4） |

---

## 11. 验收与测试

每条含可执行命令与通过标准。除线上步骤外，其余命令在仓库根目录执行。

### 11.1 构建 + dist 产物检查

```bash
pnpm build

test -f dist/index.html
test -f dist/cases/index.html
test -f dist/cases/fulfillment-ai/index.html
test -f dist/robots.txt
test -f dist/sitemap.xml
test -f dist/favicon.svg
test -f dist/404.html
ls dist/images/og-home.jpg dist/images/og-cases.jpg dist/images/og-fulfillment-ai.jpg
ls dist/images/logo-512.png

# 三页均应含 og:image、twitter:card（文件白名单，避免未来新增页面/404 打破计数）
for f in dist/index.html dist/cases/index.html dist/cases/fulfillment-ai/index.html; do
    grep -q 'property="og:image"' "$f" || { echo "missing og:image in $f"; exit 1; }
    grep -q 'name="twitter:card"' "$f" || { echo "missing twitter:card in $f"; exit 1; }
done

# JSON-LD：仅首页 + 文章页必有（/cases/ 本次不加 CollectionPage；若日后实施再把它加进本循环）
for f in dist/index.html dist/cases/fulfillment-ai/index.html; do
    grep -q 'application/ld+json' "$f" || { echo "missing JSON-LD in $f"; exit 1; }
done

# og:type 断言：文章页 article，首页/列表页 website（缺失或写错即失败）
grep -q '<meta property="og:type" content="article"' dist/cases/fulfillment-ai/index.html \
    || { echo "og:type not article in article page"; exit 1; }
grep -q '<meta property="og:type" content="website"' dist/index.html \
    || { echo "og:type not website in home page"; exit 1; }
grep -q '<meta property="og:type" content="website"' dist/cases/index.html \
    || { echo "og:type not website in cases page"; exit 1; }
echo "dist meta checks OK"
```

- 通过标准：退出码 0，上述文件齐全；三页均含 `og:image`、`twitter:card`；首页与文章页含 JSON-LD（`/cases/` 的 `CollectionPage` 可选）；`og:type` 为文章页 `article`、首页/列表页 `website`。
- 不运行 `pnpm check` 作为发布门禁（当前 TypeScript 7 阻塞，如实记录）。

### 11.2 robots.txt / sitemap 合法性

```bash
curl -fsS https://ecomcanopy.site/robots.txt -o /tmp/robots.txt
grep -q '^Sitemap:' /tmp/robots.txt || { echo "robots.txt missing Sitemap line"; exit 1; }
curl -fsS https://ecomcanopy.site/sitemap.xml -o /tmp/sitemap.xml

# XML 合法性前置检查（macOS 自带 /usr/bin/xmllint；部分 Linux 需安装 libxml2-utils）
# 缺失时明确失败，不能声称零依赖；node 校验只检查 3 个 loc，无法发现实体转义等 XML 错误
xmllint --noout /tmp/sitemap.xml || { echo "xmllint missing or failed（Linux 安装 libxml2-utils）"; exit 1; }

# sitemap 含 3 个 <url>、loc 均带尾斜杠（node 零依赖校验）
node -e '
const x = require("fs").readFileSync("/tmp/sitemap.xml", "utf8");
const locs = [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log(locs);
if (locs.length !== 3) throw new Error("expected 3 locs, got " + locs.length);
for (const l of locs) if (!l.endsWith("/")) throw new Error("loc missing trailing slash: " + l);
'

# 每个 loc 实际返回 200（部署后；非 200 即失败）
for u in $(grep -oE '<loc>[^<]+</loc>' /tmp/sitemap.xml | sed -E 's#</?loc>##g'); do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$u")
    echo "$code  $u"
    test "$code" = "200" || { echo "loc not 200: $u"; exit 1; }
done
```

- 通过标准：robots 200 且含 `Sitemap:` 行；`xmllint --noout` 无报错；sitemap 含 3 个 `loc`、都带尾斜杠、且每个 `loc` 返回 200。

### 11.3 响应头

```bash
curl -sSI https://ecomcanopy.site/
curl -sSI http://ecomcanopy.site/          # 预期 308 -> https
curl -sSI https://www.ecomcanopy.site/     # 预期 301 -> apex
curl -sSI https://ecomcanopy.site/cases    # 预期 308 -> /cases/
curl -sSI https://ecomcanopy.site/images/og-home.jpg
```

- 通过标准：HSTS、`X-Content-Type-Options: nosniff`、`Referrer-Policy`；HTML `Cache-Control: no-cache`；`/_astro/*` immutable；`/images/*` 7 天；OG 图 `Content-Type: image/jpeg` 且 200。

### 11.4 canonical 一致性

```bash
test "$(curl -sS https://ecomcanopy.site/ | grep -oE '<link rel="canonical" href="[^"]*"')" \
    = '<link rel="canonical" href="https://ecomcanopy.site/"' || { echo "canonical wrong for /"; exit 1; }
test "$(curl -sS https://ecomcanopy.site/cases/ | grep -oE '<link rel="canonical" href="[^"]*"')" \
    = '<link rel="canonical" href="https://ecomcanopy.site/cases/"' || { echo "canonical wrong for /cases/"; exit 1; }
test "$(curl -sS https://ecomcanopy.site/cases/fulfillment-ai/ | grep -oE '<link rel="canonical" href="[^"]*"')" \
    = '<link rel="canonical" href="https://ecomcanopy.site/cases/fulfillment-ai/"' || { echo "canonical wrong for /cases/fulfillment-ai/"; exit 1; }
```

- 通过标准：三个 `test` 断言全部成立（canonical 值与各自带尾斜杠的线上 URL 一致），任何缺失/错误即 `exit 1`。

### 11.5 站内链接尾斜杠扫描（构建产物 + 线上）

**构建产物静态检查（不发请求，先跑）：**

```bash
test -d dist || { echo "dist missing (run pnpm build first)"; exit 1; }

# 无尾斜杠的 /cases 链接必须 0 命中（命中或 rg 出错即失败）
rg -n 'href="/cases"' dist --glob '*.html'; rc=$?
if [ "$rc" -eq 0 ]; then echo "found bare /cases link (missing trailing slash)"; exit 1; fi
if [ "$rc" -eq 2 ]; then echo "rg failed (bad path or permission)"; exit 1; fi

rg -n 'href="/cases/fulfillment-ai"' dist --glob '*.html'; rc=$?
if [ "$rc" -eq 0 ]; then echo "found bare /cases/fulfillment-ai link (missing trailing slash)"; exit 1; fi
if [ "$rc" -eq 2 ]; then echo "rg failed (bad path or permission)"; exit 1; fi

echo "OK: no bare /cases or /cases/fulfillment-ai"
```

- 通过标准：`test -d dist` 通过；两条 `rg` 均返回 1（0 命中），`rc=0`（命中）或 `rc=2`（路径/权限出错）都会 `exit 1`；最终输出 `OK: no bare ...`。

**线上逐个 200 检查（部署后）：**

```bash
( set -euo pipefail
# 抽取 dist 中所有站内 href，去重后逐个 curl，非 200（即 3xx/4xx）即失败
# 用子 shell 包裹，失败时只结束本段，不会关掉交互式终端
rg -o 'href="/[^"]*"' dist --glob '*.html' \
    | sed -E 's/.*href="([^"]*)"/\1/' \
    | sort -u \
    | while read -r p; do
        code=$(curl -s -o /dev/null -w '%{http_code}' "https://ecomcanopy.site$p")
        echo "$code  $p"
        test "$code" = "200" || exit 1
      done
)
```

- 通过标准：所有站内 href 返回 200，无 308/301/404。

### 11.6 JSON-LD 解析与必填字段断言

```bash
node -e '
const fs = require("fs");
// 仅首页 + 文章页必有 JSON-LD；/cases/ 的 CollectionPage 可选（若实施，把 dist/cases/index.html 加回此数组）
const pages = ["dist/index.html", "dist/cases/fulfillment-ai/index.html"];
for (const file of pages) {
    const html = fs.readFileSync(file, "utf8");
    const raw = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
    if (!raw.length) throw new Error(file + ": no JSON-LD");
    const nodes = raw.flatMap(r => { const o = JSON.parse(r); return o["@graph"] || [o]; });
    const ids = new Map(nodes.filter(n => n["@id"]).map(n => [n["@id"], n]));
    for (const n of nodes) {
        const t = n["@type"];
        if (t === "Article") {
            for (const k of ["headline", "image", "datePublished", "author", "publisher", "mainEntityOfPage"]) {
                if (n[k] === undefined) throw new Error(file + " Article missing " + k);
            }
            const pid = n.publisher["@id"];
            if (!pid || !ids.has(pid) || !ids.get(pid).name) throw new Error(file + " Article publisher is dangling");
        }
        if (t === "Organization") {
            for (const k of ["name", "url", "logo"]) { if (!n[k]) throw new Error(file + " Organization missing " + k); }
        }
        if (t === "BreadcrumbList") {
            if (!Array.isArray(n.itemListElement) || n.itemListElement.length !== 3) throw new Error(file + " BreadcrumbList must have 3 items");
        }
    }
    console.log(file + " OK (" + nodes.length + " nodes)");
}
console.log("JSON-LD validation passed");
'
```

- 通过标准：首页与文章页 JSON-LD 均可 `JSON.parse`（若被构建转义、未用 `is:inline`，本步会失败，从而兜底发现），`Article` 必填字段齐全且 `publisher` 的 `@id` 在同页有定义，`Organization` 含 name/url/logo，`BreadcrumbList` 3 项。
- 人工复核：`validator.schema.org` 只贴首页与文章页两页 URL；`/cases/` 默认无结构化数据，显示「未检测到项目」属预期，不算错误。

### 11.7 GSC URL Inspection

- 对 3 个 URL 执行「网址检查」。
- 通过标准：显示「已编入索引」、抓取无 blocked、canonical 正确、结构化数据被读取。

### 11.8 移动端友好 + Core Web Vitals

- PageSpeed Insights 对首页/文章页各测一次（移动端）。
- 通过标准：移动端可用性通过；LCP/INP/CLS 达「良好」档（若 LCP 受字体 CDN 影响，记录并评估预加载，见第 12 节风险）。

### 11.9 OG 分享预览

- **OG 验收（真实依据）：**
  - `curl -sSI https://ecomcanopy.site/images/og-home.jpg`（200 + `image/jpeg`）
  - LinkedIn Post Inspector（`linkedin.com/post-inspector`）或飞书粘贴 URL 预览
- **微信单独人工确认，不作为 OG 验收依据**（微信不读取 OG/Twitter Card）。
- 通过标准：LinkedIn/飞书出图（1200×630）、标题、描述正确，中文不截断。

### 11.10 404（已确认实施，§12.4 #6）

```bash
( set -euo pipefail
code=$(curl -s -o /tmp/404.html -w '%{http_code}' https://ecomcanopy.site/this-page-does-not-exist)
echo "status=$code"
test "$code" = "404" || { echo "404 status wrong: $code"; exit 1; }
test -s /tmp/404.html || { echo "404 body is empty (Caddy default)"; exit 1; }
if grep -q 'rel="canonical"' /tmp/404.html; then
    echo "404 page must not have canonical"; exit 1
fi
)
```

- 通过标准：状态 404、响应体非空、无 canonical（或含 `noindex`）。

### 11.11 OG 图 / favicon 资产检查

```bash
# OG 图尺寸断言：每张必须 1200×630（缺失或尺寸错即失败）
for img in public/images/og-home.jpg public/images/og-cases.jpg public/images/og-fulfillment-ai.jpg; do
    sips -g pixelWidth "$img" | grep -q 'pixelWidth: 1200' || { echo "$img width wrong"; exit 1; }
    sips -g pixelHeight "$img" | grep -q 'pixelHeight: 630' || { echo "$img height wrong"; exit 1; }
done

# 体积断言：每张必须 < 300KB（307200 字节）
for img in public/images/og-*.jpg; do
    size=$(stat -f '%z' "$img")   # macOS；Linux 用 stat -c '%s'
    echo "$img: $size bytes"
    test "$size" -lt 307200 || { echo "$img over 300KB"; exit 1; }
done

# logo 尺寸断言：512×512（满足 ≥112×112、方形；Article 的 publisher.logo 需达标）
sips -g pixelWidth public/images/logo-512.png | grep -q 'pixelWidth: 512' || { echo "logo width wrong"; exit 1; }
sips -g pixelHeight public/images/logo-512.png | grep -q 'pixelHeight: 512' || { echo "logo height wrong"; exit 1; }

# favicon 上线后可用且 MIME 正确
curl -sSI https://ecomcanopy.site/favicon.svg | head -5
```

- 通过标准：三张 OG 图 1200×630、每张 <300KB（断言，非建议）；logo 512×512；favicon 返回 200 且 `image/svg+xml`。

---

## 12. 风险、回滚、待用户确认问题

### 12.1 风险与应对

| # | 风险 | 影响 | 概率/说明 | 应对 |
| --- | --- | --- | --- | --- |
| 1 | 无 ICP 备案 + 境外 VPS | 百度收录慢/竞争力弱 | 确定性存在 | 如实说明，不承诺百度效果；作为已知限制记录 |
| 2 | 字体走 loli.net CDN | LCP 可能受影响、爬虫额外 DNS | 低-中 | 保留（设计已确认）；若 CWV 不达标再评估 preload/自托管，不提前改 |
| 3 | 裁切版 OG 图没有品牌文字 | 分享预览认不出是谁 | 确定存在（已接受） | 后续替换为品牌图；替换后重新走 1a 验收 |
| 4 | sitemap `lastmod` 写错日期 | 误导爬虫 | 低 | 文章页用 `article.date`；`/`、`/cases/` 省略 `lastmod`（§3.2） |
| 5 | 放行 AI 爬虫白名单被误读为「必被引用」 | 期望落空 | 确定存在 | 文档第 7.5 节已声明边界 |
| 6 | 给不存在详情页的案例生成 ItemList | 结构化数据误导 | 中（若误实现） | 第 6.5 节明确禁止 |
| 7 | `pnpm check` 仍失败 | 类型检查缺失 | 确定存在 | 如实记录，不作为发布阻塞；发布前人工核对改动文件 |
| 8 | 改尾斜杠链接引入遗漏 | 部分链接仍 308 | 低 | §11.5 的 `rg` 静态扫描 + 线上逐个 200 检查兜底 |
| 9 | 404 接线改动 Caddyfile | 错误页异常或站点不可用 | 低（有备份 + `validate`） | 备份 → `validate` → `reload`；失败恢复备份（§12.2） |

### 12.2 回滚

- 本方案全部改动集中在**代码与静态资产**，回滚 = 回滚 git 提交 + 重新发布；或按 `runbook.md` 第 7.7 节从 `releases/<timestamp>` 回滚。
- Caddy 404 接线（若做）出错，恢复备份 Caddyfile 后 `validate` + `reload`（见 `runbook.md` 第 3.3 节）。
- 已提交给搜索引擎的 sitemap/URL 无需回滚，搜索引擎会自行重新抓取。

### 12.3 待用户确认问题（2026-11-24 已全部确认，结论见 §12.4）

> 下表为确认前的原始记录，保留用于追溯。**最终结论以 §12.4 为准**，与下表冲突时以 §12.4 为准。

| # | 问题 | 影响 | 是否阻塞 |
| --- | --- | --- | --- |
| 1 | 是否放行 `Google-Extended`（允许 Google 用于 AI 训练） | 隐私/版权口径 | **不阻塞**（默认可先不放行，仅放行搜索爬虫） |
| 2 | Skills Hub 子域名 URL（另开任务，本次不实施外链） | 页脚/首页外链 | **不阻塞本次**（确认前不实施） |
| 3 | 是否同时公开 GitHub / 社交账号用于 `sameAs` | 实体一致性增强 | 不阻塞（不确认则 JSON-LD 不写 `sameAs`） |
| 4 | OG 图/logo/favicon 候选稿是否复用 Ardot 品牌元素 | 视觉资产制作 | 不阻塞（阶段 1a 出稿后验收） |
| 5 | 404 页是否本次实施（需管理员改 Caddyfile） | 404 体验 | 不阻塞（默认不做，后置） |
| 6 | 百度是否为重点渠道（决定是否评估备案/国内托管） | 长期策略 | 不阻塞（本方案按现状处理） |
| 7 | `CONTEXT.md` 中「Demo Site / www 不可用」快照已过期，是否更新 | 文档准确性 | 不阻塞（建议随手更新） |
| 8 | RSS 本次不做（理由：无文章列表页支撑），是否接受 | 需求文档 §10.1 要求 RSS | **不阻塞**（偏离需求需用户确认） |
| 9 | 结果区数字（6 条/6 min/0 张/8 行业/90 天）是否已获你本人确认真实 | 数字是否进入正文/JSON-LD | 不阻塞（JSON-LD 已用不含数字的描述；正文保留数字待确认） |
| 10 | 新增数据端点 `/sitemap.xml`（非 HTML 页面，属数据端点）是否认可 | 与「不新增页面/路由」的口径 | **不阻塞**（认可后实施；见 `AGENTS.md` §3 需上报新增路由） |

### 12.4 确认记录（2026-11-24）

用户在逐条确认中作出以下决定，作为 v1.1 的实施依据。正文中与本节冲突的「可选/默认不做」措辞，以本节为准。

| # | 事项 | 用户决定 | 连带影响 |
| --- | --- | --- | --- |
| 1 | 新增 `/sitemap.xml` 数据端点 | **认可，实施** | 按 `AGENTS.md` §3 已上报新增路由（数据端点，非 HTML 页面） |
| 2 | RSS | **本次不做** | 偏离需求文档 §10.1，已获用户确认；后续文章增多再评估 |
| 3 | 结果区 5 个数字（6 条/6 min/0 张/8 行业/90 天） | **确认真实** | 正文保留；JSON-LD 仍不含数字（保守口径） |
| 4 | `Google-Extended` | **不放行** | robots.txt 改为显式 `Disallow: /`；同时修正 v1.0 中「默认可以先不放行」的错误说法 |
| 5 | `sameAs` | **写 `https://github.com/hzhihu`** | 已核实该主页返回 200、姓名栏为空，不暴露真实姓名 |
| 6 | 404 页 | **本次实施** | 新增 `404.astro`；`BaseLayout` 加 `noCanonical`；管理员改 Caddyfile（阶段 2） |
| 7 | `/cases/` 的 `CollectionPage` | **不加** | 验证脚本保持不变（`/cases/` 无 JSON-LD 属预期） |
| 8 | `llms.txt` | **不做** | P2 保留，等 P1 稳定后单独决定 |
| 9 | OG 图 | **现有图裁切，JPEG q88** | 无损 PNG 为 888–1015 KB，超出 300 KB 上限，改用 JPEG（144–158 KB）；`og-home` 与 `og-cases` 用同一张图（已确认接受） |
| 10 | logo / favicon | **沿用站内 `TreeMark`**；logo 仅图形、favicon 用深色圆角底 | 与页面视觉一致；44px 时文字已看不清，故 logo 不放文字 |
| 11 | `CONTEXT.md` 过期快照 | **更新** | 已同步「Caddy 现状」「当前缺口」「尚未完成」「待用户确认」四处部署状态 |
| 12 | 百度渠道定位 | **非重点渠道** | 按现状实施，不评估 ICP 备案与国内托管 |
| 13 | Skills Hub 子域名链接 | **另开任务** | 本次不加外链；确认 URL 后单独实施 |

---

## 附录 A：关键文件依据索引

> 采用「符号名（file:line）」格式；行号以仓库 HEAD `e3da9b1` 为准，改代码后需重新 `rg -n` 复核。

| 结论 | 依据 |
| --- | --- |
| `<html lang>` | `src/layouts/BaseLayout.astro › html lang（:20）` |
| canonical 生成方式 | `src/layouts/BaseLayout.astro › canonicalUrl（:15,26）` |
| 站点域名 | `astro.config.mjs › site（:5）` |
| 导航含无斜杠 `/cases` | `src/data/content.ts › navItems（:30）` |
| 详情链接无斜杠 | `src/components/CaseCard.astro（:16,39）` |
| 仅 1 篇文章有 slug | `src/data/content.ts › featuredCase / article（:163,218）` |
| 其余案例无 slug | `src/data/content.ts › caseStudies（:176-206）` |
| FAQ | `src/data/content.ts › faqs（:140-153）` |
| 案例统计数字 | `src/data/content.ts › caseStats（:155-160）` |
| 引用金句 | `src/data/content.ts › sections[].quote（:247-250）` |
| 作者/日期/阅读时长 | `src/data/content.ts › article（:228-230）` |
| 结果区与免责声明 | `src/data/content.ts › results / resultNote（:280-297）` |
| 首页 title/description/H1 | `src/pages/index.astro（:18-19,34）` |
| 案例页 title/description/H1 | `src/pages/cases.astro（:15-16,28）` |
| 文章页 title/description | `src/pages/cases/[slug].astro（:24-25）` |
| 文章页面包屑可见末项 | `src/pages/cases/[slug].astro（:33）` |
| SEO 未实现项 | `ARCHITECTURE.md` 第 7 节 |
| 缓存头与 404/Caddy | `docs/deployment/vps-grey-cloud-plan.md` 第 5.3 节 |
| 回滚流程 | `docs/deployment/runbook.md` 第 7.7 节 |

---

## 附录 B：本次任务边界（规划执行者声明）

- 本任务**仅产出本文档**，未修改任何代码、配置、页面或 `public/` 文件。
- 未运行 `pnpm build`（避免写 `dist/`）；线上核验全部为只读 `curl`。
- 所有现状判断均有源码或线上实测依据；未把未实现项写成已实现。
