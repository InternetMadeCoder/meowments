import { createContext, useContext, useState, useEffect } from 'react';

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('meowments_likes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('meowments_likes', JSON.stringify(likedPosts));
  }, [likedPosts]);

  const toggleLike = (post) => {
    setLikedPosts(prev => {
      const isLiked = prev.find(p => p.id === post.id);
      if (isLiked) {
        return prev.filter(p => p.id !== post.id);
      }
      return [...prev, post];
    });
  };

  return (
    <LikesContext.Provider value={{ likedPosts, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => useContext(LikesContext);
