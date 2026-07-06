/* ============================================================
 * templates.js — Bộ sinh prompt cho pipeline Story -> Video
 * Mọi prompt đầu ra là TIẾNG ANH (chuẩn cho model tạo ảnh/video).
 * ============================================================ */

const STYLES = {
  stopmotion: {
    label: "Stop Motion / Claymation (mặc định)",
    video:
      "handcrafted stop-motion animation, claymation puppet aesthetic in the spirit of Aardman and Laika films, " +
      "characters and props look sculpted from clay and felt with visible fingerprints and fabric textures, " +
      "miniature handcrafted sets with tiny practical props, stepped 12fps stop-motion movement with slight " +
      "frame-by-frame jitter, shallow depth of field like a macro lens on a miniature set, warm practical " +
      "lighting with soft shadows, rich tactile materials, 4K, charming and cozy family-film mood",
    image:
      "stop-motion puppet style, clay and felt textures, miniature handcrafted look, soft studio lighting, 4K"
  },
  pixar3d: {
    label: "Hoạt hình 3D kiểu Pixar",
    video:
      "high-end 3D animated family film in a Pixar-inspired style, soft rounded character designs, expressive " +
      "big eyes, subsurface skin shading, warm cinematic lighting, gentle depth of field, polished render, 4K",
    image: "Pixar-style 3D render, soft lighting, expressive characters, high detail, 4K"
  },
  anime2d: {
    label: "Anime 2D",
    video:
      "hand-drawn 2D anime film, clean line art, painterly backgrounds, expressive character acting, " +
      "cinematic lighting, smooth 2D animation with dynamic camera moves, 4K",
    image: "2D anime illustration, clean line art, painterly background, high detail"
  },
  cinematic: {
    label: "Điện ảnh thực tế (Live-action)",
    video:
      "photorealistic live-action cinematic footage, real-world physics, filmic color grading, dramatic " +
      "lighting, dynamic camera work, motion blur, 4K",
    image: "photorealistic cinematic photograph, filmic color grading, high detail, 4K"
  },
  papercraft: {
    label: "Giấy cắt (Paper cutout)",
    video:
      "paper cutout stop-motion animation, layered cardboard and construction-paper characters and sets, " +
      "visible paper grain and cut edges, stepped stop-motion movement, soft top-down craft lighting, 4K",
    image: "paper cutout craft style, layered cardboard diorama, visible paper texture, soft lighting"
  },
  custom: { label: "Tuỳ chỉnh (tự nhập mô tả style)", video: "", image: "" }
};

function styleVideoText(project) {
  if (project.styleKey === "custom") return (project.styleCustom || "").trim() || "cinematic, 4K";
  return STYLES[project.styleKey] ? STYLES[project.styleKey].video : STYLES.stopmotion.video;
}

function styleImageText(project) {
  if (project.styleKey === "custom") return (project.styleCustom || "").trim() || "high detail";
  return STYLES[project.styleKey] ? STYLES[project.styleKey].image : STYLES.stopmotion.image;
}

function sceneCount(project) {
  return Math.max(1, Math.round((project.durationSec || 60) / 10));
}

/* ------------------------------------------------------------
 * 1) Prompt tạo Character Sheet TỪ ẢNH GỐC (template trong prompt.txt)
 * ------------------------------------------------------------ */
