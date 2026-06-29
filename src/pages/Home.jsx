import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Listing from '../components/Listing'
import Footer from '../components/Footer'
import { clothes } from '../data/clothingData'
import { useCategoryContext } from '../context/CategoryContext'

const Home = () => {

  const clothing = clothes;
  const { searchTerm } = useCategoryContext();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      {!searchTerm || !searchTerm.trim() ? <Hero /> : null}
      <Listing clothing={clothing}/>
      <Footer/>
    </div>
  )
}

export default Home
