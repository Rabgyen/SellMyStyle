import React from 'react'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import Listing from './components/Listing'
import { CategoryProvider } from './context/CategoryContext'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <Hero/>
      <CategoryProvider>
        <Listing/>
      </CategoryProvider>
    </div>
  )
}

export default App
