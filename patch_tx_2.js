const fs = require('fs');
const file = 'E:/my-savings-plan/src/app/transactions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const calcBlock = `
  const { filteredIncome, filteredExpense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else if (t.type === 'expense') exp += t.amount;
    });
    return { filteredIncome: inc, filteredExpense: exp };
  }, [filteredTransactions]);
`;

content = content.replace(
  '  }, [transactions, activeTab, searchQuery, filterPeriod, customStartDate, customEndDate])',
  '  }, [transactions, activeTab, searchQuery, filterPeriod, customStartDate, customEndDate])\n' + calcBlock
);

fs.writeFileSync(file, content);
console.log("Patched transactions page.tsx again");
