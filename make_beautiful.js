const fs = require('fs');

let pagePath = 'E:/my-savings-plan/src/app/plan/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Update imports
const importRegex = /import \{ Map, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Activity, Wallet, Target \} from "lucide-react"/;
content = content.replace(importRegex, 'import { Map, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Activity, Wallet, Target, CalendarDays, ShoppingBag, Coffee, PiggyBank } from "lucide-react"');

// 2. Update UI
const oldUIStart = '{/* Daily Plan Breakdown */}';
const oldUIEnd = 'Mức chi tiêu tối đa mỗi ngày để không bị lạm ngân sách!\n              </div>\n            </div>';
const oldUIIndexStart = content.indexOf(oldUIStart);
const oldUIIndexEnd = content.indexOf(oldUIEnd) + oldUIEnd.length;

if (oldUIIndexStart !== -1 && oldUIIndexEnd !== -1) {
  const newUI = `{/* Daily Plan Breakdown (Premium UI) */}
            <div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/60 to-black/20 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <CalendarDays size={150} className="text-white" />
              </div>
              <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest text-foreground flex items-center gap-2 relative z-10">
                  <CalendarDays size={16} className="text-neon-secondary" /> {t('daily_plan') || 'Kế hoạch hằng ngày'}
                </h3>
                <div className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md text-white/70 font-mono">
                  Phân bổ tối ưu
                </div>
              </div>
              
              <div className="p-5 space-y-3 relative z-10">
                <div className="group flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] text-blue-200/70 uppercase tracking-widest font-semibold mb-0.5">Thiết yếu (Needs)</div>
                      <div className="text-[10px] text-blue-400/80 font-mono">Sinh hoạt & ăn uống</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">{formatCurrency(allocation.needs / 30)}</div>
                    <div className="text-[10px] text-blue-200/50 uppercase tracking-wider">Tối đa / ngày</div>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Coffee size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] text-amber-200/70 uppercase tracking-widest font-semibold mb-0.5">Cá nhân (Wants)</div>
                      <div className="text-[10px] text-amber-400/80 font-mono">Giải trí & Cà phê</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">{formatCurrency(allocation.wants / 30)}</div>
                    <div className="text-[10px] text-amber-200/50 uppercase tracking-wider">Tối đa / ngày</div>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <PiggyBank size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] text-emerald-200/70 uppercase tracking-widest font-semibold mb-0.5">Tiết kiệm (Savings)</div>
                      <div className="text-[10px] text-emerald-400/80 font-mono">Tích lũy mục tiêu</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">{formatCurrency(allocation.savings / 30)}</div>
                    <div className="text-[10px] text-emerald-200/50 uppercase tracking-wider">Mục tiêu / ngày</div>
                  </div>
                </div>
              </div>
            </div>`;
            
  content = content.substring(0, oldUIIndexStart) + newUI + content.substring(oldUIIndexEnd);
  fs.writeFileSync(pagePath, content);
  console.log('UI Updated successfully');
} else {
  console.log('Could not find old UI block');
}
