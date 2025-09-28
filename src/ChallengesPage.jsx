import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function ChallengesPage() {
  const [userId, setUserId] = useState(null);
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [myChallenges, setMyChallenges] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      await refreshMyChallenges();
    })();
  }, [userId]);

  async function refreshMyChallenges() {
    if (!userId) return;
    const { data, error } = await supabase
      .from('challenge_participants')
      .select('status, completed_at, challenges:challenge_id(id, title, description, created_at)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error) setMyChallenges(data || []);
  }

  async function createChallenge() {
    if (!userId) { alert('Please log in.'); return; }
    if (!createTitle.trim()) { alert('Enter a title.'); return; }
    try {
      setLoadingCreate(true);
      const { data: challenge, error: cErr } = await supabase
        .from('challenges')
        .insert([{ title: createTitle.trim(), description: createDesc.trim(), created_by: userId }])
        .select('id')
        .single();
      if (cErr) throw cErr;
      const { error: mErr } = await supabase
        .from('challenge_participants')
        .insert([{ challenge_id: challenge.id, user_id: userId, status: 'joined' }]);
      if (mErr) throw mErr;
      alert('Challenge created!');
      setCreateTitle('');
      setCreateDesc('');
    } catch (e) {
      console.error(e);
      alert('Failed to create challenge');
    } finally {
      setLoadingCreate(false);
    }
    await refreshMyChallenges();
  }

  async function performSearch() {
    setLoadingSearch(true);
    try {
      const q = search.trim();
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title, description, created_at')
        .ilike('title', `%${q}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setResults(data || []);
    } catch (e) {
      console.error(e);
      alert('Search failed');
    } finally {
      setLoadingSearch(false);
    }
  }

  async function joinChallenge(id) {
    if (!userId) { alert('Please log in.'); return; }
    setJoiningId(id);
    try {
      const { error } = await supabase
        .from('challenge_participants')
        .insert([{ challenge_id: id, user_id: userId, status: 'joined' }]);
      if (error) throw error;
      alert('Joined challenge!');
    } catch (e) {
      console.error(e);
      alert('Failed to join');
    } finally {
      setJoiningId(null);
    }
    await refreshMyChallenges();
  }

  async function completeChallenge(id) {
    if (!userId) { alert('Please log in.'); return; }
    setCompletingId(id);
    try {
      const { error } = await supabase
        .from('challenge_participants')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('challenge_id', id)
        .eq('user_id', userId);
      if (error) throw error;
      alert('Marked completed!');
    } catch (e) {
      console.error(e);
      alert('Failed to mark completed');
    } finally {
      setCompletingId(null);
    }
    await refreshMyChallenges();
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ background: '#ffffff', border: '1px solid rgba(53,114,73,0.10)', borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: 0, color: '#2a5934' }}>Challenges</h2>
        <p style={{ color: '#385f44', marginTop: 6 }}>Create, join, and complete challenges.</p>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <strong style={{ color: '#2a5934' }}>Create challenge</strong>
            <input placeholder="Title" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)' }} />
            <textarea placeholder="Description (optional)" value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} rows={3} style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)' }} />
            <button disabled={loadingCreate} onClick={createChallenge} style={{ background: '#2e804a', color: '#fff', border: 0, padding: '10px 12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
              {loadingCreate ? 'Creating...' : 'Create challenge'}
            </button>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <strong style={{ color: '#2a5934' }}>Find challenges</strong>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)' }} />
              <button onClick={performSearch} disabled={loadingSearch} style={{ background: '#2e804a', color: '#fff', border: 0, padding: '10px 12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>{loadingSearch ? 'Searching...' : 'Search'}</button>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {results.map(r => (
                <div key={r.id} style={{ border: '1px solid rgba(53,114,73,0.15)', borderRadius: 10, padding: 10, display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2a5934' }}>{r.title}</div>
                    <div style={{ color: '#567e66', fontSize: 13 }}>{r.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => joinChallenge(r.id)} disabled={joiningId === r.id} style={{ background: '#ffffff', color: '#2a5934', border: '1px solid rgba(53,114,73,0.30)', padding: '8px 10px', borderRadius: 10, cursor: 'pointer' }}>{joiningId === r.id ? 'Joining…' : 'Join'}</button>
                    <button onClick={() => completeChallenge(r.id)} disabled={completingId === r.id} style={{ background: '#2e804a', color: '#fff', border: 0, padding: '8px 10px', borderRadius: 10, cursor: 'pointer' }}>{completingId === r.id ? 'Completing…' : 'Mark completed'}</button>
                  </div>
                </div>
              ))}
              {!loadingSearch && results.length === 0 && search.trim() && (
                <div style={{ color: '#567e66' }}>No results found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#ffffff', border: '1px solid rgba(53,114,73,0.10)', borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0, color: '#2a5934' }}>My challenges</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {myChallenges.map((row, idx) => (
            <div key={idx} style={{ border: '1px solid rgba(53,114,73,0.15)', borderRadius: 10, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#2a5934' }}>{row.challenges?.title}</div>
                <div style={{ color: '#567e66', fontSize: 13 }}>Status: {row.status}{row.completed_at ? ` • Completed at ${new Date(row.completed_at).toLocaleString()}` : ''}</div>
              </div>
              {row.status !== 'completed' && (
                <button onClick={() => completeChallenge(row.challenges?.id)} style={{ background: '#2e804a', color: '#fff', border: 0, padding: '8px 10px', borderRadius: 10, cursor: 'pointer' }}>Mark completed</button>
              )}
            </div>
          ))}
          {myChallenges.length === 0 && (
            <div style={{ color: '#567e66' }}>No challenges yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}