function buildCharacterSheetFromImagePrompt() {
  return `Use the attached image as the highest-priority reference and create a character sheet that clearly depicts the same person or character.

If the attached image is a photograph, keep it photorealistic. If it is an illustration, anime, manga, 3D render, or chibi/deformed style, preserve the original art style, linework, coloring, textures, and level of stylization exactly.
Do not arbitrarily convert it into a photo, illustration, or a different art style.

The purpose is not to introduce a character profile, but to create a visual reference sheet for character creation, AI image generation, and character consistency.
Do not include profile information such as name, age, personality, hobbies, or descriptions.
The only text inside the image should be short English labels indicating each panel.

Image format:
A single 16:9 horizontal image. White to light gray background. High resolution. A clean, easy-to-read character sheet layout organized with thin guide lines and boxes.

Highest priority requirements:
Faithfully reproduce the face, eyes, eyebrows, nose, mouth, face shape, hairstyle, hair color, skin tone, rendering texture, body proportions, overall atmosphere, and clothing impression from the original image.
The result must clearly look like the same person or character.
Do not turn them into a different person or character.
Do not excessively beautify, oversimplify, alter body proportions, or redesign the face.
Temporary objects appearing in the original image, such as accessories, food, background elements, poses, or handheld items, should be omitted unless they are essential to the character design.

Clothing:
If the original clothing is clearly visible, keep it unchanged.
If the full body is not visible, naturally complete the outfit while matching the original atmosphere.
The front, side, and back views must all use the same outfit, hairstyle, and body proportions.
Avoid revealing clothing, underwear, swimsuits, or sexualized outfits.

Include:
[Full Body] Front, Side, Back
[Face Close-up] Front, Profile, 45-degree angle
[Expressions] Neutral, Smile, Big Smile, Serious, Surprised, Embarrassed, Thinking, Troubled
[Facial Features] Eyes, Eyebrows, Nose, Mouth, Ears, Face Contour, Skin, Texture
[Hair Details] Bangs, Side Hair, Back Hair, Hair Flow
[Additional Angles] Left 3/4, Right 3/4, Top View, Bottom View, Back of the Head

Layout:
Make it easy to read as a production reference, with clean spacing and each section organized inside boxes.
Do not make it look like a magazine profile, résumé, or poster.
Do not include long descriptions; only short English labels.

Negative prompt:
Different person, different character, changed face, changed art style, unintended photorealism, unintended anime style, different hairstyle, different hair color, inconsistent clothing, altered body proportions, excessive beautification, excessive simplification, profile text, name, age, personality, hobbies, long descriptions, garbled text, unreadable text, messy layout, low resolution, distorted face, malformed eyes, broken hands, broken fingers, duplicated faces, sexualized clothing, underwear, swimsuits, unnecessary accessories, food in the mouth, random objects, cluttered background.`;
}

/* ------------------------------------------------------------
 * 2) Prompt tạo Character Sheet TỪ MÔ TẢ (khi chưa có ảnh nhân vật)
 * ------------------------------------------------------------ */
function buildCharacterSheetFromDescriptionPrompt(project, ch) {
  return `Create a production-ready character reference sheet for a new character.

Character: ${ch.name} — ${ch.role || "supporting character"}.
Character design description (follow it faithfully):
${ch.description || "(describe the character here)"}

Art style: ${styleImageText(project)}.
Keep this exact art style consistently across every panel.

Image format:
A single 16:9 horizontal image. White to light gray background. High resolution. A clean character sheet layout organized with thin guide lines and boxes. The only text inside the image should be short English labels for each panel.

Include:
[Full Body / Turnaround] Front, 3/4 Front, Side, Back
[Face Close-up] Front, Profile, 45-degree angle
[Expressions] Neutral, Happy, Big Smile, Surprised, Worried, Determined
[Action Poses] 4-6 poses that fit the character's role in the story
[Color Palette] main colors as small swatches

The same face, hairstyle, outfit, colors, and body proportions must repeat identically in every panel, so the sheet can be used as a consistency reference for AI image and video generation.

Negative prompt:
inconsistent design between panels, different face between panels, changed outfit, changed colors, long descriptive text, name, age, personality text, garbled text, low resolution, distorted face, broken hands, cluttered background, watermark.`;
}

/* ------------------------------------------------------------
 * 3) Prompt tạo ảnh BỐI CẢNH tham chiếu
 * ------------------------------------------------------------ */
function buildLocationPrompt(project, loc) {
  return `Create a high-quality environment reference image for an animated film.

Location: ${loc.name}
Description (follow it faithfully):
${loc.description || "(describe the location here)"}

Art style: ${styleImageText(project)}.

Requirements:
A single 16:9 horizontal establishing shot of the location with NO characters in frame. Clear readable layout of the space, consistent lighting mood, rich set details and props that can be reused across many shots. This image will be used as a visual consistency reference for AI video generation.

Negative prompt:
people, characters, text, labels, watermark, logo, split frame, collage, low resolution, blurry.`;
}

