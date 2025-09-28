import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState(''); // green_name from backend
  const [bio, setBio] = useState('');
  const [postsCount, setPostsCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error: userError } = await supabase.auth.getUser();
      console.log('Logged-in user:', data?.user);
      if (userError) {
        console.error('Error fetching user:', userError);
        setLoading(false);
        return;
      }
      if (!data?.user) {
        console.warn('No user logged in');
        setLoading(false);
        return;
      }
      setUser(data.user);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('green_name, bio')
        .eq('user_id', data.user.id)
        .maybeSingle();
      console.log('Profile data:', profileData, 'Error:', profileError);

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setUsername(profileData.green_name || '');
        setBio(profileData.bio || '');
      }

      // Fetch posts count
      const { count, error: postsError } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', data.user.id);
      console.log('Posts count:', count, 'Error:', postsError);

      if (postsError) {
        console.error('Error fetching posts count:', postsError);
      } else {
        setPostsCount(count || 0);
      }

      setLoading(false);
    })();
  }, []);

  async function saveProfile() {
    if (!user) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({ user_id: user.id, bio: bio || null });
      if (error) throw error;
      alert('Profile saved');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 12 }}>Loading…</div>;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: '20px auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f7f9f5',
        padding: 24,
        borderRadius: 14,
        boxShadow: '0 4px 15px rgba(53,114,73,0.15)',
      }}
    >
      <h2 style={{ margin: 0, color: '#2a5934', marginBottom: 8 }}>Profile</h2>
      <p style={{ color: '#385f44', marginBottom: 20 }}>
        Update your public details.
      </p>

      <label
        style={{
          color: '#2a5934',
          fontWeight: 600,
          display: 'block',
          marginBottom: 6,
        }}
      >
        Username
      </label>
      <input
        value={username}
        readOnly
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 10,
          border: '1px solid rgba(53,114,73,0.3)',
          backgroundColor: '#e9f3ea',
          color: '#2a5934',
          fontWeight: 'bold',
          marginBottom: 18,
          boxSizing: 'border-box',
          userSelect: 'none',
        }}
      />

      <label
        style={{
          color: '#2a5934',
          fontWeight: 600,
          display: 'block',
          marginBottom: 6,
        }}
      >
        Bio
      </label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        placeholder="Tell others about your sustainability journey"
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 10,
          border: '1px solid rgba(53,114,73,0.3)',
          fontFamily: 'Arial, sans-serif',
          resize: 'vertical',
          marginBottom: 20,
          boxSizing: 'border-box',
        }}
      />

      <div
        style={{
          fontWeight: '600',
          color: '#2a5934',
          marginBottom: 24,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Posts count:
        <span
          style={{
            backgroundColor: '#2e804a',
            color: 'white',
            padding: '4px 14px',
            borderRadius: 12,
            marginLeft: 10,
            fontSize: 14,
            userSelect: 'none',
          }}
        >
          {postsCount}
        </span>
      </div>

      <button
        disabled={saving}
        onClick={saveProfile}
        style={{
          width: '100%',
          backgroundColor: '#2e804a',
          color: '#fff',
          border: 'none',
          padding: '14px 0',
          borderRadius: 10,
          fontWeight: 700,
          cursor: saving ? 'default' : 'pointer',
          boxShadow: '0 4px 8px rgba(46,128,74,0.4)',
          transition: 'background-color 0.3s ease',
        }}
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
