import { create } from 'zustand';
import { supabase, type Database } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Kingdom = Database['public']['Tables']['kingdoms']['Row'];
type Village = Database['public']['Tables']['villages']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Formula = Database['public']['Tables']['formulas']['Row'];
type PowerUp = Database['public']['Tables']['power_ups']['Row'];
type UserPowerUp = Database['public']['Tables']['user_power_ups']['Row'];
type Rank = Database['public']['Tables']['ranks']['Row'];
type DailyMission = Database['public']['Tables']['daily_missions']['Row'];

export interface MissionWithProgress extends DailyMission { user_mission_id: string | null; progress: number; is_completed: boolean; is_claimed: boolean; }

export interface BattleState {
  question: Question | null;
  questionQueue: Question[];
  currentIndex: number;
  currentHealth: number; maxHealth: number;
  enemyHealth: number; enemyMaxHealth: number;
  timeLeft: number; score: number; streak: number;
  answers: Array<{ questionId: string; correct: boolean; time: number; }>;
  activePowerUps: string[];
  hintRevealed: boolean;
  removedOptions: string[];
  shieldActive: boolean;
  doubleXpNext: boolean;
  tripleCoinsNext: boolean;
  secondChanceActive: boolean;
  isBoss: boolean;
}

export interface MultiplayerState {
  inMatch: boolean;
  matchPhase: 'idle' | 'searching' | 'found' | 'playing' | 'result';
  mode: 'ai' | 'friend';
  difficulty: 'easy' | 'medium' | 'advanced';
  opponentName: string;
  opponentAvatar: string;
  opponentId: string | null;
  opponentScore: number;
  opponentHealth: number;
  opponentMaxHealth: number;
  userScore: number;
  userHealth: number;
  userMaxHealth: number;
  currentQuestion: Question | null;
  questionQueue: Question[];
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  emote: string | null;
  opponentEmote: string | null;
  botAnswerTimer: number;
  result: 'win' | 'loss' | 'draw' | null;
  matchId: string | null;
}

interface AppState {
  user: User | null; profile: UserProfile | null; session: Session | null;
  kingdoms: Kingdom[]; villages: Village[];
  currentKingdom: Kingdom | null; currentVillage: Village | null;
  battle: BattleState; multiplayer: MultiplayerState;
  powerUps: PowerUp[]; userPowerUps: UserPowerUp[];
  ranks: Rank[]; formulas: Formula[];
  missions: MissionWithProgress[];
  loading: boolean; error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null, session: Session | null) => void;
  fetchProfile: () => Promise<void>;
  fetchKingdoms: () => Promise<void>;
  fetchVillages: (kingdomId: string) => Promise<void>;
  fetchPowerUps: () => Promise<void>;
  fetchUserPowerUps: () => Promise<void>;
  fetchRanks: () => Promise<void>;
  fetchFormulas: (search?: string, kingdomId?: string) => Promise<void>;
  fetchMissions: () => Promise<void>;
  updateMissionProgress: (type: string, amount: number) => Promise<void>;
  claimMission: (userMissionId: string) => Promise<boolean>;
  selectKingdom: (kingdom: Kingdom | null) => void;
  selectVillage: (village: Village | null) => void;
  startBattle: (villageId: string) => Promise<void>;
  answerQuestion: (answer: string) => Promise<boolean>;
  nextQuestion: () => Promise<void>;
  endBattle: () => void;
  usePowerUp: (powerUpId: string) => Promise<boolean>;
  buyPowerUp: (powerUpId: string) => Promise<boolean>;
  getCurrentRank: () => Rank | null;
  startMultiplayerMatch: (mode?: 'ai' | 'friend', difficulty?: 'easy' | 'medium' | 'advanced', opponentName?: string, opponentAvatar?: string, opponentId?: string) => void;
  startMultiplayerBattle: () => Promise<void>;
  cancelMultiplayerMatch: () => void;
  multiplayerAnswer: (answer: string) => boolean;
  multiplayerBotTick: () => void;
  endMultiplayerMatch: () => Promise<void>;
  sendEmote: (emote: string) => void;
}

