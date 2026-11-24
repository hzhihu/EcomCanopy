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
- 新增 VPS 灰云直连部署方案：`docs/deployment/vps-grey-cloud-plan.md`。
- 新增 VPS 首次部署与运维手册：`docs/deployment/runbook.md`。

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
- 2026-11-22：按用户授权把生产部署架构从 Cloudflare Tunnel + NAS 调整为 VPS 灰云直连；同步修订 `docs/decisions.md`、`ARCHITECTURE.md`、`README.md` 与 `CONTEXT.md`。
- 2026-11-22：按用户授权把 Web 服务器由 Nginx 改为 Caddy，TLS 由 Caddy 自动 HTTPS 管理，移除 certbot 方案。
- 2026-11-23：用户说明 Caddy 已以 Docker 容器独立部署（容器 `caddy`，镜像 `caddy:2.11.2-geoip`），站点目录为 `/var/www/ecomcanopy.site`；方案调整为「现有 Caddy + 静态目录原地发布」，不再使用本仓库 Docker/GHCR 运行时。同步修订部署文档与架构文档。
- 2026-11-23：GitHub Actions 发布触发改为仅「推送 `v*.*.*` tag」与「手动 `workflow_dispatch`」两种；推送 `main` 不再自动发布。
- 2026-11-24：按用户确认修订部署模型：新增受限 `deploy` 用户（无 sudo、无 Docker 权限），业务写权限先限制在 `/var/www/ecomcanopy.site`；站点根目录改为 `current/`，上传暂存与备份分别放入 `tmp/`、`releases/`；SSH 端口改为 `55222` 并重新生成密钥；VPS 需先安装 `rsync`；Caddyfile 确认为 `/etc/caddy/Caddyfile:ro` 只读 bind mount。同日随后把 `deploy` 权限扩展到 `/var/www`。同步更新部署方案、执行手册、冻结决策、状态快照与架构文档。
- 2026-11-24：按用户确认把 `deploy` 权限范围扩大到 `/var/www`，以支持后续多站点发布；确认 Caddy 容器 `67021f66c770` 以 `caddy run --config /etc/caddy/Caddyfile --adapter caddyfile` 启动，宿主机 `/var/www` 只读挂载到容器 `/var/www`，宿主机 `/opt/docker-compose/caddy/Caddyfile` 只读挂载到容器 `/etc/caddy/Caddyfile`。同步更新部署方案、执行手册、冻结决策、状态快照与架构文档。
- 2026-11-24：用户确认 Caddy 配置与 GitHub Actions Secrets 已就绪，批准进入实施阶段。新增 `scripts/release.sh` 与 `.github/workflows/deploy.yml`；发布脚本包含暂存上传、备份、`rsync --delay-updates`、健康检查与失败自动回滚；工作流仅由 `v*.*.*` tag 或手动 `workflow_dispatch` 触发。`pnpm build` 通过。

### Notes

- `astro check` 暂不可用：Astro 7 不支持当前 TypeScript 7，需要安装 TypeScript 6。
- 当前仓库缺少 `LICENSE` 文件；模板 MIT 许可证是否补回需单独确认。
- 尚未配置 Cloudflare Email Routing。
- GHCR 不再用于本站运行时，因此不再产生镜像存储与拉取成本。
- 发布脚本 `scripts/release.sh` 与 GitHub Actions 工作流 `.github/workflows/deploy.yml` 已创建；首次生产发布尚未执行。
- 现有 Caddy 已为 `https://ecomcanopy.site/` 返回 200，但首页仍是 `Demo Site` 占位页；3 个目标页面尚未发布。
