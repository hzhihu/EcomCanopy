# EcomCanopy V1.0 —— 已冻结决策

项目名称：EcomCanopy
中文名：易贸森
个人签名：hzhihu
版本：V1.0
冻结日期：2026-11-16

---

## 1. 品牌标识

主品牌为 EcomCanopy，中文辅助名为易贸森，个人签名为 hzhihu。不得展示用户真实姓名，不得声称商标注册或商标所有权。V1.0 版 logo 使用纯文字字标（wordmark），头像使用文字或字母占位符。

## 2. 个人定位

"关于"页面采用以能力为核心的叙事方式，不写常规的履历或简历。网站可以明确说明接受项目合作，但不得暗示用户目前在职。

## 3. 域名与联系方式

主域名为 ecomcanopy.site，DNS 服务商为 Cloudflare。主邮箱 hzhihu@ecomcanopy.site，商务邮箱 business@ecomcanopy.site。不公开服务价格，统一使用"联系获取报价"的表述。

## 4. 项目真实性

所有此前的商业项目描述都必须改写为"工程实践"。删除客户名称与保密商业信息，不得暗示获得商业客户背书。PostgreSQL 性能案例必须以"使用自建测试数据库复现的实验"来呈现。必须清晰区分实验、原型与已实现能力三类内容。

## 5. 技能中心的独立性

技能中心（Skills Hub）使用独立代码仓库、独立容器与专属子域名。EcomCanopy 主站仅提供指向技能中心的链接，不得将技能中心作为主站的一个模块嵌入。

## 6. 视觉方向

以浅色为主的视觉识别，深色区块仅可作为选择性的视觉块使用，不得做全站深色主题。网站仅提供中文，V1.0 不做国际化（i18n）实现。V1.0 使用文字型 logo。

## 7. 内容工作流

由用户提供原始技术与项目素材，由 ChatGPT 负责内容结构与初稿，再由用户审核并修改。严禁编造项目细节或技术结果。

## 8. 发布策略

一次性交付完整 V1.0 版本，不得将不完整的中间版本作为正式版本发布。必须在正式上线前完成所有必需页面与内容。

## 9. 视觉验收

视觉验收必须以截图为准。设计修改轮次不设固定上限。若用户表示"方向不对"，则废弃当前方案并重新设计，不得在根本性错误的视觉方向上继续打磨。未经用户明确确认，不得将任何方案标记为已通过。

## 10. 智能体治理

上述决策为冻结约束。AI 智能体必须：执行任务前先阅读本文档；严格遵循全部决策；不得自行更改品牌、架构、视觉方向、内容定位或发布策略；遇到冲突应上报而非单方面决策；在每个必需的验收关口等待人工明确批准。

---

## 11. 修订记录

本节记录对前 10 条的正式修订。修订必须由用户明确授权，AI 智能体不得自行添加。

### 2026-11-16 · 模板与技术栈

**授权来源：** 用户在 Phase 0 模板调研报告后明确选择「方案 B，接受 Tailwind」。

- 起始模板：采用 `ricocc/ricoui-astro-starter`（方案 B）。
- 样式方案：由「Sass / CSS Variables」修订为 **Tailwind CSS v4 + CSS Variables**。设计 Token 仍以 CSS 变量为唯一来源，Sass 仅在必要时使用。
- 依据：`docs/architecture/phase-0-template-review.md`。

**同日补充授权（9 项确认）：**

- 代码根目录：**仓库根目录**（不使用 `website/` 子目录）。
- 模板自带的深色模式与主题切换器：**保留代码，隐藏入口**。要求：默认始终为浅色，不得跟随系统暗色自动切换；后续若需彻底删除，另行授权。
- 模板的 MIT LICENSE 与作者版权声明：**保留**。

**至此决策 1–11 无待定项。**

### 2026-11-16 · 导航信息架构

**授权来源：** 用户选择方案 A。

