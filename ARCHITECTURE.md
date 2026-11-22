# ARCHITECTURE.md —— 技术架构

状态：**Phase 2 已实现并通过视觉验收；生产部署未开始**
最后核对：2026-11-22
视觉与内容基准：Ardot 文件 `749492056765475`
约束优先级：`docs/decisions.md` → `docs/requirements/*` → 其他文档

本文描述当前仓库的实际实现，并单独标注尚未实施的部署计划。

---

## 1. 架构目标

EcomCanopy V1.0 是纯静态内容站：

- 无数据库、无用户系统、无后端接口、无 CMS。
- 构建期生成全部 HTML，运行期只分发静态文件。
- 当前只实现 Ardot 已设计的 3 个页面，不扩展旧需求中的未设计路由。
- 桌面端与手机端共用同一套 Astro 页面与 CSS，图片可按断点切换资源。

---

## 2. 当前技术栈

| 技术 | 当前用途 | 状态 |
| --- | --- | --- |
| Astro `^7.4.13` | 静态站点生成 | 已实现 |
| TypeScript `^7.0.2` | 严格模式类型声明 | 已实现；`astro check` 暂不兼容 |
| Tailwind CSS v4 | 样式入口与构建插件 | 已实现 |
| 原生 CSS Variables | 颜色、字体、间距等设计 Token | 已实现 |
| `src/data/content.ts` | 页面文案、案例、笔记与文章数据 | 已实现 |
| 本地 Astro 组件 | 页头、页脚、卡片、图标等 | 已实现 |
| `lucide-astro` | 依赖已安装 | 当前页面图标仍以本地 SVG 组件为主 |
| LoliNet 字体 CDN | 中英文字体加载 | 已实现 |
| pnpm | 依赖管理与脚本 | 已实现 |
| Nginx + Docker + Cloudflare Tunnel | 生产部署 | 计划中，尚未实现 |

当前未使用：

- Astro Content Collections。
- MDX。
- Sitemap、robots.txt 与 RSS。
- Sass。
- 前端框架运行时或状态管理。

---

## 3. 页面与路由

| 路由 | 源文件 | 当前状态 |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | 已实现 |
| `/cases/` | `src/pages/cases.astro` | 已实现 |
| `/cases/fulfillment-ai/` | `src/pages/cases/[slug].astro` | 已实现，当前仅生成 1 篇文章 |

构建结果固定为 3 个静态页面。旧需求中的 `/cross-border-ai`、`/ai-agents`、`/services`、`/fde`、`/projects`、`/insights`、`/about`、`/contact` 与 `404` 当前均未实现。

### 导航

主导航与页脚导航共用 `src/data/content.ts` 中的 4 项配置：

1. 能力：`/#capability`
2. 交付物：`/#deliverables`
3. 合作方式：`/#engagement`
4. 案例与笔记：`/cases`

桌面端为平铺导航。手机端使用原生 `<details>` / `<summary>` 面板，不依赖客户端 JavaScript。首页、案例页与文章页使用不同的菜单图标变体。

---

## 4. 布局与页面组成

### 公共布局

`src/layouts/BaseLayout.astro` 负责：

- 设置 `lang="zh-CN"`、viewport、页面标题、描述与 canonical。
- 输出基础 Open Graph 元信息。
- 引入 LoliNet 字体与 `src/styles/global.css`。
- 按顺序渲染刊头、页头、主内容与页脚。

页脚通过 `variant` 区分 `home`、`cases`、`article` 三种结构；页头菜单图标也按页面类型切换。

### 首页

首页由以下区块组成：

1. 首屏与服务范围。
2. 业务关键词 Ticker。
3. 能力。
4. 交付物。
5. 信任与合作、合作方式、FAQ 与 CTA。

### 案例与笔记

案例页由页头、数据概览、筛选展示、精选案例、案例卡片、现场笔记、联系区与页脚组成。

### 文章详情

文章页由面包屑、文章头、封面、正文、目录、侧栏、结果区、上一篇/下一篇、相关阅读与页脚组成。

唯一的客户端脚本用于“复制文章链接”按钮。复制失败时只更新按钮文案，不影响页面其他功能。

---

## 5. 内容模型

当前内容全部位于 `src/data/content.ts`，通过 TypeScript 数据结构直接导入页面，不经过内容集合或远程 CMS。

### 案例

```ts
type CaseStudy = {
    slug?: string;
    code: string;
    category: string;
    title: string;
    summary: string;
    meta: string;
    image: string;
    imageMobile?: string;
    imageAlt: string;
    tags?: string[];
};
```

当前只有精选案例 `fulfillment-ai` 带 `slug`，因此只有它能进入详情页。其余案例卡片链接回 `/cases`。

