import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp, loading } = useGameStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      if (isSignUp) {
        if (!username.trim()) { setError('Username is required'); return; }
        await signUp(email, password, username);
      } else { await signIn(email, password); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Authentication failed'); }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 bg-pattern bg-stars">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
          <div className="relative z-10">
            <motion.div className="text-center mb-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-float" />
                <h1 className="text-4xl font-bold gradient-text">AptiVerse</h1>
              </div>
              <p className="text-[var(--text-muted)] mt-2">{isSignUp ? 'Begin Your Adventure' : 'Continue Your Journey'}</p>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.form key={isSignUp ? 'signup' : 'signin'} initial={{ opacity: 0, x: isSignUp ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isSignUp ? -20 : 20 }} onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" /><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input-game pl-12" /></div>}
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" /><input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-game pl-12" required /></div>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-game pl-12" required minLength={6} /></div>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</motion.p>}
                <motion.button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isSignUp ? 'Create Account' : 'Sign In'}</>}
                </motion.button>
              </motion.form>
            </AnimatePresence>
            <div className="mt-6 text-center"><button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-[var(--text-muted)] hover:text-indigo-400 transition-colors">{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}</button></div>
          </div>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-4 text-sm text-[var(--text-muted)]">Master aptitude through epic adventures</motion.p>
      </div>
    </div>
  );
}
