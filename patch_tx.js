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

// Insert after filteredTransactions closing array
content = content.replace(
  ']}, [transactions, activeTab, searchQuery, filterPeriod, customStartDate, customEndDate])',
  ']}, [transactions, activeTab, searchQuery, filterPeriod, customStartDate, customEndDate])\n' + calcBlock
);

const uiBlock = `
          {/* Summary for Filtered Period */}
          <div className="bg-muted/30 border border-border rounded-xl p-4 mb-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                {filterPeriod === 'all' ? 'TỔNG THU' : 'THU TRONG KỲ'}
              </div>
              <div className="text-emerald-500 font-bold text-lg">
                +{formatCurrency(filteredIncome)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                {filterPeriod === 'all' ? 'TỔNG CHI' : 'CHI TRONG KỲ'}
              </div>
              <div className="text-destructive font-bold text-lg">
                -{formatCurrency(filteredExpense)}
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-border">
`;

content = content.replace(
  '<div className="divide-y divide-border">',
  uiBlock
);

fs.writeFileSync(file, content);
console.log("Patched transactions page.tsx");
