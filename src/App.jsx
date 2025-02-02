import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return <Home />
      case 'upload':
        return <div className="p-8 text-xl">Upload Content Coming Soon</div>
      case 'explore':
        return <div className="p-8 text-xl">Explore Content Coming Soon</div>
      case 'favorites':
        return <div className="p-8 text-xl">Favorites Content Coming Soon</div>
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-white w-full overflow-hidden">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main>
        {renderContent()}
      </main>
    </div>
  )
}

export default App
