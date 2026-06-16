const fs = require('fs');

const bgPath = 'E:/my-savings-plan/src/components/ThemeBackground.tsx';
let bg = fs.readFileSync(bgPath, 'utf8');

// Remove rendering
bg = bg.replace(/\s*\{colorTheme === "worldcup" && <WorldCupBackground \/>\}/g, '');
bg = bg.replace(/\s*\{colorTheme === "portugal" && <PortugalBackground \/>\}/g, '');

// Remove function definitions
bg = bg.replace(/function WorldCupBackground\(\) \{[\s\S]*?(?=function PortugalBackground)/, '');
bg = bg.replace(/function PortugalBackground\(\) \{[\s\S]*?(?=function ClassicBackground)/, '');

fs.writeFileSync(bgPath, bg);
console.log("Cleaned up ThemeBackground.tsx");
