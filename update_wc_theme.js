const fs = require('fs');

const path = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldWorldCup = `function WorldCupBackground() {
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

const newWorldCup = `function WorldCupBackground() {
  const SoccerBall = ({ color, className, style }: any) => (
    <svg viewBox="0 0 512 512" fill={color} className={className} style={style}>
      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM358.5 391.2l-64.8-199-139 53.6-14.7 136.2 218.5 9.2zm-289-72L106 182.8l105-121 48 116.4-189.5 141zm238.4-239L393 189l-75 147.6-136.6-46 126.5-210.4zm76 270.8L281 334l22.6-111 138-16.7-57.7 144.5zM177.3 358L106.8 244l136-104.5 56.6 124L177.3 358z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#1E002B]">
      {/* WC 2026 Core Brand Gradients */}
      <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-[#E40046]/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#00E5FF]/20 rounded-full blur-[180px]" />
      <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-[#4A00B4]/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-[#00FF87]/15 rounded-full blur-[150px]" />
      
      {/* Huge subtle "26" watermark in the center */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-white font-black text-[40vw] select-none tracking-tighter">
        26
      </div>
      
      {/* Floating WC elements */}
      {Array.from({ length: 15 }).map((_, i) => {
        const colors = ['#E40046', '#00E5FF', '#00FF87', '#FFFFFF', '#4A00B4'];
        const color = colors[i % colors.length];
        const isBall = i % 2 === 0;
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
            {isBall ? (
              <SoccerBall color={color} className="w-full h-full" />
            ) : (
              <span className="font-bold flex items-center justify-center w-full h-full" style={{ color, fontSize: style.width }}>
                26
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}`;

content = content.replace(oldWorldCup, newWorldCup);
fs.writeFileSync(path, content);
console.log("Updated ThemeBackground for WC 2026.");
