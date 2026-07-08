import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, Search, Users, Inbox, Send, X, Trophy, Zap, Target, Swords, Copy, Check } from 'lucide-react';
import { useFriendsStore } from '../store/friendsStore';
import { useGameStore } from '../store/gameStore';

export function Friends() {
  const { friends, pendingRequests, sentRequests, loading, fetchFriends, fetchPendingRequests, fetchSentRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, viewFriendProfile } = useFriendsStore();
  const { profile } = useGameStore();
  const [tab, setTab] = useState<'friends' | 'add' | 'requests'>('friends');
  const [searchInput, setSearchInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);

  useEffect(() => { fetchFriends(); fetchPendingRequests(); fetchSentRequests(); }, []);

  const handleSendRequest = async () => {
    if (!searchInput.trim()) return;
    const result = await sendFriendRequest(searchInput.trim());
    if (result.success) { setFeedback({ type: 'success', msg: 'Friend request sent!' }); setSearchInput(''); }
    else setFeedback({ type: 'error', msg: result.error || 'Failed to send request' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const copyMyId = () => {
    if (profile?.unique_id) { navigator.clipboard.writeText(profile.unique_id); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const openProfile = async (userId: string) => { setViewingProfile(userId); await viewFriendProfile(userId); };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-1 flex items-center gap-2"><Users className="w-8 h-8" />Friends</h1>
        <p className="text-[var(--text-muted)]">Add friends, battle together, track stats</p>
      </motion.div>

      <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-[var(--text-muted)] mb-1">Your Unique ID</p>
          <p className="text-lg font-mono font-bold text-indigo-400">{profile?.unique_id || 'Loading...'}</p>
        </div>
        <motion.button onClick={copyMyId} className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
        </motion.button>
      </div>

      <div className="flex gap-2 mb-6">
        {([['friends', 'My Friends'], ['add', 'Add Friend'], ['requests', `Requests${pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}`]] as const).map(([id, label]) => (
          <motion.button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'bg-indigo-500/20 text-indigo-400' : 'glass text-[var(--text-muted)]'}`} whileTap={{ scale: 0.95 }}>
            {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'friends' && (
          <motion.div key="friends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {friends.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center"><Users className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" /><p className="text-[var(--text-muted)]">No friends yet. Add some!</p></div>
            ) : (
              <div className="grid gap-3">
                {friends.map((f, i) => (
                  <motion.div key={f.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <motion.button onClick={() => openProfile(f.user_id)} className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white" whileHover={{ scale: 1.1 }}>{(f.display_name || f.username || '?')[0].toUpperCase()}</motion.button>
                    <div className="flex-1">
                      <p className="font-medium">{f.display_name || f.username}</p>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-green-400" />{f.xp.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-400" />Lv.{f.level}</span>
                        <span className="flex items-center gap-1"><Swords className="w-3 h-3 text-red-400" />{f.multiplayer_wins}W</span>
                      </div>
                    </div>
                    <motion.button onClick={() => removeFriend(f.user_id)} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Remove"><UserMinus className="w-5 h-5" /></motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'add' && (
          <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-[var(--text-muted)] mb-4">Enter your friend's Unique ID to send a request</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input value={searchInput} onChange={(e) => setSearchInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()} placeholder="e.g. AB12CD34" className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/50" maxLength={8} />
                </div>
                <motion.button onClick={handleSendRequest} disabled={loading || !searchInput.trim()} className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><UserPlus className="w-5 h-5" /> Send</motion.button>
              </div>
              {feedback && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-3 p-3 rounded-xl text-sm ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{feedback.msg}</motion.div>}
              {sentRequests.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-1"><Send className="w-3 h-3" /> Sent Requests</p>
                  {sentRequests.map(r => <div key={r.id} className="glass rounded-xl p-3 mb-2 text-sm text-[var(--text-muted)]">Pending request sent</div>)}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'requests' && (
          <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {pendingRequests.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center"><Inbox className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" /><p className="text-[var(--text-muted)]">No pending requests</p></div>
            ) : (
              <div className="grid gap-3">
                {pendingRequests.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">{(r.sender_profile?.display_name || r.sender_profile?.username || '?')[0].toUpperCase()}</div>
                    <div className="flex-1"><p className="font-medium">{r.sender_profile?.display_name || r.sender_profile?.username}</p><p className="text-xs text-[var(--text-muted)]">ID: {r.sender_profile?.unique_id}</p></div>
                    <motion.button onClick={() => acceptFriendRequest(r.id, r.sender_id)} className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Accept</motion.button>
                    <motion.button onClick={() => rejectFriendRequest(r.id)} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Reject</motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FriendProfileModal userId={viewingProfile} onClose={() => setViewingProfile(null)} />
    </div>
  );
}

function FriendProfileModal({ userId, onClose }: { userId: string | null; onClose: () => void }) {
  const { viewedProfile } = useFriendsStore();
  if (!userId || !viewedProfile) return null;
  const accuracy = viewedProfile.total_questions > 0 ? Math.round((viewedProfile.correct_answers / viewedProfile.total_questions) * 100) : 0;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8 }} className="glass rounded-3xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">{(viewedProfile.display_name || viewedProfile.username || '?')[0].toUpperCase()}</div>
              <div><h2 className="text-xl font-bold">{viewedProfile.display_name || viewedProfile.username}</h2><p className="text-sm text-[var(--text-muted)]">ID: {viewedProfile.unique_id}</p></div>
            </div>
            <motion.button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5" whileTap={{ scale: 0.9 }}><X className="w-5 h-5" /></motion.button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Level', value: viewedProfile.level, icon: Trophy, color: 'text-yellow-400' },
              { label: 'XP', value: viewedProfile.xp.toLocaleString(), icon: Zap, color: 'text-green-400' },
              { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-blue-400' },
              { label: 'Questions', value: viewedProfile.total_questions, icon: Target, color: 'text-purple-400' },
              { label: 'MP Wins', value: viewedProfile.multiplayer_wins, icon: Swords, color: 'text-red-400' },
              { label: 'MP Losses', value: viewedProfile.multiplayer_losses, icon: Swords, color: 'text-orange-400' },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--surface)] rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1"><s.icon className={`w-4 h-4 ${s.color}`} /><span className="text-xs text-[var(--text-muted)]">{s.label}</span></div>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
