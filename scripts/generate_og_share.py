# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
SCALE = 2
SW, SH = W * SCALE, H * SCALE

img = Image.new("RGBA", (SW, SH), (250, 249, 245, 255))
draw = ImageDraw.Draw(img)

# 1. 背景细腻暖白微渐变
for y in range(SH):
    f = y / SH
    r = int(251 * (1 - f) + 242 * f)
    g = int(250 * (1 - f) + 238 * f)
    b = int(246 * (1 - f) + 230 * f)
    draw.line([(0, y), (SW, y)], fill=(r, g, b, 255))

# 网格微点
step = 30 * SCALE
for x in range(step, SW, step):
    for y in range(step, SH, step):
        draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(215, 208, 198, 80))

def get_font(size, bold=False):
    s = int(size * SCALE)
    try:
        path = "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"
        return ImageFont.truetype(path, s)
    except Exception:
        return ImageFont.load_default()

font_title_brand = get_font(28, bold=True)
font_badge = get_font(14, bold=True)
font_card_head = get_font(22, bold=True)
font_card_sub = get_font(14, bold=False)
font_card_tag = get_font(13, bold=True)
font_center_title = get_font(17, bold=True)
font_center_sub = get_font(13, bold=False)
font_pill = get_font(13, bold=True)
font_url = get_font(14, bold=True)

def draw_shadow_box(box, radius):
    sx0, sy0, sx1, sy1 = box[0], box[1] + 5*SCALE, box[2], box[3] + 5*SCALE
    draw.rounded_rectangle([sx0, sy0, sx1, sy1], radius=radius, fill=(20, 20, 19, 24))

# ==================== 顶部品牌栏 ====================
icon_x, icon_y = 60 * SCALE, 40 * SCALE
icon_size = 48 * SCALE
draw.rounded_rectangle([icon_x, icon_y, icon_x + icon_size, icon_y + icon_size], radius=12*SCALE, fill=(204, 120, 92, 255))
draw.text((icon_x + 10*SCALE, icon_y + 8*SCALE), "DBF", font=get_font(16, bold=True), fill=(255, 255, 255, 255))
draw.text((icon_x + 14*SCALE, icon_y + 24*SCALE), ">>>", font=get_font(13, bold=True), fill=(255, 240, 230, 230))

draw.text((icon_x + icon_size + 16*SCALE, icon_y + 3*SCALE), "DBF to Excel 在线转换工具", font=font_title_brand, fill=(20, 20, 19, 255))
draw.text((icon_x + icon_size + 16*SCALE, icon_y + 33*SCALE), "企业级数据表离线互转 · 支持 dBase III/IV & Visual FoxPro", font=get_font(13, bold=False), fill=(108, 106, 100, 255))

badge_w = 370 * SCALE
badge_h = 40 * SCALE
badge_x = SW - 60 * SCALE - badge_w
badge_y = 44 * SCALE
draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=20*SCALE, fill=(228, 241, 231, 255), outline=(93, 184, 114, 255), width=2*SCALE)
draw.ellipse([badge_x + 16*SCALE, badge_y + 14*SCALE, badge_x + 28*SCALE, badge_y + 26*SCALE], fill=(45, 122, 68, 255))
draw.text((badge_x + 36*SCALE, badge_y + 9*SCALE), "100% 浏览器本地流式处理 · 零云端上传", font=font_badge, fill=(45, 122, 68, 255))

# ==================== 中间三大核心区 ====================
card_y = 120 * SCALE
card_h = 350 * SCALE

# 1. 左侧卡片
c1_x, c1_w = 60 * SCALE, 320 * SCALE
draw_shadow_box([c1_x, card_y, c1_x + c1_w, card_y + card_h], 16*SCALE)
draw.rounded_rectangle([c1_x, card_y, c1_x + c1_w, card_y + card_h], radius=16*SCALE, fill=(255, 255, 255, 255), outline=(230, 223, 216, 255), width=2*SCALE)

draw.rounded_rectangle([c1_x, card_y, c1_x + c1_w, card_y + 58*SCALE], radius=16*SCALE, fill=(204, 120, 92, 255))
draw.rectangle([c1_x, card_y + 36*SCALE, c1_x + c1_w, card_y + 58*SCALE], fill=(204, 120, 92, 255))
draw.text((c1_x + 22*SCALE, card_y + 14*SCALE), ".DBF 数据库文件", font=font_card_head, fill=(255, 255, 255, 255))

c1_in_y = card_y + 74*SCALE
draw.text((c1_x + 24*SCALE, c1_in_y), "dBASE III/IV · FoxPro · VFP", font=font_card_sub, fill=(108, 106, 100, 255))

