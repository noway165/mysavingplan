const fs = require('fs');
const path = require('path');

const sidebarPath = 'E:/my-savings-plan/src/components/Sidebar.tsx';
let content = fs.readFileSync(sidebarPath, 'utf8');

content = content.replace(/.*\{ name: t\('analytics'\), href: "\/analytics", icon: Activity \},\r?\n?/g, '');
fs.writeFileSync(sidebarPath, content);

const analyticsDir = 'E:/my-savings-plan/src/app/analytics';
if (fs.existsSync(analyticsDir)) {
  fs.rmSync(analyticsDir, { recursive: true, force: true });
}

console.log("Analytics removed.");
