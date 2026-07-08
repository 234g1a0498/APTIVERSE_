import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Radio, Smile, Laugh, Lightbulb, ThumbsUp, Bot, Users, Zap, Heart, Timer, Crown, ArrowLeft, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useFriendsStore } from '../store/friendsStore';

type MpMode = 'ai' | 'friend';
type MpDifficulty = 'easy' | 'medium' | 'advanced';

interface Props {
  onBack: () => void;
}

export function MultiplayerArena({ onBack }: Props) {
  const { multiplayer, startMultiplayerMatch, cancelMultiplayerMatch, multiplayerAnswer, multiplayerBotTick, endMultiplayerMatch, sendEmote } = useGameStore();
  const { friends } = useFriendsStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedMode, setSelectedMode] = useState<MpMode | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<MpDifficulty>('medium');
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (multiplayer.matchPhase === 'playing') {
      tickRef.current = setInterval(() => {
        multiplayerBotTick();
        const mp = useGameStore.getState().multiplayer;
        if (mp.userHealth <= 0 || mp.opponentHealth <= 0) { if (tickRef.current) clearInterval(tickRef.current); }
      }, 1500);
      timerRef.current = setInterval(() => {
        const mp = useGameStore.getState().multiplayer;
        if (mp.timeLeft <= 1) { if (timerRef.current) clearInterval(timerRef.current); endMultiplayerMatch(); }
        else useGameStore.setState((s) => ({ multiplayer: { ...s.multiplayer, timeLeft: s.multiplayer.timeLeft - 1 } }));
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); if (timerRef.current) clearInterval(timerRef.current); };
  }, [multiplayer.matchPhase]);

  const q = multiplayer.currentQuestion;
  const handleAnswer = (answer: string) => {
    if (showResult || !q) return;
    setSelectedAnswer(answer);
    multiplayerAnswer(answer);
    setShowResult(true);
  };
  const handleNext = () => {
    setSelectedAnswer(null); setShowResult(false);
    const mp = useGameStore.getState().multiplayer;
    if (mp.userHealth <= 0 || mp.opponentHealth <= 0 || mp.questionIndex + 1 >= mp.totalQuestions) { endMultiplayerMatch(); }
    else {
      useGameStore.setState((s) => ({
        multiplayer: {
          ...s.multiplayer,
          questionIndex: s.multiplayer.questionIndex + 1,
          currentQuestion: s.multiplayer.questionQueue[s.multiplayer.questionIndex + 1],
          timeLeft: 60,
          botAnswerTimer: Math.floor(Math.random() * 5) + 3,
        },
      }));
    }
  };

  const resetAll = () => {
    cancelMultiplayerMatch();
    setSelectedAnswer(null);
    setShowResult(false);
    setSelectedMode(null);
    setSelectedFriendId(null);
    setShowQuitConfirm(false);
  };

  const startMatch = () => {
    if (selectedMode === 'friend' && selectedFriendId) {
      const friend = friends.find(f => f.user_id === selectedFriendId);
      startMultiplayerMatch('friend', selectedDifficulty, friend?.display_name || friend?.username || 'Friend', 'linear-gradient(135deg, #f43f5e, #ec4899)', selectedFriendId);
    } else {
      startMultiplayerMatch('ai', selectedDifficulty);
    }
  };

  if (multiplayer.matchPhase === 'idle') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <motion.button onClick={onBack} className="p-2 glass rounded-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><ArrowLeft className="w-5 h-5" /></motion.button>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-2"><Swords className="w-8 h-8" />1v1 Arena</h1>
            <p className="text-[var(--text-muted)]">Battle with HP system - answer fast, deal damage, win glory!</p>
          </motion.div>
          <div className="w-9" />
        </div>

        <AnimatePresence mode="wait">
          {!selectedMode && (
            <motion.div key="mode-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <motion.button onClick={() => setSelectedMode('ai')} className="glass rounded-3xl p-8 text-center" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Bot className="w-10 h-10 text-white" /></motion.div>
                <h2 className="text-xl font-semibold mb-2">vs AI</h2>
                <p className="text-sm text-[var(--text-muted)]">Quick match against AI opponent</p>
              </motion.button>
              <motion.button onClick={() => setSelectedMode('friend')} className="glass rounded-3xl p-8 text-center" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center"><Users className="w-10 h-10 text-white" /></motion.div>
                <h2 className="text-xl font-semibold mb-2">vs Friend</h2>
                <p className="text-sm text-[var(--text-muted)]">Challenge your friends directly</p>
              </motion.button>
            </motion.div>
          )}

          {selectedMode && !selectedFriendId && selectedMode === 'friend' && (
            <motion.div key="friend-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-3 mb-4">
                <motion.button onClick={() => setSelectedMode(null)} className="text-sm text-[var(--text-muted)] hover:text-white" whileTap={{ scale: 0.95 }}>&larr; Back</motion.button>
                <h2 className="text-lg font-semibold">Select Friend</h2>
              </div>
              {friends.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center"><Users className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" /><p className="text-[var(--text-muted)] mb-4">No friends yet. Add friends first!</p><p className="text-sm text-indigo-400">Go to Friends tab to add friends</p></div>
              ) : (
                <div className="grid gap-3 max-w-2xl mx-auto">
                  {friends.map((f) => (
                    <motion.button key={f.user_id} onClick={() => setSelectedFriendId(f.user_id)} className={`glass rounded-2xl p-4 flex items-center gap-4 text-left ${selectedFriendId === f.user_id ? 'ring-2 ring-rose-500' : ''}`} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-bold text-white">{(f.display_name || f.username || '?')[0].toUpperCase()}</div>
                      <div className="flex-1"><p className="font-medium">{f.display_name || f.username}</p><p className="text-xs text-[var(--text-muted)]">Lv.{f.level} - {f.multiplayer_wins}W {f.multiplayer_losses}L</p></div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {selectedMode && (selectedMode === 'ai' || selectedFriendId) && (
            <motion.div key="difficulty-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <motion.button onClick={() => { setSelectedMode(null); setSelectedFriendId(null); }} className="text-sm text-[var(--text-muted)] hover:text-white" whileTap={{ scale: 0.95 }}>&larr; Back</motion.button>
                <h2 className="text-lg font-semibold">Choose Difficulty</h2>
              </div>
              <div className="grid gap-4">
                {([
                  { id: 'easy' as const, label: 'Easy', desc: '200 HP - Simpler questions', color: 'from-green-500 to-emerald-600', hp: 200 },
                  { id: 'medium' as const, label: 'Medium', desc: '250 HP - Moderate questions', color: 'from-blue-500 to-cyan-600', hp: 250 },
                  { id: 'advanced' as const, label: 'Advanced', desc: '300 HP - Hardest questions', color: 'from-rose-500 to-red-600', hp: 300 },
                ]).map((d) => (
                  <motion.button key={d.id} onClick={() => setSelectedDifficulty(d.id)} className={`glass rounded-2xl p-5 flex items-center gap-4 text-left ${selectedDifficulty === d.id ? 'ring-2 ring-indigo-500' : ''}`} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center`}><Heart className="w-7 h-7 text-white" /></div>
                    <div className="flex-1"><p className="font-semibold text-lg">{d.label}</p><p className="text-sm text-[var(--text-muted)]">{d.desc}</p></div>
                    <div className="text-right"><p className="text-2xl font-bold text-indigo-400">{d.hp}</p><p className="text-xs text-[var(--text-muted)]">HP</p></div>
                  </motion.button>
                ))}
              </div>
              <motion.button onClick={startMatch} className="btn-primary w-full mt-6 py-4 text-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Start Battle</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (multiplayer.matchPhase === 'searching') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500" />
            <div className="absolute inset-4 rounded-full border-4 border-purple-500/20" />
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-purple-500" />
            <Radio className="absolute inset-0 m-auto w-8 h-8 text-indigo-400" />
          </motion.div>
          <h2 className="text-xl font-semibold mb-2">{selectedMode === 'friend' ? 'Connecting with friend...' : 'Finding Opponent...'}</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">Preparing the battlefield</p>
          <motion.button onClick={() => { cancelMultiplayerMatch(); setSelectedMode(null); setSelectedFriendId(null); }} className="text-sm text-red-400 hover:text-red-300" whileTap={{ scale: 0.95 }}>Cancel</motion.button>
        </motion.div>
      </div>
    );
  }

  if (multiplayer.matchPhase === 'found') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: multiplayer.opponentAvatar || 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{multiplayer.opponentName[0]}</motion.div>
          <h2 className="text-xl font-semibold mb-1">{multiplayer.opponentName}</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">{multiplayer.mode === 'ai' ? 'AI Opponent' : 'Friend'} - {multiplayer.difficulty} mode</p>
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-1 bg-indigo-500 rounded-full mx-auto max-w-xs" />
          <p className="text-xs text-[var(--text-muted)] mt-2">Starting battle...</p>
        </motion.div>
      </div>
    );
  }

  if (multiplayer.matchPhase === 'result') {
    const win = multiplayer.result === 'win';
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 text-center max-w-md w-full">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }} className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: win ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {win ? <Crown className="w-12 h-12 text-gray-900" /> : <Trophy className="w-12 h-12 text-white" />}
          </motion.div>
          <h2 className={`text-2xl font-bold mb-2 ${win ? 'text-yellow-400' : 'text-indigo-400'}`}>{win ? 'Victory!' : multiplayer.result === 'draw' ? 'Draw!' : 'Defeat'}</h2>
          <p className="text-[var(--text-muted)] mb-4">vs {multiplayer.opponentName}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[var(--surface)] rounded-xl p-3"><p className="text-2xl font-bold text-indigo-400">{multiplayer.userScore}</p><p className="text-xs text-[var(--text-muted)]">Your Score</p></div>
            <div className="bg-[var(--surface)] rounded-xl p-3"><p className="text-2xl font-bold text-red-400">{multiplayer.opponentScore}</p><p className="text-xs text-[var(--text-muted)]">Opponent</p></div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-green-400"><Zap className="w-4 h-4" /><span className="font-bold">+{win ? 50 : 25} XP</span></div>
            <div className="flex items-center gap-1 text-yellow-400"><span className="text-lg">🪙</span><span className="font-bold">+{win ? 100 : 50}</span></div>
          </div>
          <div className="flex gap-3">
            <motion.button onClick={resetAll} className="btn-secondary flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Play Again</motion.button>
            <motion.button onClick={() => { resetAll(); onBack(); }} className="btn-primary flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Back to Home</motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (multiplayer.matchPhase === 'playing' && q) {
    const options = [{ key: 'A', value: q.option_a }, { key: 'B', value: q.option_b }, { key: 'C', value: q.option_c }, { key: 'D', value: q.option_d }].filter(o => o.value);
    const userHp = multiplayer.userHealth;
    const oppHp = multiplayer.opponentHealth;
    const userHpPct = (userHp / multiplayer.userMaxHealth) * 100;
    const oppHpPct = (oppHp / multiplayer.opponentMaxHealth) * 100;
    return (
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button onClick={() => setShowQuitConfirm(true)} className="p-2 glass rounded-xl text-red-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Quit match"><X className="w-5 h-5" /></motion.button>
          <p className="text-sm font-medium text-[var(--text-muted)]">{multiplayer.mode === 'ai' ? 'vs AI' : 'vs Friend'}</p>
          <div className="w-9" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">YOU</div><div className="flex-1"><p className="text-sm font-medium">You</p><p className="text-xs text-[var(--text-muted)]">Score: {multiplayer.userScore}</p></div></div>
            <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden"><motion.div className="h-full health-bar rounded-full" animate={{ width: `${userHpPct}%` }} /></div>
            <p className="text-xs text-right mt-1 text-[var(--text-muted)]"><Heart className="w-3 h-3 inline text-red-400" /> {userHp} HP</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-3 relative">
            <AnimatePresence>{multiplayer.opponentEmote && (
              <motion.div initial={{ opacity: 0, scale: 0.5, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute -top-2 -right-2 glass rounded-full p-2 z-10">
                <span className="text-lg">{multiplayer.opponentEmote === 'laugh' ? '😂' : multiplayer.opponentEmote === 'mind-blown' ? '🤯' : multiplayer.opponentEmote === 'cool' ? '😎' : '😅'}</span>
              </motion.div>
            )}</AnimatePresence>
            <div className="flex items-center gap-2 mb-2"><div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: multiplayer.opponentAvatar }}>{multiplayer.opponentName[0]}</div><div className="flex-1"><p className="text-sm font-medium">{multiplayer.opponentName}</p><p className="text-xs text-[var(--text-muted)]">Score: {multiplayer.opponentScore}</p></div></div>
            <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #ef4444, #f87171)' }} animate={{ width: `${oppHpPct}%` }} /></div>
            <p className="text-xs text-right mt-1 text-[var(--text-muted)]"><Heart className="w-3 h-3 inline text-red-400" /> {oppHp} HP</p>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="glass rounded-full px-4 py-2"><span className="text-sm font-medium">Q{multiplayer.questionIndex + 1}/{multiplayer.totalQuestions}</span></div>
          <motion.div animate={{ scale: multiplayer.timeLeft <= 10 ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.5, repeat: multiplayer.timeLeft <= 10 ? Infinity : 0 }} className={`glass rounded-full px-4 py-2 ${multiplayer.timeLeft <= 10 ? 'text-red-400' : ''}`}><Timer className="w-4 h-4 inline mr-1" /><span className="text-sm font-medium">{multiplayer.timeLeft}s</span></motion.div>
        </div>

        <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-medium mb-6">{q.question_text}</h2>
          <div className="space-y-3">
            {options.map((option, i) => (
              <motion.button key={option.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} onClick={() => handleAnswer(option.key)} disabled={showResult} className={`option-card w-full text-left flex items-center gap-4 ${showResult ? (option.key === q.correct_answer ? 'correct' : option.key === selectedAnswer ? 'incorrect' : '') : ''}`} whileHover={!showResult ? { scale: 1.01 } : undefined}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold bg-[var(--surface-light)]">{option.key}</div>
                <span className="flex-1">{option.value}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-4">
          {[{ e: 'smile', icon: Smile, emoji: '😄' }, { e: 'laugh', icon: Laugh, emoji: '😂' }, { e: 'mind', icon: Lightbulb, emoji: '🤯' }, { e: 'thumbs', icon: ThumbsUp, emoji: '👍' }].map((em) => (
            <motion.button key={em.e} onClick={() => sendEmote(em.e)} className="glass rounded-xl p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><span className="text-xl">{em.emoji}</span></motion.button>
          ))}
        </div>

        <AnimatePresence>{multiplayer.emote && (
          <motion.div initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-24 left-4 glass rounded-full p-3 z-50">
            <span className="text-2xl">{multiplayer.emote === 'smile' ? '😄' : multiplayer.emote === 'laugh' ? '😂' : multiplayer.emote === 'mind' ? '🤯' : '👍'}</span>
          </motion.div>
        )}</AnimatePresence>

        <AnimatePresence>{showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-4">
            {q.explanation && <p className="text-sm mb-4"><span className="font-medium text-indigo-400">Explanation: </span>{q.explanation}</p>}
            <motion.button onClick={handleNext} className="btn-primary w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{multiplayer.questionIndex + 1 >= multiplayer.totalQuestions ? 'See Results' : 'Next Question'}</motion.button>
          </motion.div>
        )}</AnimatePresence>

        <AnimatePresence>{showQuitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowQuitConfirm(false)}>
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8 }} className="glass rounded-3xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-2">Quit Match?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">You will lose this match if you quit now.</p>
              <div className="flex gap-3">
                <motion.button onClick={() => setShowQuitConfirm(false)} className="btn-secondary flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Stay</motion.button>
                <motion.button onClick={() => { resetAll(); onBack(); }} className="btn-primary flex-1 !bg-red-500/20 !text-red-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Quit</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}</AnimatePresence>
      </div>
    );
  }
  return null;
}
