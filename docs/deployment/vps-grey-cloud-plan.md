# VPS Caddy 静态目录部署方案

状态：**Phase 5 实施中：发布脚本与工作流已创建，首次生产发布待执行**
最后更新：2026-11-24
适用范围：EcomCanopy 主站 V1.0（当前 3 个页面）
关联决策：`docs/decisions.md` 2026-11-23、2026-11-24 部署修订
关联架构：`ARCHITECTURE.md` 第 9 节
关联手册：`docs/deployment/runbook.md`

本文描述部署方案与当前实施状态。发布脚本与 GitHub Actions 已创建；首次生产发布尚未执行。

---

## 0. 本次修订摘要

本次按用户确认的 VPS 现状调整部署模型：

1. 新增受限 SSH 用户 `deploy`，业务写权限只放在 `/var/www/ecomcanopy.site` 边界内。
2. 上传临时目录与备份都放到该边界内，但**不能放进 Caddy 正在服务的站点根目录**。
3. 站点根目录改为新子目录 `/var/www/ecomcanopy.site/current`，由 Caddy 提供静态文件。
4. SSH 端口为 `55222`，部署密钥重新生成，不复用旧密钥。
5. VPS 当前未安装 `rsync`，首次部署前必须由管理员安装；`deploy` 用户没有 `sudo`，不能自行安装。
6. Caddyfile 以只读 bind mount 映射为 `/etc/caddy/Caddyfile:ro`；修改时必须编辑宿主机源文件，不能在容器内直接写。

### 0.1 目录模型

```text
/var/www/                          # deploy 有操作权限的共享发布根目录
├── .deploy-home/                   # deploy 的 SSH home，不对外提供
├── ecomcanopy.site/                # 本站
│   ├── current/                    # Caddy 站点根目录，只放公开静态文件
│   ├── tmp/                        # 本站上传临时目录，不对外提供
│   └── releases/                   # 本站历史备份，不对外提供
└── <other-site>/                   # 后续站点，按同样结构
```

`deploy` 对 `/var/www` 有操作权限，后续其它站点也由它发布。每个站点仍使用自己的 `current/`、`tmp/`、`releases/`；`tmp/` 与 `releases/` 必须在 `current/` 之外，避免因为 Caddy 的 `file_server` 被公开访问。不要给任何站点设置 `root` 为 `/var/www` 本身。

### 0.2 实施顺序

顺序不能颠倒：

1. 复核 Caddy 容器挂载与 Caddyfile 路径；当前已确认，但实施前仍要再查一次。
2. 创建 `current/`，把现有 Demo Site 顶层文件迁入。
3. 把 Caddyfile 的 `root` 改到 `current/`，执行 `validate` 与 `reload`，确认站点仍返回 200。
4. 再创建 `/var/www/.deploy-home`、`deploy` 用户与本站 `tmp/`、`releases/` 目录。
5. 安装 `rsync`，配置 SSH `55222` 与新密钥。
6. 配置 GitHub Actions Secrets。
7. 首次只用手动 `workflow_dispatch` 发布，并测试一次回滚。

第 3 步必须在第 4 步之前。否则 Caddy 仍以父目录为 `root` 时，`tmp/` 与 `releases/` 可能被公开读取。

---

## 1. 当前事实与约束

### 1.1 VPS 与 Caddy

| 项 | 值 |
| --- | --- |
| VPS | `104.233.188.111`，Ubuntu 24.04.5 LTS，x86_64 |
| SSH 端口 | `55222` |
| 部署用户 | `deploy`，待创建；对 `/var/www` 有操作权限；无 `sudo`，不加入 `docker` 组 |
| deploy home | `/var/www/.deploy-home`，待创建 |
| Caddy 部署方式 | Docker 容器 |
| 容器 ID | `67021f66c770` |
| 容器名 | `caddy` |
| 镜像 | `caddy:2.11.2-geoip` |
| 启动命令 | `caddy run --config /etc/caddy/Caddyfile --adapter caddyfile` |
| Caddy 端口 | `80`、`443`、`443/udp`；`2019` 仅容器内，未发布到宿主机 |
| Caddyfile 宿主机路径 | `/opt/docker-compose/caddy/Caddyfile` |
| Caddyfile 容器路径 | `/etc/caddy/Caddyfile`，只读 bind mount |
| 站点目录挂载 | 宿主机 `/var/www` -> 容器 `/var/www`，只读 |
| 其他 Caddy 挂载 | `/opt/docker-compose/caddy/config` -> `/config`（rw）；`/data` -> `/data`（rw）；GeoLite2 mmdb -> `/etc/caddy/GeoLite2-Country.mmdb`（ro） |
| 新站点根目录 | `/var/www/ecomcanopy.site/current`，待实施 |
| rsync | VPS 当前未安装，首次部署前由管理员安装 |

