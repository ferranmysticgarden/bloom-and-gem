import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GameProgress {
  lives: number;
  gems: number;
  leaves: number;
  currentLevel: number;
  unlockedLevels: number;
  hammers: number;
  bombs: number;
  lastLifeRefill: number;
  unlimitedLivesUntil: number | null;
}

const DEFAULT_PROGRESS: GameProgress = {
  lives: 5,
  gems: 100,
  leaves: 0,
  currentLevel: 1,
  unlockedLevels: 1,
  hammers: 3,
  bombs: 1,
  lastLifeRefill: Date.now(),
  unlimitedLivesUntil: null,
};

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load progress from database
  const loadProgress = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading progress:', error);
        return;
      }

      if (data) {
        setProgress({
          lives: data.lives,
          gems: data.gems,
          leaves: data.leaves,
          currentLevel: data.current_level,
          unlockedLevels: data.unlocked_levels,
          hammers: data.hammers,
          bombs: data.bombs,
          lastLifeRefill: data.last_life_refill,
          unlimitedLivesUntil: data.unlimited_lives_until,
        });
      } else {
        // Create initial progress
        await createProgress(uid);
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create initial progress for new users
  const createProgress = async (uid: string) => {
    const { error } = await supabase
      .from('game_progress')
      .insert({
        user_id: uid,
        lives: DEFAULT_PROGRESS.lives,
        gems: DEFAULT_PROGRESS.gems,
        leaves: DEFAULT_PROGRESS.leaves,
        current_level: DEFAULT_PROGRESS.currentLevel,
        unlocked_levels: DEFAULT_PROGRESS.unlockedLevels,
        hammers: DEFAULT_PROGRESS.hammers,
        bombs: DEFAULT_PROGRESS.bombs,
        last_life_refill: DEFAULT_PROGRESS.lastLifeRefill,
        unlimited_lives_until: DEFAULT_PROGRESS.unlimitedLivesUntil,
      });

    if (error) {
      console.error('Error creating progress:', error);
    }
  };

  // Save progress to database
  const saveProgress = useCallback(async (newProgress: Partial<GameProgress>) => {
    if (!userId) return;

    const updateData: Record<string, unknown> = {};
    
    if (newProgress.lives !== undefined) updateData.lives = newProgress.lives;
    if (newProgress.gems !== undefined) updateData.gems = newProgress.gems;
    if (newProgress.leaves !== undefined) updateData.leaves = newProgress.leaves;
    if (newProgress.currentLevel !== undefined) updateData.current_level = newProgress.currentLevel;
    if (newProgress.unlockedLevels !== undefined) updateData.unlocked_levels = newProgress.unlockedLevels;
    if (newProgress.hammers !== undefined) updateData.hammers = newProgress.hammers;
    if (newProgress.bombs !== undefined) updateData.bombs = newProgress.bombs;
    if (newProgress.lastLifeRefill !== undefined) updateData.last_life_refill = newProgress.lastLifeRefill;
    if (newProgress.unlimitedLivesUntil !== undefined) updateData.unlimited_lives_until = newProgress.unlimitedLivesUntil;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('game_progress')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      console.error('Error saving progress:', error);
    } else {
      setProgress(prev => ({ ...prev, ...newProgress }));
    }
  }, [userId]);

  // Initialize auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setTimeout(() => {
          loadProgress(session.user.id);
        }, 0);
      } else {
        setUserId(null);
        setProgress(DEFAULT_PROGRESS);
        setLoading(false);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadProgress(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProgress]);

  return {
    progress,
    loading,
    saveProgress,
  };
};
