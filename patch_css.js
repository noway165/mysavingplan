const fs = require('fs');
const file = 'E:/my-savings-plan/src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const newCSS = `

/* ============================================ */
/* THEME CARD HOVER ENHANCEMENTS                */
/* ============================================ */

@keyframes card-glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Default (JARVIS) - Amber scan-line + sharper glow */
.dark.theme-default .theme-card,
.dark.theme-default .bento-card,
.dark.theme-default .bg-glass-card {
  transition: all 0.3s ease;
}
.dark.theme-default .theme-card:hover,
.dark.theme-default .bento-card:hover,
.dark.theme-default .bg-glass-card:hover {
  box-shadow: 0 0 25px rgba(251, 191, 36, 0.15), 0 0 50px rgba(251, 191, 36, 0.05), inset 0 0 30px rgba(251, 191, 36, 0.05);
  border-color: rgba(251, 191, 36, 0.5);
}

/* Classic (Emerald) - Emerald shimmer border */
.dark.theme-classic .theme-card,
.dark.theme-classic .bento-card,
.dark.theme-classic .bg-glass-card {
  transition: all 0.3s ease;
}
.dark.theme-classic .theme-card:hover,
.dark.theme-classic .bento-card:hover,
.dark.theme-classic .bg-glass-card:hover {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.2), 0 0 40px rgba(16, 185, 129, 0.08), inset 0 0 20px rgba(16, 185, 129, 0.05);
  border-color: rgba(52, 211, 153, 0.6);
}

/* Pastelpink (Sakura) - Pink-lavender glow */
.dark.theme-pastelpink .theme-card,
.dark.theme-pastelpink .bento-card,
.dark.theme-pastelpink .bg-glass-card {
  transition: all 0.4s ease;
}
.dark.theme-pastelpink .theme-card:hover,
.dark.theme-pastelpink .bento-card:hover,
.dark.theme-pastelpink .bg-glass-card:hover {
  box-shadow: 0 0 25px rgba(255, 182, 193, 0.2), 0 0 50px rgba(216, 180, 254, 0.1), inset 0 0 20px rgba(255, 182, 193, 0.05);
  border-color: rgba(255, 182, 193, 0.6);
}

/* Limegreen (Matrix) - Green phosphor glow + scan-line */
.dark.theme-limegreen .theme-card,
.dark.theme-limegreen .bento-card,
.dark.theme-limegreen .bg-glass-card {
  transition: all 0.2s ease;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(74, 222, 128, 0.03) 2px,
    rgba(74, 222, 128, 0.03) 4px
  );
}
.dark.theme-limegreen .theme-card:hover,
.dark.theme-limegreen .bento-card:hover,
.dark.theme-limegreen .bg-glass-card:hover {
  box-shadow: 0 0 30px rgba(74, 222, 128, 0.2), 0 0 60px rgba(74, 222, 128, 0.08), inset 0 0 30px rgba(74, 222, 128, 0.05);
  border-color: rgba(74, 222, 128, 0.7);
}

/* Whitesmoke (Halloween) - Ember glow on hover */
.dark.theme-whitesmoke .theme-card,
.dark.theme-whitesmoke .bento-card,
.dark.theme-whitesmoke .bg-glass-card {
  transition: all 0.3s ease;
}
.dark.theme-whitesmoke .theme-card:hover,
.dark.theme-whitesmoke .bento-card:hover,
.dark.theme-whitesmoke .bg-glass-card:hover {
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.2), 0 0 50px rgba(249, 115, 22, 0.1), inset 0 0 25px rgba(168, 85, 247, 0.05);
  border-color: rgba(249, 115, 22, 0.6);
}

/* Amethyst (Galaxy) - Cosmic purple shimmer */
.dark.theme-amethyst .theme-card,
.dark.theme-amethyst .bento-card,
.dark.theme-amethyst .bg-glass-card {
  transition: all 0.4s ease;
}
.dark.theme-amethyst .theme-card:hover,
.dark.theme-amethyst .bento-card:hover,
.dark.theme-amethyst .bg-glass-card:hover {
  box-shadow: 0 0 30px rgba(167, 139, 250, 0.2), 0 0 60px rgba(244, 114, 182, 0.1), inset 0 0 25px rgba(167, 139, 250, 0.06);
  border-color: rgba(167, 139, 250, 0.6);
}

/* Spring (Tet) - Red-gold lantern glow */
.dark.theme-spring .theme-card,
.dark.theme-spring .bento-card,
.dark.theme-spring .bg-glass-card {
  transition: all 0.3s ease;
}
.dark.theme-spring .theme-card:hover,
.dark.theme-spring .bento-card:hover,
.dark.theme-spring .bg-glass-card:hover {
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.15), 0 0 50px rgba(250, 204, 21, 0.1), inset 0 0 20px rgba(250, 204, 21, 0.05);
  border-color: rgba(250, 204, 21, 0.7);
}

/* Summer - Ocean-cyan wave glow */
.dark.theme-summer .theme-card,
.dark.theme-summer .bento-card,
.dark.theme-summer .bg-glass-card {
  transition: all 0.4s ease;
}
.dark.theme-summer .theme-card:hover,
.dark.theme-summer .bento-card:hover,
.dark.theme-summer .bg-glass-card:hover {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.2), 0 0 50px rgba(6, 182, 212, 0.08), inset 0 0 20px rgba(6, 182, 212, 0.05);
  border-color: rgba(6, 182, 212, 0.6);
}

/* Autumn - Warm amber-brown glow */
.dark.theme-autumn .theme-card,
.dark.theme-autumn .bento-card,
.dark.theme-autumn .bg-glass-card {
  transition: all 0.3s ease;
}
.dark.theme-autumn .theme-card:hover,
.dark.theme-autumn .bento-card:hover,
.dark.theme-autumn .bg-glass-card:hover {
  box-shadow: 0 0 25px rgba(249, 115, 22, 0.2), 0 0 50px rgba(161, 98, 7, 0.1), inset 0 0 20px rgba(249, 115, 22, 0.05);
  border-color: rgba(249, 115, 22, 0.6);
}

/* Winter - Frosted ice-blue glow */
.dark.theme-winter .theme-card,
.dark.theme-winter .bento-card,
.dark.theme-winter .bg-glass-card {
  transition: all 0.4s ease;
  backdrop-filter: blur(20px);
}
.dark.theme-winter .theme-card:hover,
.dark.theme-winter .bento-card:hover,
.dark.theme-winter .bg-glass-card:hover {
  box-shadow: 0 0 30px rgba(186, 230, 253, 0.2), 0 0 60px rgba(186, 230, 253, 0.08), inset 0 0 25px rgba(186, 230, 253, 0.06);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Vietnam - Red-gold sharp glow */
.dark.theme-vietnam .theme-card,
.dark.theme-vietnam .bento-card,
.dark.theme-vietnam .bg-glass-card {
  transition: all 0.3s ease;
}
.dark.theme-vietnam .theme-card:hover,
.dark.theme-vietnam .bento-card:hover,
.dark.theme-vietnam .bg-glass-card:hover {
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.15), 0 0 50px rgba(251, 191, 36, 0.1), inset 0 0 20px rgba(251, 191, 36, 0.05);
  border-color: rgba(251, 191, 36, 0.7);
}
`;

content = content.trimEnd() + newCSS;
fs.writeFileSync(file, content);
console.log("CSS patched successfully!");
