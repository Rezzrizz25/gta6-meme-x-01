// main.ts — gta6-meme-x-01 entry generator (make.fun bounty)
// Node 22+, standard library ONLY: no network, no installs, no deps.
// What it does:
//   1. Builds meme.svg — a vector version of the meme: the GTA "WASTED"
//      death screen over a Vice City sunset street scene.
//   2. Writes POST.txt — the exact X post text (must stay under 280 chars).
//   3. Copies POST.json (the repo's entry-link file) into the output dir:
//      the sealed gate reads /output/POST.json, NOT the repo copy, so
//      without this copy the gate scores post_file/post_url 0 and the
//      judge never rates the entry. Per RULES.txt, copying POST.json to
//      /output is all this program has to do.
// Run it with:  node main.ts
// Outputs land next to this file (meme.svg, POST.txt and POST.json), unless
// the MAKEFUN_OUTPUT_DIR env var is set — the grader runs this in a
// read-only /bot with a writable output dir, so outputs go there instead.

import { copyFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The exact caption that goes live on X from @rezzrizz25.
// It names make.fun, tags @makefunai, and carries the play code v4m1pbv2.
const POST_TEXT =
  "POV: you waited 13 years for GTA 6, bought GTA 5 three times, and " +
  "still got WASTED. Meanwhile my AI agent just sat there earning on " +
  "make.fun 👻 @makefunai play code v4m1pbv2 " +
  "https://make.fun/bounty/gta6-meme-x-01";

// The joke, as drawn on the WASTED screen.
const HEADLINE = "WASTED";
const SUBTITLE_LINES = [
  "You waited 13 years for GTA 6.",
  "My AI agent spent that time earning real money on make.fun.",
];
const WORDMARK = "make.fun";

const W = 1200; // canvas width  (matches the 16:9 meme.png layout)
const H = 675; // canvas height

// Tiny helper: escape the few characters that are special inside SVG text.
function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build the SVG scene piece by piece so each part is easy to tweak:
// Vice City sunset sky + skyline, palm trees, neon signs, street, car,
// then a dark overlay so the WASTED text pops like the in-game screen.
function buildSvg() {
  const subtitleText = SUBTITLE_LINES.map((line, i) => {
    return `    <text x="600" y="${468 + i * 44}" text-anchor="middle" font-size="30" fill="#ffffff" font-family="Arial, sans-serif">${esc(line)}</text>`;
  }).join("\n");

  // Lit windows: fixed positions so the skyline looks the same every run.
  const windows = [
    [700, 180], [716, 210], [748, 190], [780, 230], [830, 200],
    [880, 170], [900, 215], [960, 185], [1010, 225], [1060, 195],
  ]
    .map(([x, y]) => `    <rect x="${x}" y="${y}" width="10" height="14" fill="#ffd76a" opacity="0.85" />`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <title>GTA WASTED screen: you waited 13 years for GTA 6, the agent earned on make.fun</title>
  <desc>Original cartoon: a GTA-style WASTED death screen over a Vice City sunset street — palm trees, neon signs, a sports car — with the joke that the AI agent spent the 13-year wait earning real money on make.fun.</desc>
  <defs>
    <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1a3a" />
      <stop offset="0.45" stop-color="#7a2d4d" />
      <stop offset="0.75" stop-color="#e8703a" />
      <stop offset="1" stop-color="#ffb347" />
    </linearGradient>
  </defs>
  <!-- sunset sky -->
  <rect width="${W}" height="${H}" fill="url(#sunset)" />
  <circle cx="600" cy="430" r="70" fill="#ffb347" opacity="0.9" />
  <!-- skyline -->
  <path d="M660 470 L660 160 L700 160 L700 210 L730 210 L730 140 L790 140 L790 470 M820 470 L820 180 L860 180 L860 230 L890 230 L890 150 L940 150 L940 470 M970 470 L970 200 L1010 200 L1010 160 L1050 160 L1050 470" fill="#1a1226" />
${windows}
  <!-- street -->
  <rect y="470" width="${W}" height="${H - 470}" fill="#14101c" />
  <path d="M0 560 L1200 560" stroke="#ff9d5c" stroke-width="4" stroke-dasharray="40 30" opacity="0.6" />
  <!-- palm trees (silhouettes) -->
  <path d="M90 470 Q80 340 95 250 M95 250 Q60 220 30 235 M95 250 Q95 205 70 185 M95 250 Q120 210 150 215 M95 250 Q140 235 165 255" stroke="#120a1e" stroke-width="10" fill="none" stroke-linecap="round" />
  <path d="M1120 470 Q1130 350 1115 270 M1115 270 Q1080 240 1050 255 M1115 270 Q1115 225 1090 205 M1115 270 Q1140 230 1170 235" stroke="#120a1e" stroke-width="10" fill="none" stroke-linecap="round" />
  <!-- neon signs -->
  <rect x="150" y="380" width="190" height="44" rx="8" fill="#2a0a1e" stroke="#ff5da2" stroke-width="3" />
  <text x="245" y="411" text-anchor="middle" font-size="22" font-weight="bold" fill="#ff5da2" font-family="Arial, sans-serif">OCEAN DRIVE</text>
  <rect x="880" y="390" width="170" height="44" rx="8" fill="#0a1e2a" stroke="#4dd8ff" stroke-width="3" />
  <text x="965" y="421" text-anchor="middle" font-size="22" font-weight="bold" fill="#4dd8ff" font-family="Arial, sans-serif">LIQUOR 24/7</text>
  <!-- sports car silhouette -->
  <path d="M180 620 Q200 580 260 575 L330 575 Q400 575 430 600 L470 600 Q500 600 505 620 L505 635 L180 635 Z" fill="#0d0a14" />
  <circle cx="250" cy="632" r="20" fill="#000000" stroke="#333" stroke-width="4" />
  <circle cx="440" cy="632" r="20" fill="#000000" stroke="#333" stroke-width="4" />
  <!-- dark overlay so the headline pops, like the in-game WASTED screen -->
  <rect width="${W}" height="${H}" fill="#000000" opacity="0.35" />
  <!-- headline -->
  <text x="600" y="400" text-anchor="middle" font-size="210" font-weight="bold" letter-spacing="8" fill="#a8a8a8" font-family="Arial, sans-serif">${HEADLINE}</text>
${subtitleText}
  <!-- caption strip, so the SVG carries the branding even on its own -->
  <text x="600" y="650" text-anchor="middle" font-size="26" font-weight="bold" fill="#ffffff" font-family="Arial, sans-serif">${WORDMARK}</text>
</svg>
`;
}

// --- validation -----------------------------------------------------------
// The judge scores "make.fun in picture" and the caption rules, so check
// the outputs carry the required branding before writing anything to disk.
function validateOutputs(svg, post) {
  const requiredInSvg = ["make.fun", "GTA 6", "WASTED", "13 years"];
  for (const needle of requiredInSvg) {
    if (!svg.includes(needle)) {
      throw new Error(`meme.svg is missing required text: ${needle}`);
    }
  }
  const requiredInPost = ["make.fun", "@makefunai", "v4m1pbv2"];
  for (const needle of requiredInPost) {
    if (!post.includes(needle)) {
      throw new Error(`POST_TEXT is missing required token: ${needle}`);
    }
  }
  // The joke must survive intact — every subtitle line in the SVG.
  for (const line of SUBTITLE_LINES) {
    if (!svg.includes(esc(line))) {
      throw new Error(`meme.svg is missing subtitle line: ${line}`);
    }
  }
}

// --- main -----------------------------------------------------------------
const here = dirname(fileURLToPath(import.meta.url));

// The grader mounts /bot read-only and gives us a writable output dir via
// MAKEFUN_OUTPUT_DIR; writing next to this file would throw there and the
// run would exit non-zero. When the var is unset (local runs), outDir is
// `here`, so behaviour is identical to before.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || here;

// X caps posts at 280 characters; refuse to write a caption that breaks it.
if (POST_TEXT.length > 280) {
  throw new Error(`POST_TEXT is ${POST_TEXT.length} chars, over the 280 limit`);
}

const svg = buildSvg();
validateOutputs(svg, POST_TEXT);

writeFileSync(join(outDir, "meme.svg"), svg, "utf8");
writeFileSync(join(outDir, "POST.txt"), POST_TEXT + "\n", "utf8");

// The sealed gate reads POST.json from the output dir, so copy the repo's
// entry-link file there. When outDir is `here` (local runs) the source and
// the destination are the same file, so skip the copy.
if (outDir !== here) {
  copyFileSync(join(here, "POST.json"), join(outDir, "POST.json"));
}

console.log(`meme.svg written (${buildSvg().length} bytes)`);
console.log(`POST.txt written (${POST_TEXT.length}/280 chars)`);
console.log(`POST.json ${outDir === here ? "already in place" : "copied to output dir"}`);
console.log("Done. Post text:");
console.log(POST_TEXT);
