const fs = require('fs');

// 1. Update SettingsContext.tsx
const settingsCtxPath = 'E:/my-savings-plan/src/context/SettingsContext.tsx';
let settingsCtx = fs.readFileSync(settingsCtxPath, 'utf8');
settingsCtx = settingsCtx.replace(' | "portugal"', ' | "portugal" | "classic"');
fs.writeFileSync(settingsCtxPath, settingsCtx);

// 2. Update settings/page.tsx
const settingsPagePath = 'E:/my-savings-plan/src/app/settings/page.tsx';
let settingsPage = fs.readFileSync(settingsPagePath, 'utf8');
// Insert Classic theme as the first item
settingsPage = settingsPage.replace("              {([", "              {([\n                { id: 'classic', name: 'Nguyên Bản', color: 'bg-zinc-800' },");
fs.writeFileSync(settingsPagePath, settingsPage);

// 3. Update ThemeBackground.tsx
const themeBgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let themeBg = fs.readFileSync(themeBgPath, 'utf8');
// Add to ThemeBackground function
themeBg = themeBg.replace('{colorTheme === "portugal" && <PortugalBackground />}', '{colorTheme === "portugal" && <PortugalBackground />}\n      {colorTheme === "classic" && <ClassicBackground />}');

// Add ClassicBackground component at the bottom
const classicBgComponent = `
function ClassicBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-black/90 pointer-events-none" />
  )
}
`;
themeBg += classicBgComponent;
fs.writeFileSync(themeBgPath, themeBg);

console.log('Added Classic theme successfully');
