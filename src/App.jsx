import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Upload from './components/Upload'
import Post from './components/Post'
import './App.css'
import { LikesProvider, useLikes } from './context/LikesContext'

const FavoritesList = () => {
  const { likedPosts } = useLikes()
  
  if (likedPosts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 text-lg">
        No favorite moments yet! Start liking some posts to see them here. ✨
      </div>
    )
  }

  return likedPosts.map(post => (
    <Post key={post.id} {...post} />
  ))
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const sections = document.querySelectorAll('section')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentPage(entry.target.id)
        }
      })
    }, { threshold: 0.5 })

    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    section?.scrollIntoView({ behavior: 'smooth' })
  }

  const posts = [
    { id: 1, color: "rose", description: "Lazy Sunday afternoon 😺" },
    { id: 2, color: "blue", description: "Window watching! 🪟" },
    { id: 3, color: "green", description: "Nap time is the best time 😴" },
    { id: 4, color: "yellow", description: "Playing with yarn 🧶" },
    { id: 5, color: "purple", description: "Exploring the garden 🌿" },
    { id: 6, color: "pink", description: "Cuddle time! 💕" },
  ]

  return (
    <LikesProvider>
      <div className="w-full bg-white">
        <Navbar currentPage={currentPage} setCurrentPage={scrollToSection} />
        
        <section id="home" className="h-screen w-full">
          <Home />
        </section>

        <section id="explore" className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Explore <span className="text-rose-500">MeowMents</span>
            </h2>
            <p className="mt-2 text-gray-600">Discover adorable moments from fellow cat lovers!</p>
          </div>
          <div className="max-w-[90%] mx-auto flex flex-wrap justify-center gap-8">
            {posts.map(post => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        </section>

        <section id="upload" className="min-h-screen w-full py-24">
          <Upload />
        </section>

        <section id="favorites" className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Your Favorite <span className="text-rose-500">MeowMents</span>
            </h2>
            <p className="mt-2 text-gray-600">A collection of your most treasured memories!</p>
          </div>
          <div className="max-w-[90%] mx-auto flex flex-wrap justify-center gap-8">
            <FavoritesList />
          </div>
        </section>
      </div>
    </LikesProvider>
  )
}

export default App
