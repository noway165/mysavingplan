const fs = require('fs');

// 1. SettingsContext.tsx
let settingsPath = 'E:/my-savings-plan/src/context/SettingsContext.tsx';
let settingsContent = fs.readFileSync(settingsPath, 'utf8');
settingsContent = settingsContent.replace(
  /export type ColorTheme = "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)" \| "([^"]+)"/,
  'export type ColorTheme = "$1" | "$2" | "$3" | "$4" | "$5" | "$6" | "$7" | "$8" | "$9" | "$10" | "$11" | "portugal"'
);
settingsContent = settingsContent.replace(
  /"theme-vietnam", "theme-worldcup"/,
  '"theme-vietnam", "theme-worldcup", "theme-portugal"'
);
fs.writeFileSync(settingsPath, settingsContent);


// 2. globals.css
let cssPath = 'E:/my-savings-plan/src/app/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');
const portugalCSS = `
.theme-portugal {
  --background: 0 100% 4%; /* Very dark red/black */
  --foreground: 0 0% 98%;
  --card: 0 80% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 0 80% 6%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 100% 50%; /* Portugal Red */
  --primary-foreground: 0 0% 100%;
  --secondary: 120 100% 20%; /* Portugal Green */
  --secondary-foreground: 0 0% 100%;
  --muted: 0 50% 15%;
  --muted-foreground: 0 20% 70%;
  --accent: 51 100% 50%; /* Gold */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 51 100% 50%;
  --input: 0 50% 15%;
  --ring: 51 100% 50%;
  --neon-primary: #FF0000;
  --neon-secondary: #006600;
}
`;
if (!cssContent.includes('.theme-portugal')) {
  cssContent += portugalCSS;
  fs.writeFileSync(cssPath, cssContent);
}

// 3. settings/page.tsx
let settingsPagePath = 'E:/my-savings-plan/src/app/settings/page.tsx';
let settingsPageContent = fs.readFileSync(settingsPagePath, 'utf8');
if (!settingsPageContent.includes("{ id: 'portugal'")) {
  settingsPageContent = settingsPageContent.replace(
    /\{ id: 'worldcup', name: 'World Cup', color: 'bg-\[#10b981\]' \},/,
    `{ id: 'worldcup', name: 'World Cup', color: 'bg-[#10b981]' },
              { id: 'portugal', name: 'Portugal WC 26', color: 'bg-[#FF0000]' },`
  );
  fs.writeFileSync(settingsPagePath, settingsPageContent);
}


// 4. ThemeBackground.tsx
let themeBgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let themeBgContent = fs.readFileSync(themeBgPath, 'utf8');
if (!themeBgContent.includes('colorTheme === "portugal"')) {
  themeBgContent = themeBgContent.replace(
    /\{colorTheme === "worldcup" && <WorldCupBackground \/>\}/,
    `{colorTheme === "worldcup" && <WorldCupBackground />}
      {colorTheme === "portugal" && <PortugalBackground />}`
  );
}

const portugalComponent = `
function PortugalBackground() {
  const SoccerBall = ({ color, className, style }: any) => (
    <svg viewBox="0 0 512 512" fill={color} className={className} style={style}>
      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM358.5 391.2l-64.8-199-139 53.6-14.7 136.2 218.5 9.2zm-289-72L106 182.8l105-121 48 116.4-189.5 141zm238.4-239L393 189l-75 147.6-136.6-46 126.5-210.4zm76 270.8L281 334l22.6-111 138-16.7-57.7 144.5zM177.3 358L106.8 244l136-104.5 56.6 124L177.3 358z"/>
    </svg>
  );

  const TrophyIcon = ({ color, className, style }: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
      <path d="M4 22h16"></path>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#1A0505]">
      {/* Portugal Colors Gradients */}
      <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-[#FF0000]/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#006600]/15 rounded-full blur-[180px]" />
      <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-[#FFD700]/10 rounded-full blur-[120px]" />
      
      {/* Huge subtle "PORTUGAL" watermark in the center */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-white font-black text-[20vw] select-none tracking-tighter">
        PORTUGAL
      </div>
      
      {/* Floating elements */}
      {Array.from({ length: 25 }).map((_, i) => {
        const colors = ['#FF0000', '#006600', '#FFD700', '#FFFFFF'];
        const color = colors[i % colors.length];
        
        let type = 'ball';
        if (i % 5 === 1) type = 'cr7';
        if (i % 5 === 2) type = 'trophy';
        if (i % 5 === 3) type = '26';
        if (i % 5 === 4) type = 'portugal';

        const style = {
          left: \`\${Math.random() * 100}%\`,
          top: \`-\${Math.random() * 20 + 10}%\`,
          animationDuration: \`\${Math.random() * 15 + 15}s\`,
          animationDelay: \`\${Math.random() * 10}s\`,
          width: \`\${Math.random() * 40 + 20}px\`,
          height: \`\${Math.random() * 40 + 20}px\`,
          transform: \`rotate(\${Math.random() * 360}deg)\`,
          opacity: Math.random() * 0.3 + 0.1,
          filter: \`drop-shadow(0 0 10px \${color})\`
        }
        
        return (
          <div 
            key={i} 
            className="absolute animate-fall-spin" 
            style={style}
          >
            {type === 'ball' && <SoccerBall color={color} className="w-full h-full" />}
            {type === 'trophy' && <TrophyIcon color={color} className="w-full h-full" />}
            {type === '26' && (
              <span className="font-bold flex items-center justify-center w-full h-full" style={{ color, fontSize: style.width }}>
                26
              </span>
            )}
            {type === 'cr7' && (
              <span className="font-black italic flex items-center justify-center w-full h-full" style={{ color, fontSize: style.width }}>
                CR7
              </span>
            )}
            {type === 'portugal' && (
              <span className="font-bold flex items-center justify-center w-full h-full" style={{ color, fontSize: parseFloat(style.width)*0.4 + 'px' }}>
                POR
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
`;

if (!themeBgContent.includes('function PortugalBackground')) {
  themeBgContent += portugalComponent;
  fs.writeFileSync(themeBgPath, themeBgContent);
}

console.log("Portugal theme added!");
