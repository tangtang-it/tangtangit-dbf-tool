# tangtangit-dbf-tool

# DBF <-> XLSX 快速转换工具

中文环境下 DBF 与 Excel 表格的高性能双向转换工具。
读 DBF 自动检测编码（GBK 优先），写 DBF 默认 GBK，兼容国内老财务/ERP 软件。
转换全部在**浏览器本地**完成（纯前端 JS），文件绝不上传服务器。

> 项目已按 **Vue 3 + Vite** 规范重构为多页面应用（MPA），页面结构与外观保持不变，
> 仅技术栈由原生 JS + esbuild 升级为 Vue 单文件组件 + Vite。

## 快速上手

需要 Node.js 18+，全部依赖由 npm 管理：

```bash
npm install          # 安装依赖（vue / vite / xlsx / jszip）
npm run dev          # 本地开发服务器 http://localhost:5173（热更新）
npm run build        # 打包生产产物 → dist/ 目录
npm run preview      # 本地预览 dist/ 产物 http://localhost:4173
```

> ⚠️ 构建产物在 `dist/` 目录（纯静态站点）。若直接双击打开 `dist/*.html`，
> 部分浏览器可能因 `file://` 限制无法加载 ES Module，建议通过 `npm run preview`
> 或任意静态服务器访问。

## npm 脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 本地开发（Vite，热更新） |
| `npm run build` | 打包生产产物 → `dist/`（多页面 + 资源哈希 + 静态资源复制） |
| `npm run preview` | 本地预览 `dist/` 产物 |

## Web 界面功能

- 完整多页面网站：首页、功能特性、关于、联系我们、隐私政策、服务条款
- 拖拽 / 点击多选上传 `.dbf` / `.xlsx` 文件
- 转换方向自动识别，也可手动指定（DBF→XLSX / XLSX→DBF）
- DBF 编码可选：自动检测（读）/ GBK / UTF-8
- 每个文件独立显示转换结果（行数、字段数、编码、警告），失败显示原因
- 单个文件直接下载，成功结果可一键打包 ZIP
- 文件全程在浏览器本地处理，绝不上传服务器
- 响应式布局，适配手机 / 平板 / 桌面

## 项目结构（Vue 规范）

```
dbf-tool/
├── index.html              # 首页入口
├── features.html           # 功能特性页入口
├── about.html              # 关于我们页入口
├── contact.html            # 联系我们页入口
├── privacy.html            # 隐私政策页入口
├── terms.html              # 服务条款页入口
├── vite.config.js          # Vite 多页面构建配置
├── src/
│   ├── main-home.js        # 各页面 Vue 挂载入口（main-*.js）
│   ├── styles/main.css     # 全站全局样式（Anthropic 暖色编辑风）
│   ├── components/         # 共享组件
│   │   ├── SiteNav.vue     #   顶部导航（汉堡菜单 + 下拉）
│   │   ├── SiteFooter.vue  #   页脚
│   │   ├── Starfield.vue   #   Hero 星空装饰
│   │   └── ConvertTool.vue #   在线转换工具核心逻辑
│   ├── views/              # 页面视图
│   │   ├── HomeView.vue
│   │   ├── FeaturesView.vue
│   │   ├── AboutView.vue
│   │   ├── ContactView.vue
│   │   ├── PrivacyView.vue
│   │   └── TermsView.vue
│   └── utils/              # 纯 JS 工具模块（ES Module）
│       ├── dbf.js          #   DBF 解析/写入引擎（GBK 编码）
│       ├── converter.js    #   DBF⇄XLSX 转换流程
│       └── download.js     #   下载 / 文件读取辅助
├── public/                 # 静态资源（构建时原样复制到 dist/）
│   ├── favicon.svg
│   ├── brand/              # 关联站点图标
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── _headers            # Cloudflare Pages 安全响应头
│   └── _redirects          # Cloudflare Pages 404 兜底
└── DESIGN.md               # 设计规范（Anthropic 暖色编辑风）
```

## 部署到 Cloudflare Pages

构建产物 `dist/` 是**纯静态站点**，转换引擎已全部用浏览器端 JS 实现，可部署到
Cloudflare Pages 等任何静态托管。

### 方式一：Wrangler CLI（推荐）

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=你的项目名   # 首次部署
wrangler pages deploy dist --project-name=你的项目名    # 后续更新
```

### 方式二：Cloudflare Dashboard

1. 打开 [Cloudflare Pages](https://pages.cloudflare.com/) → **Create a project** → **Connect to Git**
2. 选择仓库，构建配置填：
   - **Build command（构建命令）**：`npm run build`
   - **Build output directory（构建输出目录）**：`dist`
3. 点击 Save and Deploy 即可

> 说明：`public/` 内含 `_headers`（安全响应头）与 `_redirects`（404 兜底），构建后会自动复制进 `dist/`，Cloudflare Pages 会识别应用。

### 上线前待办
- 将各 HTML 的 `<meta name="canonical">`、`robots.txt`、`sitemap.xml` 中的 `YOUR-DOMAIN.example.com` 替换为真实域名
- 需要广告时，按需在页面中加入 AdSense 代码

## 字段类型映射

### DBF → XLSX

| DBF 类型 | XLSX 类型 |
|---|---|
| C 字符 | 文本 |
| N / F 数值 | 数字（保留小数位） |
| D 日期 | 日期 |
| L 逻辑 | 布尔 |
| I 整型 / T 时间戳 / M 备注 | 数字 / 日期时间 / 文本 |

### XLSX → DBF（自动推断，两遍扫描）

| XLSX 列内容 | DBF 类型 |
|---|---|
| 全部为日期 | D（YYYYMMDD） |
| 全部为布尔 | L（T/F） |
| 全部为数字 | N（按最大整数位 + 小数位自动定长） |
| 其他（含文本） | C（按最大字节数定长，GBK 下中文按 2 字节计） |

> 输出统一使用 dBASE III 原生四种类型（C/N/D/L），兼容性最好。

## 工程细节与边界处理

- **编码**：读入时优先读取 DBF 头部的 language driver id（0x57=GBK），取不到默认 GBK；写出统一 GBK，可用编码选项切换 UTF-8
- **字段名**：非 ASCII / 超长字段名按 GBK 字节截断到 10 字节（不会切出半个汉字），非法字符替换为下划线，冲突自动追加序号
- **空值**：数字/日期空值写空格填充、逻辑空值写 `?`，读回时还原为 `None`
- **删除标记记录**：读取时自动跳过
- **大文件**：XLSX 单表上限 1,048,576 行，超限会提示拆分
- **备注字段**：`.fpt` 缺失时不报错，自动兜底

## 性能参考

| 操作 | 10 万行 × 4 字段 |
|---|---|
| 生成 DBF | 0.4s |
| DBF → XLSX | 3.8s |
| XLSX → DBF | 4.6s |
