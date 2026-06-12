export type Locale = 'vi' | 'en'

export type TranslationKeys = {
  // Sidebar
  dashboard: string
  transactions: string
  goals: string
  budget: string
  gamification: string
  ai_insights: string
  profile: string
  settings: string
  logout: string

  // Dashboard
  overview: string
  balance: string
  income: string
  expense: string
  recent_transactions: string
  category_chart: string
  vs_last_month: string
  savings_goals: string
  no_goals: string
  no_data: string
  create_goal: string
  add_record: string
  transactions_count: string

  // Transactions
  tx_title: string
  tx_desc: string
  add_new: string
  edit: string
  delete: string
  search: string
  filter_all: string
  filter_income: string
  filter_expense: string
  amount: string
  category: string
  date: string
  time: string
  save: string
  saving: string
  no_transactions: string
  this_week: string
  this_month: string
  custom: string
  select_date: string
  
  // Goals
  goals_title: string
  goals_desc: string
  deposit: string
  withdraw: string
  deposit_money: string
  withdraw_money: string
  history: string
  target: string
  saved: string
  remaining: string
  deadline: string
  days_left: string
  overdue: string
  completed: string
  goal_name: string
  target_amount: string
  color: string
  create: string
  confirm_deposit: string
  confirm_withdraw: string
  view_history: string
  deposited: string
  withdrawn: string

  // Budget
  budget_title: string
  budget_desc: string
  set_budget: string
  monthly_budget: string
  spent: string
  over_budget: string
  no_budget: string
  add_budget: string
  edit_budget: string
  limit: string
  usage_percent: string

  // Gamification
  game_title: string
  game_desc: string
  your_activity: string
  transactions_label: string
  goals_created: string
  goals_completed: string
  badges: string
  total_xp: string
  level: string
  badge_collection: string

  // Profile & Settings
  profile_title: string
  display_name: string
  update: string
  updated_success: string
  settings_title: string
  dark_mode: string
  dark_mode_desc: string
  language: string
  language_desc: string
  currency: string
  currency_desc: string
  save_settings: string

  // Common
  loading: string
  error: string
  cancel: string
  confirm: string
  close: string
  
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
  back: string
}

