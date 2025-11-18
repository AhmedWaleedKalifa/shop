import React from 'react'
import { Link } from 'react-router'

function CategoryCard({ id,leftImage, rightImage, name, buttonText }) {
  return (
   <>
    <Link to={`/category/${id}`} className="flex w-full h-[90vh] relative">
      <div 
        className="w-full lg:w-1/2 relative bg-cover bg-center md:bg-top-left bg-no-repeat"
        style={{ backgroundImage: `url(${leftImage})` }}
      >
      
      </div>

      <div 
        className="hidden lg:block lg:w-1/2 bg-cover  bg-no-repeat"
        style={{ backgroundImage: `url(${rightImage})` }}
      />
       <div className="absolute bottom-26  w-full  flex flex-col justify-center items-center pb-12">
          <p className="text-white  text-5xl font-bold mb-4">{name}</p>
          <button  className=" text-white underline px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            {buttonText}
          </button>
        </div>
    </Link>
     
   </>
  )
}

export default CategoryCard