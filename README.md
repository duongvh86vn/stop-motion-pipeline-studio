# 🎬 Stop Motion Pipeline Studio

Công cụ chạy local biến **câu truyện** thành **bộ prompt hoàn chỉnh** để tạo phim
hoạt hình **stop motion** bằng Gemini (Veo — video 10 giây, có âm thanh gốc),
theo đúng sơ đồ quy trình của dự án. Xem kế hoạch chi tiết tại [PLAN.md](PLAN.md).

## Chạy app

```powershell
cd "D:\Newproject_ stop motion animation"
npx --yes http-server -p 8317 -c-1 .
# Mở trình duyệt: http://localhost:8317
```

(Hoặc mở trực tiếp `index.html` bằng trình duyệt cũng chạy được.)

## Quy trình 7 bước (khớp sơ đồ)

| Bước | Trong sơ đồ | Việc cần làm |
|------|-------------|--------------|
| 1. Dự án & Câu truyện | `input: câu truyện, story, có cốt truyện` → `Project` | Nhập truyện, chọn style (Stop Motion mặc định), chọn thời lượng |
| 2. Nhân vật | `ảnh nhân vật 1..n`, `Characters: cố định charter` | Tạo Character Sheet cho từng nhân vật (từ ảnh gốc hoặc từ mô tả), tải ảnh sheet vào app + lưu vào `assets/characters/` |
| 3. Bối cảnh | `tạo bối cảnh ảnh / json` | Khai báo địa điểm, tạo ảnh bối cảnh tham chiếu |
| 4. Prompt JSON cốt truyện | `prompt tạo json cốt truyện`, `tạo khung cốt truyện` | Copy master prompt → dán vào ChatGPT/Gemini → nhận JSON |
| 5. Nhập JSON | `Sinh ra phân cảnh: Scene breakdown`, `Visual requirements` | Dán JSON vào app, app kiểm tra (đủ cảnh 10s, có âm thanh) |
| 6. Prompt video 10s | `ảnh tham chiếu + prompt cho vào Gemini` | Copy prompt từng cảnh (kèm ảnh sheet) hoặc tải `prompts.txt` |
| 7. Tạo video & hoàn thiện | `Extension Edge → Video thường → Final video` | Tạo hàng loạt bằng extension, kiểm tra, nối video, xuất final |

## Dự án mẫu

Bấm **“✨ Nạp dự án mẫu”** để xem dự án hoàn chỉnh
**“Theo & Cloudy — Ngôi Nhà Mới”** (60s = 6 cảnh × 10s):
4 nhân vật (Theo, Cloudy, Theo's Mom, Theo's Dad — khớp với 4 character sheet có sẵn),
3 bối cảnh, phân cảnh chi tiết theo mốc giây và **thiết kế âm thanh đầy đủ**
(ambience + hiệu ứng + nhạc) cho từng cảnh.

Ảnh character sheet đặt vào [assets/characters/](assets/characters/) — dùng làm
ảnh đính kèm mỗi lần tạo video trong Gemini.

## Âm thanh (yêu cầu bắt buộc của dự án)

- Mỗi prompt video đều có mục **“Audio & sound design”**: tiếng môi trường,
  hiệu ứng khớp hành động, nhạc nền (chủ đề nhạc xuyên suốt các cảnh).
- Veo trong Gemini sinh âm thanh trực tiếp theo mô tả này.
- Khi nối video ở bước 7 có thể phủ thêm 1 track nhạc nền xuyên suốt bằng CapCut.

## Cấu trúc thư mục

```
├── index.html            # App 7 bước (UI tiếng Việt)
├── css/style.css
├── js/templates.js       # Bộ sinh prompt (EN): master JSON, character sheet, bối cảnh, video 10s
├── js/sample-data.js     # Dự án mẫu Theo & Cloudy
├── js/app.js             # Logic UI + lưu localStorage/IndexedDB
├── assets/characters/    # Ảnh Character Sheet (tự thêm)
├── output/               # Video 10s tải từ Gemini (scene-01.mp4, ...)
├── PLAN.md               # Kế hoạch dự án
└── README.md
```
