import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroProps { onComplete: () => void; }

export function Intro({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 600));
    timers.push(setTimeout(() => setPhase(2), 1600));
    timers.push(setTimeout(() => setPhase(3), 2600));
    timers.push(setTimeout(() => setPhase(4), 3600));
    timers.push(setTimeout(() => setExit(true), 4600));
    timers.push(setTimeout(() => onComplete(), 5200));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden gap-6"
          style={{ background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)' }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated grid background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.5, opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 50%)',
            }}
          />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-indigo-400"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight - 100],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            />
          ))}

          {/* APTIVERSE title — above logo */}
          <motion.h1
            className="relative z-10 text-5xl md:text-7xl font-black tracking-tighter"
            initial={{ y: -30, opacity: 0, filter: 'blur(20px)' }}
            animate={phase >= 1 ? { y: 0, opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block">
              {'APTIVERSE'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: -20, rotateX: -90 }}
                  animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 200 }}
                  style={{
                    background: 'linear-gradient(135deg, #818cf8, #c084fc, #f0abfc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 20px rgba(129,140,248,0.5))',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Lightning bolt logo — center */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
                  <motion.path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="white"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </svg>
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 blur-xl opacity-50"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Created By + Caption — below logo */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Created By */}
            <motion.p
              className="text-sm md:text-base text-slate-400 tracking-widest uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Created By
              </motion.span>
              <motion.span
                className="ml-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                initial={{ scale: 0.8 }}
                animate={phase >= 2 ? { scale: 1 } : {}}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                SAI_BALAJI_23_
              </motion.span>
            </motion.p>

            {/* Caption */}
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={phase >= 3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <motion.div
                className="absolute inset-0 blur-2xl opacity-50"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <p className="relative text-lg md:text-2xl font-light tracking-wide text-slate-200 px-8 py-3">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={phase >= 3 ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  Think Faster.
                </motion.span>
                <motion.span
                  className="inline-block ml-2 font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                  initial={{ opacity: 0 }}
                  animate={phase >= 4 ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  Solve Smarter.
                </motion.span>
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-0.5 bg-slate-700 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={phase >= 4 ? { opacity: 1 } : {}}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          {/* Corner accents */}
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-indigo-500/30 rounded-tl-3xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/30 rounded-br-3xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
