import React from 'react'
import { Link } from 'react-router-dom'

function CategoryCard({ id, leftImage, rightImage, name, buttonText }) {
  return (
   <Link 
    to={`/category/${id}`} 
    className="flex flex-col md:flex-row w-full md:aspect-auto md:h-[90vh] relative font-body"
    aria-label={`Browse ${name} category`}
>
    {/* Left Image Section */}
    <figure 
        className="w-full md:w-1/2 relative bg-cover bg-center bg-no-repeat aspect-2/3 md:aspect-auto"
        style={{ backgroundImage: `url(${leftImage})` }}
    />
    
    {/* Right Image Section - Hidden on mobile, shown on desktop */}
    <figure 
        className="hidden md:block md:w-1/2 bg-cover bg-no-repeat aspect-square md:aspect-auto"
        style={{ backgroundImage: `url(${rightImage})` }}
    />
    
    {/* Content Overlay */}
    <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 lg:pb-12">
        <h2 className="text-white text-3xl lg:text-5xl font-bold mb-4 text-center font-heading tracking-wide">
            {name}
        </h2>
        <span className="text-white underline px-6 py-3 rounded-lg font-body font-semibold  transition duration-300">
            {buttonText}
        </span>
    </div>
</Link>
  )
}

export default CategoryCard