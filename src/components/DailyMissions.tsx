import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Coins, Gem, Zap, Check, Gift, Flame } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function DailyMissions() {
  const { missions, fetchMissions, claimMission } = useGameStore();

  useEffect(() => { fetchMissions(); }, [fetchMissions]);

  const handleClaim = async (userMissionId: string) => { await claimMission(userMissionId); };

  const missionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    questions: Target, xp: Zap, battles: Flame,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2"><Target className="w-5 h-5 text-indigo-400" />Daily Missions</h2>
        <span className="text-xs text-[var(--text-muted)]">Resets daily</span>
      </div>
      <div className="space-y-3">
        {missions.length === 0 && <p className="text-sm text-[var(--text-muted)] text-center py-4">No missions available today. Check back tomorrow!</p>}
        {missions.map((mission, i) => {
          const Icon = missionIcons[mission.mission_type] || Target;
          const progressPercent = Math.min(100, (mission.progress / mission.requirement) * 100);
          const canClaim = mission.is_completed && !mission.is_claimed;
          return (
            <motion.div key={mission.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`bg-[var(--surface)] rounded-xl p-4 ${mission.is_claimed ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mission.is_completed ? 'bg-green-500/20' : 'bg-indigo-500/20'}`}>
                  {mission.is_completed ? <Check className="w-5 h-5 text-green-400" /> : <Icon className="w-5 h-5 text-indigo-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{mission.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-green-400" />{mission.xp_reward}</span>
                    <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-yellow-400" />{mission.coin_reward}</span>
                    {mission.diamond_reward > 0 && <span className="flex items-center gap-1"><Gem className="w-3 h-3 text-purple-400" />{mission.diamond_reward}</span>}
                  </div>
                </div>
                <AnimatePresence>
                  {canClaim && (
                    <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => handleClaim(mission.user_mission_id!)} className="btn-primary px-4 py-2 flex items-center gap-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Gift className="w-4 h-4" /><span className="text-sm">Claim</span>
                    </motion.button>
                  )}
                  {mission.is_claimed && <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3" />Claimed</span>}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[var(--surface-light)] rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${mission.is_completed ? 'bg-green-500' : 'bg-indigo-500'}`} initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
                </div>
                <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{mission.progress}/{mission.requirement}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
