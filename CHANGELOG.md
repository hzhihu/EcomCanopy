# CHANGELOG

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 结构，版本号遵循语义化版本。

## [Unreleased]

### Added

- 初始化 Git 仓库，远端 `git@github.com:hzhihu/EcomCanopy.git`，主分支 `main`。
- 添加 `.gitignore`（Node / Astro / 编辑器 / 环境变量）。
- 项目文档骨架：`README.md`、`AGENTS.md`、`ARCHITECTURE.md`、`CONTEXT.md`、`CHANGELOG.md`、`docs/decisions.md`。
- 冻结关键决策与修订记录（品牌、定位、域名邮箱、项目真实性、Skills Hub 独立性、视觉方向、内容工作流、发布策略、视觉验收、智能体治理）。
- 确定三个 AI 项目的类型与状态：AI Skills Hub = Development，AI 差评洞察 = Research，AI Listing 体检 = Research。
- 确定联系方式：`hzhihu@ecomcanopy.site`（主）、`business@ecomcanopy.site`（商务）。
- 确定 Skills Hub 以独立仓库、独立容器、`skills.ecomcanopy.site` 子域部署，主站仅外链。
- 初始化 Astro 工程与 3 个 V1.0 页面：首页、案例与笔记、文章详情。
- 将 Ardot 6 张画板对应的图片、图标与文案落到 `public/`、`src/components/` 与 `src/data/content.ts`。
- 补充 Ardot 手机端独立图片资源，覆盖能力、交付物、文章内文与相关阅读。
- 新增 Ardot 画板导出记录，存放于 `docs/design/ardot-shots/`。
- 新增桌面端与手机端视觉验收截图，存放于 `docs/design/qa/`。

### Changed

- 需求文档 `README.md` 迁移至 `docs/requirements/website-plan-v1.2.md`，`README.md` 改为项目概览与文档索引。
- 新增 `docs/decisions.md` 第 11 节修订记录：起始模板选定 `ricoui-astro-starter`（方案 B）；样式方案由 Sass / CSS Variables 修订为 Tailwind CSS v4 + CSS Variables（用户授权）。
- 确定代码根目录为仓库根（不使用 `website/`）；不提供全站深色模式入口，深色仅用于局部区块；决定保留模板 MIT LICENSE 与版权声明，但当前仓库缺少 `LICENSE` 文件，待补回或确认。
- 2026-11-22：按用户授权变更方向，Ardot 设计稿成为 V1.0 视觉与内容唯一基准；导航、内容与页面范围以设计稿为准，先完成设计验收再进入代码开发。
- 2026-11-22：记录 Ardot 现有 6 张画板：首页、案例与笔记、文章详情，各含桌面端与手机端。
- 2026-11-22：Phase 2 实现完成，`pnpm build` 通过；桌面端与手机端按设计稿完成视觉比对。
- 2026-11-22：用户确认「页面通过」，Phase 2 的 3 个页面桌面端与手机端视觉验收完成。
- 2026-11-22：完成文档全量审计与同步：为冻结需求增加 Ardot 覆盖说明，按实际实现重写架构文档，修正 README / CONTEXT / AGENTS 状态，并归档旧设计探索。
- 2026-11-22：统一 Ardot 案例桌面稿的验收基准，并将 QA 预览地址标记为截图时地址。

### Notes

- `astro check` 暂不可用：Astro 7 不支持当前 TypeScript 7，需要安装 TypeScript 6。
- 当前仓库缺少 `LICENSE` 文件；模板 MIT 许可证是否补回需单独确认。
- 尚未配置 Cloudflare Email Routing。
