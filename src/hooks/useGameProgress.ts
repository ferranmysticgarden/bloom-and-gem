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
  shuffles: number;
  rainbows: number;
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
  shuffles: 3,
  rainbows: 1,
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
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading progress:', error);
        // Use default progress on error
        setProgress(DEFAULT_PROGRESS);
        return;
      }

      if (data) {
        setProgress({
          lives: data.lives ?? DEFAULT_PROGRESS.lives,
          gems: data.gems ?? DEFAULT_PROGRESS.gems,
          leaves: data.leaves ?? DEFAULT_PROGRESS.leaves,
          currentLevel: data.current_level ?? DEFAULT_PROGRESS.currentLevel,
          unlockedLevels: data.unlocked_levels ?? DEFAULT_PROGRESS.unlockedLevels,
          hammers: data.hammers ?? DEFAULT_PROGRESS.hammers,
          bombs: data.bombs ?? DEFAULT_PROGRESS.bombs,
          shuffles: (data as any).shuffles ?? DEFAULT_PROGRESS.shuffles,
          rainbows: (data as any).rainbows ?? DEFAULT_PROGRESS.rainbows,
          lastLifeRefill: data.last_life_refill ?? DEFAULT_PROGRESS.lastLifeRefill,
          unlimitedLivesUntil: data.unlimited_lives_until ?? DEFAULT_PROGRESS.unlimitedLivesUntil,
        });
      } else {
        // Create initial progress
        await createProgress(uid);
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
      // Use default progress on error
      setProgress(DEFAULT_PROGRESS);
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
        shuffles: DEFAULT_PROGRESS.shuffles,
        rainbows: DEFAULT_PROGRESS.rainbows,
        last_life_refill: DEFAULT_PROGRESS.lastLifeRefill,
        unlimited_lives_until: DEFAULT_PROGRESS.unlimitedLivesUntil,
      } as any);

    if (error) {
      console.error('Error creating progress:', error);
    }
  };

  // Save progress to database
  const saveProgress = useCallback(async (newProgress: Partial<GameProgress>) => {
    if (!userId) {
      console.error('saveProgress called but userId is null');
      return;
    }

    console.log('Saving progress for user:', userId, newProgress);

    const updateData: Record<string, unknown> = {};
    
    if (newProgress.lives !== undefined) updateData.lives = newProgress.lives;
    if (newProgress.gems !== undefined) updateData.gems = newProgress.gems;
    if (newProgress.leaves !== undefined) updateData.leaves = newProgress.leaves;
    if (newProgress.currentLevel !== undefined) updateData.current_level = newProgress.currentLevel;
    if (newProgress.unlockedLevels !== undefined) updateData.unlocked_levels = newProgress.unlockedLevels;
    if (newProgress.hammers !== undefined) updateData.hammers = newProgress.hammers;
    if (newProgress.bombs !== undefined) updateData.bombs = newProgress.bombs;
    if (newProgress.shuffles !== undefined) updateData.shuffles = newProgress.shuffles;
    if (newProgress.rainbows !== undefined) updateData.rainbows = newProgress.rainbows;
    if (newProgress.lastLifeRefill !== undefined) updateData.last_life_refill = newProgress.lastLifeRefill;
    if (newProgress.unlimitedLivesUntil !== undefined) updateData.unlimited_lives_until = newProgress.unlimitedLivesUntil;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('game_progress')
      .update(updateData)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error saving progress:', error);
    } else {
      console.log('Progress saved successfully:', data);
      setProgress(prev => ({ ...prev, ...newProgress }));
    }
  }, [userId]);

  // Initialize auth listener
  useEffect(() => {
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUserId(session.user.id);
        setTimeout(() => {
          if (mounted) {
            loadProgress(session.user.id);
          }
        }, 0);
      } else {
        setUserId(null);
        setProgress(DEFAULT_PROGRESS);
        setLoading(false);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUserId(session.user.id);
        loadProgress(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Error getting session:', err);
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProgress]);

  return {
    progress,
    loading,
    saveProgress,
  };
};
