import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts from Cloudinary
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `https://api.cloudinary.com/v1_1/dlm7van7p/resources/search`,
        {
          params: {
            type: 'upload',
            prefix: 'meowments/',
            max_results: 500,
            context: true,
            metadata: true
          },
          auth: {
            username: '419321886338194',
            password: 'gKW6lQHGDIeGOxlA1ZQ8ksELPtI'
          }
        }
      );

      const formattedPosts = response.data.resources
        .filter(resource => resource.folder === 'meowments')
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

  // Initial fetch and set up refresh interval
  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const addPost = async (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const deletePost = async (publicId) => {
    try {
      await axios.delete(
        `https://api.cloudinary.com/v1_1/dlm7van7p/resources/image/upload`,
        {
          params: { public_ids: [publicId] },
          auth: {
            username: '419321886338194',
            password: 'gKW6lQHGDIeGOxlA1ZQ8ksELPtI'
          }
        }
      );
      setPosts(prevPosts => prevPosts.filter(post => post.id !== publicId));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, deletePost, loading, refreshPosts: fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
