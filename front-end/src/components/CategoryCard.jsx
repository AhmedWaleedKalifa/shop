import React from 'react'
import { Link } from 'react-router-dom'

function CategoryCard({ id, leftImage, rightImage, name, buttonText }) {
  return (
    <Link to={`/category/${id}`} className="flex flex-col md:flex-row w-full  md:aspect-auto md:h-[90vh]  relative">
      {/* Left Image Section */}
      <div 
        className="w-full md:w-1/2 relative bg-cover bg-center  bg-no-repeat aspect-2/3 md:aspect-auto"
        style={{ backgroundImage: `url(${leftImage})` }}
      />
      
      {/* Right Image Section - Hidden on mobile, shown on desktop */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-no-repeat aspect-square md:aspect-auto"
        style={{ backgroundImage: `url(${rightImage})` }}
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 lg:pb-12">
        <p className="text-white text-3xl lg:text-5xl font-bold mb-4 text-center">{name}</p>
        <button className="text-white underline px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:text-black transition duration-300">
          {buttonText}
        </button>
      </div>
    </Link>
  )
}

export default CategoryCard