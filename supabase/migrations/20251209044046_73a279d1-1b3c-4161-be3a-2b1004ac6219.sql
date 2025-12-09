-- Add missing booster columns to game_progress
ALTER TABLE public.game_progress 
ADD COLUMN IF NOT EXISTS shuffles integer DEFAULT 3,
ADD COLUMN IF NOT EXISTS rainbows integer DEFAULT 1;