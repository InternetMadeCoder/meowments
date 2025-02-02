import { useLikes } from '../context/LikesContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Post = ({ id, color = "rose", description = "A cute moment..." }) => {
  const { likedPosts, toggleLike } = useLikes()
  const isLiked = likedPosts.some(post => post.id === id)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      className="relative group"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Enhanced cursor following glow */}
      <motion.div
        className="absolute -inset-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
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
        className="relative bg-white rounded-xl overflow-hidden will-change-transform"
        whileHover={{ 
          y: -12,
          scale: 1.02,
          transition: { 
            type: "spring",
            stiffness: 900,
            damping: 30,
            mass: 0.5
          }
        }}
        style={{
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="w-64">
          {/* Enhanced Polaroid Image Area */}
          <div className={`w-full h-56 bg-${color}-200 relative overflow-hidden group/image`}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                backgroundSize: '200% 200%',
                opacity: 0
              }}
              whileHover={{
                opacity: 1,
                transition: { duration: 0.3 }
              }}
              animate={{
                backgroundPosition: ['200% 200%', '-50% -50%'],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }
              }}
            />
          </div>
          
          {/* Enhanced Bottom Section */}
          <motion.div 
            className="p-4 bg-white"
            initial={{ background: 'rgba(255, 255, 255, 1)' }}
            whileHover={{ background: 'rgba(255, 255, 255, 0.95)' }}
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
                onClick={() => toggleLike({ id, color, description })}
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
    </motion.div>
  )
}

export default Post