### 1.2 外部只读检查

2026-11-23 检查结果：

| 检查项 | 结果 |
| --- | --- |
| `https://ecomcanopy.site/` | `200` |
| `Server` | `Caddy` |
| TLS | 正常，HTTP/2 与 HTTP/3 可用 |
| `http://ecomcanopy.site` | `308` 到 HTTPS |
| 首页 | `Demo Site` 占位页 |
| `/cases/` | `404` |
| `/cases/fulfillment-ai/` | `404` |
| `/images/home-warehouse-wide.jpg` | `404` |
| `https://www.ecomcanopy.site/` | 当前不可用 |

结论：

- Caddy 与 TLS 已经工作，不需要重新部署 Caddy。
- 当前缺的是本站静态文件。
- 现有 Demo Site 文件需要先迁入 `current/`，再把 Caddy `root` 切过去。
- `www` 需要补 DNS 与 Caddy 站点配置。

### 1.3 安全约束

- `deploy` 用户只用于发布静态文件，不用于日常运维。
- `deploy` 用户不能执行 `sudo`，不能访问 Docker，不能修改 Caddy 配置。
- `deploy` 用户对 `/var/www` 有操作权限，可管理本站与后续站点；同一个密钥可以影响 `/var/www` 下的全部站点。
- SSH home 使用 `/var/www/.deploy-home`，只存放 `authorized_keys`。
- 私钥只保存在本地与 GitHub Actions Secret，不进入仓库。
- 备份与临时目录不能出现在 Caddy 的 Web 根目录下。

---

## 2. 目标链路

访问链路：

```text
访客
  └─ Cloudflare DNS（灰云 / DNS only）
      └─ VPS 公网 IP
          └─ 现有 Caddy 容器
              └─ /var/www/ecomcanopy.site/current
                  └─ Astro 静态文件
```

发布链路：

```text
版本 tag 推送或手动 workflow_dispatch
  └─ GitHub Actions
      ├─ pnpm install --frozen-lockfile
      ├─ pnpm build
      └─ rsync dist/ 到 VPS
          ├─ 上传到 /var/www/ecomcanopy.site/tmp/<timestamp>
          ├─ 备份 current/ 到 /var/www/ecomcanopy.site/releases/<timestamp>
          ├─ rsync --delay-updates 到 /var/www/ecomcanopy.site/current
          ├─ 健康检查
          └─ 失败时从 releases/<timestamp> 回滚
```

本仓库不再使用：

- 本仓库构建的 Docker 运行时镜像。
- GHCR 镜像仓库。
- Nginx、certbot 或额外 Web 服务器。

Caddy 容器、TLS 与 Caddyfile 由 VPS 独立管理；本仓库只发布静态文件。

### 2.1 触发规则

| 事件 | 是否发布 | 说明 |
| --- | --- | --- |
| 推送 `v*.*.*` tag | 是 | 正式发布；tag 必须指向已推送的提交 |
| 手动 `workflow_dispatch` | 是 | 用于首次发布、重试、回滚验证或紧急发布 |
| 推送 `main` | 否 | 只保留提交，不自动发布 |
| Pull Request | 否 | 不发布 |
| 纯文档提交 | 否 | 除非打 tag 或手动触发 |

约定：

- 版本 tag 使用附注 tag，格式为 `vMAJOR.MINOR.PATCH`，例如 `v1.0.0`。
- 不使用 `latest`、`prod` 这类浮动 tag。
- 手动触发时，优先选择已有 tag；如果从 `main` 运行，必须记录提交 SHA。
- 每次部署记录触发方式、tag 名称与提交 SHA。

---

## 3. 为什么 `current` 是真实目录

Caddy 通过 Docker bind mount 读取站点目录。把 `/var/www/ecomcanopy.site` 整体改成 symlink，宿主机路径变化不一定能正确反映到已启动的容器挂载中。

因此：

- `current/` 是真实目录，不是 symlink。
- Caddy 的 `root` 指向 `/var/www/ecomcanopy.site/current`。
- 新版本先上传到 `tmp/<timestamp>/`。
- 当前版本先备份到 `releases/<timestamp>/`。
- 用 `rsync --delay-updates` 原地更新 `current/`。
- 健康检查失败时，从 `releases/<timestamp>/` 恢复。

