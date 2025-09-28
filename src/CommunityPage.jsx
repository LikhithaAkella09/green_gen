import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function CommunityPage() {
  const [userId, setUserId] = useState(null);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  async function handleCreateCommunity() {
    if (!userId) { alert('Please log in.'); return; }
    if (!createName.trim()) { alert('Enter a community name.'); return; }
    try {
      setLoadingCreate(true);
      const { data: community, error: cErr } = await supabase
        .from('communities')
        .insert([{ name: createName.trim(), description: createDesc.trim(), created_by: userId }])
        .select('id')
        .single();
      if (cErr) throw cErr;

      const { error: mErr } = await supabase
        .from('community_members')
        .insert([{ community_id: community.id, user_id: userId, role: 'owner' }]);
      if (mErr) throw mErr;

      alert('Community created!');
      setCreateName('');
      setCreateDesc('');
    } catch (e) {
      console.error(e);
      alert('Failed to create community.');
    } finally {
      setLoadingCreate(false);
    }
  }

  async function performSearch() {
    setLoadingSearch(true);
    try {
      const query = search.trim();
      if (!query) { setResults([]); return; }
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, description, created_at')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setResults(data || []);
    } catch (e) {
      console.error(e);
      alert('Search failed.');
    } finally {
      setLoadingSearch(false);
    }
  }

  async function joinCommunity(id) {
    if (!userId) { alert('Please log in.'); return; }
    setJoiningId(id);
    try {
      const { error } = await supabase
        .from('community_members')
        .insert([{ community_id: id, user_id: userId, role: 'member' }]);
      if (error) throw error;
      alert('Joined community!');
    } catch (e) {
      console.error(e);
      alert('Failed to join community.');
    } finally {
      setJoiningId(null);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ background: '#ffffff', border: '1px solid rgba(53,114,73,0.10)', borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: 0, color: '#2a5934' }}>Community</h2>
        <p style={{ color: '#385f44', marginTop: 6 }}>Create a new community or join an existing one.</p>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <strong style={{ color: '#2a5934' }}>Create community</strong>
            <input placeholder="Name" value={createName} onChange={(e) => setCreateName(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)' }} />
            <textarea placeholder="Description (optional)" value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} rows={3} style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)' }} />
            <button disabled={loadingCreate} onClick={handleCreateCommunity} style={{ background: '#2e804a', color: '#fff', border: 0, padding: '10px 12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
              {loadingCreate ? 'Creating...' : 'Create community'}
            </button>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <strong style={{ color: '#2a5934' }}>Join community</strong>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)' }} />
              <button onClick={performSearch} disabled={loadingSearch} style={{ background: '#2e804a', color: '#fff', border: 0, padding: '10px 12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>{loadingSearch ? 'Searching...' : 'Search'}</button>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {results.map(r => (
                <div key={r.id} style={{ border: '1px solid rgba(53,114,73,0.15)', borderRadius: 10, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2a5934' }}>{r.name}</div>
                    <div style={{ color: '#567e66', fontSize: 13 }}>{r.description}</div>
                  </div>
                  <button onClick={() => joinCommunity(r.id)} disabled={joiningId === r.id} style={{ background: '#ffffff', color: '#2a5934', border: '1px solid rgba(53,114,73,0.30)', padding: '8px 10px', borderRadius: 10, cursor: 'pointer' }}>
                    {joiningId === r.id ? 'Joining...' : 'Join'}
                  </button>
                </div>
              ))}
              {!loadingSearch && results.length === 0 && search.trim() && (
                <div style={{ color: '#567e66' }}>No results found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