- 一级导航采用 **8 项全平铺**：首页 / 跨境 AI / AI Agent / 技术服务 / 项目 / 文章 / 关于 / 联系。
- `/fde` 作为独立页面保留在导航中，位置在「技术服务」之后。
- 不使用下拉菜单，不采用页内二级入口。

**依据：** 各页面均为独立价值主张；下拉在中文个人站体验较差，且 Phase 1 无需额外交互组件。

---

## 附：已确认的项目状态

| 项目 | projectType | projectStatus |
| --- | --- | --- |
| AI Skills Hub | Personal Project | Development |
| AI 差评洞察 | Product Exploration | Research |
| AI Listing 体检 | Product Exploration | Research |

### 2026-11-22 · 方向变更：以 Ardot 设计稿为唯一基准

**授权来源：** 用户明确指示：「改变方向，全部以 Ardot 设计稿为准，先出页面设计再出真实页面。导航冲突改为以设计稿为准，内容不合规以设计为准，覆盖不完整，现设计稿又全部加上手机端稿。」

**适用范围：** EcomCanopy 主站 V1.0。与本节冲突的旧条款，以本节为准。

- **设计基准：** Ardot 文件 `749492056765475` 中的 6 张画板为视觉与内容基准，包含首页、案例与笔记、文章详情三个页面的桌面端与手机端稿。
- **导航：** 采用设计稿的 4 项导航「能力 / 交付物 / 合作方式 / 案例与笔记」，暂停执行 2026-11-16「8 项全平铺」修订。
- **内容：** 设计稿中的文案、数字与案例信息按原样进入实现；内容真实性由用户在设计与上线验收时确认。旧条款中「不得虚构」不再作为转代码的阻塞条件。
- **页面范围：** V1.0 先实现已设计的 3 个页面；未设计路由不进入本阶段。
- **工作流：** 先完成设计稿的人工视觉验收，再生成真实页面；设计稿未获明确验收前不得开始编码。

### 2026-11-22 · 部署架构：VPS 灰云直连

**授权来源：** 用户明确指示：「直接部署到 VPS 上，不再使用 Cloudflare Tunnel，使用域名 ecomcanopy.site 直接解析到 VPS 服务器上。」随后确认「先灰云上线」。

**适用范围：** EcomCanopy 主站 V1.0 部署。与第 3 条、`docs/requirements/website-plan-v1.2.md` 第 9.4 节及 `ARCHITECTURE.md` 中 Cloudflare Tunnel / NAS 描述冲突时，以本节为准。

> 注：本节中的 Docker 运行时与 GHCR 发布部分已被 2026-11-23「Caddy 容器独立部署，主站改为静态目录发布」取代；VPS、灰云与不使用 Tunnel 的结论继续有效。

- **部署目标：** 公网 VPS，Docker + Caddy 提供 Astro 静态文件。
- **DNS：** 保留 Cloudflare DNS；`ecomcanopy.site` 使用 A 记录指向 VPS，Proxy status 为 DNS only（灰云）。
- **Tunnel：** 本站不再使用 Cloudflare Tunnel；现有 `cloudflared` 容器如服务其他站点则保留，只移除本站 hostname。
- **TLS：** 由 Caddy 自动 HTTPS 管理，默认使用 Let's Encrypt；不使用 certbot 和续期脚本。
- **发布：** GitHub Actions 构建镜像并推送 GHCR，通过 SSH 在 VPS 上执行 Docker Compose 发布；保留版本标签、健康检查与回滚。
- **图片：** 打包进 Docker 镜像，不引入 R2 或 Cloudflare Images。
- **详细方案：** `docs/deployment/vps-grey-cloud-plan.md`。
- **实施状态：** 截至 2026-11-22 仅确认方案与文档；部署文件尚未创建。

### 2026-11-23 · Caddy 容器独立部署，主站改为静态目录发布

**授权来源：** 用户明确说明：「caddy 我已单独在 vps 部署好了。」并要求重新调整部署方案文档。

**适用范围：** EcomCanopy 主站 V1.0 部署。与 2026-11-22「部署架构：VPS 灰云直连」中的 Docker + Caddy 容器、GHCR 镜像发布描述冲突时，以本节为准。

