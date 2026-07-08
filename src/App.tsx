import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { SagaMap } from './components/SagaMap';
import { BattleArena } from './components/BattleArena';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Layout } from './components/Layout';
import { KingdomsGrid } from './components/KingdomsGrid';
import { GrandLibrary } from './components/GrandLibrary';
import { PowerUpStore } from './components/PowerUpStore';
import { MultiplayerArena } from './components/MultiplayerArena';
import { Friends } from './components/Friends';
import { Intro } from './components/Intro';
import type { Database } from './lib/supabase';

type Kingdom = Database['public']['Tables']['kingdoms']['Row'];
type View = 'home' | 'kingdoms' | 'saga' | 'battle' | 'leaderboard' | 'profile' | 'library' | 'store' | 'multiplayer' | 'friends';

function App() {
  const { user, setUser, fetchProfile, currentKingdom, currentVillage, battle, profile, kingdoms, fetchKingdoms, selectKingdom, selectVillage, fetchPowerUps, fetchUserPowerUps, fetchRanks, fetchMissions } = useGameStore();
  const [view, setView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null, session);
      if (session?.user) { fetchProfile(); fetchKingdoms(); fetchPowerUps(); fetchUserPowerUps(); fetchRanks(); fetchMissions(); }
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null, session);
      if (session?.user) { (async () => { await fetchProfile(); await fetchPowerUps(); await fetchUserPowerUps(); await fetchRanks(); await fetchMissions(); })(); }
    });
    return () => subscription.unsubscribe();
  }, [setUser, fetchProfile, fetchKingdoms, fetchPowerUps, fetchUserPowerUps, fetchRanks]);

  useEffect(() => {
    if (battle.question) setView('battle');
    else if (currentVillage && currentKingdom) setView('saga');
  }, [battle.question, currentVillage, currentKingdom]);

  const handleNavigate = (newView: string) => {
    if (['home', 'kingdoms', 'leaderboard', 'profile', 'library', 'store', 'multiplayer'].includes(newView)) {
      selectKingdom(null); selectVillage(null);
    }
    setView(newView as View);
  };

  const handleKingdomSelect = (kingdom: Kingdom) => { selectKingdom(kingdom); setView('saga'); };

  useEffect(() => {
    const handleNavigateEvent = (e: Event) => { const detail = (e as CustomEvent).detail; if (detail) handleNavigate(detail); };
    window.addEventListener('navigate', handleNavigateEvent);
    return () => window.removeEventListener('navigate', handleNavigateEvent);
  }, []);

  if (showIntro) return <Intro onComplete={() => setShowIntro(false)} />;
  if (isLoading) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center bg-pattern bg-stars">
      <div className="flex flex-col items-center gap-4">
        <motion.div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} />
        <motion.p className="text-[var(--text-muted)] text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Loading AptiVerse...</motion.p>
      </div>
    </div>
  );

  if (!user || !profile) return <Auth />;
  if (view === 'battle' && battle.question) return <BattleArena />;
  if (view === 'multiplayer') return <MultiplayerArena onBack={() => handleNavigate('home')} />;
  if (view === 'friends') return <Layout activeView={view} onNavigate={handleNavigate}><Friends /></Layout>;

  const renderContent = () => {
    switch (view) {
      case 'home': return <Dashboard onKingdomSelect={handleKingdomSelect} />;
      case 'kingdoms': return <div className="max-w-6xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-6">All Kingdoms</h1><KingdomsGrid kingdoms={kingdoms} onSelect={handleKingdomSelect} /></div>;
      case 'saga': return currentKingdom ? <SagaMap /> : <Dashboard onKingdomSelect={handleKingdomSelect} />;
      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <Profile />;
      case 'library': return <GrandLibrary />;
      case 'store': return <PowerUpStore />;
      default: return <Dashboard onKingdomSelect={handleKingdomSelect} />;
    }
  };

  return <Layout activeView={view} onNavigate={handleNavigate}>{renderContent()}</Layout>;
}

export default App;
