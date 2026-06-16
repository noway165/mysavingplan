const fs = require('fs');

let pagePath = 'E:/my-savings-plan/src/app/plan/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

const injectionPoint = `                <div className="h-full bg-amber-500" style={{ width: \`\${strategy === '50_30_20' ? 30 : strategy==='aggressive'?20: (100-customRate)/2}%\` }} title="Wants" />
              </div>
            </div>`;

const dailyPlanSection = `                <div className="h-full bg-amber-500" style={{ width: \`\${strategy === '50_30_20' ? 30 : strategy==='aggressive'?20: (100-customRate)/2}%\` }} title="Wants" />
              </div>
            </div>

            {/* Daily Plan Breakdown */}
            <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={64} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-foreground/80 mb-4 flex items-center gap-2 relative z-10">
                <CheckCircle2 size={16} className="text-neon-secondary" /> {t('daily_plan') || 'Kế hoạch hằng ngày'}
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="text-sm text-foreground/70">Thiết yếu (Needs)</div>
                  <div className="font-mono font-bold text-blue-400">{formatCurrency(allocation.needs / 30)}<span className="text-xs text-foreground/40 font-sans">/ngày</span></div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="text-sm text-foreground/70">Cá nhân (Wants)</div>
                  <div className="font-mono font-bold text-amber-400">{formatCurrency(allocation.wants / 30)}<span className="text-xs text-foreground/40 font-sans">/ngày</span></div>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <div className="text-sm text-foreground/70">Tiết kiệm (Savings)</div>
                  <div className="font-mono font-bold text-emerald-400">{formatCurrency(allocation.savings / 30)}<span className="text-xs text-foreground/40 font-sans">/ngày</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-foreground/50 italic text-center">
                Mức chi tiêu tối đa mỗi ngày để không bị lạm lạm ngân sách!
              </div>
            </div>`;

content = content.replace(injectionPoint, dailyPlanSection);

fs.writeFileSync(pagePath, content);
console.log('Added daily plan section');
