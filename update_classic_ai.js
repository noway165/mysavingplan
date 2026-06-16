const fs = require('fs');

// 1. Update globals.css
const cssPath = 'E:/my-savings-plan/src/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');

const classicThemeCSS = `
  .dark.theme-classic {
    --background: 220 40% 6%;
    --card: 220 50% 12%;
    --border: 210 100% 60%;
    --primary: 210 100% 60%;
    --primary-foreground: 0 0% 100%;
    --ring: 210 100% 60%;
    --neon-primary: #3b82f6; /* AI Blue */
    --neon-secondary: #06b6d4; /* AI Cyan */
    
    /* Modern AI Layout */
    --bento-radius: 1.5rem;
    --bento-bg: rgba(15, 25, 45, 0.6);
    --bento-border-top: none;
    --bento-border-bottom: none;
    --bento-border-full: 1.5px solid color-mix(in srgb, var(--neon-secondary) 50%, transparent);
  }
`;

if (!css.includes('.dark.theme-classic')) {
  css = css.replace('.dark {', classicThemeCSS + '\n  .dark {');
  fs.writeFileSync(cssPath, css);
}

// 2. Update ThemeBackground.tsx
const themeBgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let themeBg = fs.readFileSync(themeBgPath, 'utf8');
const oldClassicBg = `function ClassicBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-black/90 pointer-events-none" />
  )
}`;
const newClassicBg = `function ClassicBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617]" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[120px]" />
    </div>
  )
}`;
themeBg = themeBg.replace(oldClassicBg, newClassicBg);
fs.writeFileSync(themeBgPath, themeBg);

// 3. Update settings/page.tsx
const settingsPagePath = 'E:/my-savings-plan/src/app/settings/page.tsx';
let settingsPage = fs.readFileSync(settingsPagePath, 'utf8');
settingsPage = settingsPage.replace("{ id: 'classic', name: 'Nguyên Bản', color: 'bg-zinc-800' }", "{ id: 'classic', name: 'Nguyên Bản', color: 'bg-blue-500' }");
fs.writeFileSync(settingsPagePath, settingsPage);

console.log("Updated Classic theme to AI blue");
