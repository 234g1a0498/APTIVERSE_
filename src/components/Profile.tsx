import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Crown, Flame, Gem, Target, Trophy, Zap, Star, Clock, ChevronRight, Lock, Unlock, Swords } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabase';

interface Achievement { id: string; name: string; description: string | null; icon: string; category: string; xp_reward: number; coin_reward: number; diamond_reward: number; title_reward: string | null; unlocked: boolean; }
interface RecentMatch { id: string; opponent_name: string; result: string; xp_earned: number; created_at: string; }

export function Profile() {
  const { profile, getCurrentRank, ranks } = useGameStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'history'>('stats');

  useEffect(() => {
    if (!profile?.user_id) return;
    (async () => {
      const { data: allAchievements } = await supabase.from('achievements').select('*');
      const { data: userAchievements } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', profile.user_id);
      const { data: matches } = await supabase.from('multiplayer_matches').select('*').eq('user_id', profile.user_id).order('created_at', { ascending: false }).limit(5);
      const unlockedIds = new Set(userAchievements?.map((a) => a.achievement_id) || []);
      if (allAchievements) setAchievements(allAchievements.map((a) => ({ ...a, unlocked: unlockedIds.has(a.id) })));
      if (matches) setRecentMatches(matches);
      setLoading(false);
    })();
  }, [profile?.user_id]);

  if (!profile) return null;
  const accuracy = profile.total_questions > 0 ? Math.round((profile.correct_answers / profile.total_questions) * 100) : 0;
  const rank = getCurrentRank();
  const nextRank = ranks.find(r => r.order_index === (rank?.order_index ?? 0) + 1);
  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = { progress: Zap, accuracy: Target, speed: Clock, streak: Flame, kingdom: Crown, social: Award, currency: Gem, level: Star };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative"><div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold">{profile.username?.[0]?.toUpperCase() || 'A'}</div><div className="absolute -bottom-2 -right-2 bg-[var(--surface)] rounded-full p-1.5"><span className="text-xs font-medium">Lv.{profile.level}</span></div></div>
            <div className="flex-1"><div className="flex items-center gap-2 mb-1"><h1 className="text-2xl font-bold">{profile.username || 'Adventurer'}</h1><Trophy className="w-5 h-5 text-yellow-400" /></div><p className="text-[var(--text-muted)] mb-3">{profile.title}</p><div className="flex flex-wrap gap-4"><div className="flex items-center gap-1 text-sm"><Zap className="w-4 h-4 text-green-400" /><span>{profile.xp.toLocaleString()} XP</span></div><div className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 text-yellow-400" /><span>{profile.coins.toLocaleString()} coins</span></div><div className="flex items-center gap-1 text-sm"><Gem className="w-4 h-4 text-purple-400" /><span>{profile.diamonds} diamonds</span></div><div className="flex items-center gap-1 text-sm"><Flame className="w-4 h-4 text-orange-400" /><span>{profile.current_streak} day streak</span></div></div></div>
          </div>
          <div className="mt-6"><div className="flex items-center justify-between text-sm mb-2"><span className="text-[var(--text-muted)]">Level {profile.level}</span><span className="text-[var(--text-muted)]">{profile.xp % 1000}/1000 to Level {profile.level + 1}</span></div><div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden"><motion.div className="h-full xp-bar rounded-full" initial={{ width: 0 }} animate={{ width: `${(profile.xp % 1000) / 10}%` }} transition={{ duration: 1 }} /></div></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          {rank && <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${rank.color}30`, border: `2px solid ${rank.color}` }}><Crown className="w-8 h-8" style={{ color: rank.color }} /></motion.div>}
          <div className="flex-1"><h2 className="font-semibold text-lg" style={{ color: rank?.color }}>Current Rank: {rank?.name}</h2>{nextRank ? <p className="text-sm text-[var(--text-muted)]">{((profile.xp - rank!.min_xp) / (nextRank.min_xp - rank!.min_xp) * 100).toFixed(1)}% to {nextRank.name}</p> : <p className="text-sm text-[var(--text-muted)]">Max rank achieved!</p>}</div>
        </div>
        {nextRank && <div className="mt-4"><div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: rank?.color }} initial={{ width: 0 }} animate={{ width: `${(profile.xp - rank!.min_xp) / (nextRank.min_xp - rank!.min_xp) * 100}%` }} transition={{ duration: 1 }} /></div><p className="text-xs text-[var(--text-muted)] mt-1">{profile.xp} / {nextRank.min_xp} XP</p></div>}
        <div className="flex flex-wrap gap-2 mt-4">{ranks.map((r) => <div key={r.id} className={`px-2 py-1 rounded-lg text-xs ${r.slug === rank?.slug ? '' : 'opacity-40'}`} style={{ background: `${r.color}20`, color: r.color }}>{r.name}</div>)}</div>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {[{ id: 'stats', icon: Target, label: 'Stats' }, { id: 'achievements', icon: Award, label: 'Awards' }, { id: 'history', icon: Swords, label: 'History' }].map((tab) => (
          <motion.button key={tab.id} onClick={() => setActiveTab(tab.id as 'stats' | 'achievements' | 'history')} className={`flex-1 glass rounded-xl py-3 flex items-center justify-center gap-2 ${activeTab === tab.id ? 'border-2 border-indigo-500' : ''}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><tab.icon className="w-4 h-4" /><span>{tab.label}</span></motion.button>
        ))}
      </div>

      {activeTab === 'stats' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-xl p-4 text-center"><p className="text-3xl font-bold text-green-400">{profile.correct_answers}</p><p className="text-sm text-[var(--text-muted)]">Correct</p></div>
          <div className="glass rounded-xl p-4 text-center"><p className="text-3xl font-bold text-red-400">{profile.total_questions - profile.correct_answers}</p><p className="text-sm text-[var(--text-muted)]">Incorrect</p></div>
          <div className="glass rounded-xl p-4 text-center"><p className="text-3xl font-bold text-indigo-400">{accuracy}%</p><p className="text-sm text-[var(--text-muted)]">Accuracy</p></div>
          <div className="glass rounded-xl p-4 text-center"><p className="text-3xl font-bold text-orange-400">{profile.longest_streak}</p><p className="text-sm text-[var(--text-muted)]">Best Streak</p></div>
        </motion.div>
      ) : activeTab === 'history' ? (
        <div className="space-y-3">
          {recentMatches.length === 0 && <div className="glass rounded-xl p-8 text-center"><Swords className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" /><p className="text-[var(--text-muted)]">No matches yet. Try the 1v1 Arena!</p></div>}
          {recentMatches.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.result === 'win' ? 'bg-green-500/20' : m.result === 'loss' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}><Trophy className={`w-5 h-5 ${m.result === 'win' ? 'text-green-400' : m.result === 'loss' ? 'text-red-400' : 'text-yellow-400'}`} /></div>
              <div className="flex-1"><p className="font-medium">vs {m.opponent_name}</p><p className="text-xs text-[var(--text-muted)]">{new Date(m.created_at).toLocaleDateString()}</p></div>
              <div className="text-right"><p className={`font-bold uppercase text-sm ${m.result === 'win' ? 'text-green-400' : m.result === 'loss' ? 'text-red-400' : 'text-yellow-400'}`}>{m.result}</p><p className="text-xs text-[var(--text-muted)]">+{m.xp_earned} XP</p></div>
            </motion.div>
          ))}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const IconComponent = categoryIcons[achievement.category] || Award;
            return (
              <motion.div key={achievement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`glass rounded-xl p-4 ${achievement.unlocked ? 'border border-green-500/30' : 'opacity-60'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.unlocked ? 'bg-green-500/20' : 'bg-gray-700/50'}`}>
                    {achievement.unlocked ? <IconComponent className="w-6 h-6 text-green-400" /> : <Lock className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">{achievement.name}{achievement.unlocked && <Unlock className="w-3 h-3 text-green-400" />}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{achievement.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      {achievement.xp_reward > 0 && <span className="flex items-center gap-0.5 text-green-400"><Zap className="w-3 h-3" />+{achievement.xp_reward}</span>}
                      {achievement.coin_reward > 0 && <span className="flex items-center gap-0.5 text-yellow-400"><Star className="w-3 h-3" />+{achievement.coin_reward}</span>}
                      {achievement.diamond_reward > 0 && <span className="flex items-center gap-0.5 text-purple-400"><Gem className="w-3 h-3" />+{achievement.diamond_reward}</span>}
                    </div>
                  </div>
                  {achievement.unlocked && <div className="flex items-center gap-1 text-green-400"><Award className="w-5 h-5" /></div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 mt-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">{[1, 2, 3].map((i) => (<div key={i} className="flex items-center gap-3 p-3 bg-[var(--surface)] rounded-xl"><div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Zap className="w-5 h-5 text-indigo-400" /></div><div className="flex-1"><p className="text-sm">Completed {Math.floor(Math.random() * 10) + 1} questions</p><p className="text-xs text-[var(--text-muted)]">{i} day{i > 1 ? 's' : ''} ago</p></div><ChevronRight className="w-4 h-4 text-[var(--text-muted)]" /></div>))}</div>
      </motion.div>
    </div>
  );
}