以后如果确认 Caddy 挂载的是父目录，并且 symlink 行为经过验证，可以再评估 symlink 切换；当前不引入这个假设。

---

## 4. 目录与权限模型

### 4.1 目录结构

```text
/var/www/                          # deploy:deploy 755，共享发布根目录
├── .deploy-home/                   # deploy:deploy 700，SSH home
│   └── .ssh/
│       └── authorized_keys         # deploy:deploy 600
└── ecomcanopy.site/                # deploy:deploy 755
    ├── current/                    # deploy:deploy 755，Caddy root
    ├── tmp/                        # deploy:deploy 700，上传暂存
    └── releases/                   # deploy:deploy 700，历史备份
```

### 4.2 权限表

| 路径 | 所有者 | 权限 | 用途 |
| --- | --- | --- | --- |
| `/var/www` | `deploy:deploy` | `755` | 共享发布根目录；`deploy` 可创建后续站点目录 |
| `/var/www/.deploy-home` | `deploy:deploy` | `700` | SSH home；只放 `.ssh` |
| `/var/www/ecomcanopy.site` | `deploy:deploy` | `755` | 本站目录 |
| `current/` | `deploy:deploy` | `755` | Caddy 站点根目录；文件 `644` |
| `tmp/` | `deploy:deploy` | `700` | 上传临时目录；成功后清理 |
| `releases/` | `deploy:deploy` | `700` | 备份目录；保留最近 3 个 |

说明：

- `deploy` 对 `/var/www` 有写权限，这是为了后续多站点发布；它也意味着一个部署密钥可以影响全部站点。
- `deploy` 可在 `current/` 内读写，满足 `rsync` 发布需要。
- Caddy 通过只读挂载读取 `/var/www`；每个站点的 `root` 只指向自己的 `current/`。
- `tmp/` 与 `releases/` 为 `700`，且不在 `current/` 下，不对外提供。
- 目录建议 `755`，文件建议 `644`；发布时用 `rsync --chmod=D755,F644` 统一权限。
- 后续站点按 `ecomcanopy.site` 的结构创建；如果 `/var/www` 下已有其它站点也要交给 `deploy` 管理，先逐个确认再 `chown` 或使用 ACL，不要无差别递归改权限。
- 新站点目录可由 `deploy` 创建，但对应的 Caddy 站点块仍需管理员修改 Caddyfile；`deploy` 不能编辑 Caddyfile 或 reload Caddy。

### 4.3 宿主机路径与容器内路径

已确认的挂载关系：

- 宿主机 `/var/www` -> 容器 `/var/www`，只读。
- 宿主机 `/opt/docker-compose/caddy/Caddyfile` -> 容器 `/etc/caddy/Caddyfile`，只读。
- 容器命令为 `caddy run --config /etc/caddy/Caddyfile --adapter caddyfile`。

这里的“只读”只限制容器；宿主机上的 `/var/www` 仍由 `deploy` 正常写入，Caddy 会看到更新后的文件。

因此 Caddyfile 的 `root` 可以直接写 `/var/www/ecomcanopy.site/current`。部署前仍建议用 `docker inspect` 复核；如果实际挂载与上述不一致，停止并上报。

---

## 5. 第一阶段：切换 Caddy root

### 5.1 确认 Caddy 挂载与运行用户

```bash
sudo docker ps --filter name=caddy
sudo docker inspect caddy --format '{{range .Mounts}}{{println .Source " => " .Destination " (rw=" .RW ")"}}{{end}}'
sudo docker inspect caddy --format '{{json .Config.Cmd}}'
sudo docker inspect caddy --format '{{.Config.User}}'
```

预期结果：

- `/var/www => /var/www (rw=false)`。
- `/opt/docker-compose/caddy/Caddyfile => /etc/caddy/Caddyfile (rw=false)`。
- `.Config.Cmd` 为 `["caddy","run","--config","/etc/caddy/Caddyfile","--adapter","caddyfile"]`。
- `2019/tcp` 只在容器内部，未发布到宿主机；`caddy reload` 通过 `docker exec` 在容器内执行。
- Caddy 容器运行用户；如果为空，通常表示 `root`。如果是非 root UID，必须确认它能读取 `current/`。

如果实际挂载与上述不一致，停止实施并上报；不要自行重建 Caddy 容器。

### 5.2 迁移现有 Demo Site

先看目录内容：

```bash
ls -la /var/www/ecomcanopy.site
```

创建新站点根目录：

```bash
sudo mkdir -p /var/www/ecomcanopy.site/current
```

