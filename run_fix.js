const fs = require('fs');
const file = 'E:/my-savings-plan/src/app/plan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add useEffect import
content = content.replace(
  'import { useState, useMemo } from "react"',
  'import { useState, useMemo, useEffect } from "react"'
);

// 2. Add useEffect and handle functions
const hookToInsert = `
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStrategy = localStorage.getItem('savings_strategy');
      if (savedStrategy === '50_30_20' || savedStrategy === 'aggressive' || savedStrategy === 'custom') {
        setStrategy(savedStrategy);
      }
      const savedRate = localStorage.getItem('savings_custom_rate');
      if (savedRate && !isNaN(Number(savedRate))) {
        setCustomRate(Number(savedRate));
      }
    }
  }, []);

  const handleStrategyChange = (newStrategy: '50_30_20' | 'aggressive' | 'custom') => {
    setStrategy(newStrategy);
    if (typeof window !== "undefined") {
      localStorage.setItem('savings_strategy', newStrategy);
    }
  };

  const handleCustomRateChange = (val: number) => {
    setCustomRate(val);
    if (typeof window !== "undefined") {
      localStorage.setItem('savings_custom_rate', val.toString());
    }
  };
`;

content = content.replace(
  'const [customRate, setCustomRate] = useState(30)',
  'const [customRate, setCustomRate] = useState(30)\n' + hookToInsert
);

// 3. Replace setStrategy calls
content = content.replace(/onClick=\{\(\) => setStrategy\('50_30_20'\)\}/g, "onClick={() => handleStrategyChange('50_30_20')}");
content = content.replace(/onClick=\{\(\) => setStrategy\('aggressive'\)\}/g, "onClick={() => handleStrategyChange('aggressive')}");
content = content.replace(/onClick=\{\(\) => setStrategy\('custom'\)\}/g, "onClick={() => handleStrategyChange('custom')}");

// 4. Replace setCustomRate calls
content = content.replace(/onChange=\{\(e\) => setCustomRate\(Number\(e\.target\.value\)\)\}/g, "onChange={(e) => handleCustomRateChange(Number(e.target.value))}");

fs.writeFileSync(file, content);
console.log("Patched page.tsx");
