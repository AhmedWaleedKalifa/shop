import React from 'react'
import { Link } from 'react-router-dom'

function CategoryCard({ id, leftImage, name,priority }) {
  return (
   <Link 
    to={`/page/category/${id}`} 
    className='relative w-60 h-80 font-bold text-2xl cursor-pointer hover:scale-105 duration-300 transition-all bg-cover bg-center rounded-xl border-2 border-white overflow-hidden group'
    aria-label={`Browse ${name} category`}
    style={{ backgroundImage: `url(${leftImage})` }}
>
    {/* Dark overlay for better text visibility */}
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
    
    {/* Category name */}
    <div className="absolute inset-0 flex  flex-col items-center justify-center p-4">
        <h2 className='text-white'>{priority}</h2>
        <h2 className="text-white text-3xl lg:text-5xl font-bold text-center font-heading tracking-wide capitalize drop-shadow-lg">
            {name}
        </h2>
    </div>
</Link>
  )  
}

export default CategoryCard