# SEO Action Plan: https://dbf.tangtangit.com/

<!-- Generated: 2026-10-09 -->
<!-- Target: 针对 dbf.tangtangit.com 的优先修复与升级排期 -->

## 阶段一：Immediate Blockers（立即解决 - 预计耗时 30 分钟）

### 1. 修复站内导航全部 308 重定向
- **现状**: 站内 13 处链接使用 .html，如 <a href="/features.html">、<a href="/index.html#tool">，均触发 308 重定向。
- **动作**: 全局替换 index.html 中的站内链接：
  - `/features.html` -> `/features`
  - `/about.html` -> `/about`
  - `/privacy.html` -> `/privacy`
  - `/terms.html` -> `/terms`
  - `/contact.html` -> `/contact`
  - `/index.html` -> `/`
  - `/index.html#tool` -> `/#tool`
- **预期收益**: 彻底杜绝内部权重流失，避免搜索引擎蜘蛛产生额外的抓取跳数。

### 2. 修复语言声明与 hreflang 标签重复
- **现状**: <html lang="en"> 与正文中文冲突，hreflang 标签重复输出了 2 组。
- **动作**:
  - 当前根页面将 <html lang="en"> 改为 <html lang="zh-CN">（或依照多语言规划拆分 / 与 /en/）。
  - 清理 <head> 中重复插入的 5 条 <link rel="alternate" hreflang="..."> 标签。
- **预期收益**: 纠正搜索引擎对页面语种的识别错误，提高在中文搜索“DBF转Excel”中的检索相关性。

---

## 阶段二：Quick Wins（高收益速赢 - 预计耗时 1 小时）

### 3. 优化社交分享图格式 (OG / Twitter Image)
- **现状**: twitter:image 为 SVG 矢量图，主流社交平台（Twitter/Discord/微信）无法解析渲染 SVG 预览卡片。
- **动作**: 生成 1200x630 分辨率的标准 WebP/PNG 预览图（如 /brand/og-share.png），并补充 og:image:width 与 og:image:height。

### 4. 补齐 Web 服务器安全标头 (Security Headers)
- **现状**: 缺失 HSTS，安全评分仅 65。
- **动作**: 在 Nginx / Vercel / Cloudflare 中注入响应头：
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

---

## 阶段三：Strategic Improvements（战略演进 - 预计耗时 1~2 天）

### 5. 落地国际化独立多语言落地页架构 (根据哥飞多语言SEO标准)
- **现状**: 目前根目录为中文正文配英文 Title，无法兼顾海外与国内流量。
- **动作**:
  - `/` (或 `/zh/`): 标题聚焦 `DBF to Excel 在线转换工具 - 批量免安装 FoxPro/dBase 转 XLSX`
  - `/en/`: 独立全英文落地页，标题 `Free DBF to Excel Converter Online - Batch Export XLSX & CSV`
  - 精确配置 hreflang 互相指向。

### 6. 重构 Schema.org 结构化数据
- **动作**:
  - 将无富媒体效益的 FAQPage 移出或精简，增加 BreadcrumbList 面包屑结构。
  - 在 WebApplication 中注入 softwareVersion: "1.0.0" 与 operatingSystem: "WebBrowser"，并补充功能特性列表。
