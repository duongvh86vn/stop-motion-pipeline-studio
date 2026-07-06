/* ============================================================
 * app.js — Điều khiển UI 7 bước của pipeline
 * Lưu dự án: localStorage | Ảnh nhân vật: IndexedDB
 * ============================================================ */

const LS_KEY = "smx_project_v1";

const DEFAULT_PROJECT = () => ({
  name: "",
  story: "",
  styleKey: "stopmotion",
  styleCustom: "",
  durationSec: 60,
  characters: [],
  locations: [],
  storyFrame: [],
  scenes: []
});

let state = loadState();
let currentStep = 1;

const $ = sel => document.querySelector(sel);
const uid = p => p + "-" + Math.random().toString(36).slice(2, 8);

/* ---------------- Persistence ---------------- */
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return Object.assign(DEFAULT_PROJECT(), JSON.parse(raw));
  } catch (e) { /* dữ liệu hỏng -> dùng mặc định */ }
  return DEFAULT_PROJECT();
}
function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  renderNav();
}

/* ---------------- IndexedDB cho ảnh nhân vật ---------------- */
function idb() {
  return new Promise((res, rej) => {
    const rq = indexedDB.open("smx_db", 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore("images");
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
}
async function imgPut(key, dataUrl) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction("images", "readwrite");
    tx.objectStore("images").put(dataUrl, key);
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
}
async function imgGet(key) {
  const db = await idb();
  return new Promise((res, rej) => {
    const rq = db.transaction("images").objectStore("images").get(key);
    rq.onsuccess = () => res(rq.result || null);
    rq.onerror = () => rej(rq.error);
  });
}
async function imgDel(key) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction("images", "readwrite");
    tx.objectStore("images").delete(key);
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
}

/* ---------------- Helpers ---------------- */
let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2200);
}

async function copyText(text, okMsg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg || "Đã copy vào clipboard ✔");
  } catch (e) {
    // Fallback cho môi trường không có Clipboard API
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast(okMsg || "Đã copy vào clipboard ✔"); }
    catch (e2) { toast("Không copy được — hãy bôi đen thủ công."); }
    ta.remove();
  }
}

