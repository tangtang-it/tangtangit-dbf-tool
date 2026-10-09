# AGENTS.md - tangtangit-dbf-tool

## 项目定位
- 纯前端本地离线 DBF to Excel 在线批量转换工具 (`https://dbf.tangtangit.com/`)。
- 技术栈: Vite + 原生 JavaScript / Web Workers + 纯前端流式解析库。
- 核心卖点: 100% 浏览器本地离线解析，支持 dBase III/IV 及 Visual FoxPro 格式，智能自动嗅探 GBK/UTF-8 编码，零数据上传保障企业数据私密安全。

## 构建与部署
- 开发服务: `npm run dev`
- 生产构建: `npm run build`
- 静态部署: 构建产物输出至 `dist/`，部署于静态托管平台 (如 Cloudflare Pages / Vercel / Nginx)。

## SEO 与规范约定
- 路由规范: URL 严禁在内链中使用 `.html` 伪静态后缀，统一使用干净路由（如 `/features` 而非 `/features.html`），防止触发 308 重定向。
- 结构化数据: 维持 `WebApplication` 实体定义；FAQPage 仅做辅助语义，避免对富媒体展示产生误判。
- 国际化规范: 严格维护独立多语言子目录与对应 `hreflang` 矩阵（中文对应 `zh-CN`，英文对应 `en`）。
