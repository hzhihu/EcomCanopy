#!/usr/bin/env python3
"""生成阶段 1a 的资产候选稿：logo、favicon 预览图与 OG 分享图。

为什么用脚本而不是手工导出：图标形状来自
src/components/icons/TreeMark.astro，手工重抄坐标容易与源码漂移；
脚本直接复用同一份路径数据，保证「站内图形 = 资产图形」。
"""

import re
from pathlib import Path

from PIL import Image, ImageDraw

repoRoot = Path(__file__).resolve().parent.parent
outputDir = repoRoot / "docs" / "seo" / "candidates"
imageDir = repoRoot / "public" / "images"

# 与 src/styles 中的设计令牌保持一致
colorInk = "#141413"
colorPaper = "#faf9f5"

# 以下路径数据逐字取自 src/components/icons/TreeMark.astro
treePaths = [
    (
        (4, 5),
        "M-1 17Q-1 13.2108 0.0783 9.8218Q1.0968 6.621 2.95 4.15Q4.7657 1.7291 "
        "7.0935 0.3841Q9.4891 -1 12 -1Q14.5109 -1 16.9065 0.3841Q19.2343 1.7291 "
        "21.05 4.15Q22.9032 6.621 23.9217 9.8218Q25 13.2108 25 17L23 17Q23 13.5213 "
        "22.0158 10.4282Q21.1001 7.5501 19.45 5.35Q17.8797 3.2562 15.906 2.1159"
        "Q13.9747 1 12 1Q10.0253 1 8.094 2.1159Q6.1203 3.2562 4.55 5.35Q2.8999 7.5501 "
        "1.9842 10.4282Q1 13.5213 1 17L-1 17Z",
    ),
    (
        (9, 10),
        "M-1 12Q-1 6.6327 1.3367 2.8495Q2.4331 1.0743 3.8536 0.0732Q5.3764 -1 7 -1"
        "Q8.6236 -1 10.1464 0.0732Q11.5669 1.0743 12.6633 2.8495Q15 6.6327 15 12L13 12"
        "Q13 7.2006 10.9617 3.9005Q10.0803 2.4734 8.9942 1.708Q7.9896 1 7 1"
        "Q6.0104 1 5.0058 1.708Q3.9197 2.4734 3.0383 3.9005Q1 7.2006 1 12L-1 12Z",
    ),
    ((0, 0), "M15 22H17V28H15V22Z"),
    ((0, 0), "M3 27H29V29H3V27Z"),
]


def parsePathD(d: str) -> list[list[tuple[float, float]]]:
    """把只含 M/Q/L/H/V/Z 的路径解析成多边形顶点。

    二次贝塞尔按固定步数采样，配合 8 倍超采样后看不出棱角。
    """
    tokens = re.findall(r"[MQLHVZ]|-?\d+(?:\.\d+)?", d)
    subPaths: list[list[tuple[float, float]]] = []
    current: list[tuple[float, float]] = []
    startX = startY = 0.0
    x = y = 0.0
    index = 0

    while index < len(tokens):
        cmd = tokens[index]
        index += 1
        if cmd == "M":
            x, y = float(tokens[index]), float(tokens[index + 1])
            index += 2
            if current:
                subPaths.append(current)
            current = [(x, y)]
            startX, startY = x, y
        elif cmd == "L":
            x, y = float(tokens[index]), float(tokens[index + 1])
            index += 2
            current.append((x, y))
        elif cmd == "H":
            x = float(tokens[index])
            index += 1
            current.append((x, y))
        elif cmd == "V":
            y = float(tokens[index])
            index += 1
            current.append((x, y))
        elif cmd == "Q":
            cx, cy = float(tokens[index]), float(tokens[index + 1])
            nx, ny = float(tokens[index + 2]), float(tokens[index + 3])
            index += 4
            for step in range(1, 25):
                t = step / 24
                inv = 1 - t
                current.append(
                    (
                        inv * inv * x + 2 * inv * t * cx + t * t * nx,
                        inv * inv * y + 2 * inv * t * cy + t * t * ny,
                    )
                )
            x, y = nx, ny
        elif cmd == "Z":
            if current:
                subPaths.append(current)
            current = []
            x, y = startX, startY

    if current:
        subPaths.append(current)
    return subPaths


def renderTree(size: int, color: str, scale: float = 0.8) -> Image.Image:
    """把树形标记渲染成指定边长的透明底图片。"""
    superSample = 8
    canvas = Image.new("RGBA", (size * superSample, size * superSample), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    unit = size * superSample / 32 * scale
    # 路径包围盒中心约为 (16, 16.5)，平移到画布中心
    offsetX = size * superSample / 2 - 16 * unit
    offsetY = size * superSample / 2 - 16.5 * unit
    for (moveX, moveY), d in treePaths:
        for points in parsePathD(d):
            draw.polygon(
                [
                    ((px + moveX) * unit + offsetX, (py + moveY) * unit + offsetY)
                    for px, py in points
                ],
                fill=color,
            )
    return canvas.resize((size, size), Image.LANCZOS)


def makeLogo() -> None:
    """组织标志：深色圆角底 + 树形图标。

    不放文字：实测 44px 时文字已看不清，只留图形在 60–112px 仍可辨认。
    """
    side = 512
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((0, 0, side - 1, side - 1), radius=112, fill=colorInk)
    canvas.alpha_composite(renderTree(300, colorPaper, scale=0.7), (106, 106))
    canvas.save(outputDir / "logo-512.png")


def makeFaviconPreview() -> None:
    """favicon 预览图：深色圆角底 + 纸白树形。"""
    side = 512
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).rounded_rectangle(
        (0, 0, side - 1, side - 1), radius=112, fill=colorInk
    )
    canvas.alpha_composite(renderTree(side, colorPaper, scale=0.62))
    canvas.save(outputDir / "favicon-preview.png")


def makeOgImage(sourceName: str, outName: str) -> None:
    """按 1200×630 居中裁切。

    两张源图比例都不是 1.9:1，必须先放大到「短边刚好覆盖」再裁，
    直接裁会被拉扁。放大比例分别约 1.6%（文章图）与 25%（首页图）。

    用 JPEG q88：无损 PNG 有 0.9–1.0 MB，JPEG 只有 144–158 KB，
    缩略图尺度看不出差别（2026-11-24 用户确认）。
    """
    image = Image.open(imageDir / sourceName).convert("RGB")
    width, height = image.size
    targetW, targetH = 1200, 630
    scale = max(targetW / width, targetH / height)
    resized = image.resize((round(width * scale), round(height * scale)), Image.LANCZOS)
    left = (resized.size[0] - targetW) // 2
    top = (resized.size[1] - targetH) // 2
    cropped = resized.crop((left, top, left + targetW, top + targetH))
    cropped.save(outputDir / outName, quality=88, optimize=True, progressive=True)


def main() -> None:
    outputDir.mkdir(parents=True, exist_ok=True)
    makeLogo()
    makeFaviconPreview()
    for sourceName, stem in [
        ("home-warehouse-wide.jpg", "og-home"),
        ("home-warehouse-wide.jpg", "og-cases"),
        ("article-cover-warehouse.jpg", "og-fulfillment-ai"),
    ]:
        makeOgImage(sourceName, stem + ".jpg")


if __name__ == "__main__":
    main()