export const translations: Record<Locale, TranslationKeys> = {
  vi: {
    dashboard: "Tổng quan",
    transactions: "Thu / Chi",
    goals: "Mục tiêu",
    budget: "Ngân sách",
    gamification: "Thành tựu",
    ai_insights: "AI Tư vấn",
    profile: "Hồ sơ",
    settings: "Cài đặt",
    logout: "Đăng xuất",

    overview: "Tổng quan",
    balance: "Số dư hiện tại",
    income: "Tổng thu nhập",
    expense: "Tổng chi tiêu",
    recent_transactions: "Giao dịch gần đây",
    category_chart: "Biểu đồ danh mục",
    vs_last_month: "so với tháng trước",
    savings_goals: "Mục tiêu tiết kiệm",
    no_goals: "Chưa có mục tiêu nào",
    no_data: "Chưa có dữ liệu",
    create_goal: "Tạo mục tiêu mới",
    add_record: "Ghi chép",
    transactions_count: "giao dịch",

    tx_title: "Quản lý Thu / Chi",
    tx_desc: "Ghi chép và theo dõi dòng tiền của bạn chi tiết.",
    add_new: "Thêm mới",
    edit: "Sửa",
    delete: "Xóa",
    search: "Tìm kiếm...",
    filter_all: "Tất cả",
    filter_income: "Thu nhập",
    filter_expense: "Chi tiêu",
    amount: "Số tiền",
    category: "Danh mục",
    date: "Ngày",
    time: "Giờ",
    save: "Lưu",
    saving: "Đang lưu...",
    no_transactions: "Chưa có giao dịch nào",
    this_week: "Tuần này",
    this_month: "Tháng này",
    custom: "Tùy chọn",
    select_date: "Chọn ngày",

    goals_title: "Mục tiêu tiết kiệm",
    goals_desc: "Đặt mục tiêu và theo dõi tiến trình tiết kiệm.",
    deposit: "Nạp tiền",
    withdraw: "Rút tiền",
    deposit_money: "Nạp tiền tiết kiệm",
    withdraw_money: "Rút tiền từ mục tiêu",
    history: "Lịch sử",
    target: "Mục tiêu",
    saved: "Đã lưu",
    remaining: "Còn lại",
    deadline: "Hạn chót",
    days_left: "ngày nữa",
    overdue: "Quá hạn",
    completed: "Hoàn thành!",
    goal_name: "Tên mục tiêu",
    target_amount: "Số tiền cần đạt",
    color: "Màu sắc",
    create: "Tạo mục tiêu",
    confirm_deposit: "Xác nhận nạp",
    confirm_withdraw: "Xác nhận rút",
    view_history: "Xem lịch sử",
    deposited: "Đã nạp",
    withdrawn: "Đã rút",

    budget_title: "Ngân sách hàng tháng",
    budget_desc: "Kiểm soát chi tiêu theo từng danh mục.",
    set_budget: "Đặt ngân sách",
    monthly_budget: "Ngân sách tháng",
    spent: "Đã chi",
    over_budget: "Vượt ngân sách!",
    no_budget: "Chưa có ngân sách nào",
    add_budget: "Thêm ngân sách",
    edit_budget: "Sửa ngân sách",
    limit: "Giới hạn",
    usage_percent: "Đã dùng",

    game_title: "Thành tựu của bạn",
    game_desc: "Hoàn thành thử thách để nhận huy hiệu.",
    your_activity: "Hoạt động",
    transactions_label: "giao dịch",
    goals_created: "mục tiêu đã tạo",
    goals_completed: "đã hoàn thành",
    badges: "Huy hiệu",
    total_xp: "Tổng XP",
    level: "Cấp độ",
    badge_collection: "Bộ sưu tập",

    profile_title: "Hồ sơ cá nhân",
    display_name: "Tên hiển thị",
    update: "Cập nhật",
    updated_success: "Cập nhật thành công!",
    settings_title: "Cài đặt hệ thống",
    dark_mode: "Giao diện tối",
    dark_mode_desc: "Bật chế độ nền tối giúp dịu mắt",
    language: "Ngôn ngữ",
    language_desc: "Chuyển đổi ngôn ngữ hiển thị",
    currency: "Tiền tệ",
    currency_desc: "Đơn vị tiền tệ chính",
    save_settings: "Lưu cài đặt",

    loading: "Đang tải...",
    error: "Có lỗi xảy ra",
    cancel: "Hủy",
    confirm: "Xác nhận",
    close: "Đóng",
    
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
    back: "Quay lại"
  },
  en: {
    dashboard: "Dashboard",
    transactions: "Transactions",
    goals: "Goals",
    budget: "Budget",
    gamification: "Gamification",
    ai_insights: "AI Insights",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",

    overview: "Overview",
    balance: "Current Balance",
    income: "Total Income",
    expense: "Total Expense",
    recent_transactions: "Recent Transactions",
    category_chart: "Expenses by Category",
    vs_last_month: "vs last month",
    savings_goals: "Savings Goals",
    no_goals: "No goals yet",
    no_data: "No data",
    create_goal: "Create New Goal",
    add_record: "Add Record",
    transactions_count: "transactions",

    tx_title: "Manage Transactions",
    tx_desc: "Track and manage your cash flow in detail.",
    add_new: "Add New",
    edit: "Edit",
    delete: "Delete",
    search: "Search...",
    filter_all: "All",
    filter_income: "Income",
    filter_expense: "Expense",
    amount: "Amount",
    category: "Category",
    date: "Date",
    time: "Time",
    save: "Save",
    saving: "Saving...",
    no_transactions: "No transactions yet",
    this_week: "This Week",
    this_month: "This Month",
    custom: "Custom",
    select_date: "Select Date",

    goals_title: "Savings Goals",
    goals_desc: "Set targets and track your saving progress.",
    deposit: "Deposit",
    withdraw: "Withdraw",
    deposit_money: "Deposit Money",
    withdraw_money: "Withdraw Money",
    history: "History",
    target: "Target",
    saved: "Saved",
    remaining: "Remaining",
    deadline: "Deadline",
    days_left: "days left",
    overdue: "Overdue",
    completed: "Completed!",
    goal_name: "Goal Name",
    target_amount: "Target Amount",
    color: "Color",
    create: "Create Goal",
    confirm_deposit: "Confirm Deposit",
    confirm_withdraw: "Confirm Withdraw",
    view_history: "View History",
    deposited: "Deposited",
    withdrawn: "Withdrawn",

    budget_title: "Monthly Budget",
    budget_desc: "Control your spending by category.",
    set_budget: "Set Budget",
    monthly_budget: "Monthly Budget",
    spent: "Spent",
    over_budget: "Over budget!",
    no_budget: "No budgets yet",
    add_budget: "Add Budget",
    edit_budget: "Edit Budget",
    limit: "Limit",
    usage_percent: "Used",

    game_title: "Your Achievements",
    game_desc: "Complete challenges to earn badges.",
    your_activity: "Your Activity",
    transactions_label: "transactions",
    goals_created: "goals created",
    goals_completed: "completed",
    badges: "Badges",
    total_xp: "Total XP",
    level: "Level",
    badge_collection: "Badge Collection",

    profile_title: "User Profile",
    display_name: "Display Name",
    update: "Update",
    updated_success: "Successfully updated!",
    settings_title: "System Settings",
    dark_mode: "Dark Mode",
    dark_mode_desc: "Enable dark theme for eye comfort",
    language: "Language",
    language_desc: "Switch display language",
    currency: "Currency",
    currency_desc: "Primary currency unit",
    save_settings: "Save Settings",

    loading: "Loading...",
    error: "An error occurred",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    
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
    back: "Back"
  }
}

export function t(key: keyof TranslationKeys, locale: Locale = 'vi'): string {
  return translations[locale][key] || key
}
