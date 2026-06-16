const fs = require('fs');

// 1. Update globals.css to make theme-classic a Light Mode theme
const cssPath = 'E:/my-savings-plan/src/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newClassicThemeCSS = `
  /* Classic Light Theme */
  :root.theme-classic, .theme-classic {
    --background: 0 0% 98%;
    --foreground: 0 0% 9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 9%;
    --primary: 160 84% 39%; /* Emerald Green */
    --primary-foreground: 0 0% 100%;
    --secondary: 160 20% 90%;
    --secondary-foreground: 160 84% 39%;
    --muted: 0 0% 95%;
    --muted-foreground: 0 0% 45%;
    --accent: 160 20% 90%;
    --accent-foreground: 160 84% 39%;
    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --ring: 160 84% 39%;
    
    --neon-primary: #10b981;
    --neon-secondary: #34d399;

    --bento-radius: 1.5rem;
    --bento-bg: #ffffff;
    --bento-border-top: none;
    --bento-border-bottom: none;
    --bento-border-full: 1px solid #e5e7eb;
  }
`;

// Replace old .dark.theme-classic
css = css.replace(/(\.dark\.theme-classic\s*{[^}]*})/g, '');
css = css.replace('.dark {', newClassicThemeCSS + '\n  .dark {');
fs.writeFileSync(cssPath, css);

// 2. Update SettingsContext.tsx so theme-classic doesn't force dark mode
const ctxPath = 'E:/my-savings-plan/src/context/SettingsContext.tsx';
let ctx = fs.readFileSync(ctxPath, 'utf8');
ctx = ctx.replace('html.classList.remove("dark"', 'html.classList.remove("dark", "theme-classic"');
ctx = ctx.replace('html.classList.add("dark")', 'if (colorTheme !== "classic") html.classList.add("dark")');
fs.writeFileSync(ctxPath, ctx);

// 3. Update ThemeBackground.tsx
const bgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let bg = fs.readFileSync(bgPath, 'utf8');
const oldBg = /function ClassicBackground\(\) \{[\s\S]*?\}/;
const newBg = `function ClassicBackground() {
  return (
    <div className="absolute inset-0 bg-[#f8fafc] pointer-events-none" />
  )
}`;
bg = bg.replace(oldBg, newBg);
fs.writeFileSync(bgPath, bg);

// 4. Update settings/page.tsx
const pagePath = 'E:/my-savings-plan/src/app/settings/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');
page = page.replace("{ id: 'classic', name: 'Nguyên Bản', color: 'bg-blue-500' }", "{ id: 'classic', name: 'Nguyên Bản', color: 'bg-emerald-500' }");
fs.writeFileSync(pagePath, page);

console.log("Updated Classic theme to Light Mode Green");
