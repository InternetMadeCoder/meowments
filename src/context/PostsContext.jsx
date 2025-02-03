import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { ref, onValue } from 'firebase/database';
import { db } from '../utils/firebase';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const postsData = Object.values(snapshot.val())
          .map(post => ({
            ...post,
            timestamp: post.timestamp || new Date().toISOString()
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPosts(postsData);
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPost = async (postData) => {
    try {
      // Firebase will handle the state update through real-time listener
      // No need to update posts state directly
      await api.uploadPost(postData.file, postData.description);
    } catch (error) {
      console.error('Error adding post:', error);
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
      error
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
