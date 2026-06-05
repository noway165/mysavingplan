import { useState, useEffect } from 'react';

export type Rank = 'Bronze' | 'Silver' | 'Gold';

export interface GamificationState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  badges: string[];
  historicalSynced: boolean;
}

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  badges: [],
  historicalSynced: false,
};

export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mysavings_gamification');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing gamification state", e);
      }
    }
    setLoading(false);
  }, []);

  const saveState = (newState: GamificationState) => {
    setState(newState);
    localStorage.setItem('mysavings_gamification', JSON.stringify(newState));
  };

  const addXP = (amount: number, reason?: string) => {
    saveState({ ...state, xp: Math.max(0, state.xp + amount) });
    // In a real app, we might want to show a toast notification for XP gained
  };

  const checkDailyStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastActiveDate !== today) {
      // Check if it's the next consecutive day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = 1;
      if (state.lastActiveDate === yesterdayStr) {
        newStreak = state.streak + 1;
      }

      saveState({
        ...state,
        streak: newStreak,
        lastActiveDate: today,
        xp: state.xp + 10, // Daily login reward
      });
    }
  };

  const syncHistoricalData = (transactions: any[]) => {
    if (state.historicalSynced || transactions.length === 0) return;

    // Lấy tất cả các ngày có giao dịch, định dạng DD/MM/YYYY sang YYYY-MM-DD
    const uniqueDates = new Set<string>();
    transactions.forEach(tx => {
      if (!tx.date) return;
      try {
        const parts = tx.date.split('/');
        if (parts.length === 3) {
          uniqueDates.add(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
        }
      } catch (e) {}
    });

    const sortedDates = Array.from(uniqueDates).sort().reverse(); // Mới nhất lên đầu
    if (sortedDates.length === 0) return;

    let calculatedStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(today);
    let checkIndex = 0;

    // Check if streak started today or yesterday
    const firstLogDate = new Date(sortedDates[0]);
    firstLogDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - firstLogDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      // The most recent log is today or yesterday, streak is active
      calculatedStreak = 1;
      currentDate = firstLogDate;
      checkIndex = 1;

      while (checkIndex < sortedDates.length) {
        const nextDate = new Date(sortedDates[checkIndex]);
        nextDate.setHours(0, 0, 0, 0);
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);

        if (nextDate.getTime() === expectedDate.getTime()) {
          calculatedStreak++;
          currentDate = nextDate;
          checkIndex++;
        } else {
          break;
        }
      }
    }

    // Tặng 10 XP cho mỗi ngày có giao dịch trong quá khứ
    const bonusXP = sortedDates.length * 10;

    saveState({
      ...state,
      xp: state.xp + bonusXP,
      streak: calculatedStreak,
      lastActiveDate: sortedDates[0],
      historicalSynced: true
    });
  };

  const addBadge = (badgeId: string) => {
    if (!state.badges.includes(badgeId)) {
      saveState({ ...state, badges: [...state.badges, badgeId] });
    }
  };

  const level = Math.floor(state.xp / 1000) + 1;
  const xpForNextLevel = level * 1000;
  const currentLevelXP = state.xp % 1000;
  
  let rank: Rank = 'Bronze';
  if (state.xp >= 3000) rank = 'Gold';
  else if (state.xp >= 1000) rank = 'Silver';

  return {
    ...state,
    level,
    rank,
    xpForNextLevel,
    currentLevelXP,
    loading,
    addXP,
    checkDailyStreak,
    syncHistoricalData,
    addBadge,
  };
}