如果 Demo Site 文件直接位于父目录，把它们迁入 `current/`：

```bash
sudo find /var/www/ecomcanopy.site -mindepth 1 -maxdepth 1 \
    ! -name current ! -name tmp ! -name releases \
    -exec mv -t /var/www/ecomcanopy.site/current/ {} +
```

执行前必须先看 `ls -la` 结果，确认父目录中没有其他站点或系统文件。不要在不确认的情况下使用通配符移动。

如果不想在迁移与切换 `root` 之间出现短暂 404，可以把上面的 `mv` 换成 `cp -a`，等 Caddyfile 切换并验证通过后，再删除父目录中的旧 Demo Site 文件。

检查：

```bash
ls -la /var/www/ecomcanopy.site/current
```

### 5.3 修改 Caddyfile

Caddyfile 是只读 bind mount，**不能在容器内直接写**。必须编辑宿主机源文件。

宿主机路径已确认：

```bash
CADDYFILE_HOST=/opt/docker-compose/caddy/Caddyfile
sudo test -f "$CADDYFILE_HOST"
```

查看当前内容：

```bash
sudo cat "$CADDYFILE_HOST"
```

备份：

```bash
sudo install -d -m 700 /var/backups/caddy
sudo cp -a "$CADDYFILE_HOST" "/var/backups/caddy/Caddyfile.$(date -u +%Y%m%dT%H%M%SZ)"
```

单文件 bind mount 绑定的是 inode；如果用 `sudoedit`、`sed -i` 或编辑器“另存为/重命名”，宿主机文件会被替换成新 inode，容器里的 `/etc/caddy/Caddyfile` 可能仍指向旧文件。

在现有站点块中把 `root` 改为：

```caddyfile
ecomcanopy.site {
    root * /var/www/ecomcanopy.site/current
    encode zstd gzip

    @astro path /_astro/*
    header @astro Cache-Control "public, max-age=31536000, immutable"

    @images path /images/*
    header @images Cache-Control "public, max-age=604800"

    @html not path /_astro/* /images/*
    header @html Cache-Control "no-cache"

    header {
        Strict-Transport-Security "max-age=31536000"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        X-Frame-Options "SAMEORIGIN"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
        -Server
    }

    respond /healthz "ok" 200
    file_server
}

www.ecomcanopy.site {
    redir https://ecomcanopy.site{uri} permanent
}
```

注意：

- 如果现有配置使用 `handle` / `route`，按原结构合并，不要整段覆盖。
- 不写 `tls` 指令；现有 Caddy 已管理证书。
- `root` 必须指向 `current`，不能指向父目录。
- 如果容器内路径与宿主机不同，把 `root` 换成容器内路径。
- `www` 需要新增 DNS 记录。

编辑并写回：

```bash
sudo cp -a "$CADDYFILE_HOST" /var/backups/caddy/Caddyfile.edit
sudoedit /var/backups/caddy/Caddyfile.edit
sudo cp /var/backups/caddy/Caddyfile.edit "$CADDYFILE_HOST"
sudo rm -f /var/backups/caddy/Caddyfile.edit
```

`cp` 写回时会打开并截断原文件，保留原 inode。写回后确认容器能看到新内容：

```bash
sudo docker exec caddy grep -n 'root \* /var/www/ecomcanopy.site/current' /etc/caddy/Caddyfile
```

### 5.4 校验与 reload

```bash
sudo docker exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

如果 reload 失败，旧配置通常会继续运行。先恢复备份，再 reload：

```bash
sudo cp -a /var/backups/caddy/Caddyfile.<timestamp> "$CADDYFILE_HOST"
sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

如果容器禁用了 admin API，`caddy reload` 会失败；此时只能安排维护窗口执行 `sudo docker restart caddy`，并记录短暂中断。

验证：

```bash
curl -I https://ecomcanopy.site/
sudo docker exec caddy ls -la /var/www/ecomcanopy.site/current
```

此时首页仍应显示 Demo Site；如果变成 404，先检查 `root` 与实际挂载路径。

---

## 6. 第二阶段：创建 deploy 用户与目录

### 6.1 创建用户

```bash
sudo useradd --user-group --no-create-home \
    --home-dir /var/www/.deploy-home \
    --shell /bin/bash deploy
sudo passwd -l deploy
```

说明：

- `--no-create-home` 先不创建 home，稍后手动创建并设置权限。
- home 放在 `/var/www/.deploy-home`，与 `deploy` 的发布范围保持一致。
- `passwd -l` 锁定密码，只允许 SSH 密钥登录。
- 不加入 `sudo` 组，不加入 `docker` 组。
- 如果 `deploy` 已经存在，改用 `sudo usermod -d /var/www/.deploy-home -m deploy` 更新 home，并重新核对权限。

