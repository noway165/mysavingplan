import { useState, useEffect } from 'react';

export type Rank = 'Bronze' | 'Silver' | 'Gold';

export interface GamificationState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  badges: string[];
}

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  badges: [],
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
    addBadge,
  };
}
