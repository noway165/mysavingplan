const fs = require('fs');

// 1. Update globals.css to make theme-classic a Dark Mode Emerald theme
const cssPath = 'E:/my-savings-plan/src/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newClassicThemeCSS = `
  /* Classic Dark Emerald Theme */
  .dark.theme-classic {
    --background: 220 40% 6%;
    --card: 220 50% 12%;
    --border: 160 50% 20%;
    --primary: 160 84% 39%; /* Emerald Green */
    --primary-foreground: 0 0% 100%;
    --ring: 160 84% 39%;
    
    --neon-primary: #10b981; /* Emerald */
    --neon-secondary: #34d399; /* Light Emerald */

    --bento-radius: 1.5rem;
    --bento-bg: rgba(6, 78, 59, 0.2);
    --bento-border-top: none;
    --bento-border-bottom: none;
    --bento-border-full: 1.5px solid color-mix(in srgb, var(--neon-primary) 50%, transparent);
  }
`;

// Remove the old light mode block
css = css.replace(/\/\* Classic Light Theme \*\/[\s\S]*?\}\s*/g, '');
css = css.replace('.dark {', newClassicThemeCSS + '\n  .dark {');
fs.writeFileSync(cssPath, css);

// 2. Update SettingsContext.tsx to add "dark" back for all themes
const ctxPath = 'E:/my-savings-plan/src/context/SettingsContext.tsx';
let ctx = fs.readFileSync(ctxPath, 'utf8');
ctx = ctx.replace('html.classList.remove("dark", "theme-classic"', 'html.classList.remove("dark"');
ctx = ctx.replace('if (colorTheme !== "classic") html.classList.add("dark")', 'html.classList.add("dark")');
fs.writeFileSync(ctxPath, ctx);

// 3. Update ThemeBackground.tsx
const bgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let bg = fs.readFileSync(bgPath, 'utf8');
const oldBg = /function ClassicBackground\(\) \{[\s\S]*?\}/;
const newBg = `function ClassicBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-black/90 pointer-events-none" />
  )
}`;
bg = bg.replace(oldBg, newBg);
fs.writeFileSync(bgPath, bg);

console.log("Updated Classic theme to Dark Mode Emerald Green");
