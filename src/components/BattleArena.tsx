import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Zap, X, Check, ArrowLeft, Swords, Sparkles, Lightbulb, Scissors, Shield, FastForward, RefreshCw, Coins, FlaskConical, Hourglass } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const powerUpIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors, clock: Hourglass, heart: Heart, lightbulb: Lightbulb, zap: Zap,
  'fast-forward': FastForward, 'refresh-cw': RefreshCw, shield: Shield, coins: Coins, gem: FlaskConical,
};

export function BattleArena() {
  const { battle, answerQuestion, nextQuestion, currentVillage, currentKingdom, selectVillage, selectKingdom, usePowerUp, userPowerUps, powerUps } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showPowerUpMenu, setShowPowerUpMenu] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [bossExplosion, setBossExplosion] = useState(false);
  const question = battle.question;
  const totalQuestions = battle.answers.length + 1;
  const correctCount = battle.answers.filter((a) => a.correct).length;

  useEffect(() => {
    if (!question || showResult) return;
    const timer = setInterval(() => { setTimeLeft((prev) => { if (prev <= 1) { handleTimeUp(); return 0; } return prev - 1; }); }, 1000);
    return () => clearInterval(timer);
  }, [question, showResult]);

  useEffect(() => { if (question) setTimeLeft(question.time_limit_seconds); }, [question]);

  const handleTimeUp = useCallback(() => { if (!selectedAnswer && question) { setShowResult(true); setIsCorrect(false); } }, [selectedAnswer, question]);

  const handleAnswer = async (answer: string) => {
    if (showResult || !question) return;
    setSelectedAnswer(answer);
    const correct = await answerQuestion(answer);
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) { setEnemyShake(true); setTimeout(() => setEnemyShake(false), 500); }
    else { setScreenShake(true); setTimeout(() => setScreenShake(false), 400); }
  };

  const handleNext = async () => {
    if (battle.isBoss && battle.enemyHealth <= 0) { setBossExplosion(true); setTimeout(() => { setSelectedAnswer(null); setShowResult(false); setBossExplosion(false); }, 800); }
    setSelectedAnswer(null); setShowResult(false); await nextQuestion();
  };
  const handleExit = () => { if (currentVillage) selectVillage(null); if (currentKingdom) selectKingdom(null); };

  if (!question || !currentVillage) return null;

  const options = [{ key: 'A', value: question.option_a }, { key: 'B', value: question.option_b }, { key: 'C', value: question.option_c }, { key: 'D', value: question.option_d }].filter((opt) => opt.value && !battle.removedOptions.includes(opt.key));
  const healthPercentage = (battle.currentHealth / battle.maxHealth) * 100;
  const enemyHealthPercentage = (battle.enemyHealth / battle.enemyMaxHealth) * 100;

  const getOptionClasses = (key: string) => {
    if (!showResult) return selectedAnswer === key ? 'selected' : '';
    if (key === question.correct_answer) return 'correct';
    if (key === selectedAnswer && key !== question.correct_answer) return 'incorrect';
    return '';
  };

  const handleUsePowerUp = async (puId: string) => {
    const ok = await usePowerUp(puId);
    if (ok) setShowPowerUpMenu(false);
  };

  const ownedPowerUps = powerUps.filter(pu => {
    const owned = userPowerUps.find(u => u.power_up_id === pu.id);
    return owned && owned.quantity > 0;
  });

  return (
    <div className={`min-h-screen bg-[var(--background)] bg-pattern bg-stars py-4 ${screenShake ? 'animate-pulse' : ''}`} style={screenShake ? { animation: 'shake 0.4s' } : {}}>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }`}</style>
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
          <button onClick={handleExit} className="p-2 glass rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
          <div className="glass rounded-xl px-4 py-2"><span className="text-sm text-[var(--text-muted)]">{currentVillage.name} - Q{totalQuestions}</span></div>
          <motion.button onClick={() => setShowPowerUpMenu(!showPowerUpMenu)} className="glass rounded-xl px-3 py-2 flex items-center gap-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Sparkles className="w-4 h-4 text-indigo-400" /><span className="text-sm font-medium">{ownedPowerUps.length}</span>
          </motion.button>
        </motion.div>

        <AnimatePresence>{showPowerUpMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass rounded-2xl p-4 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" />Power-ups</h3>
            <div className="grid grid-cols-2 gap-2">
              {ownedPowerUps.length === 0 && <p className="text-sm text-[var(--text-muted)] col-span-2 text-center py-4">No power-ups. Visit the Store!</p>}
              {ownedPowerUps.map((pu) => {
                const Icon = powerUpIcons[pu.icon] || Sparkles;
                const qty = userPowerUps.find(u => u.power_up_id === pu.id)?.quantity || 0;
                return (
                  <motion.button key={pu.id} onClick={() => handleUsePowerUp(pu.id)} className="bg-[var(--surface)] rounded-xl p-3 flex items-center gap-2 text-left" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Icon className="w-4 h-4 text-indigo-400" /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{pu.name}</p><p className="text-xs text-[var(--text-muted)]">x{qty}</p></div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}</AnimatePresence>

        <div className="space-y-3 mb-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2"><Heart className="w-4 h-4 text-red-400" /><span className="text-sm">Your Health</span><span className="ml-auto text-sm">{battle.currentHealth}/{battle.maxHealth}</span></div>
            <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden"><motion.div className="h-full health-bar rounded-full" initial={{ width: '100%' }} animate={{ width: `${healthPercentage}%` }} transition={{ duration: 0.3 }} /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <motion.div animate={enemyShake ? { x: [-5, 5, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}>
                {battle.isBoss ? <Swords className="w-5 h-5 text-yellow-400" /> : <Swords className="w-4 h-4 text-indigo-400" />}
              </motion.div>
              <span className="text-sm">{battle.isBoss ? 'Boss Golem' : 'Enemy Golem'}</span>
              <span className="ml-auto text-sm">{battle.enemyHealth}/{battle.enemyMaxHealth}</span>
            </div>
            <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: battle.isBoss ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #6366f1, #a855f7)' }} initial={{ width: '100%' }} animate={{ width: `${enemyHealthPercentage}%` }} transition={{ duration: 0.3 }} />
            </div>
            {bossExplosion && (
              <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.8 }} className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-6xl">💥</div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 flex items-center justify-center">
          <div className="glass rounded-full px-6 py-3 flex items-center gap-3">
            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`} />
            <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : ''}`}>{timeLeft}s</span>
            {battle.shieldActive && <Shield className="w-4 h-4 text-green-400" />}
            {battle.doubleXpNext && <Zap className="w-4 h-4 text-yellow-400" />}
          </div>
        </motion.div>

        <motion.div key={question.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4 text-sm text-[var(--text-muted)]">
            <span className="px-2 py-1 bg-indigo-500/20 rounded-lg">{currentVillage.name}</span>
            <span>Difficulty: {[1, 2, 3, 4, 5].map((d) => d <= question.difficulty ? '⭐' : '☆').join('')}</span>
          </div>
          <h2 className="text-lg font-medium mb-6">{question.question_text}</h2>
          {battle.hintRevealed && question.explanation && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-yellow-500/10 rounded-xl p-3 mb-4">
              <p className="text-sm flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400" />Hint: {question.explanation.slice(0, 80)}...</p>
            </motion.div>
          )}
          <div className="space-y-3">
            {options.map((option, i) => (
              <motion.button key={option.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} onClick={() => handleAnswer(option.key)} disabled={showResult} className={`option-card w-full text-left flex items-center gap-4 ${getOptionClasses(option.key)}`} whileHover={!showResult ? { scale: 1.01 } : undefined}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${showResult && option.key === question.correct_answer ? 'bg-green-500 text-white' : showResult && option.key === selectedAnswer && option.key !== question.correct_answer ? 'bg-red-500 text-white' : 'bg-[var(--surface-light)]'}`}>
                  {showResult && option.key === question.correct_answer ? <Check className="w-5 h-5" /> : showResult && option.key === selectedAnswer && option.key !== question.correct_answer ? <X className="w-5 h-5" /> : option.key}
                </div>
                <span className="flex-1">{option.value}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>{showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              {isCorrect ? (
                <><div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><Check className="w-5 h-5 text-green-400" /></div><div><p className="font-semibold text-green-400">Correct!</p><p className="text-sm text-[var(--text-muted)]">+{question.xp_reward}{battle.doubleXpNext ? ' x2' : ''} XP, +{question.coin_reward}{battle.tripleCoinsNext ? ' x3' : ''} coins</p></div></>
              ) : (
                <><div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"><X className="w-5 h-5 text-red-400" /></div><div><p className="font-semibold text-red-400">Incorrect</p><p className="text-sm text-[var(--text-muted)]">{battle.shieldActive ? 'Shield blocked!' : '-20 HP'}</p></div></>
              )}
            </div>
            {question.explanation && <div className="bg-[var(--surface)] rounded-xl p-4 mb-4"><p className="text-sm"><span className="font-medium text-indigo-400">Explanation: </span>{question.explanation}</p></div>}
            <motion.button onClick={handleNext} className="btn-primary flex-1 w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{totalQuestions >= 10 ? 'Finish Battle' : 'Next Question'}</motion.button>
          </motion.div>
        )}</AnimatePresence>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-around text-center">
            <div><p className="text-2xl font-bold text-indigo-400">{totalQuestions}</p><p className="text-xs text-[var(--text-muted)]">Questions</p></div>
            <div className="w-px h-10 bg-white/10" />
            <div><p className="text-2xl font-bold text-green-400">{correctCount}</p><p className="text-xs text-[var(--text-muted)]">Correct</p></div>
            <div className="w-px h-10 bg-white/10" />
            <div><p className="text-2xl font-bold text-yellow-400">{battle.streak}</p><p className="text-xs text-[var(--text-muted)]">Streak</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
