const fs = require('fs');
const files = [
  'src/app/insights/page.tsx',
  'src/app/page.tsx',
  'src/components/AIWidget.tsx',
  'src/components/DashboardCharts.tsx',
  'src/components/GamificationWidget.tsx',
  'src/components/MainLayout.tsx'
];
files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\[#00f2fe\]/g, 'neon-primary');
  content = content.replace(/\[#fe0979\]/g, 'neon-secondary');
  content = content.replace(/rgba\(0, ?242, ?254, ?([0-9.]+)\)/g, (match, p1) => `color-mix(in_srgb,var(--neon-primary)_${parseFloat(p1)*100}%,transparent)`);
  content = content.replace(/rgba\(254, ?9, ?121, ?([0-9.]+)\)/g, (match, p1) => `color-mix(in_srgb,var(--neon-secondary)_${parseFloat(p1)*100}%,transparent)`);
  content = content.replace(/\"#00f2fe\"/g, '\"var(--neon-primary)\"');
  content = content.replace(/\"#fe0979\"/g, '\"var(--neon-secondary)\"');
  fs.writeFileSync(file, content);
});
console.log('Replaced neon colors');
