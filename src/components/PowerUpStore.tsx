import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Coins, Gem, Check, ShoppingCart, Package } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function PowerUpStore() {
  const { powerUps, userPowerUps, profile, buyPowerUp, fetchPowerUps, fetchUserPowerUps } = useGameStore();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => { fetchPowerUps(); fetchUserPowerUps(); }, [fetchPowerUps, fetchUserPowerUps]);

  const powerUpIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    scissors: Sparkles, clock: Sparkles, heart: Sparkles, lightbulb: Sparkles, zap: Sparkles,
    'fast-forward': Sparkles, 'refresh-cw': Sparkles, shield: Sparkles, coins: Sparkles, gem: Sparkles,
  };

  const handleBuy = async (puId: string, name: string) => {
    setBuyingId(puId);
    const ok = await buyPowerUp(puId);
    if (ok) { setSuccessMsg(`Purchased ${name}!`); setTimeout(() => setSuccessMsg(null), 2000); }
    setBuyingId(null);
  };

  const getOwnedQty = (puId: string) => userPowerUps.find(u => u.power_up_id === puId)?.quantity || 0;
  const canAfford = (pu: any) => (profile?.coins ?? 0) >= pu.cost_coins && (profile?.diamonds ?? 0) >= pu.cost_diamonds;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-2"><ShoppingCart className="w-8 h-8" />Power-up Store</h1>
        <p className="text-[var(--text-muted)]">Spend your hard-earned coins on battle power-ups</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-4 mb-6 flex items-center justify-around">
        <div className="flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-400" /><span className="text-xl font-bold">{profile?.coins.toLocaleString() || 0}</span><span className="text-sm text-[var(--text-muted)]">coins</span></div>
        <div className="flex items-center gap-2"><Gem className="w-5 h-5 text-purple-400" /><span className="text-xl font-bold">{profile?.diamonds || 0}</span><span className="text-sm text-[var(--text-muted)]">diamonds</span></div>
      </motion.div>

      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-xl p-3 mb-6 text-center border border-green-500/30">
          <p className="text-green-400 flex items-center justify-center gap-2"><Check className="w-4 h-4" />{successMsg}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {powerUps.map((pu, i) => {
          const Icon = powerUpIcons[pu.icon] || Sparkles;
          const owned = getOwnedQty(pu.id);
          const affordable = canAfford(pu);
          return (
            <motion.div key={pu.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center"><Icon className="w-6 h-6 text-indigo-400" /></div>
                <div className="flex-1"><h3 className="font-semibold">{pu.name}</h3><p className="text-xs text-[var(--text-muted)] mt-0.5">{pu.description}</p></div>
                {owned > 0 && <div className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-lg"><Package className="w-3 h-3" />{owned}</div>}
              </div>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                  {pu.cost_diamonds > 0 ? (
                    <div className="flex items-center gap-1 text-purple-400"><Gem className="w-4 h-4" /><span className="font-bold">{pu.cost_diamonds}</span></div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-400"><Coins className="w-4 h-4" /><span className="font-bold">{pu.cost_coins}</span></div>
                  )}
                  {pu.cost_coins > 0 && pu.cost_diamonds > 0 && <div className="flex items-center gap-1 text-yellow-400"><Coins className="w-4 h-4" /><span className="font-bold">{pu.cost_coins}</span></div>}
                </div>
                <motion.button onClick={() => handleBuy(pu.id, pu.name)} disabled={!affordable || buyingId === pu.id} className={`btn-primary w-full ${!affordable ? 'opacity-50 cursor-not-allowed' : ''}`} whileHover={affordable ? { scale: 1.02 } : undefined} whileTap={affordable ? { scale: 0.98 } : undefined}>
                  {buyingId === pu.id ? '...' : affordable ? 'Buy' : 'Not enough'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