### 6.2 创建目录与授权

```bash
sudo mkdir -p /var/www/.deploy-home
sudo mkdir -p /var/www/ecomcanopy.site/{tmp,releases}

sudo chown deploy:deploy /var/www
sudo chmod 755 /var/www
sudo chown -R deploy:deploy /var/www/ecomcanopy.site /var/www/.deploy-home
sudo chmod 755 /var/www/ecomcanopy.site /var/www/ecomcanopy.site/current
sudo chmod 700 /var/www/.deploy-home /var/www/ecomcanopy.site/{tmp,releases}

sudo find /var/www/ecomcanopy.site/current -type d -exec chmod 755 {} \;
sudo find /var/www/ecomcanopy.site/current -type f -exec chmod 644 {} \;
```

说明：

- `/var/www` 归 `deploy` 所有，后续新站点目录可以由 `deploy` 直接创建。
- 本站只把现有 `/var/www/ecomcanopy.site` 递归交给 `deploy`；如果 `/var/www` 下还有其它站点也要交给它管理，先逐个确认再 `chown` 或使用 ACL，不要无差别递归修改整个 `/var/www`。
- `tmp/` 与 `releases/` 为 `700`，且不在 `current/` 下。

### 6.3 验证权限

```bash
sudo -l -U deploy
id deploy
getent group docker
sudo -u deploy test -w /var/www && echo "/var/www writable"
sudo -u deploy test -w /var/www/ecomcanopy.site/current && echo "current writable"
sudo -u deploy test ! -w /opt && echo "outside /var/www not writable"
```

预期：

- `sudo -l -U deploy` 显示该用户不能运行 sudo。
- `id deploy` 不包含 `docker` 组。
- `/var/www` 可写。
- `current` 可写。
- `/opt` 不可写。

`sudo -l -U deploy` 输出 `User deploy is not allowed to run sudo on ...` 且退出码为 `1`，是预期结果，不是报错。它表示查询完成，`deploy` 没有任何 sudo 规则。

---

## 7. 第三阶段：rsync 与 SSH

先确认 SSH 端口与防火墙，不要直接改 `sshd`：

```bash
sudo sshd -T | grep -i '^port'
sudo ss -ltnp | grep ':55222'
sudo ufw status verbose
```

如果当前不是 `55222`，保留现有登录会话，修改 `/etc/ssh/sshd_config.d/` 下的配置，先执行 `sudo sshd -t`，通过后再 reload；防火墙与云厂商安全组放行 `55222/tcp`，确认新端口可登录后，才断开旧会话。

### 7.1 安装 rsync

由管理员执行，不能由 `deploy` 执行：

```bash
sudo apt-get update
sudo apt-get install -y rsync
rsync --version
sudo -u deploy rsync --version
```

`deploy` 必须能执行 `rsync`，但不需要 `sudo`。

### 7.2 重新生成部署密钥

在本地生成新的 ed25519 密钥，不复用旧密钥：

```bash
ssh-keygen -t ed25519 -a 100 \
    -C "ecomcanopy-deploy@github-actions" \
    -f "$HOME/.ssh/ecomcanopy-deploy_ed25519" \
    -N ""
```

说明：

- GitHub Actions 无法交互输入 passphrase，所以私钥不设口令。
- 私钥只保存到 GitHub Secret 与本地 `~/.ssh`，不进入仓库。
- 如果同名文件已存在，换一个新文件名，不要覆盖。

### 7.3 安装公钥

把公钥上传到 VPS 临时目录：

```bash
scp -P 55222 "$HOME/.ssh/ecomcanopy-deploy_ed25519.pub" \
    <admin>@104.233.188.111:/tmp/ecomcanopy-deploy.pub
```

由管理员安装到 `deploy` 的 home：

```bash
ssh -p 55222 <admin>@104.233.188.111 "
    set -e
    sudo install -d -m 700 -o deploy -g deploy /var/www/.deploy-home/.ssh
    if [ -f /var/www/.deploy-home/.ssh/authorized_keys ]; then
        sudo cp -a /var/www/.deploy-home/.ssh/authorized_keys \
            /var/www/.deploy-home/.ssh/authorized_keys.bak.$(date -u +%Y%m%dT%H%M%SZ)
    fi
    sudo install -m 600 -o deploy -g deploy /tmp/ecomcanopy-deploy.pub \
        /var/www/.deploy-home/.ssh/authorized_keys
    rm -f /tmp/ecomcanopy-deploy.pub
"
```

