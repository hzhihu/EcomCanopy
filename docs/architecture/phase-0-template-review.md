# Phase 0：模板调研报告

日期：2026-11-16
状态：**待人工确认**（未选择模板，未修改任何代码）

调研对象：

- `ricocc/public-portfolio-site`
- `ricocc/ricoui-astro-starter`

参考站点：`https://ricoui.com`

---

## 1. 结论摘要

| 项 | 结论 |
| --- | --- |
| 两个模板都能用 | 均可安装并构建通过（实测，见第 2 节） |
| 都不匹配品牌调性 | 一个是「设计师作品集」，一个是「设计 starter」自述页，都不是技术顾问/工作室气质 |
| 真正可复用的部分 | 布局骨架、SEO 头、内容集合、组件原语；**视觉层 Phase 1 仍需重做** |
| 推荐 | **方案 B：ricoui-astro-starter 改造**，但需你批准引入 Tailwind v4 |
| 备选 | 方案 A：public-portfolio-site 改造（纯 SCSS，但装饰负担重） |
| 兜底 | 方案 C：最小自建（不引入任何模板包袱） |

---

## 2. 调研方法

1. 克隆两个仓库到临时目录（浅克隆，`--depth 1`）。
2. 统计文件、代码行数、依赖、内容结构。
3. **实际执行 `pnpm install` 与 `pnpm build`**，验证能否构建。
4. 逐项对照冻结决策（`docs/decisions.md`）与需求方案（V1.2 第 9、10 章）。

构建结果：

| 模板 | 安装 | 构建 | 产出 | 耗时 | 环境 |
| --- | --- | --- | --- | --- | --- |
| public-portfolio-site | 成功 | 成功（含 `astro check`） | 11 页 + sitemap | 约 2.7s | Node 24.12 / pnpm 12.9 |
| ricoui-astro-starter | 成功 | 成功（含 `astro check`） | 9 页 + sitemap + rss | 约 1.2s | 同上 |

两个模板的已知问题：`pnpm install` 会提示忽略 `sharp` / `esbuild` 的构建脚本，需 `pnpm approve-builds` 放行（本地 dev 不受影响，Docker 构建需注意）。

---

## 3. 技术栈对比

| 项 | public-portfolio-site | ricoui-astro-starter |
| --- | --- | --- |
| Astro | 6.4.4（锁定） | ^7.1.5 |
| 样式 | Sass（SCSS）+ CSS 变量 | Tailwind CSS v4 + CSS 变量 |
| TypeScript | 5.6 | 5.4 |
| 图标 | 自建 `IconPaths.ts` + 内联 SVG | `@lucide/astro` ✅（决策要求 Lucide） |
| 内容 | Content Collections（仅 blog） | Content Collections（仅 post） |
| MDX | ✅ | ✅ |
| RSS | ✅ | ✅ |
| Sitemap | ✅ | ✅ |
| 图片优化 | sharp（构建期转 WebP）✅ | sharp ✅ |
| 代码检查 | `astro check` | `astro check` + Biome |
| 运行时依赖 | 无（无框架运行时） | 无 |
| Node 要求 | 未声明 | ≥ 22.12，pnpm ≥ 9 |
| 许可证 | MIT | MIT |
| 最近提交 | 2026-06-07 | 2026-07-29 |
| 维护者 | Ricocc（同一作者） | 同左 |

**关键差异：** starter 的依赖更现代（Astro 7、Lucide、Biome、Tailwind v4），但对 Node 版本要求更高；PPS 的 Astro 6 更保守，样式方案是纯 SCSS，完全贴合 V1.2 第 9.1 节的选型。

---

## 4. 目录结构对比

### public-portfolio-site（161 个文件，其中约 82 个图片资源）

```
src/
├── components/        约 20 个 .astro（2739 行）
│   ├── Nav / NavMobile / Footer / ThemeToggle / Search / Wechat
│   ├── Cards / ProjectList / PostPreview / Filter
│   ├── MainHead（SEO）
│   └── Icon + IconPaths.ts
├── data/
│   ├── content.ts     导航、页脚、各页 SEO TDK（写死在代码里）
│   ├── project.ts     项目数据（**硬编码 TypeScript 数组**）
│   └── home.json      首页卡片内容
├── content/blog/      文章（Content Collections）
├── layouts/           BaseLayout / BlogPostLayout / DetailPostLayout
├── pages/             index / about / blog / project / rss / 404
│   └── detail/        **3 个手写项目详情页**（.astro，非集合驱动）
└── styles/            global.scss 1040 行 + layout.scss 676 行
public/plugins/effects/ GSAP + imageTrail + shuffle.js（装饰性动画）
```

### ricoui-astro-starter（87 个文件）

