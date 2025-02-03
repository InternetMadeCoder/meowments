import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { ref, onValue } from 'firebase/database';
import { db } from '../utils/firebase';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await api.fetchPosts();
      // No need to format posts since they're already in the correct format
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const postsData = Object.values(snapshot.val());
        setPosts(postsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPost = async (postData) => {
    try {
      // First update the local state with the complete post data
      setPosts(prevPosts => [{
        ...postData,
        timestamp: new Date().toISOString()
      }, ...prevPosts]);
      
      // Update localStorage
      const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      storedPosts.unshift(postData);
      localStorage.setItem('posts', JSON.stringify(storedPosts));
    } catch (error) {
      console.error('Error adding post:', error);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postData.id));
      throw error;
    }
  };

  const deletePost = async (postId) => {
    try {
      // Remove from local state first
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      // Then remove from localStorage
      await api.deletePost(postId);
      return true;
    } catch (error) {
      // Revert state if deletion fails
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      setPosts(posts);
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
      error,
      refreshPosts: fetchPosts 
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