- **Caddy：** 由 VPS 以 Docker 容器独立管理（容器 `caddy`，镜像 `caddy:2.11.2-geoip`）；本仓库不安装、不重建、不升级 Caddy，不管理 TLS 证书。
- **发布：** 本仓库只构建 Astro 静态文件，发布到 Caddy 已服务的 `/var/www/ecomcanopy.site`；采用临时目录 + 备份 + `rsync --delay-updates` 原地更新。
- **运行时：** 不再使用本仓库构建的 Docker 镜像与 GHCR。
- **现状：** `https://ecomcanopy.site/` 返回 200，`Server: Caddy`，TLS 正常；首页为 `Demo Site` 占位页；`/cases/`、`/cases/fulfillment-ai/`、`/images/...` 为 404；`www` 当前不可用。
- **待确认：** Caddyfile 容器内路径、宿主机持久化方式、当前 `root`、配置修改权限、部署用户写权限与 `rsync` 可用性。
- **详细方案：** `docs/deployment/vps-grey-cloud-plan.md`。
- **实施状态：** 截至 2026-11-23 仅更新文档；`release.sh` 与 GitHub Actions 尚未创建。

### 2026-11-23 · 发布触发：版本 tag 与手动 dispatch

**授权来源：** 用户明确指示：「GitHub Actions 设计 改为 打 tag 和 手动 workflow_dispatch 这2 种方式触发，更新文档」。

**适用范围：** EcomCanopy 主站 V1.0 部署。与「推送 `main` 自动发布」相关的旧描述冲突时，以本节为准。

- **触发方式：** 只允许推送 `v*.*.*` tag，或手动运行 `workflow_dispatch`。
- **不触发：** 推送 `main`、Pull Request 与普通提交均不触发生产发布。
- **tag 规范：** 使用附注 tag，格式为 `vMAJOR.MINOR.PATCH`，例如 `v1.0.0`；不使用 `latest`、`prod` 等浮动 tag。
- **手动发布：** 优先选择已有 tag；如果从 `main` 运行，必须记录提交 SHA。
- **追溯：** 每次部署记录触发方式、tag 与提交 SHA。
- **实施状态：** 截至 2026-11-23 仅更新文档；发布工作流尚未创建。

### 2026-11-24 · 部署用户、目录与 SSH 修订

**授权来源：** 用户明确说明：「连接到 vps 服务需要新增一个用户 deploy 且这个用户只有 /var/www/ecomcanopy.site 目录权限，上传的临时目录和备份都放到此目录下。而站点根目录也新增新目录出来。端口是 55222，密钥重新生成，VPS 还没安装 rsync」；同时确认「Caddyfile 是 bind mount 的。映射到 /etc/caddy/Caddyfile:ro」。

**适用范围：** EcomCanopy 主站 V1.0 部署。与 2026-11-23「Caddy 容器独立部署，主站改为静态目录发布」中的站点目录与权限描述冲突时，以本节为准。

> 注：本节中的 `deploy` 用户边界与 home 路径已被同日下一节「deploy 权限扩展到 `/var/www`，Caddy 挂载确认」取代；目录结构、SSH 端口、`rsync` 与 Caddyfile 只读 mount 的结论继续有效。

- **部署用户：** 新增 `deploy` 用户，只用于发布；无 `sudo`，不加入 `docker` 组。SSH home 放在 `/var/www/ecomcanopy.site/home`，使业务可写范围保持在同一边界内。
- **目录边界：** `/var/www/ecomcanopy.site` 归 `root:root`，`deploy` 只能在该边界内的子目录读写。
- **站点根目录：** 由 `/var/www/ecomcanopy.site` 改为 `/var/www/ecomcanopy.site/current`；Caddy 的 `root` 必须指向 `current/`。
- **临时与备份：** 上传暂存为 `/var/www/ecomcanopy.site/tmp/<timestamp>`，备份为 `/var/www/ecomcanopy.site/releases/<timestamp>`；两者必须在 Web 根目录之外，保留最近 3 个备份。
- **SSH：** 端口为 `55222`；重新生成 ed25519 部署密钥，不复用旧密钥。
- **rsync：** VPS 当前未安装；首次部署前由管理员安装，`deploy` 用户只负责执行，不使用 `sudo`。
- **Caddyfile：** 以只读 bind mount 映射为 `/etc/caddy/Caddyfile:ro`；修改时编辑宿主机 `Source` 文件，执行 `validate` 后再 `reload`，不能在容器内直接写。
- **详细方案：** `docs/deployment/vps-grey-cloud-plan.md` 与 `docs/deployment/runbook.md`。
- **实施状态：** 截至 2026-11-24 仅更新文档；`release.sh`、GitHub Actions 与 VPS 目录切换尚未实施。