```
src/
├── components/        约 22 个 .astro（2772 行，Tailwind 类名密集）
│   ├── sections/      Header / Footer / BlogSection
│   ├── elements/      PageHeader / SectionHeader / SeparatorLine
│   ├── ui/            Button / Badge / Logo / AccordionItem / BrowserFrame / TopBg
│   └── widgets/       Meta / Toc / Pagination / OptimizedImage / ActionBar / ToTop / TrackGa
├── config/
│   ├── site.js        站点元信息（title/description/OG/social）
│   └── themes.js      **918 行，10 套主题 × 明暗两套 Token**
├── content/post/      文章（3 篇示例）
├── layouts/           Layout / Meta / PageLayout / PostLayout
├── pages/             index（模板自述营销页）/ blog（含分页）/ design / elements / 404 / rss
└── styles/            global.css 344 + themes.css 575 + article.css 529 + article-enhancements.css 360
docs/DESIGN.md + docs/DESIGN/*.md（10 套主题设计说明）
```

---

## 5. 逐项能力评估

评分说明：✅ 可直接用 / 🟡 需改造 / ❌ 缺失需新建

| 需求项 | public-portfolio-site | ricoui-astro-starter |
| --- | --- | --- |
| 组件复用能力 | 🟡 组件偏「作品集展示」，与业务页无关比重高 | 🟡 有通用原语（Button/Badge/SectionHeader/Pagination/Toc），但首页是营销自述 |
| 响应式实现 | 🟡 SCSS 断点分散且不一致（576/767/811/1023/1280/1440 混用） | 🟡 主用 Tailwind 断点，另有 6 处手写媒体查询，混用两种体系 |
| SEO | ❌ `MainHead` 缺 canonical / og:title / og:image / twitter card；`viewport` 带 `user-scalable=no`（可访问性问题） | 🟡 `widgets/Meta.astro` 已有 canonical + OG + Twitter；无 JSON-LD；og:type 固定 `website` |
| 主题与样式组织 | 🟡 SCSS + CSS 变量，符合选型；但内置全站深色主题、装饰性中文字体（汇文明朝体） | ✅ 10 套主题 × 明暗双套 Token，是最接近「Design Tokens」体系的资产；但主题切换器与全站深色需关闭 |
| 内容管理 | 🟡 仅 blog 用集合；**项目数据硬编码在 TS 里**，详情页手写 | 🟡 仅 post 集合；**无项目集合** |
| 依赖与维护 | ✅ 依赖少、无框架运行时、MIT | ✅ 依赖新、Biome 规范、MIT；但 Astro 7 较新，生态资料少 |
| 二次开发成本 | 🟡 需拆除装饰（GSAP/字体/主题切换/赞赏码），并重建项目系统 | 🟡 需删除自述页内容、裁剪主题体系、重建项目系统 |
| 与「浅色为主 + 深色局部块」 | ❌ 默认带主题切换与全站深色 | 🟡 Token 双套，裁剪为单套浅色 + 少量深色块成本低 |
| 与「不做全站深色」 | 冲突 | 冲突（有切换器，需关闭 `showThemeSwitcher`） |
| 中文/字体 | 🟡 引入汇文明朝体 + 思源黑体，需评估子集化与版权 | ✅ 未绑定中文字体，系统字体栈起步 |
| 业务页面覆盖（11 个路由） | ❌ 只覆盖首页/关于/项目/博客 | ❌ 只覆盖首页/博客/404 |

---

## 6. 与冻结决策的匹配度

| 决策 | PPS | starter |
| --- | --- | --- |
| 1 文字型 logo | 🟡 需替换 Logo 组件 | ✅ 有 `ui/Logo.astro` 可换文字字标 |
| 2 About 用能力叙事 | 🟡 现成 About 是设计师简历结构，需重写 | ❌ 无 About 页 |
| 3 邮箱/域名 | ✅ 环境变量配置 | ✅ 环境变量配置 |
| 4 项目真实性（类型+状态字段） | ❌ 数据模型无 `projectType/projectStatus` | ❌ 无项目集合 |
| 5 Skills Hub 外链 | ✅ 外链即可 | ✅ 外链即可 |
| 6 浅色为主、无 i18n、无全站深色 | ❌ 有全站深色 + 切换器 | 🟡 有切换器需关闭 |
| 7 内容工作流 | ✅ MDX | ✅ MDX |
| 8 一次性 v1.0 | 中性 | 中性 |
| 9 截图验收 | 中性 | 中立 |
| 10 治理约束 | 中性 | 中性 |

---

## 7. 风险清单

