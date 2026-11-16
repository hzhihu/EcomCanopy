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
| 关键决策 | 已冻结（18 条） |
| 当前阶段 | Phase 0 已完成，待确认 3 项 |
| 起始模板 | ricoui-astro-starter（Tailwind v4 已批准） |
| 代码 | 尚未初始化 |
| 上线 | v1.0 一次性交付，尚未上线 |

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

**冲突处理顺序：** `docs/decisions.md` → `docs/requirements/*` → 其他文档 → 口头约定。
出现冲突应上报，不得自行选择。

---

## 目录约定

```
.
├── docs/
│   ├── decisions.md              冻结决策
│   ├── requirements/             需求原文
│   ├── design/                   Phase 1 产出（设计规范、Tokens）
│   ├── architecture/             架构图、调研报告
│   ├── content/                  内容素材、脱敏后的项目资料
│   └── deployment/               部署与回滚文档
├── src/                          Astro 源码（仓库根目录，不使用 website/）
├── public/                       静态资源
├── AGENTS.md
├── ARCHITECTURE.md
├── CONTEXT.md
├── CHANGELOG.md
└── LICENSE                       模板 MIT 许可证（保留）
```

`docs/` 不进入部署产物。

---

## 本地开发（Phase 0 后生效）

```bash
pnpm install
pnpm dev        # 本地预览
pnpm build      # 构建静态产物
pnpm preview    # 预览构建结果
```

---

## 发布

v1.0 一次性交付：所有必需页面与内容完成、验收通过后，才允许正式上线。
部署链路：Cloudflare DNS → Cloudflare Tunnel → NAS → Docker → Nginx → Astro 静态文件。

详见 `ARCHITECTURE.md` 与 `docs/deployment/`。
