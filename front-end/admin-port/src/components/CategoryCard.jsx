import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'

function CategoryCard({ id, leftImage, name, priority }) {
    return (
        <div
            className='relative w-60 h-80 font-bold text-2xl  bg-cover bg-center rounded-xl border-2 border-white overflow-hidden group'
            aria-label={`Browse ${name} category`}
            style={{ backgroundImage: `url(${leftImage})` }}
        >
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/40 " />

            {/* Category name */}
            <div className="absolute inset-0 flex  flex-col items-center justify-center p-4">
                <h2 className='text-white'>{priority}</h2>
                <h2 className="text-white text-3xl lg:text-5xl font-bold text-center font-heading tracking-wide capitalize drop-shadow-lg">
                    {name}
                </h2>
                <div className='text-sm text-whiten absolute right-4  bottom-4'>
                    <Link to={`/page/category/${id}`}
                    > <FontAwesomeIcon icon={faPen} className='text-blue mr-2' /></Link>
                    <FontAwesomeIcon icon={faTrash} className='text-red' />
                </div>
            </div>
        </div>
    )
}

export default CategoryCard