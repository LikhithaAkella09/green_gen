import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  max-width: 600px;
  width: 100%;
  padding: 3rem 3.5rem;
  border-radius: 30px;
  box-shadow: 0 12px 30px rgba(97, 162, 97, 0.25);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.8rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #2a5934;
  letter-spacing: 2.5px;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #4d7843;
  margin-bottom: 3rem;
  line-height: 1.7;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const ButtonLink = styled(Link)`
  background-color: #3b8d39;
  color: white;
  padding: 14px 40px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(59,141,57,0.45);
  margin: 0 1rem;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    background-color: #2c6629;
    transform: translateY(-3px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 12px 3px #2c6629;
  }
`;

const Footer = styled.footer`
  margin-top: 5rem;
  font-size: 0.9rem;
  color: #587d4a;
  font-weight: 400;
  letter-spacing: 1.3px;
  font-style: italic;
`;

export default function HomePage() {
  return (
    <Container>
      <Card>
        <Title>GreenGen</Title>
        <Subtitle>
          Join a warm and welcoming community inspiring everyday sustainable choices and greener living. Connect, learn, and grow your green journey with us!
        </Subtitle>
        <ButtonGroup>
          <ButtonLink to="/auth?mode=signup">Sign Up</ButtonLink>
          <ButtonLink to="/auth?mode=login">Log In</ButtonLink>
        </ButtonGroup>
      </Card>
      <Footer>© 2025 GreenGen. All rights reserved.</Footer>
    </Container>
  );
}
