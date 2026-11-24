import type { APIRoute } from "astro";
import { article } from "../data/content";

// 站点地址从 astro.config 的 site 取，避免在代码里再写一份域名
const getSiteUrl = (site: URL | undefined): URL => site ?? new URL("https://ecomcanopy.site");

const escapeXml = (value: string): string =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = ({ site }) => {
    const siteUrl = getSiteUrl(site);
    // 只有文章页有真实日期；首页与列表页省略 lastmod，错日期比没有更糟
    const entries = [
        { loc: new URL("/", siteUrl).href },
        { loc: new URL("/cases/", siteUrl).href },
        {
            loc: new URL(`/cases/${article.slug}/`, siteUrl).href,
            lastmod: article.date.replace(/\./g, "-"),
        },
    ];

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...entries.map((entry) =>
            [
                "    <url>",
                `        <loc>${escapeXml(entry.loc)}</loc>`,
                entry.lastmod ? `        <lastmod>${entry.lastmod}</lastmod>` : null,
                "    </url>",
            ]
                .filter((line) => line !== null)
                .join("\n"),
        ),
        "</urlset>",
        "",
    ].join("\n");

    return new Response(body, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
};
