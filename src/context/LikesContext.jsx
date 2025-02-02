import { createContext, useContext, useState } from 'react'

const LikesContext = createContext()

export const LikesProvider = ({ children }) => {
  const [likedPosts, setLikedPosts] = useState([])

  const toggleLike = (post) => {
    setLikedPosts(prev => {
      const isLiked = prev.find(p => p.id === post.id)
      if (isLiked) {
        return prev.filter(p => p.id !== post.id)
      } else {
        return [...prev, post]
      }
    })
  }

  return (
    <LikesContext.Provider value={{ likedPosts, toggleLike }}>
      {children}
    </LikesContext.Provider>
  )
}

export const useLikes = () => useContext(LikesContext)
