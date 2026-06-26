const fs = require('fs');
const file = 'E:/my-savings-plan/src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const majorUpdate = `

/* ============================================ */
/* 🚀 MAJOR UI OVERHAUL: FONT & BACKGROUNDS     */
/* ============================================ */

/* --- 1. THEME FONTS --- */
/* Default font */
body {
  font-family: var(--font-inter), sans-serif;
}

.dark.theme-default body,
.dark.theme-amethyst body {
  font-family: var(--font-orbitron), sans-serif;
}

.dark.theme-limegreen body {
  font-family: var(--font-space-mono), monospace;
}

.dark.theme-whitesmoke body {
  font-family: var(--font-oswald), sans-serif;
}

.dark.theme-classic body,
.dark.theme-pastelpink body,
.dark.theme-spring body,
.dark.theme-autumn body,
.dark.theme-vietnam body {
  font-family: var(--font-playfair), serif;
}

.dark.theme-summer body,
.dark.theme-winter body {
  font-family: var(--font-inter), sans-serif;
}

/* --- 2. GLOBAL BODY GRADIENTS --- */
body {
  background-attachment: fixed;
  background-size: cover;
}
.dark.theme-pastelpink body { background: linear-gradient(135deg, #2a0814 0%, #1a050d 100%); }
.dark.theme-limegreen body { background: linear-gradient(135deg, #001a00 0%, #000a00 100%); }
.dark.theme-whitesmoke body { background: linear-gradient(135deg, #1e1b4b 0%, #020617 100%); }
.dark.theme-summer body { background: linear-gradient(135deg, #083344 0%, #020617 100%); }
.dark.theme-spring body { background: linear-gradient(135deg, #450a0a 0%, #2a0814 100%); }
.dark.theme-autumn body { background: linear-gradient(135deg, #431407 0%, #2e0802 100%); }
.dark.theme-amethyst body { background: linear-gradient(135deg, #2e1065 0%, #0f0524 100%); }
.dark.theme-winter body { background: linear-gradient(135deg, #0c4a6e 0%, #042f4b 100%); }

/* --- 3. DISTINCT CARD BACKGROUNDS & THICKER BORDERS --- */
/* Base overrides for bento-card and bg-glass-card */
.dark .bento-card,
.dark .bg-glass-card {
  border-width: 1.5px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Sakura */
.dark.theme-pastelpink .bento-card,
.dark.theme-pastelpink .bg-glass-card {
  background-color: rgba(255, 182, 193, 0.08);
  border-color: rgba(255, 182, 193, 0.4);
}

/* Matrix */
.dark.theme-limegreen .bento-card,
.dark.theme-limegreen .bg-glass-card {
  background-color: rgba(0, 40, 0, 0.4);
  border-color: rgba(74, 222, 128, 0.5);
  box-shadow: inset 0 0 10px rgba(74, 222, 128, 0.1);
}

/* Halloween */
.dark.theme-whitesmoke .bento-card,
.dark.theme-whitesmoke .bg-glass-card {
  background-color: rgba(249, 115, 22, 0.08);
  border-color: rgba(249, 115, 22, 0.4);
}

/* Galaxy */
.dark.theme-amethyst .bento-card,
.dark.theme-amethyst .bg-glass-card {
  background-color: rgba(167, 139, 250, 0.08);
  border-color: rgba(167, 139, 250, 0.4);
}

/* Summer */
.dark.theme-summer .bento-card,
.dark.theme-summer .bg-glass-card {
  background-color: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.4);
}

/* Autumn */
.dark.theme-autumn .bento-card,
.dark.theme-autumn .bg-glass-card {
  background-color: rgba(249, 115, 22, 0.08);
  border-color: rgba(249, 115, 22, 0.4);
}

/* Spring */
.dark.theme-spring .bento-card,
.dark.theme-spring .bg-glass-card {
  background-color: rgba(250, 204, 21, 0.08);
  border-color: rgba(239, 68, 68, 0.4);
}

/* Winter */
.dark.theme-winter .bento-card,
.dark.theme-winter .bg-glass-card {
  background-color: rgba(186, 230, 253, 0.08);
  border-color: rgba(186, 230, 253, 0.4);
}

/* Default / Classic / Vietnam */
.dark.theme-default .bento-card,
.dark.theme-default .bg-glass-card,
.dark.theme-vietnam .bento-card,
.dark.theme-vietnam .bg-glass-card {
  background-color: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.4);
}

.dark.theme-classic .bento-card,
.dark.theme-classic .bg-glass-card {
  background-color: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.4);
}
`;

content = content.trimEnd() + majorUpdate;
fs.writeFileSync(file, content);
console.log("Major CSS UI Overhaul applied!");
