const fs = require('fs');
let content = fs.readFileSync('E:/my-savings-plan/src/app/settings/page.tsx', 'utf8');

const targetStr = "{ id: 'default', name: 'Mặc định', color: 'bg-amber-500' },";
if (content.includes(targetStr)) {
    content = content.replace(targetStr, "{ id: 'classic', name: 'Nguyên Bản', color: 'bg-zinc-800' },\n              " + targetStr);
    fs.writeFileSync('E:/my-savings-plan/src/app/settings/page.tsx', content);
    console.log("Successfully inserted Classic theme");
} else {
    console.log("Could not find the target string.");
}
