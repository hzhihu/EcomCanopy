#!/usr/bin/env bash

# 中文注释：GitHub Actions 与本地手动发布共用此脚本。
# 使用前先在仓库根目录执行 pnpm build。
#
# 必需环境变量：
#   VPS_HOST
#   VPS_PORT
#   VPS_USER
#   VPS_SSH_KEY_PATH
# 可选环境变量：
#   VPS_KNOWN_HOSTS_PATH  默认 ~/.ssh/known_hosts
#   DIST_DIR              默认 dist
#   REMOTE_ROOT           默认 /var/www/ecomcanopy.site
#   SITE_URL              默认 https://ecomcanopy.site
#   KEEP_RELEASES         默认 3

set -euo pipefail

vpsHost="${VPS_HOST:?VPS_HOST is required}"
vpsPort="${VPS_PORT:?VPS_PORT is required}"
vpsUser="${VPS_USER:?VPS_USER is required}"
sshKeyPath="${VPS_SSH_KEY_PATH:?VPS_SSH_KEY_PATH is required}"
knownHostsPath="${VPS_KNOWN_HOSTS_PATH:-$HOME/.ssh/known_hosts}"
distDir="${DIST_DIR:-dist}"
remoteRoot="${REMOTE_ROOT:-/var/www/ecomcanopy.site}"
siteUrl="${SITE_URL:-https://ecomcanopy.site}"
keepReleases="${KEEP_RELEASES:-3}"

siteUrl="${siteUrl%/}"
if ! [[ "$keepReleases" =~ ^[0-9]+$ ]] || (( keepReleases < 1 )); then
    echo "KEEP_RELEASES must be an integer >= 1" >&2
    exit 1
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
stagingDir="$remoteRoot/tmp/$stamp"
backupDir="$remoteRoot/releases/$stamp"
backupReady=0

sshOptions=(
    -p "$vpsPort"
    -i "$sshKeyPath"
    -o IdentitiesOnly=yes
    -o StrictHostKeyChecking=yes
    -o BatchMode=yes
    -o "UserKnownHostsFile=$knownHostsPath"
)

# 尽早检查依赖，避免上传到一半才发现缺少命令或密钥。
for commandName in ssh rsync curl; do
    command -v "$commandName" >/dev/null 2>&1 || {
        echo "Missing command: $commandName" >&2
        exit 1
    }
done

[[ -d "$distDir" ]] || {
    echo "Build output not found: $distDir" >&2
    exit 1
}

[[ -f "$distDir/index.html" ]] || {
    echo "Build output is missing index.html: $distDir" >&2
    exit 1
}

[[ -f "$sshKeyPath" ]] || {
    echo "SSH key not found: $sshKeyPath" >&2
    exit 1
}

[[ -f "$knownHostsPath" ]] || {
    echo "known_hosts not found: $knownHostsPath" >&2
    exit 1
}

cleanupStaging() {
    ssh "${sshOptions[@]}" "$vpsUser@$vpsHost" "rm -rf '$stagingDir'"
}

rollbackRelease() {
    if [[ "$backupReady" -ne 1 ]]; then
        return 0
    fi

    echo "Deployment failed; rolling back from $backupDir" >&2
    ssh "${sshOptions[@]}" "$vpsUser@$vpsHost" "
        set -e
        test -d '$backupDir'
        rsync -a --delete --delay-updates --chmod=D755,F644 \
            '$backupDir/' '$remoteRoot/current/'
    "

    cleanupStaging || true
}

# 备份完成后任何失败都自动回滚；成功后会解除 trap。
trap 'status=$?; if [[ $status -ne 0 ]]; then rollbackRelease; fi; exit $status' EXIT

echo "Uploading $distDir to $vpsUser@$vpsHost:$stagingDir"
ssh "${sshOptions[@]}" "$vpsUser@$vpsHost" "mkdir -p '$stagingDir'"

rsync -az --no-o --no-g --delete --itemize-changes \
    -e "ssh -p $vpsPort -i '$sshKeyPath' -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o BatchMode=yes -o 'UserKnownHostsFile=$knownHostsPath'" \
    "$distDir/" "$vpsUser@$vpsHost:$stagingDir/"

echo "Backing up current release to $backupDir"
ssh "${sshOptions[@]}" "$vpsUser@$vpsHost" "
    set -e
    mkdir -p '$backupDir'
    rsync -a --delete '$remoteRoot/current/' '$backupDir/'
"
backupReady=1

echo "Publishing to $remoteRoot/current"
ssh "${sshOptions[@]}" "$vpsUser@$vpsHost" "
    set -e
    rsync -a --delete --delay-updates --chmod=D755,F644 \
        '$stagingDir/' '$remoteRoot/current/'
"

echo "Running health checks"
curl -fsS --retry 3 --retry-delay 2 --retry-connrefused "$siteUrl/" >/dev/null
curl -fsS --retry 3 --retry-delay 2 --retry-connrefused "$siteUrl/cases/" >/dev/null
curl -fsS --retry 3 --retry-delay 2 --retry-connrefused "$siteUrl/cases/fulfillment-ai/" >/dev/null
curl -fsS --retry 3 --retry-delay 2 --retry-connrefused "$siteUrl/images/home-warehouse-wide.jpg" >/dev/null
curl -fsS --retry 3 --retry-delay 2 --retry-connrefused "$siteUrl/healthz" >/dev/null

# 内部目录不能直接返回 200。
tmpStatus="$(curl -sS -o /dev/null -w '%{http_code}' "$siteUrl/tmp/")"
releasesStatus="$(curl -sS -o /dev/null -w '%{http_code}' "$siteUrl/releases/")"
test "$tmpStatus" != "200"
test "$releasesStatus" != "200"

trap - EXIT

cleanupStaging || echo "Warning: failed to clean staging directory $stagingDir" >&2

ssh "${sshOptions[@]}" "$vpsUser@$vpsHost" "
    ls -1dt '$remoteRoot/releases/'*/ | tail -n +$((keepReleases + 1)) | xargs -r rm -rf --
" || echo "Warning: failed to prune old releases" >&2

echo "Deployed $stamp successfully."