测试新密钥：

```bash
ssh -p 55222 -i "$HOME/.ssh/ecomcanopy-deploy_ed25519" \
    -o IdentitiesOnly=yes deploy@104.233.188.111 "id; pwd"
```

预期 `pwd` 为 `/var/www/.deploy-home`。

新密钥验证通过后，删除 `authorized_keys` 中的旧公钥，并撤销旧私钥。旧私钥一旦泄露，必须立即轮换。

### 7.4 记录 known_hosts

非默认端口必须使用方括号格式：

```bash
ssh-keyscan -p 55222 -t ed25519 104.233.188.111
```

输出类似：

```text
[104.233.188.111]:55222 ssh-ed25519 AAAA...
```

核对指纹：

```bash
ssh-keyscan -p 55222 -t ed25519 104.233.188.111 | ssh-keygen -lf -
```

在 VPS 上查看主机公钥指纹：

```bash
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

两组指纹一致后，再把 `known_hosts` 行保存为 GitHub Secret。

---

## 8. GitHub Actions 设计

实际文件：`.github/workflows/deploy.yml`；发布步骤在 `scripts/release.sh`。

触发条件：

- `push` tag：`v*.*.*`。
- 手动 `workflow_dispatch`。
- 不监听 `push` 到 `main`。
- `concurrency` 保证同一时间只有一个发布。

```yaml
on:
    push:
        tags:
            - "v*.*.*"
    workflow_dispatch:

permissions:
    contents: read

concurrency:
    group: production-deploy
    cancel-in-progress: false
```

Secrets：

| Secret | 用途 |
| --- | --- |
| `VPS_HOST` | `104.233.188.111` |
| `VPS_PORT` | `55222` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | 新生成的部署私钥全文 |
| `VPS_KNOWN_HOSTS` | `[104.233.188.111]:55222 ...` 整行 |

建议 deploy job 使用 GitHub Environment `production`，需要人工 Approve。

Job 设计：

1. `build`：`pnpm install --frozen-lockfile`、`pnpm build`、上传 `dist` artifact。
2. `deploy`：下载 artifact、写入 SSH 私钥与 `known_hosts`、上传到 `tmp/<timestamp>`、备份、发布、健康检查、失败回滚。

SSH 配置：

```bash
mkdir -p ~/.ssh
printf '%s\n' "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
printf '%s\n' "${{ secrets.VPS_KNOWN_HOSTS }}" > ~/.ssh/known_hosts
chmod 600 ~/.ssh/known_hosts
```

rsync 命令必须显式带端口：

```bash
rsync -az --no-o --no-g --delete --itemize-changes \
    -e "ssh -p ${VPS_PORT} -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes" \
    dist/ "${VPS_USER}@${VPS_HOST}:/var/www/ecomcanopy.site/tmp/${STAMP}/"
```

---

## 9. 发布流程

GitHub Actions 会调用 `scripts/release.sh`；本地手动发布也可以复用同一个脚本。以下分步命令用于说明脚本内部流程。

### 9.1 构建

```bash
pnpm install --frozen-lockfile
pnpm build
```

`dist/` 应包含：

```text
index.html
cases/index.html
cases/fulfillment-ai/index.html
images/...
```

### 9.2 上传到临时目录

```bash
VPS_HOST=104.233.188.111
VPS_PORT=55222
VPS_USER=deploy
REMOTE=/var/www/ecomcanopy.site
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "mkdir -p $REMOTE/tmp/$STAMP"

rsync -az --no-o --no-g --delete --itemize-changes \
    -e "ssh -p $VPS_PORT" \
    dist/ "$VPS_USER@$VPS_HOST:$REMOTE/tmp/$STAMP/"
```

注意 `dist/` 末尾的斜杠：表示复制目录内容，而不是目录本身。

`deploy` 不是 `root`，不能保留源文件的 owner/group；`--no-o --no-g` 可以避免 rsync 因 chown/chgrp 失败而返回错误。

### 9.3 备份当前版本

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "
    set -e
    mkdir -p $REMOTE/releases/$STAMP
    rsync -a --delete $REMOTE/current/ $REMOTE/releases/$STAMP/
"
```

### 9.4 发布到 current

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "
    set -e
    rsync -a --delete --delay-updates --chmod=D755,F644 \
        $REMOTE/tmp/$STAMP/ $REMOTE/current/
