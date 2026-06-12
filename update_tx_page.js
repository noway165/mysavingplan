const fs = require('fs');

const path = 'E:/my-savings-plan/src/app/transactions/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add toYMD helper
const toYMDHelper = `  const toYMD = (dateStr: string) => {
    if (dateStr && dateStr.includes('/')) {
      const parts = dateStr.split('/')
      if (parts.length === 3) return \`\${parts[2]}-\${parts[1].padStart(2, '0')}-\${parts[0].padStart(2, '0')}\`
    }
    return dateStr
  }

  const openAddModal = () => {`;

content = content.replace('  const openAddModal = () => {', toYMDHelper);

// 2. Fix openEditModal
const editModalOld = `setFormDate(tx.date || realTime.toLocaleDateString("vi-VN"))`;
const editModalNew = `setFormDate(toYMD(tx.date) || realTime.toISOString().split('T')[0])`;
content = content.replace(editModalOld, editModalNew);

// 3. Fix onSubmit date saving
const onSubmitOld = `date: editingId ? formDate : realTime.toLocaleDateString("vi-VN"),`;
const onSubmitNew = `date: formDate,`;
content = content.replace(onSubmitOld, onSubmitNew);

// 4. Fix filter logic
const filterOld = `const txDate = new Date(\`\${parts[2]}-\${parts[1]}-\${parts[0]}\`)`;
const filterNew = `const txDate = new Date(\`\${parts[2]}-\${parts[1].padStart(2, '0')}-\${parts[0].padStart(2, '0')}T00:00:00\`)`;
content = content.replace(filterOld, filterNew);

fs.writeFileSync(path, content);
console.log("Fixed transactions page.");
