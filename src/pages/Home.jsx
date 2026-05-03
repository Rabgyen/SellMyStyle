import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Listing from '../components/Listing'
import { CategoryProvider } from '../context/CategoryContext'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <Hero/>
      <CategoryProvider>
        <Listing/>
        <Footer/>
      </CategoryProvider>
    </div>
  )
}

export default Home