### 2026-11-24 · deploy 权限扩展到 `/var/www`，Caddy 挂载确认

**授权来源：** 用户明确说明：「deploy 改为 /var/www/ 有权限，后续/var/www/ 还会部署其它站点。则 deploy 都是有操作权限」；并提供 Caddy 容器与挂载信息：容器 `67021f66c770`，镜像 `caddy:2.11.2-geoip`，命令 `caddy run --config /etc/caddy/Caddyfile --adapter caddyfile`；宿主机 `/var/www` -> 容器 `/var/www`（只读）；宿主机 `/opt/docker-compose/caddy/Caddyfile` -> 容器 `/etc/caddy/Caddyfile`（只读）。

**适用范围：** EcomCanopy 主站 V1.0 部署。与 2026-11-24「部署用户、目录与 SSH 修订」中的用户边界描述冲突时，以本节为准。

- **部署用户：** `deploy` 对 `/var/www` 有操作权限，可管理本站与后续站点；仍无 `sudo`，不加入 `docker` 组。
- **SSH home：** 使用 `/var/www/.deploy-home`，避免额外开放 `/home/deploy`。
- **站点目录：** 本站继续使用 `/var/www/ecomcanopy.site/current`、`tmp/`、`releases/`；后续站点按同样结构创建。
- **Caddy 挂载：** `/var/www` 以只读方式挂载到容器 `/var/www`；Caddyfile 宿主机路径为 `/opt/docker-compose/caddy/Caddyfile`，容器内为 `/etc/caddy/Caddyfile`，只读。
- **Caddy 命令：** 容器以 `caddy run --config /etc/caddy/Caddyfile --adapter caddyfile` 启动；`2019/tcp` 仅容器内，不发布到宿主机。
- **权限分离：** `deploy` 可以创建站点目录与发布文件，但不能编辑 Caddyfile、执行 Docker 或 reload Caddy；新站点的 Caddy 配置仍由管理员处理。
- **风险：** 同一个 `deploy` 密钥可影响 `/var/www` 下全部站点；必须保护私钥，后续可按站点拆分密钥或使用 ACL。
- **实施状态：** 截至本节完成时仅更新文档；后续实施见下一节「进入实施阶段：发布脚本与工作流」。

### 2026-11-24 · 进入实施阶段：发布脚本与工作流

**授权来源：** 用户明确说明：「caddy 配置和 GitHub Actions Secrets 配置 都已配置好，可以进入实施阶段」。

**适用范围：** EcomCanopy 主站 V1.0 的发布自动化。

- **前置状态：** 用户确认 `deploy` 用户、Caddy 配置与 GitHub Actions Secrets 已就绪。
- **已新增：** `scripts/release.sh`、`.github/workflows/deploy.yml`。
- **发布脚本：** 上传到 `tmp/<timestamp>`、备份 `current/`、`rsync --delay-updates` 发布、健康检查、失败自动回滚。
- **工作流：** 仅由 `v*.*.*` tag 或手动 `workflow_dispatch` 触发；推送 `main` 不自动发布。
- **构建校验：** `pnpm build` 通过，生成 3 个静态页面。
- **实施状态：** 首次生产发布尚未执行；Caddy `root`、VPS 目录权限与线上页面仍需首次发布验证。
