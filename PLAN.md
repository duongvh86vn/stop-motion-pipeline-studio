# KẾ HOẠCH DỰ ÁN — Stop Motion Animation Pipeline Studio

Ngày lập: 06/07/2026

## 1. Mục tiêu

Xây dựng một công cụ (web app chạy local, không cần cài đặt gì thêm ngoài Node)
thực hiện trọn vẹn quy trình trong sơ đồ:

```
Câu truyện (input)
   └─> Dự án (Project)
         └─> Prompt tạo JSON cốt truyện  <── ảnh nhân vật 1..n (tham chiếu)
               ├─> Bối cảnh (ảnh / json)
               ├─> Khung cốt truyện
               ├─> Characters (dùng sẵn có / tạo mới & cố định nhân vật)
               ├─> Phân cảnh: Scene breakdown (các đoạn 10 giây)
               ├─> Visual requirements
               └─> Style phù hợp (mặc định Stop Motion, có thể đổi)
                     └─> Ảnh tham chiếu + prompt  ──> Gemini Pro (video 10s, có âm thanh)
                           └─> Extension "Gemini Automation" trên Edge (tạo hàng loạt)
                                 └─> Nối các video ──> FINAL VIDEO chủ đề STOP MOTION
                                                       (đầy đủ hiệu ứng âm thanh)
```

## 2. Sản phẩm bàn giao

| # | Hạng mục | File/Thư mục |
|---|----------|--------------|
| 1 | Kế hoạch dự án | `PLAN.md` |
| 2 | Hướng dẫn sử dụng | `README.md` |
| 3 | Web app Pipeline Studio (7 bước) | `index.html`, `css/`, `js/` |
| 4 | Bộ template prompt (JSON cốt truyện, character sheet, bối cảnh, video 10s có âm thanh) | `js/templates.js` |
| 5 | Dự án mẫu hoàn chỉnh "Theo & Cloudy — Ngôi nhà mới" (6 cảnh × 10s = 60s, đủ audio) | `js/sample-data.js` |
| 6 | Thư mục chứa ảnh tham chiếu nhân vật | `assets/characters/` |
| 7 | Cấu hình chạy thử | `.claude/launch.json` |

## 3. Thiết kế 7 bước trong app (khớp sơ đồ)

1. **Dự án & Câu truyện** — nhập tên dự án, nội dung/ý tưởng truyện, chọn Style
   (Stop Motion mặc định — đổi được), chọn thời lượng (30/60/90/120s → số cảnh 10s).
2. **Nhân vật** — thêm nhân vật, tải ảnh tham chiếu (lưu trong trình duyệt),
   copy prompt tạo **Character Sheet** (theo template trong `prompt.txt`) hoặc prompt
   tạo nhân vật mới từ mô tả nếu chưa có ảnh. Nhân vật được "cố định" bằng mô tả +
   ảnh sheet dùng lại cho mọi lần sinh video.
3. **Bối cảnh** — khai báo các địa điểm, copy prompt tạo ảnh bối cảnh tham chiếu.
4. **Prompt tạo JSON cốt truyện** — app tự ghép câu truyện + nhân vật + bối cảnh +
   style thành 1 master prompt; dán vào ChatGPT/Gemini để nhận về JSON
   (khung cốt truyện + phân cảnh 10s + visual requirements + audio).
5. **Nhập JSON kết quả** — dán JSON trả về, app kiểm tra hợp lệ (đủ cảnh, mốc thời
   gian 0→10s, có phần âm thanh…). Có nút nạp dữ liệu mẫu để xem chuẩn đầu ra.
6. **Prompt video 10s** — app render mỗi cảnh thành prompt hoàn chỉnh đúng định dạng
   mẫu (Style / Characters / Scene breakdown theo mốc giây / **Audio & sound design** /
   Visual requirements / negative). Copy từng cảnh, copy tất cả, tải `prompts.txt`
   cho extension chạy hàng loạt.
7. **Tạo video & hoàn thiện** — checklist: Gemini Pro (Veo 3 — video 10s có âm thanh
   gốc), cài extension trên Edge, đính kèm ảnh character sheet mỗi lần tạo, tải video,
   nối cảnh (CapCut hoặc lệnh ffmpeg kèm sẵn), thêm nhạc nền, xuất FINAL VIDEO.

## 4. Yêu cầu kỹ thuật

- Thuần HTML/CSS/JS, không cần build; chạy bằng `npx http-server`.
- Tự lưu dự án vào `localStorage`; ảnh nhân vật lưu `IndexedDB`; xuất/nhập file
  `.json` để backup, chia sẻ.
- Prompt đầu ra **tiếng Anh** (chuẩn cho model video), UI **tiếng Việt**.
- Mọi prompt video bắt buộc có mục **Audio & sound design** (ambience + SFX + nhạc)
  vì yêu cầu "video phải đầy đủ hiệu ứng âm thanh".
- Style Stop Motion được mô tả chi tiết (claymation, 12fps stepped motion, miniature
  set, practical lighting…) và tiêm vào mọi prompt để đồng nhất.

## 5. Kiểm thử

- [x] App chạy, đủ 7 bước, chuyển bước được — không lỗi console.
- [x] Nạp dự án mẫu → đủ 4 nhân vật, 3 bối cảnh, 6 cảnh.
- [x] Master prompt chứa đủ truyện, nhân vật, style, schema JSON (5.622 ký tự).
- [x] Dán JSON hợp lệ → parse thành công (kể cả JSON bọc ```json``` và mốc thời
      gian dạng chuỗi "2.5s"); JSON lỗi → báo lỗi tiếng Việt; cảnh thiếu audio
      → bị phát hiện và cảnh báo.
- [x] Prompt từng cảnh đúng định dạng mẫu: Style / Setting / Characters /
      Scene breakdown theo mốc giây / Audio & sound design / Visual requirements
      + negative (no text, no watermark).
- [x] Copy/tải `prompts.txt` hoạt động; file mẫu đã xuất sẵn:
      `prompts-mau-theo-cloudy.txt` (6 cảnh, 5 dấu SCENE BREAK).
- [x] Reload trang không mất dữ liệu; trạng thái hoàn thành từng bước hiển thị
      đúng trên thanh điều hướng.

## 6. Triển khai (hoàn thành 07/07/2026)

- [x] Thực hiện hóa app thành PWA: `manifest.webmanifest` + `sw.js` (service
      worker, chạy offline, cài được như app desktop) + `icon.svg`.
- [x] Script chạy local 1 cú click: `CHAY-APP.bat`.
- [x] Đưa mã nguồn lên GitHub: https://github.com/duongvh86vn/stop-motion-pipeline-studio
- [x] Triển khai GitHub Pages (nhánh `main`, kèm `.nojekyll`):
      **https://duongvh86vn.github.io/stop-motion-pipeline-studio/**
- [x] Kiểm tra sau triển khai: trang chính + toàn bộ css/js/manifest/sw/icon
      và `prompts-mau-theo-cloudy.txt` đều trả về HTTP 200.
