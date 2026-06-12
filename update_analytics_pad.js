const fs = require('fs');
const path = 'E:/my-savings-plan/src/app/analytics/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldStr = `txDate = new Date(\`\${parts[2]}-\${parts[1]}-\${parts[0]}T00:00:00\`)`;
const newStr = `txDate = new Date(\`\${parts[2]}-\${parts[1].padStart(2, '0')}-\${parts[0].padStart(2, '0')}T00:00:00\`)`;
content = content.replace(oldStr, newStr);

fs.writeFileSync(path, content);
console.log("Fixed analytics page padStart.");
