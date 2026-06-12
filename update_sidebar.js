const fs = require('fs');

// 1. Modify Sidebar.tsx
const sidebarPath = 'E:/my-savings-plan/src/components/Sidebar.tsx';
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// The original navigation array contains the items. I will just filter them out.
// Let's replace the entire navigation array.
const newNavStr = `  const navigation = [
    { name: t('dashboard'), href: "/", icon: Home },
    { name: t('transactions'), href: "/transactions", icon: PieChart },
    { name: t('goals'), href: "/goals", icon: Target },
    { name: t('planner'), href: "/plan", icon: Map },
    { name: t('settings'), href: "/settings", icon: Settings },
  ]`;

sidebarContent = sidebarContent.replace(/const navigation = \[[\s\S]*?\]/, newNavStr);
fs.writeFileSync(sidebarPath, sidebarContent);

// 2. Modify Settings page.tsx
const settingsPath = 'E:/my-savings-plan/src/app/settings/page.tsx';
let settingsContent = fs.readFileSync(settingsPath, 'utf8');

// Add imports
if (!settingsContent.includes('import Link')) {
  settingsContent = settingsContent.replace(
    'import { Moon, Sun, Globe, DollarSign, Palette } from "lucide-react"',
    'import { Moon, Sun, Globe, DollarSign, Palette, User, Wallet, Trophy, Sparkles, ChevronRight } from "lucide-react"\nimport Link from "next/link"'
  );
} else {
  // If Link exists, just make sure we have icons
  settingsContent = settingsContent.replace(
    'import { Moon, Sun, Globe, DollarSign, Palette } from "lucide-react"',
    'import { Moon, Sun, Globe, DollarSign, Palette, User, Wallet, Trophy, Sparkles, ChevronRight } from "lucide-react"'
  );
}

// Inject the Modules section before Color Settings
const modulesSection = `
        {/* App Modules */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground text-lg">Mở rộng & Công cụ</h3>
            <p className="text-muted-foreground text-sm">Truy cập nhanh các tính năng phân tích và hồ sơ.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/profile" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><User size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">Hồ sơ cá nhân</div>
                  <div className="text-xs text-muted-foreground">Quản lý thông tin</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>
            
            <Link href="/budget" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Wallet size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">Ngân sách</div>
                  <div className="text-xs text-muted-foreground">Kiểm soát chi tiêu</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>

            <Link href="/gamification" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Trophy size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">Thành tựu</div>
                  <div className="text-xs text-muted-foreground">Cấp độ & Huy hiệu</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>

            <Link href="/insights" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Sparkles size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">AI J.A.R.V.I.S</div>
                  <div className="text-xs text-muted-foreground">Tư vấn thông minh</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Color Settings */}`;

settingsContent = settingsContent.replace('{/* Color Settings */}', modulesSection);

fs.writeFileSync(settingsPath, settingsContent);
console.log("Sidebar and Settings updated successfully.");
