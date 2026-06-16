const fs = require('fs');

// 1. SettingsContext.tsx
const ctxPath = 'E:/my-savings-plan/src/context/SettingsContext.tsx';
let ctx = fs.readFileSync(ctxPath, 'utf8');
ctx = ctx.replace(' | "worldcup" | "portugal"', '');
ctx = ctx.replace(', "theme-worldcup", "theme-portugal"', '');
fs.writeFileSync(ctxPath, ctx);

// 2. page.tsx
const pagePath = 'E:/my-savings-plan/src/app/settings/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');
page = page.replace(/\s*\{\s*id:\s*'worldcup',\s*name:\s*'World Cup',\s*color:\s*'bg-\[#10b981\]'\s*\},/g, '');
page = page.replace(/\s*\{\s*id:\s*'portugal',\s*name:\s*'Portugal WC 26',\s*color:\s*'bg-\[#FF0000\]'\s*\},/g, '');
fs.writeFileSync(pagePath, page);

// 3. globals.css
const cssPath = 'E:/my-savings-plan/src/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');
// Use regex to remove .theme-worldcup { ... } and .theme-portugal { ... }
css = css.replace(/\.theme-worldcup\s*\{[\s\S]*?\}(?=\s*\.|\s*@)/, '');
css = css.replace(/\.theme-portugal\s*\{[\s\S]*?\}(?=\s*\.|\s*@)/, '');
// Also remove .dark.theme-worldcup and .dark.theme-portugal if they exist
css = css.replace(/\.dark\.theme-worldcup\s*\{[\s\S]*?\}(?=\s*\.|\s*@)/, '');
css = css.replace(/\.dark\.theme-portugal\s*\{[\s\S]*?\}(?=\s*\.|\s*@)/, '');
fs.writeFileSync(cssPath, css);

console.log("Successfully cleaned up Context, Page, and CSS.");
