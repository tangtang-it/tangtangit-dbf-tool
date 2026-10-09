import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://dbf.tangtangit.com';
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('[ERROR] dist/index.html not found! Run "vite build" first.');
  process.exit(1);
}

const originalTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

export const languages = [
  {
    code: 'zh-CN',
    htmlLang: 'zh-CN',
    dir: '',
    name: '简体中文',
    title: 'DBF to Excel 在线转换工具 - 免费批量导出 XLSX/CSV (免安装本地处理)',
    description: '免费专业 DBF to Excel 在线转换工具，支持 Visual FoxPro 与 dBase III/IV 批量导出 XLSX/CSV 表格。智能解决 GBK 中文乱码，100% 浏览器本地离线解析，免安装且零数据上传，彻底保障财务与企业数据隐私安全。',
    keywords: 'dbf to excel, dbf转excel, dbf to xlsx, foxpro转excel, dbase转excel, dbf导出csv, gbk乱码解决, 免安装dbf转换',
    h1: 'DBF to Excel 在线转换工具：快速批量将 FoxPro/dBase 转为 Excel (XLSX/CSV)',
    lead: '专为财务与 ERP 数据打造的 <strong>dbf to excel</strong> 在线转换工具。自动解决 GBK / UTF-8 中文乱码，支持将 Visual FoxPro 及 dBase DBF 格式快速批量导出为 Excel (XLSX) 与 CSV 文件，100% 浏览器本地离线处理，保障数据安全。'
  },
  {
    code: 'en',
    htmlLang: 'en',
    dir: 'en',
    name: 'English',
    title: 'DBF to Excel Converter Online - Free Batch XLSX Export',
    description: '100% Free online DBF to Excel converter. Batch convert dBase III/IV and FoxPro .dbf files to XLSX/CSV with automatic encoding detection. 100% private in-browser tool.',
    keywords: 'dbf to excel, convert dbf to excel, dbf to xlsx, dbf converter, dbase to excel, free dbf viewer',
    h1: 'DBF to Excel Converter Online: Free Batch XLSX & CSV Export',
    lead: 'Professional, privacy-first <strong>dbf to excel</strong> web converter for financial ledgers, legacy ERP data, and accounting records. Automatically detects GBK, UTF-8, and ANSI encodings with zero server uploads.'
  },
  {
    code: 'es',
    htmlLang: 'es',
    dir: 'es',
    name: 'Español',
    title: 'Convertidor DBF a Excel Online - Gratis por Lotes a XLSX',
    description: 'Convertidor profesional gratuito de DBF a Excel online. Convierta archivos dBase y FoxPro .dbf a XLSX en lote con detección automática de codificación. 100% privado en navegador.',
    keywords: 'dbf a excel, convertir dbf a excel, dbf a xlsx, convertidor dbf, visor dbf online',
    h1: 'Convertidor DBF a Excel Online: Exportación Gratuita por Lotes a XLSX',
    lead: 'Herramienta online profesional para convertir <strong>archivos DBF a Excel</strong>. Procesamiento 100% local en su navegador con detección automática de codificación y sin subir datos a servidores.'
  },
  {
    code: 'pt',
    htmlLang: 'pt',
    dir: 'pt',
    name: 'Português',
    title: 'Conversor DBF para Excel Online - Grátis em Lote para XLSX',
    description: 'Conversor profissional e gratuito de DBF para Excel online. Converta arquivos .dbf de dBase e FoxPro para XLSX com segurança e privacidade 100% no navegador.',
    keywords: 'dbf para excel, converter dbf em excel, dbf para xlsx, conversor dbf gratis, abrir dbf online',
    h1: 'Conversor DBF para Excel Online: Conversão Rápida em Lote para XLSX',
    lead: 'Ferramenta online para converter <strong>arquivos DBF em planilhas Excel (XLSX)</strong>. Processamento 100% local no navegador com suporte a arquivos grandes de ERP e contabilidade.'
  }
];

const hreflangLines = [
  '  <link rel="alternate" hreflang="x-default" href="' + BASE_URL + '/" />'
];
for (const l of languages) {
  const url = l.dir ? BASE_URL + '/' + l.dir + '/' : BASE_URL + '/';
  hreflangLines.push('  <link rel="alternate" hreflang="' + l.code + '" href="' + url + '" />');
}
const hreflangTags = hreflangLines.join('\n');

for (const lang of languages) {
  let html = originalTemplate;
  const isRoot = !lang.dir;
  const targetDir = isRoot ? DIST_DIR : path.join(DIST_DIR, lang.dir);
  const targetFile = path.join(targetDir, 'index.html');
  const canonicalUrl = isRoot ? BASE_URL + '/' : BASE_URL + '/' + lang.dir + '/';

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  html = html.replace(/<html[^>]*>/i, '<html lang="' + lang.htmlLang + '">');
  html = html.replace(/<title>.*?<\/title>/i, '<title>' + lang.title + '</title>');
  html = html.replace(/<meta name="description" content=".*?"\s*\/?>/i, '<meta name="description" content="' + lang.description + '">');
  html = html.replace(/<meta name="keywords" content=".*?"\s*\/?>/i, '<meta name="keywords" content="' + lang.keywords + '">');

  // Strip any existing hreflang tags first to avoid duplicates
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*"[^>]*\/?>/gi, '');
  const canonicalTag = '<link rel="canonical" href="' + canonicalUrl + '">\n' + hreflangTags;
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/i, canonicalTag);

  html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, '<meta property="og:title" content="' + lang.title + '">');
  html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, '<meta property="og:description" content="' + lang.description + '">');
  html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/i, '<meta property="og:url" content="' + canonicalUrl + '">');

  html = html.replace(/<h1>.*?<\/h1>/i, '<h1>' + lang.h1 + '</h1>');
  html = html.replace(/<p class="lead">.*?<\/p>/is, '<p class="lead">' + lang.lead + '</p>');

  fs.writeFileSync(targetFile, html, 'utf-8');
  console.log('[OK] Generated ' + targetFile);
}

let sitemapLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
];
for (const l of languages) {
  const loc = l.dir ? BASE_URL + '/' + l.dir + '/' : BASE_URL + '/';
  sitemapLines.push('  <url>');
  sitemapLines.push('    <loc>' + loc + '</loc>');
  sitemapLines.push('    <lastmod>2026-10-01</lastmod>');
  sitemapLines.push('    <changefreq>weekly</changefreq>');
  sitemapLines.push('    <priority>' + (l.dir === '' ? '1.0' : '0.9') + '</priority>');
  for (const other of languages) {
    const otherLoc = other.dir ? BASE_URL + '/' + other.dir + '/' : BASE_URL + '/';
    sitemapLines.push('    <xhtml:link rel="alternate" hreflang="' + other.code + '" href="' + otherLoc + '"/>');
  }
  sitemapLines.push('    <xhtml:link rel="alternate" hreflang="x-default" href="' + BASE_URL + '/"/>');
  sitemapLines.push('  </url>');
}
sitemapLines.push('</urlset>');
const sitemapXml = sitemapLines.join('\n');

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapXml, 'utf-8');
console.log('[OK] Generated sitemap.xml with full hreflang matrix');