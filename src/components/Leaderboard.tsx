import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Trophy, Users, Zap, Swords } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry { id: string; username: string | null; xp: number; level: number; title: string; rank: number; }
interface GuildData { id: string; name: string; member_count: number; total_xp: number; }

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'players' | 'guilds' | 'mp'>('players');
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [mpPlayers, setMpPlayers] = useState<any[]>([]);
  const [guilds, setGuilds] = useState<GuildData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'players') {
      supabase.from('user_profiles').select('id, username, xp, level, title').order('xp', { ascending: false }).limit(50).then(({ data }) => { if (data) setPlayers(data.map((p, i) => ({ ...p, rank: i + 1 }))); setLoading(false); });
    } else if (activeTab === 'mp') {
      supabase.from('user_profiles').select('id, username, xp, level, title, multiplayer_wins, multiplayer_losses, multiplayer_xp').order('multiplayer_xp', { ascending: false }).limit(50).then(({ data }) => { if (data) setMpPlayers(data.map((p: any, i: number) => ({ ...p, rank: i + 1 }))); setLoading(false); });
    } else {
      supabase.from('guilds').select('id, name, member_count, total_xp').order('total_xp', { ascending: false }).limit(20).then(({ data }) => { if (data) setGuilds(data); setLoading(false); });
    }
  }, [activeTab]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-300', bg: 'bg-gray-300/20' };
    if (rank === 3) return { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-600/20' };
    return { icon: null, color: 'text-[var(--text-muted)]', bg: 'bg-[var(--surface)]' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-2"><Trophy className="w-8 h-8" />Leaderboards</h1>
        <p className="text-[var(--text-muted)]">Top performers this season</p>
      </motion.div>

      <div className="flex gap-2 mb-8">
        {[{ id: 'players', icon: Users, label: 'Players' }, { id: 'mp', icon: Swords, label: 'Arena' }, { id: 'guilds', icon: Crown, label: 'Guilds' }].map((tab) => (
          <motion.button key={tab.id} onClick={() => setActiveTab(tab.id as 'players' | 'mp' | 'guilds')} className={`flex-1 glass rounded-xl py-3 px-6 flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id ? 'border-2 border-indigo-500' : ''}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><tab.icon className="w-5 h-5" /><span>{tab.label}</span></motion.button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : activeTab === 'players' ? (
        <div className="space-y-3">
          {players.slice(0, 3).map((player, index) => {
            const style = getRankStyle(player.rank);
            const IconComponent = style.icon || Medal;
            return (
              <motion.div key={player.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`glass rounded-xl p-4 flex items-center gap-4 ${player.rank <= 3 ? 'border border-yellow-400/30' : ''}`}>
                <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center`}><IconComponent className={`w-6 h-6 ${style.color}`} /></div>
                <div className="flex-1"><div className="flex items-center gap-2"><span className="font-semibold">{player.username || 'Anonymous'}</span>{player.rank === 1 && <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded">Champion</span>}</div><div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-muted)]"><span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" />Lv.{player.level}</span><span>{player.title}</span></div></div>
                <div className="text-right"><p className="text-xl font-bold">{(player.xp / 1000).toFixed(1)}k</p><p className="text-xs text-[var(--text-muted)]">XP</p></div>
              </motion.div>
            );
          })}
          {players.length > 3 && <div className="pt-4"><p className="text-sm text-[var(--text-muted)] mb-3 text-center">Others</p>{players.slice(3).map((player, index) => (<motion.div key={player.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + index * 0.05 }} className="glass rounded-lg p-3 flex items-center gap-3 mb-2"><span className="w-8 text-center text-[var(--text-muted)] font-medium">#{player.rank}</span><span className="flex-1 font-medium">{player.username || 'Anonymous'}</span><span className="text-[var(--text-muted)]">{(player.xp / 1000).toFixed(1)}k XP</span></motion.div>))}</div>}
        </div>
      ) : activeTab === 'mp' ? (
        <div className="space-y-3">
          {mpPlayers.slice(0, 3).map((player, index) => {
            const style = getRankStyle(player.rank);
            const IconComponent = style.icon || Medal;
            const winRate = player.multiplayer_wins + player.multiplayer_losses > 0 ? Math.round((player.multiplayer_wins / (player.multiplayer_wins + player.multiplayer_losses)) * 100) : 0;
            return (
              <motion.div key={player.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`glass rounded-xl p-4 flex items-center gap-4 ${player.rank <= 3 ? 'border border-yellow-400/30' : ''}`}>
                <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center`}><IconComponent className={`w-6 h-6 ${style.color}`} /></div>
                <div className="flex-1"><div className="flex items-center gap-2"><span className="font-semibold">{player.username || 'Anonymous'}</span>{player.rank === 1 && <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded">Arena Champion</span>}</div><div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-muted)]"><span className="flex items-center gap-1 text-green-400">{player.multiplayer_wins}W</span><span className="text-red-400">{player.multiplayer_losses}L</span><span className="text-blue-400">{winRate}% WR</span></div></div>
                <div className="text-right"><p className="text-xl font-bold text-indigo-400">{player.multiplayer_xp}</p><p className="text-xs text-[var(--text-muted)]">MP XP</p></div>
              </motion.div>
            );
          })}
          {mpPlayers.length > 3 && <div className="pt-4"><p className="text-sm text-[var(--text-muted)] mb-3 text-center">Others</p>{mpPlayers.slice(3).map((player, index) => (<motion.div key={player.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + index * 0.05 }} className="glass rounded-lg p-3 flex items-center gap-3 mb-2"><span className="w-8 text-center text-[var(--text-muted)] font-medium">#{player.rank}</span><span className="flex-1 font-medium">{player.username || 'Anonymous'}</span><span className="text-green-400 text-sm">{player.multiplayer_wins}W</span><span className="text-red-400 text-sm">{player.multiplayer_losses}L</span><span className="text-[var(--text-muted)]">{player.multiplayer_xp} XP</span></motion.div>))}</div>}
          {mpPlayers.length === 0 && <div className="text-center py-12"><Swords className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" /><p className="text-[var(--text-muted)]">No arena battles yet. Start fighting!</p></div>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {guilds.map((guild, index) => (
            <motion.div key={guild.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`glass rounded-xl p-4 ${index === 0 ? 'border border-yellow-400/30' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-yellow-400/20' : 'bg-indigo-500/20'}`}><Crown className={`w-5 h-5 ${index === 0 ? 'text-yellow-400' : 'text-indigo-400'}`} /></div>
                <div className="flex-1"><h3 className="font-semibold">{guild.name}</h3><p className="text-sm text-[var(--text-muted)] flex items-center gap-1"><Users className="w-3 h-3" />{guild.member_count} members</p></div>
                <div className="text-right"><p className="font-bold">{(guild.total_xp / 1000).toFixed(1)}k</p><p className="text-xs text-[var(--text-muted)]">Total XP</p></div>
              </div>
            </motion.div>
          ))}
          {guilds.length === 0 && <div className="col-span-2 text-center py-12"><Crown className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" /><p className="text-[var(--text-muted)]">No guilds yet. Create one!</p></div>}
        </div>
      )}
    </div>
  );
}