| 风险 | 影响 | 出现概率 | 应对 |
| --- | --- | --- | --- |
| 选 starter 引入 Tailwind v4（V1.2 第 9.1 节写的是 Sass/CSS Variables） | 技术栈偏离，需你书面同意 | 确定发生 | 列为决策修订项，二选一：接受 Tailwind，或改选方案 A |
| Astro 7 生态较新，第三方集成资料少 | 遇到问题查资料慢 | 中 | 本项目只用官方集成（mdx/sitemap/rss），风险可控 |
| PPS 装饰性特效与「避免装饰性光效」冲突 | 视觉返工 | 确定发生 | 需大幅拆除，拆除后剩余价值下降 |
| 两模板均无项目集合与业务页 | 约 7 个页面从零写 | 确定发生 | 已计入工作量估算 |
| 主题体系（918 行 + 10 套主题）过度 | 裁剪耗时、易残留 | 中 | 只保留 1 套浅色 Token，其余删除 |
| 中文装饰字体版权与体积 | 首屏性能、法律 | 中（PPS） | 改用系统字体栈或子集化 |
| 模板作者单人维护 | 长期停更 | 中 | 项目本身不依赖模板后续更新，克隆后自主维护 |

---

## 8. 三个方案

### 方案 A：public-portfolio-site 改造

- 保留：Astro 6 + SCSS 架构、Content Collections、图片优化、RSS/Sitemap。
- 拆除：GSAP / imageTrail / shuffle、汇文明朝体、全站深色主题、赞赏码、微信群组件、GitHub stars。
- 重建：项目集合（替换 `data/project.ts` 与手写详情页）、7 个业务页、SEO 头、导航。
- 优点：技术栈与 V1.2 第 9.1 节完全一致；无 Tailwind。
- 缺点：拆除量大，剩余骨架与业务相似度低；视觉调性是「设计师作品集」，与「技术专家 + 工作室」有距离。

### 方案 B：ricoui-astro-starter 改造（推荐）

- 保留：Layout / Meta（含 canonical 与 OG）/ Header / Footer / Button / Badge / SectionHeader / Pagination / Toc / OptimizedImage；`@lucide/astro`；DESIGN.md 工作流。
- 拆除：首页自述营销内容、`design.astro` / `elements.astro` 示例页、10 套主题只留 1 套、主题切换器与全站深色。
- 重建：项目集合（`projects` collection + 列表/详情）、7 个业务页、导航扩展、JSON-LD。
- 优点：设计 Token 体系最接近 Phase 1 交付要求；组件更通用；图标库已是决策指定的 Lucide；无中文装饰字体与动画包袱。
- 缺点：**引入 Tailwind v4**（需你批准）；Astro 7 较新；首页要从零设计（本来就是营销页）。

### 方案 C：最小自建

- 只取 Astro + MDX + sitemap + rss + sharp + Sass + Lucide，自建 Layout 与 8 个组件。
- 优点：无历史包袱，结构完全按需求定制，`docs/` 与代码一次成型。
- 缺点：Phase 1 之前没有现成视觉参考；估算多花 1.5～2 个工作日。

---

## 9. 工作量估算（Phase 2–4 相对增量）

| 方案 | 拆除工作 | 新建工作 | 相对增量 |
| --- | --- | --- | --- |
| A | 高（特效、字体、主题） | 中（项目系统、7 页、SEO） | 基准 |
| B | 中（主题裁剪、首页重写） | 中（项目系统、7 页、JSON-LD） | -0.5 天 |
| C | 无 | 高（骨架 + 全部页面） | +1.5～2 天 |

---

## 10. 推荐结论

**推荐方案 B（ricoui-astro-starter）**，理由按权重排序：

1. 自带完整 Design Token 体系（明暗双套、10 套主题可裁剪），直接服务 Phase 1「设计规范 + Tokens」交付。
2. 组件库更通用，业务页可直接组合，而不是先删除作品集专用组件。
3. 已内置 `@lucide/astro`，符合 V1.2 第 9.1 节。
4. 无中文装饰字体、无 GSAP 类动画，天然靠近「避免装饰性光效」。
5. SEO 头基础更好（canonical + OG + Twitter）。

**但必须由你确认一个偏离项：引入 Tailwind CSS v4。** V1.2 第 9.1 节写的是 Sass / CSS Variables。二者可以共存（Tailwind v4 本身基于 CSS 变量），但属于技术栈变更，按决策第 10 条必须上报，不能自行决定。

若你不接受 Tailwind，则推荐方案 A。

---

## 11. 待你决策

1. 选 A / B / C？
2. 若选 B：是否批准引入 Tailwind v4（同时保留 CSS 变量作为设计 Token）？
3. 代码根目录用 `website/`（V1.2 第 15 节建议）还是直接放仓库根？
4. 是否删除模板自带的深色模式与主题切换器（决策 6 要求无全站深色）？
5. 是否保留模板的 MIT LICENSE 与作者版权声明？