const initialBattleState: BattleState = {
  question: null, questionQueue: [], currentIndex: 0,
  currentHealth: 100, maxHealth: 100,
  enemyHealth: 100, enemyMaxHealth: 100,
  timeLeft: 60, score: 0, streak: 0,
  answers: [], activePowerUps: [], hintRevealed: false,
  removedOptions: [], shieldActive: false,
  doubleXpNext: false, tripleCoinsNext: false,
  secondChanceActive: false, isBoss: false,
};

const initialMultiplayerState: MultiplayerState = {
  inMatch: false, matchPhase: 'idle',
  mode: 'ai', difficulty: 'medium',
  opponentName: '', opponentAvatar: '', opponentId: null,
  opponentScore: 0, opponentHealth: 200, opponentMaxHealth: 200,
  userScore: 0, userHealth: 200, userMaxHealth: 200,
  currentQuestion: null, questionQueue: [],
  questionIndex: 0, totalQuestions: 10, timeLeft: 60,
  emote: null, opponentEmote: null, botAnswerTimer: 0, result: null, matchId: null,
};

const BOT_NAMES = ['CyberSage', 'LogicLord', 'QuantumKnight', 'AptiMaster', 'BrainStorm', 'NeoWarrior', 'CodePhantom', 'MathNinja'];
const BOT_AVATARS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#06b6d4', '#a855f7', '#f97316'];