### 笔记

```ts
type Note = {
    number: string;
    title: string;
    category: string;
    date: string;
};
```

### 文章

文章是单个对象，包含：

- 元信息：`slug`、`eyebrow`、`fieldNote`、`title`、`subtitle`、`intro`、`introMobile`。
- 署名：`author`、`date`、`readTime`、`category`。
- 媒体：`cover`、`coverMobile`、`coverAlt`、`coverCaption`。
- 正文：`lead`、`sections`。
- 结果：`results`、`resultNote`。
- 阅读链路：`previous`、`next`、`related`。

`getCaseBySlug` 只用于按 slug 查找案例；当前文章路由通过 `getStaticPaths` 生成单一静态路径。

---

## 6. 样式与设计 Token

`src/styles/global.css` 是唯一全局样式入口：

- 使用 `@import "tailwindcss"`。
- 通过 `:root` CSS Variables 定义背景、文字、深色块、分隔线、强调色与字体。
- 页面样式以语义化 class 组织，不使用 Sass。

当前字体来源：

- `Instrument Serif`：品牌与展示型英文。
- `JetBrains Mono`：眉标、编号、元信息与等宽内容。
- `Noto Sans SC`：中文正文与界面文字。
- `Noto Serif SC`：中文展示标题。

字体通过 `fonts.loli.net` 与 `gstatic.loli.net` 加载，并配置了 `preconnect`。

响应式断点为 `1200px`、`960px` 与 `640px`。视觉验收基准为桌面端 `1440px` 与手机端 `390px`。

图片使用原生 `<picture>`：桌面端加载默认资源，手机端在 `640px` 以下切换 `imageMobile` 资源。

---

## 7. SEO 与可访问性

当前已实现：

- 每页独立 `<title>` 与 description。
- canonical URL，基于 `astro.config.mjs` 中的站点域名。
- 基础 Open Graph：标题、描述、URL 与站点名。
- 正确的 `lang`、viewport、图片替代文本与标题层级。
- 正文封面使用 eager 加载，其余非首屏图片使用 lazy 加载。
- 手机导航使用原生可访问的 details/summary。

当前未实现：

- Sitemap 与 robots.txt。
- RSS。
- JSON-LD 或其他结构化数据。
- 独立 OG 图片。
- 404 页面。

---

## 8. 构建与验证

```bash
pnpm build
pnpm check
```

当前结果：

- `pnpm build`：通过，生成 3 个静态路由到 `dist/`。
- `pnpm check`：失败。Astro check 当前不支持 TypeScript 7，需要 TypeScript 6；该问题不影响构建。

视觉验收：

- 6 张截图位于 `docs/design/qa/`。
- 桌面端为 1440px，手机端为 390px。
- 页面高度与 Ardot 画板完全一致，详细记录见 `docs/design/qa/design-parity-audit.md` 第 10 节。

---

## 9. 部署计划

以下链路尚未落地，属于后续阶段：

```text
访客
 └─ Cloudflare DNS (ecomcanopy.site)
     └─ Cloudflare Tunnel
         └─ NAS
             └─ Docker
                 └─ Nginx + Astro 静态文件
```

生产部署仍需补充：

- `Dockerfile`。
- `docker-compose.yml`。
- Nginx 配置。
- 健康检查、日志、版本标签与回滚流程。
- Cloudflare Tunnel 的 hostname 规则与 HTTPS 验证。

Skills Hub 使用独立仓库、独立容器与独立子域名，不包含在本仓库的页面实现中。

---

## 10. 目录结构

```text
.
├── docs/                       项目文档，不进入部署产物
├── public/images/              页面图片资源
├── src/
│   ├── components/             公共组件与本地 SVG 图标
│   ├── data/content.ts         页面内容与数据结构
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── cases.astro
│   │   └── cases/[slug].astro
│   └── styles/global.css
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

---

## 11. 当前限制

- 只有 3 个已设计页面，没有旧需求中的其余业务页面。
- 只有 1 篇可访问的文章详情。
- 内容写死在 TypeScript 文件中，新增文章或案例需要修改代码并重新构建。
- 类型检查被 TypeScript 7 兼容性阻塞。
- 暂无自动化测试与生产部署配置。
- 站点尚未上线，不得对外宣称已有生产流量或客户成果。

---

## 12. 约束来源

- 冻结决策：`docs/decisions.md`
- 当前进展：`CONTEXT.md`
- 历史需求基线：`docs/requirements/website-plan-v1.2.md`
- 视觉一致性审计：`docs/design/qa/design-parity-audit.md`
- Ardot 导出记录：`docs/design/ardot-shots/README.md`
