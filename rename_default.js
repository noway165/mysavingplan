const fs = require('fs');
let content = fs.readFileSync('E:/my-savings-plan/src/app/settings/page.tsx', 'utf8');

// Rename the old 'default' to 'Công Nghệ'
content = content.replace("{ id: 'default', name: 'Mặc định', color: 'bg-amber-500' },", "{ id: 'default', name: 'Công Nghệ', color: 'bg-amber-500' },");

fs.writeFileSync('E:/my-savings-plan/src/app/settings/page.tsx', content);
console.log("Renamed default theme to Công Nghệ");
