const fs = require('fs');

const path = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace conditional renders
content = content.replace('{colorTheme === "orangered" && <FireBackground />}', '{colorTheme === "worldcup" && <WorldCupBackground />}');
content = content.replace('{colorTheme === "slate" && <MeteorShowerBackground />}', '');

// We need to delete the definitions of FireBackground and MeteorShowerBackground, or just append WorldCupBackground and leave them unused.
// Let's just append WorldCupBackground at the end. It's safer.

const worldCupBg = `
function WorldCupBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#064e3b]">
      {/* Stadium spotlight glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#10b981]/20 rounded-full blur-[120px]" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#facc15]/20 rounded-full blur-[120px]" />
      
      {/* Falling confetti */}
      {Array.from({ length: 50 }).map((_, i) => {
        const isGold = i % 2 === 0
        const style = {
          left: \`\${Math.random() * 100}%\`,
          top: \`-\${Math.random() * 20 + 10}%\`,
          animationDuration: \`\${Math.random() * 4 + 4}s\`,
          animationDelay: \`\${Math.random() * 5}s\`,
          width: \`\${Math.random() * 8 + 6}px\`,
          height: \`\${Math.random() * 12 + 8}px\`,
          backgroundColor: isGold ? '#facc15' : '#10b981',
          transform: \`rotate(\${Math.random() * 360}deg)\`,
          opacity: Math.random() * 0.7 + 0.3
        }
        return (
          <div 
            key={i} 
            className="absolute rounded-sm animate-fall-spin shadow-[0_0_8px_currentColor]" 
            style={style} 
          />
        )
      })}
    </div>
  )
}
`;

content = content + '\n' + worldCupBg;
fs.writeFileSync(path, content);
console.log("ThemeBackground updated successfully");
