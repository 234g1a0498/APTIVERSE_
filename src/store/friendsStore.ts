import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface FriendProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  coins: number;
  level: number;
  rank: string | null;
  total_questions: number;
  correct_answers: number;
  multiplayer_wins: number;
  multiplayer_losses: number;
  multiplayer_xp: number;
  unique_id: string | null;
  current_streak: number;
  longest_streak: number;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_profile?: FriendProfile;
}

interface FriendsState {
  friends: FriendProfile[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  searchResult: FriendProfile | null;
  viewedProfile: FriendProfile | null;
  loading: boolean;
  error: string | null;
  fetchFriends: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  fetchSentRequests: () => Promise<void>;
  sendFriendRequest: (uniqueId: string) => Promise<{ success: boolean; error?: string }>;
  acceptFriendRequest: (requestId: string, senderId: string) => Promise<void>;
  rejectFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  searchUserByUniqueId: (uniqueId: string) => Promise<void>;
  viewFriendProfile: (userId: string) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  searchResult: null,
  viewedProfile: null,
  loading: false,
  error: null,

  fetchFriends: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: friendships } = await supabase.from('friends').select('friend_id').eq('user_id', user.id);
    if (!friendships || friendships.length === 0) { set({ friends: [] }); return; }
    const friendIds = friendships.map(f => f.friend_id);
    const { data: profiles } = await supabase.from('user_profiles').select('*').in('user_id', friendIds);
    set({ friends: (profiles || []) as FriendProfile[] });
  },

  fetchPendingRequests: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: requests } = await supabase.from('friend_requests').select('*').eq('receiver_id', user.id).eq('status', 'pending');
    if (!requests || requests.length === 0) { set({ pendingRequests: [] }); return; }
    const senderIds = requests.map(r => r.sender_id);
    const { data: profiles } = await supabase.from('user_profiles').select('*').in('user_id', senderIds);
    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
    const enriched = requests.map(r => ({ ...r, sender_profile: profileMap.get(r.sender_id) }));
    set({ pendingRequests: enriched });
  },

  fetchSentRequests: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: requests } = await supabase.from('friend_requests').select('*').eq('sender_id', user.id).eq('status', 'pending');
    set({ sentRequests: (requests || []) as FriendRequest[] });
  },

  sendFriendRequest: async (uniqueId) => {
    set({ loading: true, error: null });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { set({ loading: false }); return { success: false, error: 'Not authenticated' }; }
    const { data: target } = await supabase.from('user_profiles').select('user_id').eq('unique_id', uniqueId.toUpperCase()).maybeSingle();
    if (!target) { set({ loading: false, error: 'User not found' }); return { success: false, error: 'User not found' }; }
    if (target.user_id === user.id) { set({ loading: false }); return { success: false, error: 'Cannot add yourself' }; }
    const { data: existing } = await supabase.from('friends').select('id').eq('user_id', user.id).eq('friend_id', target.user_id).maybeSingle();
    if (existing) { set({ loading: false }); return { success: false, error: 'Already friends' }; }
    const { data: existingReq } = await supabase.from('friend_requests').select('id').eq('sender_id', user.id).eq('receiver_id', target.user_id).eq('status', 'pending').maybeSingle();
    if (existingReq) { set({ loading: false }); return { success: false, error: 'Request already sent' }; }
    const { data: reverseReq } = await supabase.from('friend_requests').select('id').eq('sender_id', target.user_id).eq('receiver_id', user.id).eq('status', 'pending').maybeSingle();
    if (reverseReq) { set({ loading: false }); return { success: false, error: 'You have a pending request from this user' }; }
    const { error } = await supabase.from('friend_requests').insert({ sender_id: user.id, receiver_id: target.user_id });
    set({ loading: false });
    if (error) return { success: false, error: error.message };
    get().fetchSentRequests();
    return { success: true };
  },

  acceptFriendRequest: async (requestId, senderId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', requestId);
    await supabase.from('friends').insert({ user_id: user.id, friend_id: senderId });
    await supabase.from('friends').insert({ user_id: senderId, friend_id: user.id });
    get().fetchFriends();
    get().fetchPendingRequests();
  },

  rejectFriendRequest: async (requestId) => {
    await supabase.from('friend_requests').update({ status: 'rejected' }).eq('id', requestId);
    get().fetchPendingRequests();
  },

  removeFriend: async (friendId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('friends').delete().eq('user_id', user.id).eq('friend_id', friendId);
    await supabase.from('friends').delete().eq('user_id', friendId).eq('friend_id', user.id);
    get().fetchFriends();
  },

  searchUserByUniqueId: async (uniqueId) => {
    set({ loading: true, searchResult: null });
    const { data } = await supabase.from('user_profiles').select('*').eq('unique_id', uniqueId.toUpperCase()).maybeSingle();
    set({ searchResult: (data as FriendProfile) || null, loading: false });
  },

  viewFriendProfile: async (userId) => {
    const { data } = await supabase.from('user_profiles').select('*').eq('user_id', userId).maybeSingle();
    set({ viewedProfile: (data as FriendProfile) || null });
  },
}));
