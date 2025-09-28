import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from './supabaseClient';

// --- Styled Components ---
const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: 72px 1fr;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
  background: linear-gradient(160deg, #eff8f1 0%, #dff1e3 100%);
  font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Helvetica Neue',
    'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  color: #29472e;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'main';
  }
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  background: linear-gradient(180deg, rgba(46, 128, 74, 0.12), rgba(46, 128, 74, 0.06));
  border-right: 1px solid rgba(53, 114, 73, 0.12);
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: min(84vw, 280px);
    z-index: 40;
    transform: translateX(${(props) => (props.$open ? '0' : '-100%')});
    transition: transform 0.25s ease;
    box-shadow: 8px 0 24px rgba(0,0,0,0.12);
    padding-top: 80px;
  }
`;

const Header = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(53, 114, 73, 0.12);

  @media (max-width: 900px) {
    padding: 0 12px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.25rem;
  color: #2a5934;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  border: none;
  background: #fff;
  color: #2e804a;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(46,128,74,0.24);
    background: #f7fffa;
  }
`;

const Main = styled.main`
  grid-area: main;
  padding: 24px;

  @media (max-width: 900px) {
    padding: 16px 12px 24px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(1px);
  z-index: 30;
`;

const MobileMenuButton = styled.button`
  border: none;
  background: #2e804a;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: none;
  place-items: center;
  cursor: pointer;

  @media (max-width: 900px) {
    display: grid;
  }
`;

const ShareForm = styled.form`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(46,128,74,0.15);
  max-width: 600px;
  margin: 32px auto;
  font-family: 'Inter', sans-serif;
`;

const Label = styled.label`
  font-weight: 700;
  color: #2a5934;
  display: block;
  margin-bottom: 8px;
  margin-top: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;      /* reduced height for compactness */
  border-radius: 12px;
  border: 1px solid #a2d39c;
  padding: 10px;         /* reduced padding */
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2e804a;
  }
`;


const FileDropZone = styled.div`
  border: 2px dashed #a2d39c;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  text-align: center;
  color: #567e63;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;

  &:hover,
  &.dragover {
    background-color: #d4e8ce;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-top: 16px;
  position: relative;
  max-width: 320px;
`;

const PreviewImage = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(46,128,74,0.25);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255,255,255,0.85);
  border: none;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 18px;
  font-weight: 700;
  color: #2a5934;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e6f0e6;
  }
`;

const SubmitButton = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 14px 0;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
  border: none;
  background: #2e804a;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #91ba8e;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background-color: #246338;
  }
`;

// SharePostForm component
function SharePostForm({ onPost }) {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !file) {
      alert('Please write your action or add a photo.');
      return;
    }
    setPosting(true);
    try {
      let imageUrl = null;
      if (file) {
        const { data: { user } } = await supabase.auth.getUser();
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
      const { data: { user } } = await supabase.auth.getUser();
      const { error: insertError } = await supabase.from('posts').insert([{
        user_id: user.id,
        caption,
        image_url: imageUrl || null,
      }]);
      if (insertError) throw insertError;

      setCaption('');
      setFile(null);
      if (onPost) onPost();
      alert('Post shared successfully!');
    } catch (error) {
      alert('Failed to share the post. Please try again.');
      console.error(error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <ShareForm onSubmit={handleSubmit} aria-label="Share your green action or achievement form">
      <Label htmlFor="caption">What did you do?</Label>
      <TextArea
        id="caption"
        placeholder="Describe your green action or achievement"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        disabled={posting}
      />

      <Label>Insert image</Label>
      <FileDropZone
        tabIndex={0}
        className={dragOver ? 'dragover' : ''}
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={handleDrop}
        aria-label="Drag and drop image file or click to select"
      >
        {file ? (
          <PreviewContainer>
            <PreviewImage src={URL.createObjectURL(file)} alt="Selected preview" />
            <RemoveButton
              type="button"
              aria-label="Remove selected image"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              ×
            </RemoveButton>
          </PreviewContainer>
        ) : (
          'Drag and drop an image here, or click to select a file.'
        )}
      </FileDropZone>

      <HiddenFileInput
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        disabled={posting}
      />

      <SubmitButton disabled={posting}>
        {posting ? 'Sharing...' : 'Share'}
      </SubmitButton>
    </ShareForm>
  );
}

// Main Dashboard component
export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [greenName, setGreenName] = useState(null);

  useEffect(() => {
    let subscription;

    async function loadGreenName() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setGreenName(null);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('green_name')
        .eq('user_id', user.id)
        .maybeSingle();

      setGreenName(profile?.green_name || null);
    }

    loadGreenName();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) setGreenName(null);
      else loadGreenName();
    });
    subscription = data?.subscription;

    return () => subscription?.unsubscribe?.();
  }, []);

  return (
    <Page>
      <Sidebar $open={mobileOpen}>
        <nav style={{ padding: '0 6px' }}>
          <div
            style={{
              margin: '12px 8px 6px',
              fontSize: 12,
              color: '#517d5f',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Overview
          </div>
          {['dashboard', 'community', 'challenges','resources', 'account', 'profile', 'settings'].map((path) => (
            <NavLink
              key={path}
              to={`/dashboard${path === 'dashboard' ? '' : `/${path}`}`}
              end={path === 'dashboard'}
              style={({ isActive }) => ({
                textAlign: 'left',
                textDecoration: 'none',
                display: 'block',
                padding: '10px 12px',
                borderRadius: 12,
                color: isActive ? '#ffffff' : '#2a5934',
                background: isActive ? 'rgba(46, 128, 74, 0.9)' : 'transparent',
                fontWeight: mobileOpen ? 700 : 400,  // Add this line for conditional bold
              })}
              
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </nav>
      </Sidebar>

      <Header>
        <Brand>
          <MobileMenuButton onClick={() => setMobileOpen(true)} aria-label="Open menu">☰</MobileMenuButton>
          {greenName ? `Welcome, ${greenName}` : 'GreenGen'}
        </Brand>
        <HeaderActions>
          <IconButton title="Search">🔎</IconButton>
          <IconButton title="Notifications">🔔</IconButton>
        </HeaderActions>
      </Header>

      {mobileOpen && <Overlay onClick={() => setMobileOpen(false)} />}

      <Main>
        <Outlet />
      </Main>
    </Page>
  );
}

// Updated DashboardHome component that includes the post feed as "EcoPulse"
import PostsFeed from './components/PostsFeed'; // adjust path if needed

export function DashboardHome() {
  return (
    <>
      <h1>Welcome to your GreenGen Dashboard!</h1>
      <p>Start exploring your community, challenges, and profile settings.</p>

      <SharePostForm onPost={() => { /* Implement refresh if needed */ }} />

      <section>
        <h2>EcoPulse</h2>
        <PostsFeed />
      </section>
    </>
  );
}
