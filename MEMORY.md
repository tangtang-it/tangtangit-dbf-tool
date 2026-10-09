# MEMORY.md - tangtangit-dbf-tool

## 项目定位
- 纯前端本地离线 DBF to Excel 在线批量转换工具 (`https://dbf.tangtangit.com/`)。
- 技术栈: Vite + Vue 3 + 原生 JavaScript / Web Workers + 纯前端流式解析库。
- 核心价值: 100% 浏览器本地离线解析，支持 dBase III/IV 及 Visual FoxPro 格式，智能自动嗅探与纠偏 GBK/UTF-8 编码，零数据上传保障财务与企业隐私安全。

---

## 阶段成果归档 (Phase Retrospective)

### 阶段一：Immediate Blockers（阻断级缺陷修复）
- **[2026-10-09] 根除站内 308 重定向**: 全站（包括 `index.html`、子页面及 Vue 导航组件 `SiteNav.vue`、`SiteFooter.vue`）全面清理内链中的 `.html` 后缀（如 `/features.html` -> `/features`），彻底消除 13 处重定向跳数，避免权重流失。
- **[2026-10-09] 修正语言属性与清理重复 hreflang**: 将主入口 `<html lang="en">` 纠正为 `<html lang="zh-CN">`，清理 `<head>` 中重复插入的第二套 `hreflang` 标签，确保搜索引擎精准识别中文内容。

### 阶段二：Quick Wins（高收益速赢落地）
- **[2026-10-09] 社交分享卡片标准化 (OG / Twitter Image)**: 将原 SVG 矢量图升级为符合主流社交平台规范的 1200x630 分辨率 PNG 标准图 (`/brand/og-share.png`)，补齐 `og:image:width` 与 `og:image:height`，恢复 Twitter/微信卡片渲染。
- **[2026-10-09] 注入安全标头 (Security Headers)**: 在托管配置文件 `public/_headers` 中注入 `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`，补齐 HSTS 安全防护。

### 阶段三：Strategic Improvements（战略演进与结构化数据重构）
- **[2026-10-09] 重构 Schema.org 结构化数据**:
  - 移除已废弃且对富媒体无收益的 `FAQPage` 结构（顺应 Google 算法对普通站 FAQ 富媒体展示降级趋势，避免过度优化误判）。
  - 新增 `BreadcrumbList` 面包屑导航结构化数据（Home > 在线转换工具），强化页面层级与 SERP 面包屑展示。
  - 深度扩充 `WebApplication` 实体：补充 `softwareVersion: "1.0.0"`、`operatingSystem: "WebBrowser"`、`applicationCategory: "UtilitiesApplication"`、`applicationSubCategory: "File Converter"` 与 5 项高价值功能特性清单 (`featureList`)。
- **[2026-10-09] SEO 标题与首屏 H1 长尾词升级**:
  - Title 升级为高权重双语结构：`DBF to Excel 在线转换工具 - 免费批量导出 XLSX/CSV (免安装本地处理)`。
  - 优化 Meta Description（129 字符，处于 120~155 字符最佳区间），精准捕获“DBF转Excel”、“FoxPro/dBase”、“GBK乱码解决”及本地离线安全等搜索意图。
  - 首屏 H1 与 lead 导语联动强化长尾词，并在 `index.html`、`src/views/HomeView.vue`、`scripts/build-multilang.js` 保持同步一致。

---

## 关键架构决策记录 (ADR)
- **ADR-001 [路由规范]**: URL 严禁在内链中添加 `.html` 后缀，统一使用干净路由（如 `/features` 而非 `/features.html`），静态托管通过配置目录重写，杜绝 308 重定向。
- **ADR-002 [结构化数据]**: 以 `WebApplication` 为核心应用实体，辅以 `BreadcrumbList`、`WebSite` 与 `Organization`。放弃废弃的 `FAQPage` 富媒体标记，将常见问题保留在正文语义中即可。
- **ADR-003 [多语言构建流水线]**: 采用构建后静态拆分机制（`scripts/build-multilang.js`），通过统一语言配置表生成多语言子目录及包含双向 `xhtml:link` 的完整 `sitemap.xml`。

---

## 未来规划 (Roadmap & Next Steps)
- [ ] **多语言落地页内容全量本地化**: 针对 `/en/`、`es/`、`pt/` 子目录，将页面深层的文章指南及常见问题翻译为纯正目标语言正文。
- [ ] **性能监控与 Web Vitals 自动化追踪**: 集成轻量级客户端性能监控，确保大文件在 Web Workers 中流式解析时的交互响应度 (INP) 与主线程丝滑流畅。
- [ ] **自动化 SEO 巡检 CI 门禁**: 在 GitHub Actions 中增加针对内链 `.html`、hreflang 完整性及结构化数据的自动化测试校验。
