# ARCHITECTURE.md —— 技术架构

状态：**草案**。Phase 0 模板调研完成后更新为「已确定」。

---

## 1. 架构目标

内容型静态站点：无数据库、无用户系统、无服务端业务逻辑。
构建期生成全部页面，运行期只做静态文件分发。

---

## 2. 访问链路

```
访客
 └─ Cloudflare DNS (ecomcanopy.site)
     └─ Cloudflare Tunnel（出站连接，不需要公网 IP）
         └─ NAS
             └─ Docker
                 ├─ 容器 A：nginx + 主站静态文件      → ecomcanopy.site
                 └─ 容器 B：Skills Hub（独立仓库）    → skills.ecomcanopy.site
```

主站与 Skills Hub 在 Tunnel 中是两条独立的 hostname 规则，互不影响。

---

## 3. 技术栈

| 技术 | 用途 | 状态 |
| --- | --- | --- |
| Astro | 站点框架，SSG | 已定 |
| TypeScript | 类型安全 | 已定 |
| Sass / CSS Variables | 样式与 Design Tokens | 已定 |
| Astro Content Collections | 项目与文章内容管理 | 已定 |
| MDX | 富文本内容 | 已定 |
| Lucide | 图标 | 已定 |
| pnpm | 包管理 | 已定 |
| Nginx | 静态文件服务 | 已定 |
| Docker / Docker Compose | 容器化 | 已定 |
| Cloudflare Tunnel | 公网访问 | 已定 |
| 起始模板 | 待 Phase 0 审查确定 | **待定** |

不引入：React/Vue 运行时（除非模板自带且不可移除）、CSS 框架、组件库、i18n 方案、状态管理。

---

## 4. 路由

| 路由 | 页面 | 上线要求 |
| --- | --- | --- |
| `/` | 首页 | 必须 |
| `/cross-border-ai` | 跨境 AI | 必须 |
| `/ai-agents` | AI Agent | 必须 |
| `/services` | 技术服务 | 必须 |
| `/fde` | FDE 服务 | 必须 |
| `/projects` | 项目列表 | 必须 |
| `/projects/[slug]` | 项目详情 | 建议 |
| `/insights` | 技术文章列表 | 建议 |
| `/insights/[slug]` | 文章详情 | 建议 |
| `/about` | 关于我 | 必须 |
| `/contact` | 联系我 | 必须 |
| `/404` | 错误页 | 必须 |

导航入口待定：README 5.1 的导航只有 7 项，未包含 `/ai-agents` 与 `/fde`，需在 Phase 1 确定入口方式（二期菜单、页面内锚点或合并）。

---

## 5. 内容模型

### projects

```
title, slug, summary
projectType        commercial | engineering-practice | personal | ai-experiment | poc | product-exploration
businessScenario
aiCapabilities      string[]
engineeringCapabilities string[]
role
projectStatus      idea | research | design | prototype | development | production
cover, visibility, publishedAt
```

当前实际取值（冻结）：

| 项目 | projectType | projectStatus |
| --- | --- | --- |
| AI Skills Hub | personal | development |
| AI 差评洞察 | product-exploration | research |
| AI Listing 体检 | product-exploration | research |

### insights

```
title, slug, summary, publishedAt, tags, cover, draft
```

---

## 6. 构建与部署

```
本地或 CI：pnpm build → dist/
   ↓
镜像构建：Dockerfile（nginx:alpine + dist）
   ↓
NAS：docker compose up -d
   ↓
Cloudflare Tunnel 映射域名
```

要求：版本化镜像 tag、支持回滚、健康检查、日志可查、容器最小权限、不暴露管理端口。

构建发生在本地、CI 还是 NAS，Phase 5 决定。

---

## 7. 性能与 SEO 基线

- 首屏不加载中文字体文件时使用系统字体栈；引入字体必须做子集化。
- 图片优先 WebP/AVIF，标注宽高，非首屏懒加载。
- 每页独立 title / description / canonical / OG。
- Sitemap、robots.txt、RSS（文章）。
- 目标：移动端 Lighthouse 性能 ≥ 90。

---

## 8. 待定项（Phase 0 之后填写）

- [ ] 起始模板与代码根目录命名
- [ ] 目录结构（是否沿用模板）
- [ ] 样式组织方式（全局 CSS 变量 vs SCSS 模块）
- [ ] Skills Hub 仓库地址、端口、构建方式
- [ ] 是否需要 404 自定义插画与 OG 图生成方案
- [ ] CI 是否使用 GitHub Actions
