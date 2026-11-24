# CONTEXT.md —— 当前进展快照

最后更新：2026-11-24
当前阶段：**Phase 5 实施中：发布脚本与工作流已创建；首次生产发布待执行**

本文件只记录「现在在哪里」。规则见 `AGENTS.md`，冻结决策见 `docs/decisions.md`。

---

## 1. 已完成

| 项 | 结果 |
| --- | --- |
| 需求与实施方案 | 已冻结，见 `docs/requirements/website-plan-v1.2.md`（V1.2） |
| 项目文档骨架 | README、AGENTS、ARCHITECTURE、CONTEXT、CHANGELOG、decisions |
| 冻结决策与修订记录 | 已确认，见 `docs/decisions.md` |
| Phase 0 模板调研 | 已完成，报告见 `docs/architecture/phase-0-template-review.md` |
| 代码位置 | 仓库根目录（不使用 `website/`）；当前缺少 `LICENSE` 文件，待补回或确认 |
| 深色模式 | 未提供全站主题切换；深色仅用于局部区块 |
| Git 仓库 | `github.com/hzhihu/EcomCanopy`，主分支 `main` |
| 域名 | `ecomcanopy.site`，已在 Cloudflare 托管 |
| 邮箱 | `hzhihu@`（主）、`business@`（商务），待配置 Email Routing |
| 项目状态 | Skills Hub = Development；差评洞察、Listing 体检 = Research |
| Ardot 设计稿 | 6 张画板：首页、案例与笔记、文章详情，各含 1440 桌面端与 390 手机端 |
| Astro 工程 | Astro + Tailwind CSS v4 + CSS Variables，无前端框架运行时 |
| V1.0 页面 | `/`、`/cases`、`/cases/fulfillment-ai` 三个静态页面 |
| 视觉验收截图 | 见 `docs/design/qa/`，3 个页面桌面端与手机端已获用户确认通过 |
| 构建 | `pnpm build` 通过，3 个静态路由生成成功 |
| 部署方案 | 现有 Caddy 容器 + `/var/www/ecomcanopy.site/current` 静态目录发布；`deploy` 对 `/var/www` 有操作权限，后续可管理其它站点，见 `docs/deployment/vps-grey-cloud-plan.md` |
| VPS | `104.233.188.111`，境外，Ubuntu 24.04.5 LTS，x86_64；Docker 29.9.3 与 Compose v5.7.1 已安装，本站不再使用其运行时 |
| 仓库与范围 | GitHub 仓库公开；当前 3 个页面确认为本次 V1.0 上线范围 |
| Caddy 现状 | 容器 `caddy`（`67021f66c770`），镜像 `caddy:2.11.2-geoip`；命令 `caddy run --config /etc/caddy/Caddyfile --adapter caddyfile`；`https://ecomcanopy.site/` 返回 200，TLS 正常；首页已是真实内容（2026-11-24 线上复测） |
| Caddy 挂载 | 宿主机 `/var/www` -> 容器 `/var/www`（只读）；`/opt/docker-compose/caddy/Caddyfile` -> `/etc/caddy/Caddyfile`（只读）；`2019/tcp` 仅容器内 |
| 发布自动化 | `scripts/release.sh` 与 `.github/workflows/deploy.yml` 已创建；本地 `pnpm build` 通过 |
| VPS 准备（用户确认） | `deploy` 用户已创建；Caddy 配置与 GitHub Actions Secrets 已配置 |
| 当前缺口 | SEO 基础能力已在代码侧补齐（`robots.txt`、`sitemap.xml`、JSON-LD、OG 图、favicon、404 页），**尚未发布到线上**；方案见 `docs/seo/geo-seo-plan-v1.0.md`（v1.1） |

---

## 2. 尚未完成

- 类型检查：`pnpm check` 因 TypeScript 7 与 `astro check` 不兼容而失败
- 未来页面素材（头像等，当前 3 页范围外）
- Caddy `root` 已能正常服务 3 个页面（2026-11-24 复测）；`/var/www/ecomcanopy.site` 的 `current`/`tmp`/`releases` 结构与 `deploy` 写权限尚未逐项核对
- 上传暂存与备份目录尚未在首次发布中实际创建
- `/var/www` 下是否已有其它站点需要交给 `deploy` 管理，尚未逐个确认
- 首次发布已完成（2026-11-24 复测 3 页、图片、`www` 均可访问）；本次发布是否由 GitHub Actions 触发尚未核实
- 3 个页面、`/images/` 与 `www`（301 → apex）已于 2026-11-24 线上复测确认可用，见 `docs/seo/geo-seo-plan-v1.0.md` §2.5

---

## 3. 待用户确认