/* ------------------------------------------------------------
 * 4) MASTER PROMPT — "prompt tạo json cốt truyện"
 *    Dán vào ChatGPT/Gemini để nhận về JSON phân cảnh.
 * ------------------------------------------------------------ */
function buildMasterPrompt(project) {
  const n = sceneCount(project);
  const chars = (project.characters || [])
    .map(c => `- ${c.name} (${c.role || "supporting"}): ${c.description || "no description yet"}`)
    .join("\n");
  const locs = (project.locations || [])
    .map(l => `- ${l.name}: ${l.description || "no description yet"}`)
    .join("\n");

  return `You are a professional animation director, storyboard artist, and sound designer.
Turn the story below into a complete production plan for an AI-generated animated short film, output as ONE strict JSON object.

=== STORY (may be written in Vietnamese — the JSON you output must be 100% in English) ===
${(project.story || "").trim() || "(no story provided)"}

=== FILM SETTINGS ===
- Total duration: ${project.durationSec || 60} seconds = exactly ${n} scenes, each scene exactly 10.0 seconds long.
- Visual style (use this in every scene, do not change it): ${styleVideoText(project)}

=== FIXED CHARACTERS (keep names and visual descriptions EXACTLY as given; do not invent new main characters) ===
${chars || "(no characters defined yet — you may propose characters that fit the story, with detailed visual descriptions)"}

=== KNOWN LOCATIONS (reuse them; you may add more if the story needs) ===
${locs || "(none defined — propose locations that fit the story)"}

=== OUTPUT FORMAT ===
Return ONLY a JSON object (no markdown fences, no commentary) with exactly this schema:

{
  "title": "film title in English",
  "logline": "1-2 sentence summary",
  "story_frame": ["Act 1: ...", "Act 2: ...", "Act 3: ..."],
  "locations": [
    { "name": "location name", "description": "detailed visual description of the set" }
  ],
  "scenes": [
    {
      "title": "short scene title",
      "location": "one of the location names",
      "characters": ["names of characters appearing, matching the fixed character names"],
      "shots": [
        { "start": 0.0, "end": 2.5, "description": "what happens + camera work, concrete and visual" }
      ],
      "visual_requirements": "style keywords + consistency notes for this scene",
      "audio": {
        "ambience": "background environmental sound",
        "sfx": "specific sound effects synced to the actions",
        "music": "music cue: instruments, mood, tempo",
        "dialogue": "short dialogue lines with speaker names, or 'No dialogue.'"
      }
    }
  ]
}

=== RULES ===
1. Exactly ${n} scenes. Every scene covers exactly 0.0 to 10.0 seconds with 3-5 shots; the first shot starts at 0.0, the last shot ends at 10.0, no gaps and no overlaps.
2. Shot descriptions must be concrete and filmable: subject, action, emotion, camera angle and movement. Never write abstract summaries.
3. Character visual continuity: whenever a character appears, their look must match the fixed description above. Never redesign characters between scenes.
4. Story continuity: the end state of each scene must connect naturally to the next scene.
5. Audio is mandatory and detailed for every scene (ambience + sfx + music). Keep the music cue evolving coherently across scenes (same main theme, different intensity).
6. Everything in English. Output the JSON object only.`;
}

/* ------------------------------------------------------------
 * 5) PROMPT VIDEO 10 GIÂY cho từng cảnh (định dạng theo mẫu)
 * ------------------------------------------------------------ */
function fmtTime(t) {
  const n = Number(t);
  return (Number.isInteger(n) ? n.toFixed(1) : String(Math.round(n * 10) / 10)) + "s";
}

