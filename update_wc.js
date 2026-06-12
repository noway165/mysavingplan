const fs = require('fs');

// 1. Rewrite globals.css
const cssPath = 'E:/my-savings-plan/src/app/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const oldWorldCupRegex = /\.theme-worldcup\s*\{[\s\S]*?--bento-border-full:[^\}]+\}/;

const newWorldCupCSS = `.theme-worldcup {
  --background: 280 50% 5%; /* Very dark neon purple/black */
  --foreground: 0 0% 98%;
  --card: 280 40% 8%;
  --card-foreground: 0 0% 98%;
  --popover: 280 40% 8%;
  --popover-foreground: 0 0% 98%;
  --primary: 199 89% 48%; /* Neon cyan */
  --primary-foreground: 0 0% 100%;
  --secondary: 326 78% 60%; /* Neon magenta/pink */
  --secondary-foreground: 0 0% 100%;
  --muted: 280 30% 15%;
  --muted-foreground: 280 20% 70%;
  --accent: 142 71% 45%; /* Neon green */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 326 78% 60%;
  --input: 280 30% 15%;
  --ring: 199 89% 48%;
  --neon-primary: #ec4899; /* Pink */
  --neon-secondary: #0ea5e9; /* Cyan */
  --canvas-bg: #090314;
  --bento-border-full: 2px solid color-mix(in srgb, var(--neon-secondary) 80%, transparent);
}`;

cssContent = cssContent.replace(oldWorldCupRegex, newWorldCupCSS);
fs.writeFileSync(cssPath, cssContent);

// 2. Rewrite ThemeBackground.tsx
const bgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let bgContent = fs.readFileSync(bgPath, 'utf8');

const oldBgRegex = /function WorldCupBackground\(\) \{[\s\S]*?\n\}/;

const newBgContent = `function WorldCupBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#090314]">
      {/* WC 2026 Retro-Futuristic Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#ec4899]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0ea5e9]/10 rounded-full blur-[150px]" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-[#8b5cf6]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-[#22c55e]/10 rounded-full blur-[100px]" />
      
      {/* Floating geometric shapes (WC 2026 style) */}
      {Array.from({ length: 20 }).map((_, i) => {
        const colors = ['#ec4899', '#0ea5e9', '#8b5cf6', '#22c55e', '#f97316'];
        const color = colors[i % colors.length];
        const style = {
          left: \`\${Math.random() * 100}%\`,
          top: \`-\${Math.random() * 20 + 10}%\`,
          animationDuration: \`\${Math.random() * 10 + 10}s\`,
          animationDelay: \`\${Math.random() * 10}s\`,
          width: \`\${Math.random() * 30 + 10}px\`,
          height: \`\${Math.random() * 30 + 10}px\`,
          borderColor: color,
          borderWidth: '2px',
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          borderRadius: i % 3 === 0 ? '50%' : '4px',
          transform: \`rotate(\${Math.random() * 360}deg)\`,
          opacity: Math.random() * 0.4 + 0.1
        }
        return (
          <div 
            key={i} 
            className="absolute animate-fall-spin shadow-[0_0_15px_currentColor]" 
            style={style} 
          />
        )
      })}
    </div>
  )
}`;

bgContent = bgContent.replace(oldBgRegex, newBgContent);
fs.writeFileSync(bgPath, bgContent);

console.log("World Cup 2026 theme applied.");