| # | 事项 | 影响 | 是否阻塞 |
| --- | --- | --- | --- |
| 1 | 是否安装 TypeScript 6 恢复 `astro check` | 类型检查可用性 | 不阻塞构建 |
| 2 | 头像图片文件 | 当前 3 页范围外的未来页面 | 不阻塞 |
| 3 | 「易贸森」重名与商标查询 | 对外宣传口径 | 不阻塞（不宣称商标） |
| 4 | 后续案例与文章原料 | 未来内容扩展 | 不阻塞当前 3 页 |
| 5 | Cloudflare Email Routing 是否已配置 | 上线后的邮件联系 | 阻塞上线 |
| 6 | ~~是否现在执行首次生产发布~~ 已完成：3 个页面已上线（2026-11-24 实测） | 3 个页面上线 | 已确认 |
| 7 | ~~`www.ecomcanopy.site` 是否现在补 DNS~~ 已解决：`www` 301 → apex（2026-11-24 实测） | `www` 可用性 | 已确认 |
| 8 | 首次发布使用手动 `workflow_dispatch` 还是 `v1.0.0` tag | 发布追溯 | 不阻塞 |

---

## 4. 下一步

**Phase 5B：首次生产发布**

- Phase 2 的 3 个页面桌面端与手机端已通过人工视觉验收
- 部署方案见 `docs/deployment/vps-grey-cloud-plan.md`，执行步骤见 `docs/deployment/runbook.md`
- Caddy 已以 Docker 容器在 VPS 独立部署，不需要本仓库再安装或重建 Caddy
- 发布脚本与工作流已创建；不创建 Dockerfile、Caddyfile 或 Compose
- GitHub Actions 发布只由 `v*.*.*` tag 推送或手动 `workflow_dispatch` 触发
- Caddyfile 已确认：宿主机 `/opt/docker-compose/caddy/Caddyfile` -> 容器 `/etc/caddy/Caddyfile`，只读；站点目录已确认：`/var/www` -> `/var/www`，只读
- 首次发布优先使用手动 `workflow_dispatch`，需要 `production` Environment 人工 Approve
- 发布前确认 Caddy `root`、`/var/www/ecomcanopy.site/current`、`tmp/`、`releases/` 与 `deploy` 写权限
- SSH 端口为 `55222`，使用新生成的 ed25519 部署密钥；`rsync` 需已安装
- `deploy` 对 `/var/www` 有写权限；同一个密钥会影响全部站点，必须保护私钥
- 首次发布后验证 3 个页面、图片、`healthz`、缓存头、`www` 与回滚
- 未经确认不新增页面、不扩展路由
- 未经确认不把候选部署标记为已上线

---

## 5. 已知风险

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 一次性 v1.0 上线，部署环节最易拖延 | 上线时间被拖长 | Phase 5 前不宣称可上线；部署脚本与文档提前准备 |
| 首次发布尚未执行 | Actions、SSH、rsync 组合可能在线失败 | 先手动 `workflow_dispatch`；失败自动回滚；保留日志 |
| 商业项目归属前雇主 | 法律与信誉风险 | 全部改写为工程实践，去客户名、去可定位数据 |
| 后续 AI 起草内容容易空泛 | 内容可信度下降 | 新增内容的技术事实必须由用户提供素材 |
| 无限制视觉修改轮次 | 项目持续拖延 | 每轮说明改动理由；「方向不对」即重做 |
| 「个人品牌」但不公开姓名与履历 | 信任建立较慢 | 靠头像、代号、项目、文章建立信任 |
| VPS 公网 IP 暴露 | 被扫描或攻击 | 密钥登录、最小端口、fail2ban、及时更新；后续可切橙云 |
| Caddy 当前 `root` 不是发布目录 | 页面继续显示 Demo Site 或 404 | 先确认 root，备份后修改并 validate |
| Caddy 仍以父目录为 `root` 时创建 `tmp/` 与 `releases/` | 备份可能被公开访问 | 先把 `root` 切到 `current/`，再创建临时与备份目录 |
| Caddyfile 只读 bind mount | 容器内无法直接修改；换 inode 后容器可能仍读旧文件 | 编辑副本后用 `cp`/`tee` 原地写回 `/opt/docker-compose/caddy/Caddyfile`，确认容器内容后再 validate/reload |
| `deploy` 无 sudo 且 VPS 未装 rsync | 发布失败 | 管理员先安装 rsync；发布前用 `deploy` 验证 |
| `deploy` 对 `/var/www` 有写权限 | 一个密钥可影响全部站点 | 保护私钥；后续可按站点拆分密钥或 ACL |
| `rsync --delete` 路径写错 | 可能删除其它站点文件 | 禁止对 `/var/www` 整体执行 `--delete`；路径写到具体站点 |
| SSH 端口改为 `55222` 配置不当 | 无法登录 | 保留旧会话；先 `sshd -t`；防火墙放行后再断开 |
| 发布目录权限错误 | Caddy 无法读取 | 目录 755、文件 644，确认运行用户 |
| 原地更新中断 | 页面短暂混合版本 | 先传到 `tmp/<timestamp>`，备份后用 `rsync --delay-updates` |
