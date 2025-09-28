import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
import { supabase } from './supabaseClient'; // Adjust path if needed

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #a8d5a2, #daf3d7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: #386641;
  padding: 2rem 1rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 12px 30px rgba(97, 162, 97, 0.3);
  width: 380px;
  padding: 3rem 2.5rem;
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

const SwitchMode = styled.div`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #4a774a;
`;

const StyledLink = styled(Link)`
  color: #3b8d39;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 0.5rem;
  font-weight: 600;
`;

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        alert('Signup successful! Please check your email to verify.');
        navigate('/auth?mode=login');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  }

  return (
    <Container>
      <Card>
        {mode === 'login' ? (
          <>
            <Title>Welcome Back!</Title>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
              </SubmitButton>
              {mode === 'login' && (
  <SwitchMode>
    <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
  </SwitchMode>
)}

            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <SwitchMode>
              Don't have an account?
              <StyledLink to="/auth?mode=signup"> Sign Up here</StyledLink>
            </SwitchMode>
            <SwitchMode>
              <StyledLink to="/">Back to Home</StyledLink>
            </SwitchMode>
          </>
        ) : (
          <>
            <Title>Create Your Account</Title>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Your full name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Create a password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </SubmitButton>
            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <SwitchMode>
              Already have an account?
              <StyledLink to="/auth?mode=login"> Log In here</StyledLink>
            </SwitchMode>
            <SwitchMode>
              <StyledLink to="/">Back to Home</StyledLink>
            </SwitchMode>
          </>
        )}
      </Card>
    </Container>
  );
}