"
```

`--delay-updates` 会把新文件先写到临时名称，再统一 rename，减少用户看到半个文件的机会。

### 9.5 清理临时目录

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "rm -rf $REMOTE/tmp/$STAMP"
```

### 9.6 健康检查

```bash
curl -fsS https://ecomcanopy.site/ >/dev/null
curl -fsS https://ecomcanopy.site/cases/ >/dev/null
curl -fsS https://ecomcanopy.site/cases/fulfillment-ai/ >/dev/null
curl -fsS https://ecomcanopy.site/images/home-warehouse-wide.jpg >/dev/null
curl -fsS https://ecomcanopy.site/healthz >/dev/null
```

还要确认内部目录没有被公开：

```bash
test "$(curl -s -o /dev/null -w '%{http_code}' https://ecomcanopy.site/tmp/)" != "200"
test "$(curl -s -o /dev/null -w '%{http_code}' https://ecomcanopy.site/releases/)" != "200"
```

### 9.7 失败回滚

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "
    set -e
    test -d $REMOTE/releases/<timestamp>
    rsync -a --delete --delay-updates --chmod=D755,F644 \
        $REMOTE/releases/<timestamp>/ $REMOTE/current/
"
```

回滚后重新执行健康检查。

### 9.8 清理旧备份

保留最近 3 个备份：

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "
    ls -1dt $REMOTE/releases/*/ | tail -n +4 | xargs -r rm -rf --
"
```

执行前先看列表，确认不会删除正在使用的备份：

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "ls -1dt $REMOTE/releases/*/"
```

---

## 10. 回滚与版本

查看备份：

```bash
ssh -p 55222 deploy@104.233.188.111 "ls -1dt /var/www/ecomcanopy.site/releases/*/"
```

回滚：

```bash
ssh -p 55222 deploy@104.233.188.111 "
    set -e
    rsync -a --delete --delay-updates --chmod=D755,F644 \
        /var/www/ecomcanopy.site/releases/<timestamp>/ \
        /var/www/ecomcanopy.site/current/
"
```

回滚后验证：

```bash
curl -fsS https://ecomcanopy.site/ >/dev/null
curl -fsS https://ecomcanopy.site/cases/ >/dev/null
curl -fsS https://ecomcanopy.site/cases/fulfillment-ai/ >/dev/null
```

不需要重启 Caddy；下次请求会读取恢复后的文件。

---

## 11. 验收清单

### 11.1 VPS 与权限

- [ ] SSH 只监听 `55222`，防火墙允许该端口。
- [ ] `deploy` 用户存在，密码已锁定，只能密钥登录。
- [ ] `deploy` 不在 `sudo` 组，不在 `docker` 组。
- [ ] `deploy` 对 `/var/www` 有写权限，可创建后续站点目录。
- [ ] `rsync` 已安装，`deploy` 可以执行。
- [ ] 新密钥验证通过，旧公钥已删除。
- [ ] `VPS_KNOWN_HOSTS` 使用 `[IP]:55222` 格式，指纹已核对。

### 11.2 目录与 Caddy

- [ ] `/var/www` 为 `deploy:deploy 755`。
- [ ] `/var/www/.deploy-home` 为 `deploy:deploy 700`。
- [ ] `/var/www/ecomcanopy.site` 为 `deploy:deploy 755`。
- [ ] `current/` 为 `deploy:deploy 755`，文件 `644`。
- [ ] `tmp/`、`releases/` 为 `deploy:deploy 700`。
- [ ] Caddyfile 宿主机 `/opt/docker-compose/caddy/Caddyfile` 已备份。
- [ ] Caddyfile 从宿主机 `/opt/docker-compose/caddy/Caddyfile` 只读挂载到容器 `/etc/caddy/Caddyfile`。
- [ ] 宿主机 `/var/www` 以只读方式挂载到容器 `/var/www`。
- [ ] Caddy `root` 指向 `/var/www/ecomcanopy.site/current`。
- [ ] `caddy validate` 通过后再 `reload`。
- [ ] `https://ecomcanopy.site/tmp/` 与 `/releases/` 返回 404。

### 11.3 发布

- [ ] `pnpm build` 通过。
- [ ] `pnpm check` 结果如实记录；当前失败，不写成通过。
- [ ] `dist` 包含 3 个页面与 `images/`。
- [ ] 首次使用手动 `workflow_dispatch` 发布。
- [ ] 上传、备份、发布、健康检查全部通过。
- [ ] 回滚测试成功。
- [ ] 保留最近 3 个备份。

### 11.4 站点

