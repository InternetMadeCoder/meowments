import { createContext, useContext, useState, useEffect } from 'react';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('meowments_posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  useEffect(() => {
    localStorage.setItem('meowments_posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (newPost) => {
    setPosts(prevPosts => [
      { ...newPost, id: Date.now() },
      ...prevPosts
    ]);
  };

  const deletePost = async (postId) => {
    try {
      // Update posts state
      setPosts(prevPosts => {
        const updatedPosts = prevPosts.filter(post => post.id !== postId);
        // Update localStorage
        localStorage.setItem('meowments_posts', JSON.stringify(updatedPosts));
        return updatedPosts;
      });

      // Also remove from likes if present
      const likedPosts = JSON.parse(localStorage.getItem('meowments_likes') || '[]');
      const updatedLikedPosts = likedPosts.filter(post => post.id !== postId);
      localStorage.setItem('meowments_likes', JSON.stringify(updatedLikedPosts));

      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  // Make sure deletePost is included in the context value
  const contextValue = {
    posts,
    addPost,
    deletePost
  };

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
