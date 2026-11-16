# CHANGELOG

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 结构，版本号遵循语义化版本。

## [Unreleased]

### Added

- 初始化 Git 仓库，远端 `git@github.com:hzhihu/EcomCanopy.git`，主分支 `main`。
- 添加 `.gitignore`（Node / Astro / 编辑器 / 环境变量）。
- 项目文档骨架：`README.md`、`AGENTS.md`、`ARCHITECTURE.md`、`CONTEXT.md`、`CHANGELOG.md`、`docs/decisions.md`。
- 冻结 18 条关键决策（品牌、定位、域名邮箱、项目真实性、Skills Hub 独立性、视觉方向、内容工作流、发布策略、视觉验收、智能体治理）。
- 确定三个 AI 项目的类型与状态：AI Skills Hub = Development，AI 差评洞察 = Research，AI Listing 体检 = Research。
- 确定联系方式：`hzhihu@ecomcanopy.site`（主）、`business@ecomcanopy.site`（商务）。
- 确定 Skills Hub 以独立仓库、独立容器、`skills.ecomcanopy.site` 子域部署，主站仅外链。

### Changed

- 需求文档 `README.md` 迁移至 `docs/requirements/website-plan-v1.2.md`，`README.md` 改为项目概览与文档索引。

### Notes

- 尚未初始化 Astro 工程（仅有文档，无代码）。
- 尚未开始 Phase 0 模板调研。
- 尚未配置 Cloudflare Email Routing。
