# EcomCanopy VPS 静态目录发布手册

状态：**Phase 5 实施中：发布脚本与工作流已创建，首次生产发布待执行**
最后更新：2026-11-24
目标 VPS：`104.233.188.111`（境外，Ubuntu 24.04.5 LTS，x86_64）
SSH 端口：`55222`
部署用户：`deploy`，对 `/var/www` 有操作权限
Caddy 容器：`caddy`
Caddy 容器 ID：`67021f66c770`
Caddy 镜像：`caddy:2.11.2-geoip`
Caddyfile 宿主机：`/opt/docker-compose/caddy/Caddyfile`
站点挂载：宿主机 `/var/www` -> 容器 `/var/www`，只读
共享发布根目录：`/var/www`
站点根目录：`/var/www/ecomcanopy.site/current`
部署方式：GitHub Actions → rsync → 备份 → 原地更新 → 现有 Caddy

本手册按实施阶段编写。`scripts/release.sh` 与 `.github/workflows/deploy.yml` 已创建；首次生产发布尚未执行。

---

## 1. 实施顺序

顺序不能颠倒：

1. 确认 Caddyfile 与站点目录挂载。
2. 创建 `current/`，迁移现有 Demo Site。
3. 把 Caddyfile `root` 改到 `current/`，`validate` 后 `reload`。
4. 创建 `/var/www/.deploy-home`、`deploy` 用户与本站 `tmp/`、`releases/`。
5. 安装 `rsync`，配置 SSH `55222` 与新密钥。
6. 配置 GitHub Actions Secrets。
7. 首次手动发布并测试回滚。

第 3 步必须在第 4 步之前：Caddy 仍以父目录为 `root` 时，`tmp/` 与 `releases/` 可能被公开访问。

---

## 2. 确认 Caddy 容器

查看容器、挂载与运行用户：

```bash
sudo docker ps --filter name=caddy
sudo docker inspect caddy --format '{{range .Mounts}}{{println .Source " => " .Destination " (rw=" .RW ")"}}{{end}}'
sudo docker inspect caddy --format '{{json .Config.Cmd}}'
sudo docker inspect caddy --format '{{.Config.User}}'
```

已确认的值：

- 宿主机 `/var/www` -> 容器 `/var/www`，只读。
- 宿主机 `/opt/docker-compose/caddy/Caddyfile` -> 容器 `/etc/caddy/Caddyfile`，只读。
- 启动命令为 `caddy run --config /etc/caddy/Caddyfile --adapter caddyfile`。
- `2019/tcp` 未发布到宿主机，`caddy reload` 在容器内执行。
- Caddy 运行用户需要看 `.Config.User`；如果为空，通常表示 `root`。

“只读”只限制容器；宿主机上的 `/var/www` 仍由 `deploy` 写入，Caddy 会看到更新后的文件。

如果实际挂载与上述不一致，停止实施并上报；不要自行重建 Caddy 容器。

查看 Caddyfile：

```bash
sudo docker exec caddy cat /etc/caddy/Caddyfile
```

注意：Caddy 官方镜像没有 ENTRYPOINT，容器内命令必须显式写 `caddy`。

---

## 3. 创建 current 并切换 Caddy root

### 3.1 迁移 Demo Site

先看目录：

```bash
ls -la /var/www/ecomcanopy.site
```

创建新站点根目录：

```bash
sudo mkdir -p /var/www/ecomcanopy.site/current
```

确认父目录没有其他站点或系统文件后，把 Demo Site 顶层文件迁入：

```bash
sudo find /var/www/ecomcanopy.site -mindepth 1 -maxdepth 1 \
    ! -name current ! -name tmp ! -name releases \
    -exec mv -t /var/www/ecomcanopy.site/current/ {} +
```

如果不想出现短暂 404，可以把 `mv` 换成 `cp -a`，等 Caddyfile 切换并验证通过后，再删除父目录中的旧文件。

检查：

```bash
ls -la /var/www/ecomcanopy.site/current
```

### 3.2 修改宿主机 Caddyfile

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

单文件 bind mount 绑定的是 inode；不要用 `sudoedit`、`sed -i` 或编辑器“另存为/重命名”直接改宿主机文件，否则容器可能仍看到旧文件。

把站点 `root` 改为：

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

如果现有配置使用 `handle` / `route`，按原结构合并，不要整段覆盖。如果容器内路径与宿主机不同，`root` 必须写容器内路径。

### 3.3 校验与 reload

```bash
sudo docker exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

失败时恢复备份并重新 reload：

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

此时首页仍应显示 Demo Site；如果 404，先检查 `root` 与挂载路径。

---

## 4. 创建 deploy 用户与目录

### 4.1 创建用户

```bash
sudo useradd --user-group --no-create-home \
    --home-dir /var/www/.deploy-home \
    --shell /bin/bash deploy