export const useGameStore = create<AppState>((set, get) => ({
  user: null, profile: null, session: null, kingdoms: [], villages: [],
  currentKingdom: null, currentVillage: null,
  battle: initialBattleState, multiplayer: initialMultiplayerState,
  powerUps: [], userPowerUps: [], ranks: [], formulas: [],
  missions: [],
  loading: false, error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { set({ error: error.message, loading: false }); throw error; }
    set({ loading: false });
  },

  signUp: async (email, password, username) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { set({ error: error.message, loading: false }); throw error; }
    if (data.user) {
      await supabase.from('user_profiles').insert({ user_id: data.user.id, username, display_name: username });
    }
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null });
  },

  setUser: (user, session) => { set({ user, session }); if (!user) set({ profile: null }); },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle();
    if (data) set({ profile: data });
  },

  fetchKingdoms: async () => {
    const { data } = await supabase.from('kingdoms').select('*').eq('is_active', true).order('order_index');
    if (data) set({ kingdoms: data });
  },

  fetchVillages: async (kingdomId) => {
    const { data } = await supabase.from('villages').select('*').eq('kingdom_id', kingdomId).eq('is_active', true).order('order_index');
    if (data) set({ villages: data });
  },

  fetchPowerUps: async () => {
    const { data } = await supabase.from('power_ups').select('*').eq('is_active', true);
    if (data) set({ powerUps: data });
  },

  fetchUserPowerUps: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase.from('user_power_ups').select('*').eq('user_id', user.id);
    if (data) set({ userPowerUps: data });
  },

  fetchRanks: async () => {
    const { data } = await supabase.from('ranks').select('*').order('order_index');
    if (data) set({ ranks: data });
  },

  fetchFormulas: async (search, kingdomId) => {
    let query = supabase.from('formulas').select('*');
    if (search) {
      query = query.or(`formula_name.ilike.%${search}%,formula_text.ilike.%${search}%,topic_name.ilike.%${search}%`);
    }
    if (kingdomId) {
      query = query.eq('kingdom_id', kingdomId);
    }
    const { data } = await query.limit(200);
    if (data) set({ formulas: data });
  },

  fetchMissions: async () => {
    const user = get().user;
    if (!user) return;
    const { data: dailyMissions } = await supabase.from('daily_missions').select('*').eq('mission_date', new Date().toISOString().split('T')[0]);
    if (!dailyMissions) return;
    const { data: userMissions } = await supabase.from('user_missions').select('*').eq('user_id', user.id);
    const userMissionMap = new Map((userMissions || []).map((um) => [um.mission_id, um]));
    const missions: MissionWithProgress[] = dailyMissions.map((dm) => {
      const um = userMissionMap.get(dm.id);
      return { ...dm, user_mission_id: um?.id ?? null, progress: um?.progress ?? 0, is_completed: um?.is_completed ?? false, is_claimed: um?.is_claimed ?? false };
    });
    set({ missions });
  },

  updateMissionProgress: async (type, amount) => {
    const user = get().user;
    const { missions } = get();
    if (!user) return;
    const matching = missions.filter((m) => m.mission_type === type && !m.is_claimed);
    for (const mission of matching) {
      const newProgress = Math.min(mission.requirement, mission.progress + amount);
      const isCompleted = newProgress >= mission.requirement;
      if (mission.user_mission_id) {
        await supabase.from('user_missions').update({ progress: newProgress, is_completed: isCompleted || mission.is_completed, completed_at: isCompleted ? new Date().toISOString() : null }).eq('id', mission.user_mission_id);
      } else {
        const { data } = await supabase.from('user_missions').insert({ user_id: user.id, mission_id: mission.id, progress: newProgress, is_completed: isCompleted }).select().maybeSingle();
        if (data) mission.user_mission_id = data.id;
      }
    }
    get().fetchMissions();
  },

  claimMission: async (userMissionId) => {
    const user = get().user;
    const { missions, profile } = get();
    if (!user || !profile) return false;
    const mission = missions.find((m) => m.user_mission_id === userMissionId);
    if (!mission || !mission.is_completed || mission.is_claimed) return false;
    await supabase.from('user_missions').update({ is_claimed: true }).eq('id', userMissionId);
    await supabase.from('user_profiles').update({
      xp: profile.xp + mission.xp_reward,
      coins: profile.coins + mission.coin_reward,
      diamonds: profile.diamonds + mission.diamond_reward,
      level: Math.floor((profile.xp + mission.xp_reward) / 1000) + 1,
    }).eq('user_id', profile.user_id);
    get().fetchProfile();
    get().fetchMissions();
    return true;
  },

  selectKingdom: (kingdom) => set({ currentKingdom: kingdom, villages: [], currentVillage: null }),
  selectVillage: (village) => set({ currentVillage: village }),

  startBattle: async (villageId) => {
    const village = get().villages.find(v => v.id === villageId);
    const isBoss = village?.is_boss_level ?? false;
    const { data } = await supabase.from('questions').select('*').eq('village_id', villageId).eq('is_active', true).limit(10);
    if (data && data.length > 0) {
      set({
        battle: {
          ...initialBattleState,
          question: data[0], questionQueue: data, currentIndex: 0,
          timeLeft: data[0].time_limit_seconds,
          enemyMaxHealth: data.length * 100, enemyHealth: data.length * 100,
          isBoss,
        },
      });
    }
  },

  answerQuestion: async (answer) => {
    const { battle, profile } = get();
    if (!battle.question || !profile) return false;
    const q = battle.question;
    const isCorrect = answer === q.correct_answer;

    if (!isCorrect && battle.shieldActive) {
      set((state) => ({ battle: { ...state.battle, shieldActive: false } }));
      return false;
    }
    if (!isCorrect && battle.secondChanceActive) {
      set((state) => ({ battle: { ...state.battle, secondChanceActive: false } }));
      return false;
    }

    const xpMult = battle.doubleXpNext ? 2 : 1;
    const coinMult = battle.tripleCoinsNext ? 3 : 1;
    const xpEarned = isCorrect ? Math.floor(q.xp_reward * xpMult * (1 + battle.streak * 0.1)) : 0;
    const coinEarned = isCorrect ? q.coin_reward * coinMult : 0;

    set((state) => ({
      battle: {
        ...state.battle,
        currentHealth: Math.max(0, state.battle.currentHealth - (isCorrect ? 0 : 20)),
        enemyHealth: Math.max(0, state.battle.enemyHealth - (isCorrect ? 100 : 0)),
        streak: isCorrect ? state.battle.streak + 1 : 0,
        score: state.battle.score + xpEarned,
        doubleXpNext: isCorrect ? false : state.battle.doubleXpNext,
        tripleCoinsNext: isCorrect ? false : state.battle.tripleCoinsNext,
        answers: [...state.battle.answers, { questionId: q.id, correct: isCorrect, time: q.time_limit_seconds - state.battle.timeLeft }],
      },
    }));

    await supabase.from('question_attempts').insert({
      user_id: profile.user_id, question_id: q.id, user_answer: answer, is_correct: isCorrect,
      time_taken_seconds: q.time_limit_seconds - battle.timeLeft,
      xp_earned: xpEarned, coins_earned: coinEarned,
    });
    get().updateMissionProgress('questions', 1);
    if (isCorrect && xpEarned > 0) get().updateMissionProgress('xp', xpEarned);
    return isCorrect;
  },

  nextQuestion: async () => {
    const { battle } = get();
    const nextIdx = battle.currentIndex + 1;
    if (nextIdx >= battle.questionQueue.length) { get().endBattle(); return; }
    const nextQ = battle.questionQueue[nextIdx];
    set((state) => ({
      battle: { ...state.battle, question: nextQ, currentIndex: nextIdx, timeLeft: nextQ.time_limit_seconds, hintRevealed: false, removedOptions: [] },
    }));
  },

  endBattle: () => {
    const { battle, profile } = get();
    if (!profile) return;
    const xpEarned = Math.floor(battle.score);
    const coinsEarned = Math.floor(battle.score * 0.5);
    const correctCount = battle.answers.filter((a) => a.correct).length;
    const isWin = correctCount >= Math.ceil(battle.questionQueue.length / 2);
    const newLevel = Math.floor((profile.xp + xpEarned) / 1000) + 1;
    supabase.from('user_profiles').update({
      xp: profile.xp + xpEarned, coins: profile.coins + coinsEarned,
      level: newLevel,
      total_questions: profile.total_questions + battle.answers.length,
      correct_answers: profile.correct_answers + correctCount,
      current_streak: battle.answers.every(a => a.correct) && battle.answers.length > 0 ? profile.current_streak + 1 : profile.current_streak,
      longest_streak: Math.max(profile.longest_streak, profile.current_streak + (battle.answers.every(a => a.correct) ? 1 : 0)),
      updated_at: new Date().toISOString(),
    }).eq('user_id', profile.user_id).then(() => get().fetchProfile());
    if (isWin) get().updateMissionProgress('battles', 1);
    set({ battle: initialBattleState });
  },

  usePowerUp: async (powerUpId) => {
    const { userPowerUps, battle, powerUps } = get();
    const owned = userPowerUps.find(u => u.power_up_id === powerUpId);
    if (!owned || owned.quantity <= 0) return false;
    const pu = powerUps.find(p => p.id === powerUpId);
    if (!pu) return false;

    await supabase.from('user_power_ups').update({ quantity: owned.quantity - 1 }).eq('id', owned.id);

    switch (pu.effect_type) {
      case 'remove_options': {
        const q = battle.question;
        if (!q) return false;
        const wrong = ['A','B','C','D'].filter(k => k !== q.correct_answer && (q as any)[`option_${k.toLowerCase()}`]);
        const toRemove = wrong.slice(0, 2);
        set((s) => ({ battle: { ...s.battle, removedOptions: toRemove } }));
        break;
      }
      case 'restore_hp':
        set((s) => ({ battle: { ...s.battle, currentHealth: Math.min(s.battle.maxHealth, s.battle.currentHealth + pu.effect_value) } }));
        break;
      case 'reveal_hint':
        set((s) => ({ battle: { ...s.battle, hintRevealed: true } }));
        break;
      case 'double_xp':
        set((s) => ({ battle: { ...s.battle, doubleXpNext: true } }));
        break;
      case 'triple_coins':
        set((s) => ({ battle: { ...s.battle, tripleCoinsNext: true } }));
        break;
      case 'skip_question':
        await get().nextQuestion();
        break;
      case 'second_chance':
        set((s) => ({ battle: { ...s.battle, secondChanceActive: true } }));
        break;
      case 'block_damage':
        set((s) => ({ battle: { ...s.battle, shieldActive: true } }));
        break;
    }
    get().fetchUserPowerUps();
    return true;
  },

  buyPowerUp: async (powerUpId) => {
    const { profile, powerUps } = get();
    if (!profile) return false;
    const pu = powerUps.find(p => p.id === powerUpId);
    if (!pu) return false;
    if (profile.coins < pu.cost_coins || profile.diamonds < pu.cost_diamonds) return false;

    await supabase.from('user_profiles').update({
      coins: profile.coins - pu.cost_coins,
      diamonds: profile.diamonds - pu.cost_diamonds,
    }).eq('user_id', profile.user_id);

    const { data: existing } = await supabase.from('user_power_ups').select('*').eq('user_id', profile.user_id).eq('power_up_id', powerUpId).maybeSingle();
    if (existing) {
      await supabase.from('user_power_ups').update({ quantity: existing.quantity + 1 }).eq('id', existing.id);
    } else {
      await supabase.from('user_power_ups').insert({ user_id: profile.user_id, power_up_id: powerUpId, quantity: 1 });
    }
    get().fetchProfile();
    get().fetchUserPowerUps();
    return true;
  },

  getCurrentRank: () => {
    const { profile, ranks } = get();
    if (!profile || ranks.length === 0) return null;
    return ranks.find(r => profile.xp >= r.min_xp && (r.max_xp === null || profile.xp <= r.max_xp)) || ranks[0];
  },

  startMultiplayerMatch: (mode: 'ai' | 'friend' = 'ai', difficulty: 'easy' | 'medium' | 'advanced' = 'medium', opponentName?: string, opponentAvatar?: string, opponentId?: string) => {
    const maxHp = difficulty === 'easy' ? 200 : difficulty === 'medium' ? 250 : 300;
    set({ multiplayer: { ...initialMultiplayerState, matchPhase: 'searching', inMatch: true, mode, difficulty, userMaxHealth: maxHp, opponentMaxHealth: maxHp, userHealth: maxHp, opponentHealth: maxHp, opponentName: opponentName || '', opponentAvatar: opponentAvatar || '', opponentId: opponentId || null } });
    if (mode === 'ai') {
      const nameIdx = Math.floor(Math.random() * BOT_NAMES.length);
      setTimeout(() => {
        set((s) => ({ multiplayer: { ...s.multiplayer, matchPhase: 'found', opponentName: BOT_NAMES[nameIdx], opponentAvatar: BOT_AVATARS[nameIdx] } }));
        setTimeout(() => get().startMultiplayerBattle(), 1500);
      }, 2500);
    } else {
      setTimeout(() => {
        set((s) => ({ multiplayer: { ...s.multiplayer, matchPhase: 'found' } }));
        setTimeout(() => get().startMultiplayerBattle(), 1500);
      }, 1500);
    }
  },

  startMultiplayerBattle: async () => {
    const { multiplayer, kingdoms } = get();
    const diffMap = { easy: [1, 2], medium: [2, 3], advanced: [3, 4, 5] } as const;
    const diffNums = diffMap[multiplayer.difficulty];
    if (!kingdoms || kingdoms.length === 0) return;
    const randomKingdom = kingdoms[Math.floor(Math.random() * kingdoms.length)];
    const { data: villages } = await supabase.from('villages').select('*').eq('kingdom_id', randomKingdom.id).eq('is_active', true).limit(10);
    if (!villages || villages.length === 0) return;
    const randomVillage = villages[Math.floor(Math.random() * villages.length)];
    let { data: questions } = await supabase.from('questions').select('*').eq('village_id', randomVillage.id).eq('is_active', true).in('difficulty', diffNums).limit(10);
    if (!questions || questions.length < 3) {
      const { data: fallback } = await supabase.from('questions').select('*').eq('village_id', randomVillage.id).eq('is_active', true).limit(10);
      questions = fallback;
    }
    if (!questions || questions.length === 0) return;

    set((s) => ({
      multiplayer: {
        ...s.multiplayer, matchPhase: 'playing',
        currentQuestion: questions[0], questionQueue: questions, questionIndex: 0, totalQuestions: questions.length,
        timeLeft: 60, botAnswerTimer: Math.floor(Math.random() * 5) + 3,
      },
    }));
  },

  cancelMultiplayerMatch: () => set({ multiplayer: initialMultiplayerState }),

  multiplayerAnswer: (answer) => {
    const { multiplayer } = get();
    const q = multiplayer.currentQuestion;
    if (!q) return false;
    const isCorrect = answer === q.correct_answer;
    if (isCorrect) {
      set((s) => ({
        multiplayer: {
          ...s.multiplayer,
          userScore: s.multiplayer.userScore + 10,
          opponentHealth: Math.max(0, s.multiplayer.opponentHealth - 25),
        },
      }));
    } else {
      set((s) => ({
        multiplayer: { ...s.multiplayer, userHealth: Math.max(0, s.multiplayer.userHealth - 25) } }));
    }
    return isCorrect;
  },

  multiplayerBotTick: () => {
    const { multiplayer } = get();
    if (multiplayer.matchPhase !== 'playing' || !multiplayer.currentQuestion) return;
    const newTimer = multiplayer.botAnswerTimer - 1;
    if (newTimer <= 0) {
      const botAccuracy = multiplayer.difficulty === 'easy' ? 0.4 : multiplayer.difficulty === 'medium' ? 0.55 : 0.7;
      const botCorrect = Math.random() < botAccuracy;
      const emotes = ['laugh', 'mind-blown', 'cool', 'sweat'];
      if (botCorrect) {
        set((s) => ({
          multiplayer: {
            ...s.multiplayer,
            opponentScore: s.multiplayer.opponentScore + 10,
            userHealth: Math.max(0, s.multiplayer.userHealth - 25),
            opponentEmote: emotes[Math.floor(Math.random() * emotes.length)],
            botAnswerTimer: Math.floor(Math.random() * 5) + 3,
          },
        }));
      } else {
        set((s) => ({
          multiplayer: { ...s.multiplayer, opponentHealth: Math.max(0, s.multiplayer.opponentHealth - 25), botAnswerTimer: Math.floor(Math.random() * 5) + 3 } }));
      }
      setTimeout(() => set((s) => ({ multiplayer: { ...s.multiplayer, opponentEmote: null } })), 2000);
    } else {
      set((s) => ({ multiplayer: { ...s.multiplayer, botAnswerTimer: newTimer } }));
    }
    if (get().multiplayer.userHealth <= 0 || get().multiplayer.opponentHealth <= 0) {
      get().endMultiplayerMatch();
    }
  },

  endMultiplayerMatch: async () => {
    const { multiplayer, profile } = get();
    if (!profile || multiplayer.matchPhase === 'result') return;
    const result = multiplayer.userHealth > multiplayer.opponentHealth ? 'win' : multiplayer.userHealth < multiplayer.opponentHealth ? 'loss' : 'draw';
    const xpEarned = result === 'win' ? 50 : 25;
    const coinsEarned = result === 'win' ? 100 : 50;

    await supabase.from('mp_matches').insert({
      player1_id: profile.user_id,
      player2_id: multiplayer.mode === 'friend' ? multiplayer.opponentId : null,
      mode: multiplayer.mode, difficulty: multiplayer.difficulty,
      player1_hp: multiplayer.userHealth, player2_hp: multiplayer.opponentHealth,
      player1_score: multiplayer.userScore, player2_score: multiplayer.opponentScore,
      winner_id: result === 'win' ? profile.user_id : result === 'loss' ? multiplayer.opponentId : null,
      status: 'completed', completed_at: new Date().toISOString(),
    });
    const mpWinInc = result === 'win' ? 1 : 0;
    const mpLossInc = result === 'loss' ? 1 : 0;
    await supabase.from('user_profiles').update({
      xp: profile.xp + xpEarned, coins: profile.coins + coinsEarned,
      level: Math.floor((profile.xp + xpEarned) / 1000) + 1,
      multiplayer_wins: (profile.multiplayer_wins || 0) + mpWinInc,
      multiplayer_losses: (profile.multiplayer_losses || 0) + mpLossInc,
      multiplayer_xp: (profile.multiplayer_xp || 0) + xpEarned,
    }).eq('user_id', profile.user_id);

    set((s) => ({ multiplayer: { ...s.multiplayer, matchPhase: 'result', result } }));
    get().fetchProfile();
  },

  sendEmote: (emote) => {
    set((s) => ({ multiplayer: { ...s.multiplayer, emote } }));
    setTimeout(() => set((s) => ({ multiplayer: { ...s.multiplayer, emote: null } })), 2000);
  },
}));