function buildScenePrompt(project, scene, index, total) {
  const styleTxt = styleVideoText(project);
  const inScene = (project.characters || []).filter(
    c => (scene.characters || []).some(n => n.toLowerCase() === c.name.toLowerCase())
  );
  const extraNames = (scene.characters || []).filter(
    n => !inScene.some(c => c.name.toLowerCase() === n.toLowerCase())
  );

  const charLines = [
    ...inScene.map(c => `- ${c.name}: ${c.description || "see attached reference sheet"}`),
    ...extraNames.map(n => `- ${n}`)
  ].join("\n");

  const loc = (project.locations || []).find(
    l => l.name && scene.location && l.name.toLowerCase() === scene.location.toLowerCase()
  );

  const shots = (scene.shots || [])
    .map(s => `${fmtTime(s.start)} - ${fmtTime(s.end)}:\n${s.description}`)
    .join("\n\n");

  const a = scene.audio || {};
  const audioBlock = [
    a.ambience ? `Ambience: ${a.ambience}` : null,
    a.sfx ? `Sound effects: ${a.sfx}` : null,
    a.music ? `Music: ${a.music}` : null,
    `Dialogue: ${a.dialogue || "No dialogue."}`
  ].filter(Boolean).join("\n");

  return `Create a 10-second cinematic animated video with clear shot-by-shot progression and full native sound design. This is scene ${index + 1} of ${total}${scene.title ? ` — "${scene.title}"` : ""}.

Style: ${styleTxt}.

Setting: ${scene.location || "see scene breakdown"}${loc && loc.description ? ` — ${loc.description}` : ""}

Characters (match the attached reference sheets exactly — same faces, outfits, colors, proportions):
${charLines || "- (no characters in this scene)"}

Scene breakdown:

${shots}

Audio & sound design (the video must include sound):
${audioBlock}

Visual requirements:
${scene.visual_requirements ? scene.visual_requirements + " " : ""}Consistent character design matching the reference sheets in every shot, consistent lighting and set across shots, clean character visibility, smooth scene-to-scene continuity, no text, no subtitles, no watermark, no logo.`;
}

function buildAllScenePrompts(project) {
  const total = (project.scenes || []).length;
  return (project.scenes || [])
    .map((s, i) => buildScenePrompt(project, s, i, total))
    .join("\n\n========== SCENE BREAK ==========\n\n");
}

/* ------------------------------------------------------------
 * 6) Parse & validate JSON cốt truyện dán về từ ChatGPT/Gemini
 *    Trả về { ok, errors[], data } — lỗi bằng tiếng Việt.
 * ------------------------------------------------------------ */
function parseStoryJson(text) {
  const errors = [];
  let raw = (text || "").trim();
  if (!raw) return { ok: false, errors: ["Chưa dán nội dung JSON."], data: null };

  // Bỏ rào ```json ... ``` nếu có, hoặc cắt từ dấu { đầu tiên đến } cuối cùng
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first > 0 && last > first) raw = raw.slice(first, last + 1);

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, errors: ["JSON không hợp lệ: " + e.message], data: null };
  }

  if (!Array.isArray(data.scenes) || data.scenes.length === 0) {
    return { ok: false, errors: ['Thiếu mảng "scenes" hoặc mảng rỗng.'], data: null };
  }

  data.scenes.forEach((sc, i) => {
    const tag = `Cảnh ${i + 1}`;
    if (!Array.isArray(sc.shots) || sc.shots.length === 0) {
      errors.push(`${tag}: thiếu danh sách "shots".`);
      return;
    }
    sc.shots.forEach(sh => {
      sh.start = Number(String(sh.start).replace(/s$/i, ""));
      sh.end = Number(String(sh.end).replace(/s$/i, ""));
    });
    const bad = sc.shots.find(sh => !isFinite(sh.start) || !isFinite(sh.end) || !sh.description);
    if (bad) errors.push(`${tag}: shot thiếu mốc thời gian hoặc mô tả.`);
    if (Math.abs(sc.shots[0].start) > 0.01)
      errors.push(`${tag}: shot đầu tiên phải bắt đầu ở 0.0s.`);
    if (Math.abs(sc.shots[sc.shots.length - 1].end - 10) > 0.01)
      errors.push(`${tag}: shot cuối phải kết thúc ở 10.0s.`);
    if (!sc.audio || (!sc.audio.sfx && !sc.audio.ambience && !sc.audio.music))
      errors.push(`${tag}: thiếu phần "audio" (ambience / sfx / music) — video yêu cầu đủ hiệu ứng âm thanh.`);
  });

  return { ok: errors.length === 0, errors, data };
}