sudo passwd -l deploy
```

`deploy` 不加入 `sudo` 组，不加入 `docker` 组。

如果 `deploy` 已经存在，改用 `sudo usermod -d /var/www/.deploy-home -m deploy` 更新 home，并重新核对权限。

### 4.2 创建目录与授权

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

目录职责：

| 路径 | 用途 |
| --- | --- |
| `/var/www` | `deploy` 可管理的共享发布根目录 |
| `/var/www/.deploy-home` | `deploy` 的 SSH home，只放 `.ssh` |
| `/var/www/ecomcanopy.site` | 本站目录 |
| `current/` | Caddy 站点根目录，只放公开静态文件 |
| `tmp/` | 上传临时目录，成功后清理 |
| `releases/` | 备份目录，保留最近 3 个 |

说明：`/var/www` 归 `deploy` 所有，后续新站点目录可以由它创建。不要给任何站点设置 `root` 为 `/var/www` 本身，否则 `.deploy-home` 等目录可能被公开。如果 `/var/www` 下已有其它站点也要交给 `deploy` 管理，先逐个确认再 `chown` 或使用 ACL，不要无差别递归修改整个 `/var/www`。新站点的 Caddyfile 站点块仍需管理员配置，`deploy` 不能编辑 Caddyfile 或 reload Caddy。

### 4.3 验证权限

```bash
sudo -l -U deploy
id deploy
getent group docker
sudo -u deploy test -w /var/www && echo "/var/www writable"
sudo -u deploy test -w /var/www/ecomcanopy.site/current && echo "current writable"
sudo -u deploy test ! -w /opt && echo "outside /var/www not writable"
```

`sudo -l -U deploy` 预期输出 `User deploy is not allowed to run sudo on ...`，退出码为 `1`。这是正确结果，不是报错；它表示 `deploy` 没有任何 sudo 规则。

---

## 5. 安装 rsync 与配置 SSH

先确认 SSH 端口与防火墙：

```bash
sudo sshd -T | grep -i '^port'
sudo ss -ltnp | grep ':55222'
sudo ufw status verbose
```

如果当前不是 `55222`，保留现有登录会话，修改 `/etc/ssh/sshd_config.d/` 下的配置，先执行 `sudo sshd -t`，通过后再 reload；防火墙与云厂商安全组放行 `55222/tcp`，确认新端口可登录后，才断开旧会话。

### 5.1 安装 rsync

由管理员执行：

```bash
sudo apt-get update
sudo apt-get install -y rsync
rsync --version
sudo -u deploy rsync --version
```

### 5.2 生成新密钥

在本地执行：

```bash
ssh-keygen -t ed25519 -a 100 \
    -C "ecomcanopy-deploy@github-actions" \
    -f "$HOME/.ssh/ecomcanopy-deploy_ed25519" \
    -N ""
```

私钥只保存到本地与 GitHub Secret，不进入仓库。

### 5.3 安装公钥

```bash
scp -P 55222 "$HOME/.ssh/ecomcanopy-deploy_ed25519.pub" \
    <admin>@104.233.188.111:/tmp/ecomcanopy-deploy.pub
```

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

测试：

```bash
ssh -p 55222 -i "$HOME/.ssh/ecomcanopy-deploy_ed25519" \
    -o IdentitiesOnly=yes deploy@104.233.188.111 "id; pwd"
```

预期 `pwd` 为 `/var/www/.deploy-home`。新密钥验证通过后，删除旧公钥并撤销旧私钥。

### 5.4 记录 known_hosts

```bash
ssh-keyscan -p 55222 -t ed25519 104.233.188.111
ssh-keyscan -p 55222 -t ed25519 104.233.188.111 | ssh-keygen -lf -
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

`known_hosts` 行使用方括号格式：

```text
[104.233.188.111]:55222 ssh-ed25519 AAAA...
```

两组指纹一致后，再保存为 GitHub Secret。

---

## 6. GitHub Actions 配置

实际工作流文件：`.github/workflows/deploy.yml`；发布逻辑在 `scripts/release.sh`。

触发方式只有两种：

| 事件 | 是否发布 | 用途 |
| --- | --- | --- |
| 推送 `v*.*.*` tag | 是 | 正式发布 |
| 手动 `workflow_dispatch` | 是 | 首次发布、重试、紧急发布 |
| 推送 `main` | 否 | 不自动发布 |

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

| Secret | 值 |
| --- | --- |
| `VPS_HOST` | `104.233.188.111` |
| `VPS_PORT` | `55222` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | 新生成的部署私钥全文 |
| `VPS_KNOWN_HOSTS` | `[104.233.188.111]:55222 ...` 整行 |

建议 deploy job 使用 GitHub Environment `production`，需要人工 Approve。

SSH 准备：

```bash
mkdir -p ~/.ssh
printf '%s\n' "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
printf '%s\n' "${{ secrets.VPS_KNOWN_HOSTS }}" > ~/.ssh/known_hosts
chmod 600 ~/.ssh/known_hosts
```

Job：

1. `build`：安装依赖、`pnpm build`、上传 `dist` artifact。
2. `deploy`：下载 artifact、上传 `tmp/<timestamp>`、备份、发布、健康检查、失败回滚。

---

## 7. 手动发布一次

推荐使用仓库内的发布脚本；它会完成暂存上传、备份、发布、健康检查与失败回滚：

