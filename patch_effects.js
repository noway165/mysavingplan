const fs = require('fs');
const file = 'E:/my-savings-plan/src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const newEffects = `

/* ============================================ */
/* PREMIUM UI EFFECTS                           */
/* ============================================ */

/* 1. ANIMATED GRADIENT BORDER */
@keyframes gradient-border-spin {
  0% { --angle: 0deg; }
  100% { --angle: 360deg; }
}

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  position: relative;
  isolation: isolate;
}
.gradient-border::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1.5px;
  background: conic-gradient(from var(--angle), var(--neon-primary), var(--neon-secondary), transparent, var(--neon-primary));
  animation: gradient-border-spin 4s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.gradient-border:hover::before {
  opacity: 1;
}

/* 2. CARD SHIMMER EFFECT */
@keyframes shimmer-pass {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}

.shimmer-effect {
  position: relative;
  overflow: hidden;
}
.shimmer-effect::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--neon-primary) 8%, transparent),
    color-mix(in srgb, var(--neon-secondary) 5%, transparent),
    transparent
  );
  animation: shimmer-pass 6s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

/* 3. THEME-SPECIFIC SCROLLBAR */
* {
  scrollbar-width: thin;
}
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
*::-webkit-scrollbar-track {
  background: transparent;
}
*::-webkit-scrollbar-thumb {
  border-radius: 99px;
  background: color-mix(in srgb, var(--neon-primary) 40%, transparent);
  transition: background 0.3s;
}
*::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--neon-primary) 70%, transparent);
}

/* 4. GRADIENT TEXT HEADERS */
.gradient-text {
  background: linear-gradient(135deg, var(--neon-primary), var(--neon-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}
.gradient-text-glow {
  background: linear-gradient(135deg, var(--neon-primary), var(--neon-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--neon-primary) 40%, transparent));
}

/* 5. BREATHING GLOW */
@keyframes breathe-glow {
  0%, 100% {
    box-shadow: 0 0 10px color-mix(in srgb, var(--neon-primary) 5%, transparent),
                0 0 20px color-mix(in srgb, var(--neon-primary) 3%, transparent);
  }
  50% {
    box-shadow: 0 0 20px color-mix(in srgb, var(--neon-primary) 12%, transparent),
                0 0 40px color-mix(in srgb, var(--neon-primary) 6%, transparent),
                0 0 60px color-mix(in srgb, var(--neon-secondary) 3%, transparent);
  }
}

.breathe-glow {
  animation: breathe-glow 4s ease-in-out infinite;
}

/* Auto-apply breathing glow to summary cards on dashboard */
.dark .bg-glass-card {
  animation: breathe-glow 5s ease-in-out infinite;
}
.dark .bg-glass-card:nth-child(2) { animation-delay: 1s; }
.dark .bg-glass-card:nth-child(3) { animation-delay: 2s; }
.dark .bg-glass-card:nth-child(4) { animation-delay: 3s; }

/* 6. GLASSMORPHISM DEPTH LEVELS */
.glass-light {
  background: color-mix(in srgb, var(--neon-primary) 3%, rgba(0, 0, 0, 0.2));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid color-mix(in srgb, var(--neon-primary) 10%, transparent);
}

.glass-medium {
  background: color-mix(in srgb, var(--neon-primary) 6%, rgba(0, 0, 0, 0.35));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid color-mix(in srgb, var(--neon-primary) 20%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--neon-primary) 10%, transparent),
              0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-heavy {
  background: color-mix(in srgb, var(--neon-primary) 10%, rgba(0, 0, 0, 0.5));
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid color-mix(in srgb, var(--neon-primary) 30%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--neon-primary) 15%, transparent),
              inset 0 0 30px color-mix(in srgb, var(--neon-primary) 5%, transparent),
              0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Extra: Smooth transitions for theme switching */
html, body, .bg-glass-card, .bento-card, .theme-card, .bg-glass {
  transition: background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, color 0.3s ease;
}
`;

content = content.trimEnd() + newEffects;
fs.writeFileSync(file, content);
console.log("Premium effects added!");
