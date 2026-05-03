import React from 'react'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import Listing from './components/Listing'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <Hero/>
      <Listing/>
    </div>
  )
}

export default App