```bash
export VPS_HOST=104.233.188.111
export VPS_PORT=55222
export VPS_USER=deploy
export VPS_SSH_KEY_PATH="$HOME/.ssh/ecomcanopy-deploy_ed25519"
export VPS_KNOWN_HOSTS_PATH="$HOME/.ssh/known_hosts"

pnpm build
bash scripts/release.sh
```

下面的分步命令用于理解流程或故障排查。

### 7.1 构建

```bash
pnpm install --frozen-lockfile
pnpm build
```

### 7.2 上传到临时目录

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

`deploy` 不是 `root`，不能保留源文件的 owner/group；`--no-o --no-g` 可以避免 rsync 因 chown/chgrp 失败而返回错误。

### 7.3 备份当前版本

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "
    set -e
    mkdir -p $REMOTE/releases/$STAMP
    rsync -a --delete $REMOTE/current/ $REMOTE/releases/$STAMP/
"
```

### 7.4 发布到 current

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "
    set -e
    rsync -a --delete --delay-updates --chmod=D755,F644 \
        $REMOTE/tmp/$STAMP/ $REMOTE/current/
"
```

### 7.5 清理临时目录

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "rm -rf $REMOTE/tmp/$STAMP"
```

### 7.6 验证

```bash
curl -fsS https://ecomcanopy.site/ >/dev/null
curl -fsS https://ecomcanopy.site/cases/ >/dev/null
curl -fsS https://ecomcanopy.site/cases/fulfillment-ai/ >/dev/null
curl -fsS https://ecomcanopy.site/images/home-warehouse-wide.jpg >/dev/null
curl -fsS https://ecomcanopy.site/healthz >/dev/null
```

确认内部目录未被公开：

```bash
test "$(curl -s -o /dev/null -w '%{http_code}' https://ecomcanopy.site/tmp/)" != "200"
test "$(curl -s -o /dev/null -w '%{http_code}' https://ecomcanopy.site/releases/)" != "200"
```

### 7.7 回滚

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "
    set -e
    rsync -a --delete --delay-updates --chmod=D755,F644 \
        $REMOTE/releases/<timestamp>/ $REMOTE/current/
"
```

---

## 8. 验收

```bash
curl -I http://ecomcanopy.site
curl -I https://ecomcanopy.site
curl -I https://www.ecomcanopy.site
curl -I https://ecomcanopy.site/healthz
```

浏览器检查：

- 首页不再是 `Demo Site`。
- 桌面端与手机端布局正常。
- 控制台无报错。
- 内部链接无 404。
- 图片正常加载。

权限检查：

```bash
sudo -l -U deploy
id deploy
ls -la /var/www
ls -la /var/www/.deploy-home
ls -la /var/www/ecomcanopy.site
ls -la /var/www/ecomcanopy.site/current
sudo docker exec caddy ls -la /var/www/ecomcanopy.site/current
```

再次说明：`sudo -l -U deploy` 的 “not allowed to run sudo” 输出和退出码 `1` 是预期结果。

---

## 9. 故障排查

| 现象 | 检查 |
| --- | --- |
| 仍显示 Demo Site | Caddy `root` 是否为 `current/`；文件是否已迁入 |
| 403 | Caddy 用户是否能读 `current/`；权限是否为 755/644 |
| 404 | 文件是否在 `current/`；`index.html` 是否存在 |
| `/tmp/` 或 `/releases/` 可访问 | Caddy `root` 是否误指父目录 |
| Caddyfile 写入失败 | 它是只读 bind mount；改宿主机 `/opt/docker-compose/caddy/Caddyfile` |
| Caddy reload 失败 | 先 `caddy validate`；恢复备份配置 |
| `www` 打不开 | DNS 是否有 `www`；Caddy 是否有站点块 |
| 发布后旧页面 | HTML 是否 `no-cache`；Cloudflare 是否缓存 |
| 图片旧版本 | 文件名固定；加版本号或换文件名 |
| rsync 不存在 | 管理员安装 `rsync`；确认 `deploy` 可执行 |
| `deploy` 无法写站点 | `/var/www` 或站点目录 owner 是否正确；已有其它站点是否只做了 ACL |
| 误删其它站点 | 检查是否对 `/var/www` 整体执行了 `rsync --delete`；路径必须写到具体站点 |
| SSH 连不上 | 端口 `55222`、防火墙/安全组、`sshd -T`、`AllowUsers`/`DenyUsers`、`known_hosts` |

常用命令：

```bash
sudo docker ps --filter name=caddy
sudo docker exec caddy cat /etc/caddy/Caddyfile
ls -la /var/www
ls -la /var/www/ecomcanopy.site
ls -1dt /var/www/ecomcanopy.site/releases/*/
```

---

## 10. 上线后

- 观察 24 小时，确认页面、图片、证书和日志正常。
- 保留最近 3 个备份。
- 更新 `CHANGELOG.md` 与 `CONTEXT.md`。
- 如实记录 `pnpm check` 仍因 TypeScript 7 失败。
- 确认 Cloudflare Email Routing 的 MX/TXT 未被改动。
- 不要对外宣称未验证的项目或客户成果。
