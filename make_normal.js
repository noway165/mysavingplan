const fs = require('fs');

let cssPath = 'E:/my-savings-plan/src/app/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const oldCssRegex = /\.theme-portugal\s*\{[^}]+\}/;
const newCss = `.theme-portugal {
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;
  --card: 0 0% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 6%;
  --popover-foreground: 0 0% 98%;
  --primary: 351 100% 45%; /* #E50024 */
  --primary-foreground: 0 0% 100%;
  --secondary: 120 100% 20%; /* #006600 */
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 65%;
  --accent: 44 100% 50%; /* #FFD700 */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 15%;
  --input: 0 0% 15%;
  --ring: 351 100% 45%;
  --neon-primary: #E50024;
  --neon-secondary: #006600;
}`;

cssContent = cssContent.replace(oldCssRegex, newCss);
fs.writeFileSync(cssPath, cssContent);

let bgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let bgContent = fs.readFileSync(bgPath, 'utf8');

const oldBgRegex = /function PortugalBackground\(\) \{[\s\S]+?\n\}\n/m;
const newBg = `function PortugalBackground() {
  const SoccerBall = ({ color, className, style }: any) => (
    <svg viewBox="0 0 512 512" fill={color} className={className} style={style}>
      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM358.5 391.2l-64.8-199-139 53.6-14.7 136.2 218.5 9.2zm-289-72L106 182.8l105-121 48 116.4-189.5 141zm238.4-239L393 189l-75 147.6-136.6-46 126.5-210.4zm76 270.8L281 334l22.6-111 138-16.7-57.7 144.5zM177.3 358L106.8 244l136-104.5 56.6 124L177.3 358z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#050505]">
      {/* Classic Portugal Flag Layout: Green on Left (2/5), Red on Right (3/5) */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-full bg-[#006600]/10 blur-[150px]" />
      <div className="absolute top-0 right-[-10%] w-[60%] h-full bg-[#E50024]/10 blur-[150px]" />
      
      {/* Central subtle gold glow */}
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[40%] h-[40%] bg-[#FFD700]/5 rounded-full blur-[100px]" />

      {/* Floating elegant soccer balls and standard elements */}
      {Array.from({ length: 15 }).map((_, i) => {
        const colors = ['#E50024', '#006600', '#FFD700', '#FFFFFF'];
        const color = colors[i % colors.length];
        
        const style = {
          left: \`\${Math.random() * 100}%\`,
          top: \`-\${Math.random() * 20 + 10}%\`,
          animationDuration: \`\${Math.random() * 20 + 15}s\`,
          animationDelay: \`\${Math.random() * 10}s\`,
          width: \`\${Math.random() * 25 + 15}px\`,
          height: \`\${Math.random() * 25 + 15}px\`,
          transform: \`rotate(\${Math.random() * 360}deg)\`,
          opacity: Math.random() * 0.3 + 0.1,
          filter: \`drop-shadow(0 0 5px \${color})\`
        }
        
        return (
          <div 
            key={i} 
            className="absolute animate-fall-spin" 
            style={style}
          >
            {i % 2 === 0 ? (
              <SoccerBall color={color} className="w-full h-full" />
            ) : (
              <span className="font-bold flex items-center justify-center w-full h-full" style={{ color, fontSize: style.width }}>
                7
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
`;

bgContent = bgContent.replace(oldBgRegex, newBg);
fs.writeFileSync(bgPath, bgContent);
console.log('Applied normal Portugal theme');
