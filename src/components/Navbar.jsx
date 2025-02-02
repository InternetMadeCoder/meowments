import { useState } from 'react'

const Navbar = ({ setCurrentPage, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (page) => {
    setCurrentPage(page)
    setIsOpen(false)
  }

  const NavItem = ({ page, label }) => (
    <span 
      onClick={() => handleNavClick(page)}
      className={`cursor-pointer transition-colors hover:text-rose-400 ${
        currentPage === page ? 'text-rose-500 font-medium' : 'text-black'
      }`}
    >
      {label}
    </span>
  )

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/20 border-b border-white/20 shadow-lg shadow-black/5 z-50">
      <div className="w-full mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0 pl-3 backdrop-blur-md bg-white/30 rounded-lg py-1 px-3">
            <img src="/paw.jpg" alt="MeowMents Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="ml-3 text-xl font-semibold text-black">MeowMents</span>
          </div>

          {/* Desktop Navigation - pushed to right */}
          <div className="hidden md:flex ml-auto space-x-6 pr-3">
            <NavItem page="home" label="Home" />
            <NavItem page="explore" label="Explore" />
            <NavItem page="upload" label="Upload" />
            <NavItem page="favorites" label="Favorites" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto pr-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-3 backdrop-blur-xl bg-white/10 border-t border-white/20">
            <span onClick={() => handleNavClick('home')} className={`block cursor-pointer px-3 py-1 text-black hover:text-rose-400 transition-colors ${currentPage === 'home' ? 'text-rose-500' : ''}`}>Home</span>
            <span onClick={() => handleNavClick('upload')} className={`block cursor-pointer px-3 py-1 text-black hover:text-rose-400 transition-colors ${currentPage === 'upload' ? 'text-rose-500' : ''}`}>Upload</span>
            <span onClick={() => handleNavClick('explore')} className={`block cursor-pointer px-3 py-1 text-black hover:text-rose-400 transition-colors ${currentPage === 'explore' ? 'text-rose-500' : ''}`}>Explore</span>
            <span onClick={() => handleNavClick('favorites')} className={`block cursor-pointer px-3 py-1 text-black hover:text-rose-400 transition-colors ${currentPage === 'favorites' ? 'text-rose-500' : ''}`}>Favorites</span>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
