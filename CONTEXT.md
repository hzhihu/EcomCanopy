# CONTEXT.md —— 当前进展快照

最后更新：2026-11-22
当前阶段：**Phase 2 已通过人工视觉验收（3 个页面 × 桌面/手机端）**

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

---

## 2. 尚未完成

- 类型检查：`pnpm check` 因 TypeScript 7 与 `astro check` 不兼容而失败
- 未来页面素材（头像等，当前 3 页范围外）
- NAS 部署与 Cloudflare Tunnel 配置

---

## 3. 待用户确认

| # | 事项 | 影响 | 是否阻塞 |
| --- | --- | --- | --- |
| 1 | 是否安装 TypeScript 6 恢复 `astro check` | 类型检查可用性 | 不阻塞构建 |
| 2 | 头像图片文件 | 当前 3 页范围外的未来页面 | 不阻塞 |
| 3 | 「易贸森」重名与商标查询 | 对外宣传口径 | 不阻塞（不宣称商标） |
| 4 | 后续案例与文章原料 | 未来内容扩展 | 不阻塞当前 3 页 |
| 5 | Cloudflare Email Routing 是否已配置 | 上线后的邮件联系 | 阻塞上线 |

---

## 4. 下一步

**等待用户指定下一阶段**

- Phase 2 的 3 个页面桌面端与手机端已通过人工视觉验收
- 未经确认不新增页面、不扩展路由
- 下一步优先由用户决定是否处理类型检查或其他阶段事项

---

## 5. 已知风险

| 风险 | 应对 |
| --- | --- |
| 一次性 v1.0 上线，部署环节最易拖延 | Phase 5 前不宣称可上线；部署脚本与文档提前准备 |
| 商业项目归属前雇主 | 全部改写为工程实践，去客户名、去可定位数据 |
| 后续 AI 起草内容容易空泛 | 新增内容的技术事实必须由用户提供素材 |
| 无限制视觉修改轮次 | 每轮说明改动理由；「方向不对」即重做 |
| 「个人品牌」但不公开姓名与履历 | 靠头像、代号、项目、文章建立信任 |
