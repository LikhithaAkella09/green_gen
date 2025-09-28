import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from './supabaseClient';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #a8d5a2, #daf3d7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: #386641;
`;

const Card = styled.div`
  background: #ffffff;
  max-width: 400px;
  width: 100%;
  padding: 3rem 3.5rem;
  border-radius: 30px;
  box-shadow: 0 12px 30px rgba(97, 162, 97, 0.25);
  text-align: center;
`;

const Title = styled.h2`
  font-weight: 800;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2a5934;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px 15px;
  border-radius: 14px;
  border: 1.5px solid #9ccc89;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  outline-color: #3b8d39;

  &:focus {
    border-color: #2c6629;
  }
`;

const SubmitButton = styled.button`
  background-color: #3b8d39;
  color: white;
  border: none;
  padding: 14px 0;
  border-radius: 24px;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(59, 141, 57, 0.45);
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #2c6629;
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 12px 3px #2c6629;
  }
`;

const Message = styled.p`
  margin-top: 12px;
  color: ${({ error }) => (error ? 'red' : 'green')};
  font-weight: 600;
`;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const accessToken = searchParams.get('access_token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setError('Invalid or missing access token.');
    }
  }, [accessToken]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/auth?mode=login'), 3000);
    }
  }

  if (error && !accessToken) {
    return (
      <Container>
        <Card>
          <Message error>{error}</Message>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Set New Password</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </SubmitButton>
        </Form>
        {error && <Message error>{error}</Message>}
        {success && <Message>{success}</Message>}
      </Card>
    </Container>
  );
}
