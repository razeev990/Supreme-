import { SUPABASE_REST_URL, supabaseHeaders } from '../constants/config';

// 1. Sync User Data to Database
export const syncUserToCloud = async (userObj) => {
  if (!userObj?.playerId) return;
  try {
    await fetch(`${SUPABASE_REST_URL}/ludo_users`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders,
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        player_id: String(userObj.playerId),
        name: userObj.name || 'Player',
        email: userObj.email,
        coins: Number(userObj.coins || 2000),
        avatar: userObj.avatar || '👸',
        last_seen: new Date().toISOString()
      })
    });
  } catch (e) {
    console.log('Error syncing user to Supabase:', e);
  }
};

// 2. Update Online Status (Heartbeat)
export const updateLastSeenCloud = async (playerId) => {
  if (!playerId) return;
  try {
    await fetch(
      `${SUPABASE_REST_URL}/ludo_users?player_id=eq.${encodeURIComponent(playerId)}`,
      {
        method: 'PATCH',
        headers: {
          ...supabaseHeaders,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          last_seen: new Date().toISOString()
        })
      }
    );
  } catch (e) {}
};

// 3. Sync Coins Balance
export const syncUserCoinsToCloud = async (playerId, coins) => {
  try {
    await fetch(`${SUPABASE_REST_URL}/ludo_users?player_id=eq.${playerId}`, {
      method: 'PATCH',
      headers: {
        ...supabaseHeaders,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ coins })
    });
  } catch (e) {}
};

// 4. Fetch Global Leaderboard Data
export const fetchCloudLeaderboard = async () => {
  try {
    const response = await fetch(
      `${SUPABASE_REST_URL}/ludo_users?select=player_id,name,coins&order=coins.desc`,
      { headers: supabaseHeaders }
    );
    if (!response.ok) return [];
    
    const data = await response.json();
    if (Array.isArray(data)) {
      return [...data].sort((a, b) => Number(b.coins || 0) - Number(a.coins || 0));
    }
    return [];
  } catch (error) {
    console.log('Leaderboard error:', error);
    return [];
  }
};
