import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Lock, Shield, Star, Zap, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Database } from '../lib/supabase';

type Village = Database['public']['Tables']['villages']['Row'];

export function SagaMap() {
  const { currentKingdom, villages, currentVillage, selectVillage, startBattle, fetchVillages, profile } = useGameStore();
  useEffect(() => { if (currentKingdom) fetchVillages(currentKingdom.id); }, [currentKingdom, fetchVillages]);
  if (!currentKingdom) return null;

  const userXp = profile?.xp ?? 0;
  const getVillageStatus = (village: Village) => {
    if (village.required_xp <= userXp) return 'unlocked';
    return 'locked';
  };

  const zones: { name: string; order: number; villages: Village[] }[] = [];
  villages.forEach((v) => {
    const zoneName = v.zone || 'Main';
    const zoneOrder = v.zone_order || 0;
    let zone = zones.find((z) => z.name === zoneName);
    if (!zone) { zone = { name: zoneName, order: zoneOrder, villages: [] }; zones.push(zone); }
    zone.villages.push(v);
  });
  zones.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[var(--background)] bg-pattern bg-stars">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectVillage(null)} className="p-2 glass rounded-xl"><ArrowLeft className="w-5 h-5" /></motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: currentKingdom.color }}>{currentKingdom.name}</h1>
            <p className="text-[var(--text-muted)] text-sm">{currentKingdom.description}</p>
          </div>
        </div>

        {zones.map((zone, zoneIdx) => (
          <div key={zone.name} className="mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: zoneIdx * 0.1 }} className="glass rounded-xl px-4 py-3 mb-6 flex items-center gap-3" style={{ borderLeft: `4px solid ${currentKingdom.color}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${currentKingdom.color}30` }}>
                <span className="text-sm font-bold" style={{ color: currentKingdom.color }}>{zoneIdx + 1}</span>
              </div>
              <div>
                <h2 className="font-semibold text-lg">{zone.name}</h2>
                <p className="text-xs text-[var(--text-muted)]">{zone.villages.length} topics</p>
              </div>
            </motion.div>

            <div className="relative ml-4">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b opacity-30" style={{ background: `linear-gradient(to bottom, ${currentKingdom.color}, transparent)` }} />
              {zone.villages.map((village, index) => {
                const status = getVillageStatus(village);
                const isBoss = village.is_boss_level;
                return (
                  <motion.div key={village.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: zoneIdx * 0.1 + index * 0.05 }} className="relative mb-4 pl-8">
                    <div className={`absolute left-[-7px] top-4 w-3 h-3 rounded-full border-2 ${status === 'unlocked' ? '' : 'bg-gray-700 border-gray-600'}`} style={status === 'unlocked' ? { background: currentKingdom.color, borderColor: currentKingdom.color } : {}} />
                    <motion.div whileHover={status === 'unlocked' ? { scale: 1.02 } : undefined} whileTap={status === 'unlocked' ? { scale: 0.98 } : undefined} onClick={() => status === 'unlocked' && selectVillage(village)} className={`glass rounded-2xl p-5 relative cursor-pointer ${isBoss ? 'border-2 border-yellow-400/50' : ''} ${status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isBoss && <div className="absolute -top-3 -right-3 bg-yellow-400 rounded-full p-2"><Crown className="w-4 h-4 text-gray-900" /></div>}
                      {status === 'locked' && <div className="absolute top-3 right-3 bg-gray-700 rounded-full p-1.5"><Lock className="w-3.5 h-3.5 text-gray-400" /></div>}
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isBoss ? 'bg-gradient-to-br from-yellow-400/30 to-orange-500/30' : ''}`} style={!isBoss ? { background: `linear-gradient(135deg, ${currentKingdom.color}40, ${currentKingdom.color}20)` } : {}}>
                          {isBoss ? <Shield className="w-5 h-5 text-yellow-400" /> : <span className="font-bold text-sm" style={{ color: currentKingdom.color }}>{village.order_index}</span>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{village.name}</h3>
                          <p className="text-sm text-[var(--text-muted)] line-clamp-1">{village.description}</p>
                        </div>
                        {status === 'unlocked' && <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-green-400" /><span className="text-xs">+{village.xp_reward}</span></div>
                          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /><span className="text-xs">+{village.coin_reward}</span></div>
                        </div>
                        <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((lvl) => (<div key={lvl} className={`w-1.5 h-1.5 rounded-full ${lvl <= village.difficulty ? 'bg-yellow-400' : 'bg-gray-600'}`} />))}</div>
                      </div>
                      {status === 'locked' && <p className="text-xs text-orange-400 mt-2">Requires {village.required_xp} XP</p>}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {currentVillage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="glass rounded-2xl p-4 text-center min-w-[280px]">
              <p className="text-sm text-[var(--text-muted)] mb-1">Ready to challenge</p>
              <h3 className="font-semibold mb-3">{currentVillage.name}</h3>
              <motion.button onClick={() => startBattle(currentVillage.id)} className="btn-primary w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {currentVillage.is_boss_level ? 'Fight Boss' : 'Start Battle'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
