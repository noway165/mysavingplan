const fs = require('fs');

let cssPath = 'E:/my-savings-plan/src/app/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const oldCssRegex = /\.theme-portugal\s*\{[^}]+\}/;
const newCss = `.theme-portugal {
  --background: 351 30% 4%;
  --foreground: 0 0% 98%;
  --card: 351 20% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 351 20% 6%;
  --popover-foreground: 0 0% 98%;
  --primary: 351 100% 45%; /* #E50024 */
  --primary-foreground: 0 0% 100%;
  --secondary: 44 65% 59%; /* #D8B257 */
  --secondary-foreground: 0 0% 100%;
  --muted: 351 20% 15%;
  --muted-foreground: 0 10% 65%;
  --accent: 161 100% 15%; /* #004F36 */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 44 65% 59%;
  --input: 351 20% 15%;
  --ring: 351 100% 45%;
  --neon-primary: #E50024;
  --neon-secondary: #D8B257;
}`;

cssContent = cssContent.replace(oldCssRegex, newCss);
fs.writeFileSync(cssPath, cssContent);

let bgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let bgContent = fs.readFileSync(bgPath, 'utf8');

const oldBgRegex = /function PortugalBackground\(\) \{[\s\S]+?\n\}\n/m;
const newBg = `function PortugalBackground() {
  const ShieldIcon = ({ color, className, style }: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0A0304]">
      {/* Rich, subtle gradients */}
      <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-[#8A1538]/30 to-transparent" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#004F36]/15 rounded-full blur-[150px]" />
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[#D8B257]/15 rounded-full blur-[150px]" />
      
      {/* Geometric lines reflecting modern sports design */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(45deg, #D8B257 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      
      {/* Huge subtle watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] text-[#D8B257] font-serif italic font-black text-[20vw] select-none tracking-widest">
        SELEÇÃO
      </div>

      {/* Floating elegant elements */}
      {Array.from({ length: 15 }).map((_, i) => {
        const colors = ['#E50024', '#004F36', '#D8B257', '#FFFFFF'];
        const color = colors[i % colors.length];
        
        const style = {
          left: \`\${Math.random() * 100}%\`,
          top: \`-\${Math.random() * 20 + 10}%\`,
          animationDuration: \`\${Math.random() * 25 + 20}s\`,
          animationDelay: \`\${Math.random() * 10}s\`,
          width: \`\${Math.random() * 25 + 15}px\`,
          height: \`\${Math.random() * 25 + 15}px\`,
          transform: \`rotate(\${Math.random() * 360}deg)\`,
          opacity: Math.random() * 0.15 + 0.05,
          filter: \`drop-shadow(0 0 10px \${color})\`
        }
        
        return (
          <div 
            key={i} 
            className="absolute animate-fall-spin" 
            style={style}
          >
            {i % 3 === 0 ? (
              <ShieldIcon color={color} className="w-full h-full" />
            ) : i % 3 === 1 ? (
              <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            ) : (
              <span className="font-bold font-serif flex items-center justify-center w-full h-full" style={{ color, fontSize: style.width }}>
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

console.log('Fixed Portugal Theme');
