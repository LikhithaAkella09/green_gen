import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

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

const Label = styled.label`
  text-align: left;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #386641;
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent! Check your email.');
      // Optional: redirect to login page after delay
      setTimeout(() => navigate('/auth?mode=login'), 5000);
    }
  }

  return (
    <Container>
      <Card>
        <Title>Reset Password</Title>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="email">Enter your email address</Label>
          <Input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </SubmitButton>
        </Form>
        {message && <Message>{message}</Message>}
        {error && <Message error>{error}</Message>}
      </Card>
    </Container>
  );
}
