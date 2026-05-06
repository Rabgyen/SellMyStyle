import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Listing from '../components/Listing'
import Footer from '../components/Footer'
import { clothes } from '../data/clothingData'

const Home = () => {

  const clothing = clothes;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <Hero/>
      <Listing clothing={clothing}/>
      <Footer/>
    </div>
  )
}

export default Home