row_y = c1_in_y + 30*SCALE
rows_info = [
    ("ID", "Integer (主键数值)"),
    ("NAME", "Character (定长字符)"),
    ("BALANCE", "Numeric (高精金额)"),
    ("MEMO", "Memo / .FPT 备注"),
]
for col_name, col_type in rows_info:
    draw.rounded_rectangle([c1_x + 24*SCALE, row_y, c1_x + c1_w - 24*SCALE, row_y + 25*SCALE], radius=4*SCALE, fill=(245, 242, 237, 255))
    draw.text((c1_x + 32*SCALE, row_y + 3*SCALE), col_name, font=get_font(11, bold=True), fill=(204, 120, 92, 255))
    draw.text((c1_x + 105*SCALE, row_y + 3*SCALE), col_type, font=get_font(11, bold=False), fill=(108, 106, 100, 255))
    row_y += 31*SCALE

draw.rounded_rectangle([c1_x + 24*SCALE, card_y + card_h - 52*SCALE, c1_x + c1_w - 24*SCALE, card_y + card_h - 18*SCALE], radius=8*SCALE, fill=(254, 243, 238, 255), outline=(238, 187, 170, 255), width=SCALE)
draw.text((c1_x + 32*SCALE, card_y + card_h - 45*SCALE), "✓ 智能识别 GBK / UTF-8 / CP936", font=font_card_tag, fill=(184, 97, 69, 255))

