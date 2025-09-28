import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 520px;
  margin: 20px auto;
  font-family: 'Arial, sans-serif';
  background-color: #f7f9f5;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(53,114,73,0.15);
  color: #2a5934;
`;

const Title = styled.h2`
  margin: 0;
  color: #2a5934;
  margin-bottom: 8px;
`;

const Label = styled.label`
  color: #2a5934;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(53,114,73,0.3);
  background-color: #e9f3ea;
  color: #2a5934;
  font-weight: ${({ bold }) => (bold ? '700' : 'normal')};
  margin-bottom: 18px;
  box-sizing: border-box;
  user-select: none;
`;

const Button = styled.button`
  width: 100%;
  background-color: #2e804a;
  color: #fff;
  border: none;
  padding: 14px 0;
  border-radius: 10px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  box-shadow: 0 4px 8px rgba(46,128,74,0.4);
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #91ba8e;
  }
`;

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greenName, setGreenName] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showChangePwd, setShowChangePwd] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setEmailVerified(user.email_confirmed_at !== null);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('green_name')
          .eq('user_id', user.id)
          .maybeSingle();
        setGreenName(profileData?.green_name || '');
      }
      setLoading(false);
    })();
  }, []);

  async function resendVerification() {
    if (!user) return;
    setResending(true);
    const { error } = await supabase.auth.api.resendVerificationEmail(user.email);
    if (error) alert('Failed to resend verification email');
    else alert('Verification email sent');
    setResending(false);
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setChangingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert('Failed to change password: ' + error.message);
    else alert('Password changed successfully');
    setChangingPwd(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  async function handleAccountDeletion() {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone')) return;
    alert('Account deletion request submitted. Please implement backend to complete this action.');
  }

  if (loading) return <Container>Loading…</Container>;

  return (
    <Container>
      <Title>Account Settings</Title>

      <div>
        <Label>Email</Label>
        <Input type="text" value={user?.email || ''} readOnly bold />
      </div>

      <div>
        <Label>Username</Label>
        <Input type="text" value={greenName} readOnly bold />
      </div>

      <div style={{ marginBottom: 20 }}>
        <p>
          Email Verification Status:{' '}
          <strong style={{ color: emailVerified ? 'green' : 'red' }}>
            {emailVerified ? 'Verified' : 'Not Verified'}
          </strong>
        </p>
        {!emailVerified && (
          <button
            disabled={resending}
            onClick={resendVerification}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '10px 14px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.3s ease',
              width: 'auto',
            }}
            onMouseOver={e => !resending && (e.currentTarget.style.backgroundColor = '#388e3c')}
            onMouseOut={e => !resending && (e.currentTarget.style.backgroundColor = '#4caf50')}
          >
            {resending ? 'Resending…' : 'Resend Verification Email'}
          </button>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3
          onClick={() => setShowChangePwd(!showChangePwd)}
          style={{
            color: '#4caf50',
            cursor: 'pointer',
            userSelect: 'none',
            fontWeight: '700',
            marginBottom: 12,
            borderBottom: '2px solid #4caf50',
            paddingBottom: 4,
            display: 'inline-block',
          }}
        >
          <span
            onClick={() => setShowChangePwd(!showChangePwd)}
            style={{
              fontWeight: 600,
              color: '#2a5934',
              cursor: 'pointer',
              display: 'inline-block',
              paddingBottom: 4,
              userSelect: 'none',
            }}
          >
            Change Password
          </span>
        </h3>
        {showChangePwd && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)', marginBottom: 12 }}
              disabled={changingPwd}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid rgba(53,114,73,0.2)', marginBottom: 12 }}
              disabled={changingPwd}
            />
            <button
              disabled={changingPwd}
              onClick={handleChangePassword}
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '10px 14px',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                border: 'none',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={e => !changingPwd && (e.currentTarget.style.backgroundColor = '#388e3c')}
              onMouseOut={e => !changingPwd && (e.currentTarget.style.backgroundColor = '#4caf50')}
            >
              {changingPwd ? 'Changing…' : 'Change Password'}
            </button>
          </>
        )}
      </div>

      <div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#388e3c',
            color: 'white',
            padding: '10px 14px',
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer',
            marginRight: 10,
            border: 'none',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#2e6d2a')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#388e3c')}
        >
          Logout
        </button>

        <button
          onClick={handleAccountDeletion}
          style={{
            backgroundColor: '#e94b4b',
            color: 'white',
            padding: '10px 14px',
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#bf3b3b')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#e94b4b')}
        >
          Delete Account
        </button>
      </div>
    </Container>
  );
}
