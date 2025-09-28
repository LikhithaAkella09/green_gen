import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('id, caption, image_url, created_at, profiles(green_name)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error) setPosts(data);
    else console.error(error);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  if (posts.length === 0) return <p>No posts yet. Be the first to share your impact!</p>;

  return (
    <>
      {posts.map(post => (
        <article
          key={post.id}
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <strong>{post.profiles?.green_name || 'Anonymous'}</strong>{' '}
          <em>{new Date(post.created_at).toLocaleString()}</em>
          <p>{post.caption}</p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.caption}
              style={{ maxWidth: '100%', borderRadius: 8, marginTop: 8 }}
            />
          )}
        </article>
      ))}
    </>
  );
};

export default PostsFeed;
