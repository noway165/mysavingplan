const fs = require('fs');

const path = 'E:/my-savings-plan/src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add to type TranslationKeys
const newKeysType = `
  // Planner
  planner: string
  planner_desc: string
  cashflow_analysis: string
  avg_income: string
  avg_expense: string
  free_cashflow: string
  deficit_warning: string
  savings_strategy: string
  strategy_50_30_20: string
  strategy_aggressive: string
  strategy_custom: string
  needs: string
  wants: string
  savings: string
  goal_projection: string
  monthly_required: string
  on_track: string
  at_risk: string
  strategy_desc: string
  back: string`;
content = content.replace(/back: string/, newKeysType);

// 2. Add to 'vi' translation
const newVi = `
    // Planner
    planner: "Kế hoạch",
    planner_desc: "Định hướng dòng tiền và chiến lược đạt mục tiêu",
    cashflow_analysis: "Phân tích Dòng tiền",
    avg_income: "Thu nhập T.Bình",
    avg_expense: "Chi tiêu T.Bình",
    free_cashflow: "Dòng tiền Nhàn rỗi",
    deficit_warning: "CẢNH BÁO: Chi tiêu vượt quá thu nhập!",
    savings_strategy: "Chiến lược Tiết kiệm",
    strategy_50_30_20: "Quy tắc 50/30/20",
    strategy_aggressive: "Tiết kiệm 40% (Aggressive)",
    strategy_custom: "Tùy chỉnh",
    needs: "Thiết yếu",
    wants: "Giải trí",
    savings: "Tiết kiệm",
    goal_projection: "Dự phóng Mục tiêu",
    monthly_required: "Cần tiết kiệm / tháng",
    on_track: "Đúng tiến độ",
    at_risk: "Nguy cơ trễ hạn",
    strategy_desc: "Phân bổ dòng tiền nhàn rỗi theo chiến lược",
    back: "Quay lại"`;
content = content.replace(/back: "Quay lại"/, newVi);

// 3. Add to 'en' translation
const newEn = `
    // Planner
    planner: "Plan",
    planner_desc: "Cashflow projection and goal strategies",
    cashflow_analysis: "Cashflow Analysis",
    avg_income: "Avg Income",
    avg_expense: "Avg Expense",
    free_cashflow: "Free Cashflow",
    deficit_warning: "WARNING: Expenses exceed income!",
    savings_strategy: "Savings Strategy",
    strategy_50_30_20: "50/30/20 Rule",
    strategy_aggressive: "40% Aggressive",
    strategy_custom: "Custom",
    needs: "Needs",
    wants: "Wants",
    savings: "Savings",
    goal_projection: "Goal Projection",
    monthly_required: "Required / month",
    on_track: "On Track",
    at_risk: "At Risk",
    strategy_desc: "Allocate free cashflow using strategy",
    back: "Back"`;
content = content.replace(/back: "Back"/, newEn);

fs.writeFileSync(path, content);
console.log("i18n updated successfully.");
