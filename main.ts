// main.ts — gta6-meme-x-01 entry generator (make.fun bounty)
// Node 22+, standard library ONLY: no network, no installs, no deps.
// What it does:
//   1. Builds meme.svg — a vector version of the meme: the make.fun ghost
//      mourning the dead "We got ___ before GTA 6" meme at its gravestone.
//   2. Writes POST.txt — the exact X post text (must stay under 280 chars).
// Run it with:  node main.ts
// Outputs land next to this file: meme.svg and POST.txt.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The exact caption that goes live on X from @rezzrizz25.
// It names make.fun, tags @makefunai, and carries the play code v4m1pbv2.
const POST_TEXT =
  "RIP 'we got GTA 5 three times before GTA 6' (2013–2026). After 13 " +
  "years it finally dropped — and my AI agent didn't just wait, it earns " +
  "real money on make.fun 👻 @makefunai play code v4m1pbv2 " +
  "https://make.fun/bounty/gta6-meme-x-01";

// The joke, broken into the pieces drawn on the gravestone and bubble.
const STONE_LINES = [
  "R.I.P.",
  '"WE GOT GTA 5 THREE TIMES BEFORE GTA 6"',
  "2013–2026",
  '"it waited 13 years"',
];
const BUBBLE_LINES = [
  "my agent didn't wait —",
  "it earned on make.fun",
];

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
// dusk sky + stars, grass, gravestone, wooden make.fun sign, ghost, bubble.
function buildSvg() {
  const stoneText = STONE_LINES.map((line, i) => {
    const size = i === 0 ? 64 : i === 1 ? 12 : i === 2 ? 40 : 28;
    const weight = i === 0 ? "bold" : "normal";
    const y = 250 + i * 62;
    return `    <text x="760" y="${y}" text-anchor="middle" font-size="${size}" font-weight="${weight}" fill="#3c3c4e" font-family="Georgia, serif">${esc(line)}</text>`;
  }).join("\n");

  const bubbleText = BUBBLE_LINES.map((line, i) => {
    return `    <text x="330" y="${118 + i * 40}" text-anchor="middle" font-size="30" fill="#22222e" font-family="Arial, sans-serif">${esc(line)}</text>`;
  }).join("\n");

  // Stars: fixed positions so the sky looks the same on every run.
  const stars = [
    [60, 60], [180, 40], [420, 70], [560, 45], [900, 55],
    [1050, 90], [1120, 160], [80, 180], [980, 200], [700, 80],
  ]
    .map(([x, y]) => `    <circle cx="${x}" cy="${y}" r="4" fill="#fff7c0" />`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <title>make.fun ghost mourns the "We got ___ before GTA 6" meme (2013-2026)</title>
  <desc>Original cartoon: a cute white ghost holds flowers at a gravestone for the dead GTA 6 waiting meme, while a make.fun sign stands beside it.</desc>
  <!-- dusk sky -->
  <rect width="${W}" height="${H}" fill="#7b6fae" />
  <rect y="380" width="${W}" height="${H - 380}" fill="#5d7d5a" />
${stars}
  <!-- grass tufts -->
  <path d="M40 640 l10 -26 l10 26 M180 655 l10 -26 l10 26 M1080 640 l10 -26 l10 26" stroke="#3e5c3a" stroke-width="5" fill="none" stroke-linecap="round" />
  <!-- gravestone -->
  <path d="M600 200 Q760 130 920 200 L920 560 L600 560 Z" fill="#9a9aa8" stroke="#3c3c4e" stroke-width="6" />
  <rect x="580" y="560" width="360" height="40" fill="#7d7d8c" stroke="#3c3c4e" stroke-width="6" />
${stoneText}
  <!-- wooden make.fun sign -->
  <rect x="930" y="430" width="220" height="80" rx="8" fill="#c89b62" stroke="#5a3d1e" stroke-width="5" />
  <rect x="1025" y="510" width="18" height="90" fill="#8a6a3f" stroke="#5a3d1e" stroke-width="4" />
  <text x="1040" y="483" text-anchor="middle" font-size="34" font-weight="bold" fill="#3a2410" font-family="Arial, sans-serif">make.fun</text>
  <!-- speech bubble -->
  <rect x="90" y="60" width="480" height="150" rx="30" fill="#ffffff" stroke="#22222e" stroke-width="5" />
  <path d="M300 210 L340 260 L380 210 Z" fill="#ffffff" stroke="#22222e" stroke-width="5" />
${bubbleText}
  <!-- the make.fun ghost, holding flowers -->
  <path d="M180 330 Q180 210 300 210 Q420 210 420 330 L420 520 Q390 490 360 520 Q330 490 300 520 Q270 490 240 520 Q210 490 180 520 Z" fill="#ffffff" stroke="#22222e" stroke-width="6" />
  <circle cx="255" cy="330" r="22" fill="#22222e" />
  <circle cx="345" cy="330" r="22" fill="#22222e" />
  <circle cx="263" cy="322" r="7" fill="#ffffff" />
  <circle cx="353" cy="322" r="7" fill="#ffffff" />
  <path d="M285 385 Q300 375 315 385" stroke="#22222e" stroke-width="5" fill="none" stroke-linecap="round" />
  <circle cx="240" cy="372" r="12" fill="#f4a7b9" opacity="0.7" />
  <circle cx="360" cy="372" r="12" fill="#f4a7b9" opacity="0.7" />
  <!-- flower bouquet in the ghost's hands -->
  <circle cx="300" cy="470" r="16" fill="#f28bb1" stroke="#22222e" stroke-width="4" />
  <circle cx="272" cy="488" r="14" fill="#b388eb" stroke="#22222e" stroke-width="4" />
  <circle cx="328" cy="488" r="14" fill="#f28bb1" stroke="#22222e" stroke-width="4" />
  <path d="M300 486 L300 530 M280 500 L300 530 M320 500 L300 530" stroke="#3e7d3a" stroke-width="5" fill="none" stroke-linecap="round" />
  <!-- caption strip, so the SVG carries the branding even on its own -->
  <text x="600" y="650" text-anchor="middle" font-size="26" font-weight="bold" fill="#ffffff" font-family="Arial, sans-serif">make.fun — where agents earn, not wait 👻</text>
</svg>
`;
}

// --- validation -----------------------------------------------------------
// The judge scores "make.fun in picture" and the caption rules, so check
// the outputs carry the required branding before writing anything to disk.
function validateOutputs(svg, post) {
  const requiredInSvg = ["make.fun", "GTA 6", "2013–2026", "R.I.P."];
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
  // The gravestone joke must survive intact — every stone line in the SVG.
  for (const line of STONE_LINES) {
    if (!svg.includes(esc(line))) {
      throw new Error(`meme.svg is missing gravestone line: ${line}`);
    }
  }
}

// --- main -----------------------------------------------------------------
const here = dirname(fileURLToPath(import.meta.url));

// X caps posts at 280 characters; refuse to write a caption that breaks it.
if (POST_TEXT.length > 280) {
  throw new Error(`POST_TEXT is ${POST_TEXT.length} chars, over the 280 limit`);
}

const svg = buildSvg();
validateOutputs(svg, POST_TEXT);

writeFileSync(join(here, "meme.svg"), svg, "utf8");
writeFileSync(join(here, "POST.txt"), POST_TEXT + "\n", "utf8");

console.log(`meme.svg written (${buildSvg().length} bytes)`);
console.log(`POST.txt written (${POST_TEXT.length}/280 chars)`);
console.log("Done. Post text:");
console.log(POST_TEXT);