# 2. 中间流式引擎枢纽
hub_cx = (W // 2) * SCALE
hub_cy = (card_y + card_h // 2)

draw.ellipse([hub_cx - 125*SCALE, hub_cy - 125*SCALE, hub_cx + 125*SCALE, hub_cy + 125*SCALE], fill=(255, 255, 255, 180), outline=(230, 223, 216, 255), width=2*SCALE)
draw.ellipse([hub_cx - 105*SCALE, hub_cy - 105*SCALE, hub_cx + 105*SCALE, hub_cy + 105*SCALE], fill=(255, 255, 255, 255), outline=(204, 120, 92, 255), width=3*SCALE)

draw.arc([hub_cx - 118*SCALE, hub_cy - 118*SCALE, hub_cx + 118*SCALE, hub_cy + 118*SCALE], start=210, end=330, fill=(204, 120, 92, 255), width=5*SCALE)
draw.arc([hub_cx - 118*SCALE, hub_cy - 118*SCALE, hub_cx + 118*SCALE, hub_cy + 118*SCALE], start=30, end=150, fill=(16, 124, 65, 255), width=5*SCALE)

draw.text((hub_cx, hub_cy - 48*SCALE), "⚡ 流式转换引擎", font=font_center_title, fill=(20, 20, 19, 255), anchor="mm")
draw.text((hub_cx, hub_cy - 20*SCALE), "Web Workers 多线程", font=get_font(13, bold=True), fill=(204, 120, 92, 255), anchor="mm")
draw.line([(hub_cx - 60*SCALE, hub_cy - 6*SCALE), (hub_cx + 60*SCALE, hub_cy - 6*SCALE)], fill=(230, 223, 216, 255), width=SCALE)
draw.text((hub_cx, hub_cy + 12*SCALE), "百万行数据秒级处理", font=font_center_sub, fill=(108, 106, 100, 255), anchor="mm")
draw.text((hub_cx, hub_cy + 34*SCALE), "零内存溢出 · 流式写入", font=font_center_sub, fill=(108, 106, 100, 255), anchor="mm")

hub_top_w = 190 * SCALE
hub_top_x = hub_cx - hub_top_w // 2
draw.rounded_rectangle([hub_top_x, card_y - 2*SCALE, hub_top_x + hub_top_w, card_y + 26*SCALE], radius=14*SCALE, fill=(255, 255, 255, 255), outline=(204, 120, 92, 255), width=2*SCALE)
draw.text((hub_cx, card_y + 12*SCALE), "本地解析 · 隐私无忧", font=get_font(12, bold=True), fill=(204, 120, 92, 255), anchor="mm")

draw.rounded_rectangle([hub_top_x, card_y + card_h - 26*SCALE, hub_top_x + hub_top_w, card_y + card_h + 2*SCALE], radius=14*SCALE, fill=(255, 255, 255, 255), outline=(16, 124, 65, 255), width=2*SCALE)
draw.text((hub_cx, card_y + card_h - 12*SCALE), "直接拖拽 · 即刻转换", font=get_font(12, bold=True), fill=(16, 124, 65, 255), anchor="mm")

# 3. 右侧卡片
c3_x, c3_w = SW - 60 * SCALE - 320 * SCALE, 320 * SCALE
draw_shadow_box([c3_x, card_y, c3_x + c3_w, card_y + card_h], 16*SCALE)
draw.rounded_rectangle([c3_x, card_y, c3_x + c3_w, card_y + card_h], radius=16*SCALE, fill=(255, 255, 255, 255), outline=(230, 223, 216, 255), width=2*SCALE)

draw.rounded_rectangle([c3_x, card_y, c3_x + c3_w, card_y + 58*SCALE], radius=16*SCALE, fill=(16, 124, 65, 255))
draw.rectangle([c3_x, card_y + 36*SCALE, c3_x + c3_w, card_y + 58*SCALE], fill=(16, 124, 65, 255))
draw.text((c3_x + 22*SCALE, card_y + 14*SCALE), ".XLSX / .CSV 导出", font=font_card_head, fill=(255, 255, 255, 255))

c3_in_y = card_y + 74*SCALE
draw.text((c3_x + 24*SCALE, c3_in_y), "Excel 2007-365 · WPS · Numbers", font=font_card_sub, fill=(108, 106, 100, 255))

grid_top = c3_in_y + 30*SCALE
draw.rectangle([c3_x + 24*SCALE, grid_top, c3_x + c3_w - 24*SCALE, grid_top + 22*SCALE], fill=(234, 246, 238, 255), outline=(16, 124, 65, 120))
draw.text((c3_x + 36*SCALE, grid_top + 3*SCALE), "A: 序号", font=get_font(11, bold=True), fill=(16, 124, 65, 255))
draw.text((c3_x + 110*SCALE, grid_top + 3*SCALE), "B: 客户标识", font=get_font(11, bold=True), fill=(16, 124, 65, 255))
draw.text((c3_x + 205*SCALE, grid_top + 3*SCALE), "C: 金额/备注", font=get_font(11, bold=True), fill=(16, 124, 65, 255))

grid_rows = [
    ("1001", "北京企业客户", "¥ 128,500.00"),
    ("1002", "上海技术中心", "¥ 342,000.50"),
    ("1003", "深圳制造分部", "已归档备注正常"),
]
cur_row_y = grid_top + 22*SCALE
for c_a, c_b, c_c in grid_rows:
    draw.rectangle([c3_x + 24*SCALE, cur_row_y, c3_x + c3_w - 24*SCALE, cur_row_y + 24*SCALE], fill=(255, 255, 255, 255), outline=(230, 223, 216, 255))
    draw.text((c3_x + 36*SCALE, cur_row_y + 4*SCALE), c_a, font=get_font(10, bold=False), fill=(108, 106, 100, 255))
    draw.text((c3_x + 110*SCALE, cur_row_y + 4*SCALE), c_b, font=get_font(10, bold=False), fill=(20, 20, 19, 255))
    draw.text((c3_x + 205*SCALE, cur_row_y + 4*SCALE), c_c, font=get_font(10, bold=False), fill=(20, 20, 19, 255))
    cur_row_y += 24*SCALE

draw.rounded_rectangle([c3_x + 24*SCALE, card_y + card_h - 52*SCALE, c3_x + c3_w - 24*SCALE, card_y + card_h - 18*SCALE], radius=8*SCALE, fill=(234, 246, 238, 255), outline=(162, 217, 184, 255), width=SCALE)
draw.text((c3_x + 34*SCALE, card_y + card_h - 45*SCALE), "✓ 字段类型精度保留 · 排版结构无损", font=font_card_tag, fill=(16, 124, 65, 255))

# ==================== 底部特性亮点栏 ====================
pill_y = 508 * SCALE
pill_h = 44 * SCALE
pills = [
    ("🔒 零数据上传 · 离线保障私密", (228, 241, 231, 255), (93, 184, 114, 255), (45, 122, 68, 255)),
    ("⚡ 毫秒级流式引擎 · 百万行大文件", (254, 243, 238, 255), (238, 187, 170, 255), (184, 97, 69, 255)),
    ("🌐 免装驱动与插件 · 打开浏览器即用", (238, 244, 250, 255), (180, 205, 230, 255), (40, 100, 160, 255)),
]

pill_w = 320 * SCALE
spacing = (SW - 120*SCALE - 3 * pill_w) // 2

for i, (text_content, bg_c, border_c, text_c) in enumerate(pills):
    px = 60 * SCALE + i * (pill_w + spacing)
    draw.rounded_rectangle([px, pill_y, px + pill_w, pill_y + pill_h], radius=10*SCALE, fill=bg_c, outline=border_c, width=SCALE)
    draw.text((px + pill_w // 2, pill_y + pill_h // 2), text_content, font=font_pill, fill=text_c, anchor="mm")

# 网址与规格
foot_y = 582 * SCALE
draw.text((60 * SCALE, foot_y), "https://dbf.tangtangit.com/", font=font_url, fill=(108, 106, 100, 255))
draw.text((SW - 60 * SCALE, foot_y), "1200 × 630 Professional Social Share Preview", font=get_font(12, bold=False), fill=(160, 155, 145, 255), anchor="ra")

# 缩放至标准 1200x630
final_img = img.resize((W, H), Image.Resampling.LANCZOS)
output_path = Path("public/brand/og-share.png")
output_path.parent.mkdir(parents=True, exist_ok=True)
final_img.save(output_path, "PNG", optimize=True)
print(f"[OK] Saved {output_path} with size: {final_img.size}")
