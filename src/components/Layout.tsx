import type { ReactNode } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Crown, Trophy, User, Zap, Menu, X, Swords, BookOpen, ShoppingCart, LogOut, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabase';

interface LayoutProps { children: ReactNode; activeView: string; onNavigate: (view: string) => void; }

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'kingdoms', icon: Crown, label: 'Kingdoms' },
  { id: 'multiplayer', icon: Swords, label: '1v1 Arena' },
  { id: 'friends', icon: Users, label: 'Friends' },
  { id: 'library', icon: BookOpen, label: 'Library' },
  { id: 'store', icon: ShoppingCart, label: 'Store' },
  { id: 'leaderboard', icon: Trophy, label: 'Ranks' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function Layout({ children, activeView, onNavigate }: LayoutProps) {
  const { profile, getCurrentRank } = useGameStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  if (!profile) return null;
  const rank = getCurrentRank();

  return (
    <div className="min-h-screen bg-[var(--background)] bg-pattern bg-stars">
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
            <motion.div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')} whileHover={{ scale: 1.02 }}>
              <Zap className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold gradient-text">AptiVerse</span>
            </motion.div>
            <nav className="flex items-center gap-1 flex-wrap">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <motion.button key={item.id} onClick={() => onNavigate(item.id)} className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-colors ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Icon className="w-4 h-4" /><span className="text-sm">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              {rank && <div className="flex items-center gap-1 text-sm" style={{ color: rank.color }}><span className="font-medium">{rank.name}</span></div>}
              <div className="flex items-center gap-1 text-sm"><Zap className="w-4 h-4 text-green-400" /><span className="font-medium">{profile.xp.toLocaleString()}</span></div>
              <div className="flex items-center gap-1 text-sm text-yellow-400"><span>🪙</span><span className="font-medium">{profile.coins.toLocaleString()}</span></div>
              <motion.button onClick={() => supabase.auth.signOut()} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Logout">
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="glass px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"><Zap className="w-6 h-6 text-indigo-400" /><span className="text-lg font-bold gradient-text">AptiVerse</span></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm glass px-3 py-1 rounded-lg"><Zap className="w-3 h-3 text-green-400" /><span>{profile.xp.toLocaleString()}</span></div>
            <motion.button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2" whileTap={{ scale: 0.9 }}>{showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</motion.button>
          </div>
        </div>
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass mx-4 mt-2 rounded-xl p-2 max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <motion.button key={item.id} onClick={() => { onNavigate(item.id); setShowMobileMenu(false); }} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 ${isActive ? 'bg-indigo-500/20' : ''}`} whileTap={{ scale: 0.98 }}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} /><span className={isActive ? 'text-indigo-400' : ''}>{item.label}</span>
                  </motion.button>
                );
              })}
              <motion.button onClick={() => { supabase.auth.signOut(); setShowMobileMenu(false); }} className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-red-400" whileTap={{ scale: 0.98 }}>
                <LogOut className="w-5 h-5" /><span>Logout</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20 md:pt-24 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{children}</motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass border-t border-white/5">
          <div className="flex justify-around py-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <motion.button key={item.id} onClick={() => onNavigate(item.id)} className="flex flex-col items-center p-2 min-w-[56px]" whileTap={{ scale: 0.9 }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-indigo-500/30 text-indigo-400' : 'text-[var(--text-muted)]'}`}><Icon className="w-4 h-4" /></div>
                  <span className={`text-[10px] mt-0.5 ${isActive ? 'text-indigo-400' : 'text-[var(--text-muted)]'}`}>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
