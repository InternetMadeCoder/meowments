import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const resources = await api.fetchPosts();
      const formattedPosts = resources
        .map(resource => ({
          id: resource.public_id,
          imageUrl: resource.secure_url,
          description: resource.context?.description || '',
          color: 'rose',
          timestamp: resource.created_at
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, []);

  const addPost = async (postData) => {
    try {
      setPosts(prevPosts => [postData, ...prevPosts]);
      await fetchPosts(); // Refresh posts after adding
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  };

  const deletePost = async (publicId) => {
    try {
      await api.deletePost(publicId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== publicId));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      addPost, 
      deletePost, 
      loading,
      refreshPosts: fetchPosts 
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