function download(filename, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------- Step nav ---------------- */
const STEP_DEFS = [
  { n: 1, label: "Dự án & Câu truyện", done: () => !!(state.name && state.story) },
  { n: 2, label: "Nhân vật", done: () => state.characters.length > 0 },
  { n: 3, label: "Bối cảnh", done: () => state.locations.length > 0 },
  { n: 4, label: "Prompt JSON cốt truyện", done: () => !!(state.name && state.story) },
  { n: 5, label: "Nhập JSON kết quả", done: () => state.scenes.length > 0 },
  { n: 6, label: "Prompt video 10s", done: () => state.scenes.length > 0 },
  { n: 7, label: "Tạo video & hoàn thiện", done: () => false }
];

function renderNav() {
  $("#stepNav").innerHTML = STEP_DEFS.map(s =>
    `<button class="step-btn ${s.n === currentStep ? "active" : ""} ${s.done() ? "done" : ""}" data-step="${s.n}">
       <span class="step-num">${s.done() ? "✓" : s.n}</span>
       <span class="step-label">${s.label}</span>
     </button>`
  ).join("");
  document.querySelectorAll(".step-btn").forEach(b =>
    b.addEventListener("click", () => showStep(Number(b.dataset.step)))
  );
}

function showStep(n) {
  currentStep = n;
  for (let i = 1; i <= 7; i++) $("#panel-" + i).hidden = i !== n;
  if (n === 2) renderCharacters();
  if (n === 3) renderLocations();
  if (n === 4) renderMasterPrompt();
  if (n === 5) renderSceneSummary();
  if (n === 6) renderScenePrompts();
  renderNav();
  window.scrollTo({ top: 0 });
}

/* ---------------- Bước 1: Dự án & Câu truyện ---------------- */
function initStep1() {
  const sel = $("#projStyle");
  sel.innerHTML = Object.entries(STYLES)
    .map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`)
    .join("");

  $("#projName").value = state.name;
  $("#projStory").value = state.story;
  sel.value = state.styleKey;
  $("#projDuration").value = String(state.durationSec);
  $("#projStyleCustom").value = state.styleCustom;
  $("#styleCustomWrap").hidden = state.styleKey !== "custom";

  $("#projName").addEventListener("input", e => { state.name = e.target.value; saveState(); });
  $("#projStory").addEventListener("input", e => { state.story = e.target.value; saveState(); });
  sel.addEventListener("change", e => {
    state.styleKey = e.target.value;
    $("#styleCustomWrap").hidden = state.styleKey !== "custom";
    saveState();
  });
  $("#projStyleCustom").addEventListener("input", e => { state.styleCustom = e.target.value; saveState(); });
  $("#projDuration").addEventListener("change", e => { state.durationSec = Number(e.target.value); saveState(); });
}

/* ---------------- Bước 2: Nhân vật ---------------- */
function renderCharacters() {
  const wrap = $("#charList");
  if (!state.characters.length) {
    wrap.innerHTML = `<p class="note">Chưa có nhân vật nào — bấm “Thêm nhân vật”, hoặc “Nạp dự án mẫu” trên thanh công cụ.</p>`;
    return;
  }
  wrap.innerHTML = state.characters.map(c => `
    <div class="card" data-id="${c.id}">
      <div class="card-head">
        <span class="card-title">${esc(c.name || "Nhân vật chưa đặt tên")}</span>
        <button class="btn danger char-del">✖ Xoá</button>
      </div>
      <div class="char-body">
        <div class="char-thumb">
          <div class="thumb" id="thumb-${c.id}">Chưa có ảnh<br/>Character Sheet</div>
          <label class="btn">🖼 Tải ảnh sheet<input type="file" accept="image/*" hidden class="char-img" /></label>
        </div>
        <div class="char-fields">
          <div class="row">
            <div class="field grow"><label>Tên nhân vật</label>
              <input type="text" class="char-name" value="${esc(c.name)}" placeholder="VD: Theo" /></div>
            <div class="field grow"><label>Vai trò</label>
              <input type="text" class="char-role" value="${esc(c.role)}" placeholder="main character / supporting..." /></div>
          </div>
          <div class="field"><label>Mô tả ngoại hình (tiếng Anh — dùng để cố định nhân vật trong mọi prompt)</label>
            <textarea class="char-desc" rows="3" placeholder="a 7-year-old boy with fluffy brown hair, blue hoodie...">${esc(c.description)}</textarea></div>
          <div class="row">
            <button class="btn char-prompt-img">📋 Prompt sheet từ ảnh gốc</button>
            <button class="btn char-prompt-desc">📋 Prompt sheet từ mô tả</button>
          </div>
        </div>
      </div>
    </div>`).join("");

  state.characters.forEach(c => {
    imgGet(c.id).then(dataUrl => {
      if (dataUrl) $("#thumb-" + c.id).innerHTML = `<img src="${dataUrl}" alt="${esc(c.name)}" />`;
    });
  });

  wrap.querySelectorAll(".card").forEach(card => {
    const id = card.dataset.id;
    const ch = state.characters.find(x => x.id === id);
    card.querySelector(".char-name").addEventListener("input", e => { ch.name = e.target.value; saveState(); });
    card.querySelector(".char-role").addEventListener("input", e => { ch.role = e.target.value; saveState(); });
    card.querySelector(".char-desc").addEventListener("input", e => { ch.description = e.target.value; saveState(); });
    card.querySelector(".char-del").addEventListener("click", () => {
      if (!confirm(`Xoá nhân vật "${ch.name || "?"}"?`)) return;
      state.characters = state.characters.filter(x => x.id !== id);
      imgDel(id);
      saveState(); renderCharacters();
    });
    card.querySelector(".char-img").addEventListener("change", e => {
      const f = e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = async () => {
        await imgPut(id, rd.result);
        renderCharacters();
        toast("Đã lưu ảnh nhân vật ✔ (nhớ lưu 1 bản vào assets/characters/)");
      };
      rd.readAsDataURL(f);
    });
    card.querySelector(".char-prompt-img").addEventListener("click", () =>
      copyText(buildCharacterSheetFromImagePrompt(),
        "Đã copy prompt tạo Character Sheet — dán vào ChatGPT/Gemini KÈM ảnh gốc"));
    card.querySelector(".char-prompt-desc").addEventListener("click", () =>
      copyText(buildCharacterSheetFromDescriptionPrompt(state, ch),
        "Đã copy prompt tạo nhân vật từ mô tả"));
  });
}

/* ---------------- Bước 3: Bối cảnh ---------------- */
function renderLocations() {
  const wrap = $("#locList");
  if (!state.locations.length) {
    wrap.innerHTML = `<p class="note">Chưa có bối cảnh nào — bấm “Thêm bối cảnh”.</p>`;
    return;
  }
  wrap.innerHTML = state.locations.map(l => `
    <div class="card" data-id="${l.id}">
      <div class="card-head">
        <span class="card-title">${esc(l.name || "Bối cảnh chưa đặt tên")}</span>
        <button class="btn danger loc-del">✖ Xoá</button>
      </div>
      <div class="field"><label>Tên bối cảnh (tiếng Anh)</label>
        <input type="text" class="loc-name" value="${esc(l.name)}" placeholder="VD: New house exterior" /></div>
      <div class="field"><label>Mô tả (tiếng Anh)</label>
        <textarea class="loc-desc" rows="3" placeholder="a cozy miniature two-story house...">${esc(l.description)}</textarea></div>
      <button class="btn loc-prompt">📋 Prompt ảnh bối cảnh</button>
    </div>`).join("");

  wrap.querySelectorAll(".card").forEach(card => {
    const id = card.dataset.id;
    const lc = state.locations.find(x => x.id === id);
    card.querySelector(".loc-name").addEventListener("input", e => { lc.name = e.target.value; saveState(); });
    card.querySelector(".loc-desc").addEventListener("input", e => { lc.description = e.target.value; saveState(); });
    card.querySelector(".loc-del").addEventListener("click", () => {
      if (!confirm(`Xoá bối cảnh "${lc.name || "?"}"?`)) return;
      state.locations = state.locations.filter(x => x.id !== id);
      saveState(); renderLocations();
    });
    card.querySelector(".loc-prompt").addEventListener("click", () =>
      copyText(buildLocationPrompt(state, lc), "Đã copy prompt ảnh bối cảnh"));
  });
}

/* ---------------- Bước 4: Master prompt ---------------- */
function renderMasterPrompt() {
  const n = sceneCount(state);
  $("#masterInfo").textContent =
    `Phim ${state.durationSec}s → ${n} cảnh × 10s • ${state.characters.length} nhân vật • ${state.locations.length} bối cảnh`;
  $("#masterPromptOut").textContent = buildMasterPrompt(state);
}

/* ---------------- Bước 5: Nhập JSON ---------------- */
function applyStoryData(data) {
  state.scenes = data.scenes;
  if (data.title && !state.name) state.name = data.title;
  if (Array.isArray(data.story_frame)) state.storyFrame = data.story_frame;
  // Bổ sung bối cảnh mới từ JSON (không ghi đè cái đã có)
  (data.locations || []).forEach(l => {
    if (l.name && !state.locations.some(x => x.name.toLowerCase() === l.name.toLowerCase())) {
      state.locations.push({ id: uid("loc"), name: l.name, description: l.description || "" });
    }
  });
  saveState();
}

function renderSceneSummary() {
  const wrap = $("#sceneSummary");
  $("#toStep6").hidden = state.scenes.length === 0;
  if (!state.scenes.length) { wrap.innerHTML = ""; return; }

  const frame = (state.storyFrame || []).length
    ? `<div class="callout"><b>Khung cốt truyện:</b><ol>${state.storyFrame.map(f => `<li>${esc(f)}</li>`).join("")}</ol></div>`
    : "";

  wrap.innerHTML = frame + `
    <table class="scenes">
      <tr><th>#</th><th>Tên cảnh</th><th>Bối cảnh</th><th>Nhân vật</th><th>Số shot</th><th>Âm thanh</th></tr>
      ${state.scenes.map((s, i) => {
        const a = s.audio || {};
        const hasAudio = a.sfx || a.ambience || a.music;
        return `<tr>
          <td>${i + 1}</td>
          <td>${esc(s.title || "")}</td>
          <td>${esc(s.location || "")}</td>
          <td>${esc((s.characters || []).join(", "))}</td>
          <td>${(s.shots || []).length}</td>
          <td>${hasAudio ? '<span class="badge-ok">✔ đủ</span>' : '<span class="badge-err">✖ thiếu</span>'}</td>
        </tr>`;
      }).join("")}
    </table>`;
}

function initStep5() {
  $("#btnParseJson").addEventListener("click", () => {
    const r = parseStoryJson($("#jsonIn").value);
    const msg = $("#jsonMsg");
    if (!r.data) {
      msg.innerHTML = `<div class="msg err"><b>Lỗi:</b> ${esc(r.errors[0])}</div>`;
      return;
    }
    if (!r.ok) {
      msg.innerHTML = `<div class="msg err"><b>JSON đọc được nhưng có ${r.errors.length} vấn đề:</b>
        <ul>${r.errors.map(e => `<li>${esc(e)}</li>`).join("")}</ul>
        Bạn có thể yêu cầu AI sửa lại, hoặc vẫn nạp để chỉnh tay.</div>
        <button class="btn" id="btnForceLoad">Vẫn nạp phân cảnh</button>`;
      $("#btnForceLoad").addEventListener("click", () => {
        applyStoryData(r.data);
        msg.innerHTML = `<div class="msg ok">Đã nạp ${r.data.scenes.length} cảnh (có cảnh chưa chuẩn — nhớ kiểm tra lại).</div>`;
        renderSceneSummary();
      });
      return;
    }
    applyStoryData(r.data);
    msg.innerHTML = `<div class="msg ok">✔ Hợp lệ! Đã nạp ${r.data.scenes.length} cảnh, mỗi cảnh 10 giây, đầy đủ âm thanh.</div>`;
    renderSceneSummary();
  });

  $("#btnSampleScenes").addEventListener("click", () => {
    $("#jsonIn").value = JSON.stringify({
      title: SAMPLE_PROJECT.name,
      story_frame: SAMPLE_PROJECT.storyFrame,
      locations: SAMPLE_PROJECT.locations.map(l => ({ name: l.name, description: l.description })),
      scenes: SAMPLE_PROJECT.scenes
    }, null, 2);
    toast("Đã điền JSON mẫu — bấm “Kiểm tra & nạp phân cảnh”");
  });
}

/* ---------------- Bước 6: Prompt video 10s ---------------- */
function renderScenePrompts() {
  const wrap = $("#scenePromptList");
  if (!state.scenes.length) {
    wrap.innerHTML = `<p class="note">Chưa có phân cảnh — quay lại bước 5 để nạp JSON.</p>`;
    return;
  }
  const total = state.scenes.length;
  wrap.innerHTML = state.scenes.map((s, i) => `
    <div class="card scene-card">
      <div class="card-head">
        <span class="card-title">🎬 Cảnh ${i + 1}/${total}${s.title ? " — " + esc(s.title) : ""}</span>
        <button class="btn primary scene-copy" data-i="${i}">📋 Copy prompt cảnh ${i + 1}</button>
      </div>
      <div class="scene-meta">📍 ${esc(s.location || "?")} • 👤 ${esc((s.characters || []).join(", ") || "—")}
        • 🔊 ${(s.audio && (s.audio.sfx || s.audio.music)) ? "có âm thanh" : "⚠ thiếu âm thanh"}</div>
      <pre class="promptbox">${esc(buildScenePrompt(state, s, i, total))}</pre>
    </div>`).join("");

  wrap.querySelectorAll(".scene-copy").forEach(b =>
    b.addEventListener("click", () => {
      const i = Number(b.dataset.i);
      copyText(buildScenePrompt(state, state.scenes[i], i, total), `Đã copy prompt cảnh ${i + 1} ✔`);
    })
  );
}

function initStep6() {
  $("#btnCopyAll").addEventListener("click", () =>
    copyText(buildAllScenePrompts(state), "Đã copy toàn bộ prompt các cảnh ✔"));
  $("#btnDownloadTxt").addEventListener("click", () => {
    download("prompts.txt", buildAllScenePrompts(state));
    toast("Đã tải prompts.txt ✔");
  });
}

/* ---------------- Toolbar: mẫu / xuất / nhập / xoá ---------------- */
function initToolbar() {
  $("#btnLoadSample").addEventListener("click", () => {
    if (state.scenes.length || state.characters.length) {
      if (!confirm("Nạp dự án mẫu sẽ THAY THẾ dự án hiện tại. Tiếp tục?")) return;
    }
    state = JSON.parse(JSON.stringify(SAMPLE_PROJECT));
    saveState();
    initStep1Values();
    showStep(1);
    toast("Đã nạp dự án mẫu “Theo & Cloudy — Ngôi Nhà Mới” ✔");
  });

  $("#btnExport").addEventListener("click", () => {
    download((state.name || "du-an").replace(/[^\p{L}\p{N} _-]/gu, "").trim() + ".json",
      JSON.stringify(state, null, 2));
    toast("Đã xuất file dự án ✔ (ảnh nhân vật lưu riêng trong assets/characters/)");
  });

  $("#fileImport").addEventListener("change", e => {
    const f = e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const data = JSON.parse(rd.result);
        if (!data || typeof data !== "object" || !("story" in data))
          throw new Error("File không đúng định dạng dự án.");
        state = Object.assign(DEFAULT_PROJECT(), data);
        saveState();
        initStep1Values();
        showStep(1);
        toast("Đã nhập dự án ✔");
      } catch (err) {
        toast("Lỗi nhập dự án: " + err.message);
      }
      e.target.value = "";
    };
    rd.readAsText(f);
  });

  $("#btnReset").addEventListener("click", () => {
    if (!confirm("Xoá toàn bộ dự án hiện tại?")) return;
    state.characters.forEach(c => imgDel(c.id));
    state = DEFAULT_PROJECT();
    saveState();
    initStep1Values();
    showStep(1);
    toast("Đã xoá dự án.");
  });
}

function initStep1Values() {
  $("#projName").value = state.name;
  $("#projStory").value = state.story;
  $("#projStyle").value = state.styleKey;
  $("#projDuration").value = String(state.durationSec);
  $("#projStyleCustom").value = state.styleCustom;
  $("#styleCustomWrap").hidden = state.styleKey !== "custom";
}

/* ---------------- Khởi động ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initStep1();
  initStep5();
  initStep6();
  initToolbar();

  $("#btnCopyMaster").addEventListener("click", () =>
    copyText(buildMasterPrompt(state), "Đã copy master prompt — dán vào ChatGPT/Gemini"));

  $("#btnAddChar").addEventListener("click", () => {
    state.characters.push({ id: uid("ch"), name: "", role: "", description: "", hasSheet: false });
    saveState(); renderCharacters();
  });
  $("#btnAddLoc").addEventListener("click", () => {
    state.locations.push({ id: uid("loc"), name: "", description: "" });
    saveState(); renderLocations();
  });

  document.querySelectorAll(".next-step").forEach(b =>
    b.addEventListener("click", () => showStep(Number(b.dataset.next)))
  );

  showStep(1);
});