- [ ] `https://ecomcanopy.site/` 返回 200。
- [ ] `/cases/` 返回 200。
- [ ] `/cases/fulfillment-ai/` 返回 200。
- [ ] 图片路径不再 404。
- [ ] `http://ecomcanopy.site` 308 到 HTTPS。
- [ ] `https://www.ecomcanopy.site` 可用并 301 到主域。
- [ ] HSTS、`X-Content-Type-Options`、`Referrer-Policy` 存在。
- [ ] HTML 为 `Cache-Control: no-cache`。
- [ ] `/_astro/` 与 `/images/` 缓存头符合预期。
- [ ] gzip/zstd 生效。

---

## 12. 风险

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 先创建 `tmp/` 与 `releases/`，后切 Caddy root | 备份可能被公开访问 | 严格按第 0.2 节顺序执行 |
| Caddy 挂载被改动 | Caddy 404 或读不到站点 | 部署前用 `docker inspect` 复核 `/var/www` 与 Caddyfile 挂载 |
| Caddyfile 是只读 mount | 容器内写入失败 | 编辑宿主机 `/opt/docker-compose/caddy/Caddyfile`，不在容器内改 |
| Caddyfile 写错 | 站点不可用 | 修改前备份；先 `validate`；失败恢复并 reload |
| SSH 端口改动不当 | 无法登录 | 保留旧会话；先 `sshd -t`；防火墙放行 `55222` |
| `deploy` 无 sudo | 无法安装 rsync | 管理员一次性安装；发布前验证 |
| `deploy` 对 `/var/www` 有写权限 | 一个密钥可修改全部站点 | 保护私钥；后续可按站点拆分部署密钥或 ACL |
| 私钥泄露 | 可发布恶意内容到所有站点 | 立即轮换密钥；删除旧公钥；只存 GitHub Secret |
| `rsync --delete` 路径写错 | 删除当前站点甚至其它站点文件 | 先 `--dry-run`；路径写全；禁止对 `/var/www` 整体执行 `--delete` |
| 备份占满磁盘 | 本站或其它站点发布失败 | 每个站点只保留 3 个备份；监控 `df -h`；必要时分盘 |
| 原地更新短暂混合版本 | 短暂显示不一致 | `--delay-updates`；低流量时发布 |
| HTML 被缓存 | 发布后仍看到旧页 | HTML `no-cache`；必要时清 Cloudflare 缓存 |
| 固定文件名图片缓存 | 换图后显示旧图 | 加版本号或换文件名 |
| `www` 无 DNS 或站点块 | `www` 打不开 | 添加 DNS 与 Caddy 站点块 |
| Email Routing 未配置 | 联系邮箱不可用 | 上线前确认 |
| `pnpm check` 失败 | 类型检查缺失 | 如实记录；不写成通过 |

---

## 13. 费用

| 环节 | 费用 | 说明 |
| --- | --- | --- |
| VPS | 已有成本 | Caddy 已独立部署 |
| 域名 | 年费 | 已有 |
| Cloudflare DNS | 免费 | 灰云直连 |
| GitHub Actions | 公开仓库免费 | 只构建静态文件 |
| GHCR | **不再使用** | 不推送镜像 |
| Caddy | 已有 | 容器独立管理 |
| TLS | 免费 | 现有 Caddy 自动管理 |

---

## 14. 文件清单

已新增：

```text
scripts/release.sh
.github/workflows/deploy.yml
```

预计后续修改：

```text
README.md
ARCHITECTURE.md
CONTEXT.md
CHANGELOG.md
docs/decisions.md
docs/requirements/website-plan-v1.2.md
```

明确不再新增：

```text
Dockerfile
docker-compose.yml
GHCR 镜像配置
```

现有 Caddy 的 Caddyfile 由 VPS 独立管理；本仓库只提供接入片段。

---

## 15. 待确认

实施前仍需：

1. 确认 `/opt/docker-compose/caddy/Caddyfile` 的 `root` 指向 `/var/www/ecomcanopy.site/current`。
2. 确认 `/var/www/ecomcanopy.site`、`current/`、`tmp/`、`releases/` 与 `/var/www/.deploy-home` 的权限。
3. 确认 `deploy` 可以执行 `rsync`，但无 `sudo`、无 Docker 权限。
4. 确认 GitHub `production` Environment 的审批规则与 Secrets 已生效。
5. `/var/www` 下是否已有其它站点需要交给 `deploy` 管理；如有，逐个确认 `chown` 或 ACL。
6. `www.ecomcanopy.site` 是否现在补 DNS。
7. Cloudflare Email Routing 是否已配置。

确认后执行首次手动发布，并完成线上验收。
