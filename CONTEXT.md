# CONTEXT.md —— 当前进展快照

最后更新：2026-11-16
当前阶段：**Phase 0 已完成，待确认 3 项后进入 Phase 1**

本文件只记录「现在在哪里」。规则见 `AGENTS.md`，冻结决策见 `docs/decisions.md`。

---

## 1. 已完成

| 项 | 结果 |
| --- | --- |
| 需求与实施方案 | 已冻结，见 `docs/requirements/website-plan-v1.2.md`（V1.2） |
| 项目文档骨架 | README、AGENTS、ARCHITECTURE、CONTEXT、CHANGELOG、decisions |
| 18 条关键决策 + 第 11 节修订 | 已冻结，见 `docs/decisions.md` |
| Phase 0 模板调研 | 已完成，报告见 `docs/architecture/phase-0-template-review.md` |
| 起始模板 | 已选定 `ricocc/ricoui-astro-starter`，Tailwind v4 已获批准 |
| Git 仓库 | `github.com/hzhihu/EcomCanopy`，主分支 `main` |
| 域名 | `ecomcanopy.site`，已在 Cloudflare 托管 |
| 邮箱 | `hzhihu@`（主）、`business@`（商务），待配置 Email Routing |
| 项目状态 | Skills Hub = Development；差评洞察、Listing 体检 = Research |

---

## 2. 未开始

- 视觉设计规范与 Design Tokens（Phase 1）
- 代码初始化
- 内容素材（真实业务细节、文章原料、头像）
- NAS 部署与 Cloudflare Tunnel 配置

---

## 3. 待用户确认

| # | 事项 | 影响 | 是否阻塞 |
| --- | --- | --- | --- |
| 1 | 代码根目录命名（`website/` 还是仓库根） | Docker 构建上下文、目录结构 | 阻塞 Phase 2 |
| 2 | 是否删除模板的深色模式与主题切换器 | 样式体系与决策 6 一致 | 阻塞 Phase 1 |
| 3 | 是否保留模板 MIT LICENSE 与作者版权声明 | 合规 | 不阻塞 |
| 4 | 头像图片文件 | About / Contact 页 | 不阻塞（用文字占位） |
| 5 | 「易贸森」重名与商标查询 | 对外宣传口径 | 不阻塞（不宣称商标） |
| 6 | 导航入口如何处理 `/ai-agents` 与 `/fde` | Header 结构 | 阻塞 Phase 1 |
| 7 | 首批文章素材（每篇约 200 字原始素材） | Phase 4 内容 | 阻塞 Phase 4 |
| 8 | Cloudflare Email Routing 是否已配置 | 联系页可用性 | 阻塞 Phase 5 |

---

## 4. 下一步

**Phase 1：品牌视觉设计**（待上述阻塞项确认后开始）

- 基于 `ricoui-astro-starter` 的 Token 体系，裁定为单一浅色主题 + 深色局部块
- 输出设计规范、Design Tokens、关键组件视觉稿、首页桌面/移动候选稿
- 不写正式业务页面，不改品牌定位

完成条件：用户冻觉视觉规范。

---

## 5. 已知风险

| 风险 | 应对 |
| --- | --- |
| 一次性 v1.0 上线，部署环节最易拖延 | Phase 5 前不宣称可上线；部署脚本与文档提前准备 |
| 商业项目归属前雇主 | 全部改写为工程实践，去客户名、去可定位数据 |
| AI 起草文章容易空泛 | 技术事实必须由用户提供素材 |
| 无限制视觉修改轮次 | 每轮说明改动理由；「方向不对」即重做 |
| 「个人品牌」但不公开姓名与履历 | 靠头像、代号、项目、文章建立信任 |
