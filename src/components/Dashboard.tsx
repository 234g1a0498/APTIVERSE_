import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Gem, Flame, Target, Trophy, Zap, Calendar, TrendingUp, Crown, Swords, BookOpen, ShoppingCart } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { KingdomsGrid } from './KingdomsGrid';
import { DailyMissions } from './DailyMissions';
import type { Database } from '../lib/supabase';

type Kingdom = Database['public']['Tables']['kingdoms']['Row'];
interface DashboardProps { onKingdomSelect?: (kingdom: Kingdom) => void; }

export function Dashboard({ onKingdomSelect }: DashboardProps) {
  const { profile, kingdoms, fetchKingdoms, getCurrentRank } = useGameStore();
  useEffect(() => { fetchKingdoms(); }, [fetchKingdoms]);
  if (!profile) return null;
  const accuracy = profile.total_questions > 0 ? Math.round((profile.correct_answers / profile.total_questions) * 100) : 0;
  const rank = getCurrentRank();

  const quickActions = [
    { icon: Swords, label: '1v1 Arena', color: '#ef4444', view: 'multiplayer' },
    { icon: BookOpen, label: 'Library', color: '#10b981', view: 'library' },
    { icon: ShoppingCart, label: 'Store', color: '#f59e0b', view: 'store' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br opacity-10" style={{ background: `linear-gradient(135deg, ${rank?.color || '#6366f1'}33, transparent)` }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold">{profile.username?.[0]?.toUpperCase() || 'A'}</div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Welcome back, {profile.username || 'Adventurer'}!</h1>
            <p className="text-[var(--text-muted)] flex items-center gap-2 mt-1">
              {rank && <><Crown className="w-4 h-4" style={{ color: rank.color }} /><span style={{ color: rank.color }}>{rank.name}</span><span className="mx-1">•</span></>}
              <Trophy className="w-4 h-4 text-yellow-400" />{profile.title}<span className="mx-1">•</span><Flame className="w-4 h-4 text-orange-400" />{profile.current_streak} day streak
            </p>
          </div>
          <div className="text-right"><p className="text-3xl font-bold gradient-text">Lv.{profile.level}</p><p className="text-sm text-[var(--text-muted)]">{profile.xp % 1000}/1000 XP</p></div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Zap, label: 'Total XP', value: profile.xp.toLocaleString(), color: 'text-green-400' },
          { icon: Coins, label: 'Coins', value: profile.coins.toLocaleString(), color: 'gold-text' },
          { icon: Gem, label: 'Diamonds', value: profile.diamonds.toString(), color: 'diamond-text' },
          { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: '' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2"><stat.icon className="w-4 h-4 text-indigo-400" /><span className="text-sm text-[var(--text-muted)]">{stat.label}</span></div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {quickActions.map((action, i) => (
          <motion.button key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="glass rounded-2xl p-4 text-center" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => { const event = new CustomEvent('navigate', { detail: action.view }); window.dispatchEvent(event); }}>
            <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2" style={{ background: `${action.color}30` }}><action.icon className="w-5 h-5" style={{ color: action.color }} /></div>
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <DailyMissions />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Crown className="w-6 h-6 text-indigo-400" />Choose Your Kingdom</h2>
        <KingdomsGrid kingdoms={kingdoms} onSelect={onKingdomSelect} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6 glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-400" />Weekly Activity</h2>
          <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]"><TrendingUp className="w-4 h-4 text-green-400" /><span>{profile.total_questions} questions</span></div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const today = new Date().getDay() === 0 ? 7 : new Date().getDay();
            const isActive = i < today;
            return (
              <div key={day} className="text-center">
                <p className="text-xs text-[var(--text-muted)] mb-2">{day}</p>
                <div className={`h-16 rounded-lg flex items-end justify-center pb-1 ${isActive ? 'bg-gradient-to-t from-indigo-500/50 to-indigo-500/20' : 'bg-[var(--surface)]'}`}>
                  <span className="text-xs font-medium">{isActive ? Math.floor(profile.total_questions / 7) || 0 : '-'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
