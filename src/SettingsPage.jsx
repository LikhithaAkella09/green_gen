import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Load prefs on mount
  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('user_settings')
        .select('email_notifications, push_notifications')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setEmailNotifications(data.email_notifications);
        setPushNotifications(data.push_notifications);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  // Save preferences to Supabase
  async function handleSavePreferences() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }
    const { error } = await supabase.from('user_settings').upsert({
      user_id: user.id,
      email_notifications: emailNotifications,
      push_notifications: pushNotifications,
    });
    setSaving(false);
    if (error) alert('Failed to save preferences');
    else alert('Preferences saved!');
  }

  async function handleSubmitFeedback(e) {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmittingFeedback(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('feedback').insert({
      user_id: user ? user.id : null,
      content: feedback,
    });
    setSubmittingFeedback(false);
    if (error) alert('Failed to submit feedback');
    else {
      alert('Thank you for your feedback!');
      setFeedback('');
    }
  }

  const sectionStyle = {
    backgroundColor: '#fff',
    border: '1px solid rgba(53,114,73,0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12,
    fontWeight: 600,
    color: '#2a5934',
    cursor: 'pointer'
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif', color: '#2a5934' }}>
      <h1 style={{ marginBottom: 32 }}>Settings</h1>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Notification Preferences</h2>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            style={{ marginRight: 10 }}
            disabled={loading || saving}
          />
          Email Notifications
        </label>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
            style={{ marginRight: 10 }}
            disabled={loading || saving}
          />
          Push Notifications
        </label>
        <button
          onClick={handleSavePreferences}
          disabled={loading || saving}
          style={{
            marginTop: 12,
            backgroundColor: '#2e804a',
            color: 'white',
            padding: '10px 22px',
            borderRadius: 10,
            border: 'none',
            fontWeight: 700,
            cursor: loading || saving ? 'default' : 'pointer',
            fontSize: 16,
            boxShadow: '0 4px 8px rgba(46,128,74,0.4)',
            transition: 'background-color 0.3s ease'
          }}
        >
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Feedback & Suggestions</h2>
        <form onSubmit={handleSubmitFeedback}>
          <textarea
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="We value your thoughts and ideas"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              border: '1px solid rgba(53,114,73,0.2)',
              fontSize: 16,
              resize: 'vertical',
              color: '#2a5934',
              boxSizing: 'border-box'
            }}
            disabled={submittingFeedback}
          />
          <button
            type="submit"
            disabled={!feedback.trim() || submittingFeedback}
            style={{
              marginTop: 12,
              backgroundColor: '#2e804a',
              color: 'white',
              padding: '12px 20px',
              borderRadius: 10,
              border: 'none',
              fontWeight: 700,
              cursor: submittingFeedback ? 'default' : 'pointer',
              fontSize: 16,
              boxShadow: '0 4px 8px rgba(46,128,74,0.4)',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={e => {
              if (!submittingFeedback) e.currentTarget.style.backgroundColor = '#246438';
            }}
            onMouseOut={e => {
              if (!submittingFeedback) e.currentTarget.style.backgroundColor = '#2e804a';
            }}
          >
            {submittingFeedback ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </form>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Contact Support</h2>
        <p style={{ fontSize: 16, lineHeight: 1.5 }}>
          For support, collaborations, or green-minded partnerships, email us at{' '}
          <a href="mailto:support@greengen.app" style={{ color: '#2e804a', textDecoration: 'none' }}>
            support@greengen.app
          </a>
          .
        </p>
      </section>

      <section style={{ textAlign: 'center', fontSize: 14, color: '#385f44' }}>
        <a
          href="/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2e804a', marginRight: 20, textDecoration: 'none' }}
        >
          Terms of Service
        </a>
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2e804a', textDecoration: 'none' }}
        >
          Privacy Policy
        </a>
      </section>
    </div>
  );
}
