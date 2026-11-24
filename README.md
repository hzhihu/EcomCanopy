# EcomCanopy 官网

个人技术品牌与跨境 AI 工作室官网。主品牌 EcomCanopy，中文名易贸森，个人签名 hzhihu。

**定位：** Cross-border Commerce × AI
**主张：** 让 AI 真正融入跨境电商业务。
**域名：** ecomcanopy.site

---

## 当前状态

| 项 | 状态 |
| --- | --- |
| 需求与方案 | 已冻结（V1.2） |
| 关键决策 | 已冻结，见 `docs/decisions.md` |
| 当前阶段 | Phase 2 已通过人工视觉验收；Phase 5 发布脚本与工作流已创建，首次发布待执行 |
| 设计稿 | Ardot 6 张画板：3 个页面 × 桌面端/手机端 |
| 起始模板 | ricoui-astro-starter（Tailwind v4 已批准） |
| 代码 | Astro 工程已初始化，3 个 V1.0 页面已实现 |
| 发布自动化 | `scripts/release.sh` 与 `.github/workflows/deploy.yml` 已创建；`pnpm build` 通过 |
| 上线 | 当前 3 页版本尚未上线；Caddy 容器已返回 Demo Site 占位页 |

---

## 文档索引

| 文件 | 作用 | 何时读 |
| --- | --- | --- |
| `docs/decisions.md` | **冻结决策，最高优先级约束** | 每次任务开始前 |
| `docs/requirements/website-plan-v1.2.md` | 完整需求与实施方案（品牌、信息架构、阶段划分、验收标准） | 需要背景与细节时 |
| `AGENTS.md` | AI 智能体工作规则、禁止行为、验收关口 | 执行任务前 |
| `ARCHITECTURE.md` | 技术架构、路由、内容模型、部署链路 | 涉及工程实现时 |
| `CONTEXT.md` | 当前进展快照、待确认项、下一步 | 每次接手任务时 |
| `CHANGELOG.md` | 变更历史 | 需要追溯改动时 |
| `docs/deployment/vps-grey-cloud-plan.md` | 现有 Caddy + 静态目录发布方案 | 部署与上线时 |
| `docs/deployment/runbook.md` | Caddy 接入、首次发布与回滚手册 | 进入实施阶段后 |
| `docs/architecture/phase-0-template-review.md` | 模板调研历史报告 | 追溯模板选择时 |
| `docs/design/ardot-shots/README.md` | Ardot 画板与导出资源记录 | 核对设计来源时 |
| `docs/design/qa/design-parity-audit.md` | 视觉一致性审计与验收记录 | 核对视觉验收时 |

**冲突处理顺序：** `docs/decisions.md` → `docs/requirements/*` → 其他文档 → 口头约定。
出现冲突应上报，不得自行选择。

---

## 目录约定

```
.
├── docs/
│   ├── decisions.md              冻结决策
│   ├── requirements/             需求原文
│   ├── architecture/             架构图、调研报告
│   ├── deployment/               VPS 部署方案与运行手册
│   └── design/
│       ├── ardot-shots/          Ardot 画板导出记录
│       ├── hero-directions/      历史首屏方向探索
│       ├── qa/                   视觉验收截图与审计
│       └── stitch/               历史 Stitch 提示词
├── src/                          Astro 源码（仓库根目录，不使用 website/）
├── public/                       静态资源
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── AGENTS.md
├── ARCHITECTURE.md
├── CONTEXT.md
└── CHANGELOG.md
```

`docs/` 不进入部署产物。

当前仓库尚无 `LICENSE` 文件；模板 MIT 许可证是否补回需单独确认。

---

## 本地开发

```bash
pnpm install
pnpm dev        # 本地预览
pnpm build      # 构建静态产物
pnpm preview    # 预览构建结果
```

---

## 发布

v1.0 一次性交付：所有必需页面与内容完成、验收通过后，才允许正式上线。
发布触发只有两种：推送 `v*.*.*` 版本 tag，或手动运行 `workflow_dispatch`。推送 `main` 不自动发布。
部署链路：GitHub Actions 构建 `dist` → rsync 到 `/var/www/ecomcanopy.site/current` → 现有 Caddy 容器。`deploy` 对 `/var/www` 有操作权限，可管理后续站点；本站上传暂存与备份分别放在 `/var/www/ecomcanopy.site/tmp` 与 `/var/www/ecomcanopy.site/releases`。

发布脚本为 `scripts/release.sh`，工作流为 `.github/workflows/deploy.yml`；脚本包含备份、健康检查与失败回滚。

本站不使用 Cloudflare Tunnel，也不使用本仓库的 Docker/GHCR 运行时。Caddy 由 VPS 独立管理，宿主机 `/var/www` 以只读方式挂载到容器 `/var/www`；详细方案见 `docs/deployment/vps-grey-cloud-plan.md`，执行步骤见 `docs/deployment/runbook.md`。
