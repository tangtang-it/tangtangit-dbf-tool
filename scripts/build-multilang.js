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
    code: 'en',
    htmlLang: 'en',
    dir: '',
    name: 'English',
    title: 'DBF to Excel Converter Online - Free Batch XLSX Export',
    description: '100% Free online DBF to Excel converter. Batch convert dBase III/IV and FoxPro .dbf files to XLSX/CSV with automatic encoding detection. 100% private in-browser tool.',
    keywords: 'dbf to excel, convert dbf to excel, dbf to xlsx, dbf converter, dbase to excel, free dbf viewer',
    h1: 'DBF to Excel Converter Online: Free Batch XLSX & CSV Export',
    lead: 'Professional, privacy-first <strong>dbf to excel</strong> web converter for financial ledgers, legacy ERP data, and accounting records. Automatically detects GBK, UTF-8, and ANSI encodings with zero server uploads.'
  },
  {
    code: 'zh-CN',
    htmlLang: 'zh-CN',
    dir: 'zh',
    name: '简体中文',
    title: 'DBF to Excel 在线转换工具 | 免费批量将 DBF 转为 Excel (XLSX)',
    description: '免费专业的 DBF to Excel 在线转换工具，支持批量将 DBF 转为 Excel (XLSX) 表格。自动识别 GBK/UTF-8 中文编码，流式处理超大文件，数据 100% 本机安全处理不上传。',
    keywords: 'dbf to excel, dbf转excel, dbf to xlsx, dbf, excel, dbf文件转换, 财务台账转换, gbk编码',
    h1: 'DBF to Excel 在线转换工具：快速批量将 DBF 转为 Excel',
    lead: '专为财务与 ERP 数据打造的 <strong>dbf to excel</strong> 在线转换工具。自动识别 GBK / UTF-8 中文编码，支持批量将 DBF 格式快速转换为 Excel (XLSX) 文件，数据全程本机处理，安全高效。'
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