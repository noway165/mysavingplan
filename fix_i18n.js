const fs = require('fs');
const path = 'E:/my-savings-plan/src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('goal_projection: string', 'goal_projection: string\n  daily_plan: string');
content = content.replace('goal_projection: "Dự phóng Mục tiêu",', 'goal_projection: "Dự phóng Mục tiêu",\n    daily_plan: "Kế hoạch Hàng ngày",');
content = content.replace('goal_projection: "Goal Projection",', 'goal_projection: "Goal Projection",\n    daily_plan: "Daily Plan",');

fs.writeFileSync(path, content);
console.log("Fixed i18n");
