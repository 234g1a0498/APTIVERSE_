import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Lock, Shield, Star, Zap } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Database } from '../lib/supabase';

type Village = Database['public']['Tables']['villages']['Row'];

export function VillageSelect() {
  const { currentKingdom, villages, currentVillage, selectVillage, startBattle, fetchVillages } = useGameStore();
  useEffect(() => { if (currentKingdom) fetchVillages(currentKingdom.id); }, [currentKingdom, fetchVillages]);
  if (!currentKingdom) return null;

  const getVillageStatus = (_village: Village, index: number) => index <= 2 ? 'unlocked' : 'locked';

  return (
    <div className="min-h-screen bg-[var(--background)] bg-pattern bg-stars">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectVillage(null)} className="p-2 glass rounded-xl"><ArrowLeft className="w-5 h-5" /></motion.button>
          <div><h1 className="text-2xl font-bold" style={{ color: currentKingdom.color }}>{currentKingdom.name}</h1><p className="text-[var(--text-muted)]">{currentKingdom.description}</p></div>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 to-purple-500/50 transform -translate-x-1/2 -z-10" />
          {villages.map((village, index) => {
            const status = getVillageStatus(village, index);
            const isBoss = village.is_boss_level;
            return (
              <motion.div key={village.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`relative mb-8 ${index % 2 === 0 ? 'ml-0 mr-auto' : 'ml-auto mr-0'}`} style={{ maxWidth: '45%' }}>
                <motion.div whileHover={status === 'unlocked' ? { scale: 1.02 } : undefined} whileTap={status === 'unlocked' ? { scale: 0.98 } : undefined} onClick={() => status === 'unlocked' && selectVillage(village)} className={`glass rounded-2xl p-6 relative cursor-pointer ${isBoss ? 'border-2 border-yellow-400/50' : ''} ${status === 'locked' ? 'opacity-50' : ''}`}>
                  {isBoss && <div className="absolute -top-3 -right-3 bg-yellow-400 rounded-full p-2"><Crown className="w-4 h-4 text-gray-900" /></div>}
                  {status === 'locked' && <div className="absolute top-3 right-3 bg-gray-700 rounded-full p-1"><Lock className="w-4 h-4 text-gray-400" /></div>}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isBoss ? 'bg-gradient-to-br from-yellow-400/30 to-orange-500/30' : 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30'}`}>
                      {isBoss ? <Shield className="w-6 h-6 text-yellow-400" /> : <div className="text-xl font-bold">{index + 1}</div>}
                    </div>
                    <div className="flex-1"><h3 className="font-semibold">{village.name}</h3><p className="text-sm text-[var(--text-muted)] line-clamp-1">{village.description}</p></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="flex items-center gap-1"><Zap className="w-3 h-3 text-green-400" /><span className="text-sm">+{village.xp_reward}</span></div><div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /><span className="text-sm">+{village.coin_reward}</span></div></div>
                    <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((level) => (<div key={level} className={`w-1.5 h-1.5 rounded-full ${level <= village.difficulty ? 'bg-yellow-400' : 'bg-gray-600'}`} />))}</div>
                  </div>
                </motion.div>
                <div className={`absolute top-1/2 w-4 h-4 rounded-full border-2 ${status === 'unlocked' ? 'bg-indigo-500 border-indigo-300' : 'bg-gray-700 border-gray-600'} transform -translate-y-1/2`} style={{ [index % 2 === 0 ? 'right' : 'left']: '-2.5rem' }} />
              </motion.div>
            );
          })}
        </div>
        {currentVillage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2">
            <div className="glass rounded-2xl p-4 text-center"><p className="text-sm text-[var(--text-muted)] mb-2">Ready to challenge</p><h3 className="font-semibold mb-3">{currentVillage.name}</h3><motion.button onClick={() => startBattle(currentVillage.id)} className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Start Battle</motion.button></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
