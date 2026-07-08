import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string; user_id: string; username: string | null; display_name: string | null;
          avatar_url: string | null; avatar_frame: string; title: string; xp: number;
          coins: number; diamonds: number; level: number; rank: string; total_questions: number;
          correct_answers: number; current_streak: number; longest_streak: number;
          last_activity: string | null; total_time_seconds: number; strongest_topic: string | null;
          weakest_topic: string | null; theme: string; notifications_enabled: boolean;
          unique_id: string | null; multiplayer_wins: number; multiplayer_losses: number; multiplayer_xp: number;
          created_at: string; updated_at: string;
        };
        Insert: { id?: string; user_id?: string; username?: string | null; display_name?: string | null; };
        Update: { xp?: number; coins?: number; diamonds?: number; level?: number; rank?: string; total_questions?: number; correct_answers?: number; current_streak?: number; longest_streak?: number; title?: string; };
      };
      kingdoms: {
        Row: { id: string; name: string; slug: string; description: string | null; icon: string; color: string; difficulty: number; order_index: number; is_active: boolean; };
      };
      villages: {
        Row: { id: string; kingdom_id: string; name: string; slug: string; description: string | null; icon: string | null; difficulty: number; required_xp: number; xp_reward: number; coin_reward: number; order_index: number; is_boss_level: boolean; is_active: boolean; zone: string | null; zone_order: number | null; topic_slug: string | null; };
      };
      questions: {
        Row: { id: string; village_id: string; question_text: string; question_type: string; option_a: string | null; option_b: string | null; option_c: string | null; option_d: string | null; correct_answer: string; explanation: string | null; difficulty: number; time_limit_seconds: number; xp_reward: number; coin_reward: number; hints: string[] | null; tags: string[] | null; is_active: boolean; };
      };
      formulas: {
        Row: { id: string; kingdom_id: string | null; village_id: string | null; topic_name: string; formula_name: string; formula_text: string; description: string | null; category: string | null; example: string | null; tags: string[]; created_at: string; };
      };
      power_ups: {
        Row: { id: string; name: string; slug: string; description: string | null; icon: string; effect_type: string; effect_value: number; cost_coins: number; cost_diamonds: number; category: string; is_active: boolean; };
      };
      user_power_ups: {
        Row: { id: string; user_id: string; power_up_id: string; quantity: number; acquired_at: string; };
        Insert: { user_id?: string; power_up_id: string; quantity?: number; };
        Update: { quantity?: number; };
      };
      mp_matches: {
        Row: { id: string; player1_id: string; player2_id: string | null; mode: string; difficulty: string; kingdom_slug: string | null; village_ids: string[] | null; player1_hp: number; player2_hp: number; player1_score: number; player2_score: number; winner_id: string | null; questions_data: unknown; status: string; created_at: string; completed_at: string | null; };
        Insert: { player1_id?: string; player2_id?: string | null; mode?: string; difficulty?: string; kingdom_slug?: string | null; village_ids?: string[] | null; player1_hp?: number; player2_hp?: number; player1_score?: number; player2_score?: number; winner_id?: string | null; status?: string; completed_at?: string | null; };
      };
      friends: {
        Row: { id: string; user_id: string; friend_id: string; created_at: string; };
        Insert: { user_id?: string; friend_id: string; };
      };
      friend_requests: {
        Row: { id: string; sender_id: string; receiver_id: string; status: string; created_at: string; };
        Insert: { sender_id?: string; receiver_id: string; status?: string; };
        Update: { status?: string; };
      };
      ranks: {
        Row: { id: string; name: string; slug: string; min_xp: number; max_xp: number | null; color: string; icon: string; order_index: number; };
      };
      achievements: { Row: { id: string; name: string; slug: string; description: string | null; icon: string; category: string; requirement_type: string | null; requirement_value: number | null; xp_reward: number; coin_reward: number; diamond_reward: number; title_reward: string | null; is_secret: boolean; }; };
      user_achievements: { Row: { id: string; user_id: string; achievement_id: string; unlocked_at: string; }; };
      daily_missions: { Row: { id: string; mission_type: string; description: string | null; requirement: number; xp_reward: number; coin_reward: number; diamond_reward: number; mission_date: string; }; };
      user_missions: {
        Row: { id: string; user_id: string; mission_id: string; progress: number; is_completed: boolean; is_claimed: boolean; completed_at: string | null; created_at: string; };
        Insert: { user_id?: string; mission_id: string; progress?: number; is_completed?: boolean; };
        Update: { progress?: number; is_completed?: boolean; is_claimed?: boolean; completed_at?: string | null; };
      };
      guilds: { Row: { id: string; name: string; slug: string; description: string | null; leader_id: string; member_count: number; total_xp: number; }; };
      question_attempts: {
        Row: { id: string; user_id: string; question_id: string; user_answer: string; is_correct: boolean; time_taken_seconds: number; xp_earned: number; coins_earned: number; created_at: string; };
      };
    };
  };
}
