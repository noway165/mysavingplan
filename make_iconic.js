const fs = require('fs');

let bgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let bgContent = fs.readFileSync(bgPath, 'utf8');

const oldBgRegex = /function PortugalBackground\(\) \{[\s\S]+?\n\}\n/m;

const newBg = `function PortugalBackground() {
  const CrossOfChrist = ({ className, style }: any) => (
    <svg viewBox="0 0 200 200" className={className} style={style}>
      {/* Outer Red Cross Pattée */}
      <polygon fill="#E50024" points="100,80 120,20 180,20 180,80 120,100 180,120 180,180 120,180 100,120 80,180 20,180 20,120 80,100 20,80 20,20 80,20" />
      {/* Inner White Cross */}
      <polygon fill="#FFFFFF" points="100,85 110,35 170,35 170,85 110,100 170,115 170,165 110,165 100,115 90,165 30,165 30,115 90,100 30,85 30,35 90,35" />
    </svg>
  );

  const ArmillarySphere = ({ color, className, style }: any) => (
    <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" className={className} style={style}>
      <circle cx="50" cy="50" r="45" />
      <ellipse cx="50" cy="50" rx="45" ry="15" transform="rotate(25 50 50)" />
      <ellipse cx="50" cy="50" rx="45" ry="15" transform="rotate(-25 50 50)" />
      <ellipse cx="50" cy="50" rx="15" ry="45" transform="rotate(25 50 50)" />
      <line x1="10" y1="90" x2="90" y2="10" strokeWidth="4" />
      <circle cx="50" cy="50" r="20" strokeWidth="2" fill="rgba(255, 215, 0, 0.1)" />
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0a0505]">
      {/* Dramatic stadium spotlight gradients */}
      <div className="absolute top-0 left-[20%] w-[60%] h-[40%] bg-gradient-to-b from-[#E50024]/15 to-transparent blur-[100px]" />
      <div className="absolute bottom-0 right-[10%] w-[50%] h-[50%] bg-gradient-to-t from-[#004F36]/20 to-transparent blur-[120px]" />
      <div className="absolute top-[30%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[70%] h-[70%] bg-[#D8B257]/10 rounded-full blur-[150px]" />
      
      {/* Premium Carbon/Mesh overlay */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#D8B257 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* MASSIVE Iconic Background Symbols (Fixed) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <CrossOfChrist className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] animate-pulse duration-[10000ms]" />
      </div>

      {/* Floating Legendary Icons */}
      {Array.from({ length: 12 }).map((_, i) => {
        let content;
        const color = '#D8B257'; // Keep all floating elements majestic Gold

        if (i % 4 === 0) content = <CrossOfChrist className="w-full h-full opacity-40" />;
        else if (i % 4 === 1) content = <ArmillarySphere color={color} className="w-full h-full opacity-60" />;
        else if (i % 4 === 2) content = <span className="font-bold font-serif w-full h-full flex items-center justify-center opacity-80" style={{ color }}>CR7</span>;
        else content = (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full opacity-50">
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z" />
          </svg>
        );

        const style = {
          left: \`\${Math.random() * 100}%\`,
          top: \`-\${Math.random() * 20 + 10}%\`,
          animationDuration: \`\${Math.random() * 20 + 20}s\`,
          animationDelay: \`\${Math.random() * 10}s\`,
          width: \`\${Math.random() * 40 + 30}px\`,
          height: \`\${Math.random() * 40 + 30}px\`,
          transform: \`rotate(\${Math.random() * 360}deg)\`,
          filter: \`drop-shadow(0 0 15px \${color})\`
        }
        
        return (
          <div 
            key={i} 
            className="absolute animate-fall-spin" 
            style={style}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}
`;

bgContent = bgContent.replace(oldBgRegex, newBg);
fs.writeFileSync(bgPath, bgContent);
console.log('Premium Portugal background applied');
