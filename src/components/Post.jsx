import { useLikes } from '../context/LikesContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { usePosts } from '../context/PostsContext';
import { ConfirmationModal } from './Modal';

const Post = ({ id, color = "rose", description = "", imageUrl, deleteUrl }) => {
  const { likedPosts, toggleLike } = useLikes();
  const { deletePost } = usePosts();
  const isLiked = likedPosts.some(post => post.id === id)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    setMousePosition({ x, y })
  }

  const handleDelete = async () => {
    try {
      setShowDeleteModal(false); // Close modal first
      await deletePost(id);
      console.log('Post deleted successfully:', id);
      
      // Store the deleteUrl for manual cleanup later
      const deletionUrls = JSON.parse(localStorage.getItem('deletionUrls') || '[]');
      deletionUrls.push(deleteUrl);
      localStorage.setItem('deletionUrls', JSON.stringify(deletionUrls));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  return (
    <motion.div
      className="relative group w-[320px]" // Add fixed width to parent
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Cursor following glow */}
      <motion.div
        className="absolute -inset-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none"
        animate={{
          background: `
            radial-gradient(
              600px circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(244, 63, 94, 0.15),
              rgba(244, 63, 94, 0.1) 20%,
              rgba(251, 113, 133, 0.05) 30%,
              transparent 50%
            )
          `,
        }}
        style={{
          filter: 'blur(30px)',
          transform: 'translateZ(0)',
          willChange: 'background',
        }}
      />

      {/* Card */}
      <motion.div
        className="relative bg-white rounded-xl overflow-hidden will-change-transform w-full"
        whileHover={{ 
          scale: 1.05,
          transition: { 
            type: "spring",
            stiffness: 900,
            damping: 30,
            mass: 0.5,
            duration: 0.2
          }
        }}
        style={{
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Add Delete Button */}
        <motion.button
          className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:bg-rose-50"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </motion.button>

        <div className="w-full"> {/* Remove w-72 class */}
          {/* Image Area - Removed overlay effects */}
          <div className="aspect-square w-full relative overflow-hidden"> {/* Replace height with aspect ratio */}
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={description}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                }}
              />
            ) : (
              <div className={`w-full h-full bg-${color}-200 flex items-center justify-center`}>
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          {/* Enhanced Bottom Section */}
          <motion.div 
            className="p-4 bg-white h-[80px] overflow-hidden" // Add fixed height to description area
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-2">
              <motion.p 
                className="text-gray-900 text-sm font-medium flex-1"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {description}
              </motion.p>
              
              {/* Simplified Like Button */}
              <motion.div 
                onClick={() => toggleLike({ id, color, description, imageUrl })} // Added imageUrl here
                whileTap={{ scale: 0.85, transition: { duration: 0.1 } }}
                whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
                className="relative cursor-pointer"
              >
                <AnimatePresence>
                  {isLiked && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </AnimatePresence>
                <motion.svg 
                  animate={{ 
                    scale: isLiked ? [1, 1.2, 1] : 1,
                    rotate: isLiked ? [0, 15, -15, 0] : 0
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                  className={`w-6 h-6 ${isLiked ? 'text-rose-500 fill-current' : 'text-gray-400 stroke-current'}`} 
                  viewBox="0 0 24 24"
                  fill={isLiked ? 'currentColor' : 'none'}
                  strokeWidth="2"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </motion.svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </motion.div>
  )
}

export default Post
