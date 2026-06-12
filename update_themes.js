const fs = require('fs');

// 1. SettingsContext.tsx
const ctxPath = 'E:/my-savings-plan/src/context/SettingsContext.tsx';
let ctxContent = fs.readFileSync(ctxPath, 'utf8');
ctxContent = ctxContent.replace(
  '"pastelpink" | "slate" | "limegreen" | "orangered" | "whitesmoke"',
  '"pastelpink" | "worldcup" | "limegreen" | "whitesmoke"'
);
fs.writeFileSync(ctxPath, ctxContent);

// 2. settings/page.tsx
const settingsPath = 'E:/my-savings-plan/src/app/settings/page.tsx';
let settingsContent = fs.readFileSync(settingsPath, 'utf8');

const oldThemesArr = `              {([
                { id: 'default', name: 'Mặc định', color: 'bg-amber-500' },
                { id: 'pastelpink', name: 'Hoa Anh Đào', color: 'bg-[#FFC0CB]' },
                { id: 'slate', name: 'Mưa Sao Băng', color: 'bg-slate-500' },
                { id: 'limegreen', name: 'Ma Trận', color: 'bg-[#32CD32]' },
                { id: 'orangered', name: 'Lò Rèn', color: 'bg-[#FF4500]' },
                { id: 'whitesmoke', name: 'Halloween', color: 'bg-[#a855f7]' },
                { id: 'amethyst', name: 'Ngân Hà', color: 'bg-[#9966CC]' },
                { id: 'spring', name: 'Mùa Xuân (Tết)', color: 'bg-[#ec4899]' },
                { id: 'summer', name: 'Mùa Hè', color: 'bg-[#06b6d4]' },
                { id: 'autumn', name: 'Mùa Thu', color: 'bg-[#f97316]' },
                { id: 'winter', name: 'Mùa Đông', color: 'bg-[#bae6fd]' },
                { id: 'vietnam', name: 'Việt Nam', color: 'bg-[#ef4444]' },
              ] as const).map(t => (`;

const newThemesArr = `              {([
                { id: 'default', name: 'Mặc định', color: 'bg-amber-500' },
                { id: 'pastelpink', name: 'Hoa Anh Đào', color: 'bg-[#FFC0CB]' },
                { id: 'worldcup', name: 'World Cup', color: 'bg-[#10b981]' },
                { id: 'limegreen', name: 'Ma Trận', color: 'bg-[#32CD32]' },
                { id: 'whitesmoke', name: 'Halloween', color: 'bg-[#a855f7]' },
                { id: 'amethyst', name: 'Ngân Hà', color: 'bg-[#9966CC]' },
                { id: 'spring', name: 'Mùa Xuân (Tết)', color: 'bg-[#ec4899]' },
                { id: 'summer', name: 'Mùa Hè', color: 'bg-[#06b6d4]' },
                { id: 'autumn', name: 'Mùa Thu', color: 'bg-[#f97316]' },
                { id: 'winter', name: 'Mùa Đông', color: 'bg-[#bae6fd]' },
                { id: 'vietnam', name: 'Việt Nam', color: 'bg-[#ef4444]' },
              ] as const).map(t => (`;

settingsContent = settingsContent.replace(oldThemesArr, newThemesArr);
fs.writeFileSync(settingsPath, settingsContent);

// 3. globals.css
const cssPath = 'E:/my-savings-plan/src/app/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Remove slate
const slateRegex = /\.theme-slate\s*\{[\s\S]*?\}/;
cssContent = cssContent.replace(slateRegex, '');

// Remove orangered
const orangeRegex = /\.theme-orangered\s*\{[\s\S]*?\}/;
cssContent = cssContent.replace(orangeRegex, '');

const worldCupCSS = `
.theme-worldcup {
  --background: 140 50% 10%;
  --foreground: 0 0% 98%;
  --card: 140 40% 12%;
  --card-foreground: 0 0% 98%;
  --popover: 140 40% 12%;
  --popover-foreground: 0 0% 98%;
  --primary: 45 93% 47%;
  --primary-foreground: 140 50% 10%;
  --secondary: 140 40% 20%;
  --secondary-foreground: 0 0% 98%;
  --muted: 140 40% 20%;
  --muted-foreground: 140 20% 65%;
  --accent: 140 40% 20%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62% 30%;
  --destructive-foreground: 0 0% 98%;
  --border: 45 93% 47%;
  --input: 140 40% 20%;
  --ring: 45 93% 47%;
  --neon-primary: #10b981;
  --neon-secondary: #facc15;
  --canvas-bg: #064e3b;
  --bento-border-full: 2px solid color-mix(in srgb, var(--neon-secondary) 80%, transparent);
}

@keyframes fall-spin {
  0% { transform: translateY(-100px) rotate(0deg); }
  100% { transform: translateY(110vh) rotate(720deg); }
}
.animate-fall-spin {
  animation: fall-spin linear infinite;
}
`;

cssContent = cssContent + '\n' + worldCupCSS;
fs.writeFileSync(cssPath, cssContent);

console.log("Updated contexts and CSS");
