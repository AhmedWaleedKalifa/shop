import React from 'react'
import { Link } from 'react-router'

function Error() {

  return (
<main className='w-full flex flex-col items-center justify-center h-screen bg-white font-body' role="main">
    <div className="text-center">
        <h1 className='text-6xl text-red font-heading tracking-wider mb-4'>
            ERROR 404
        </h1>
        <p className='text-gray text-lg font-body mb-6'>
            Page not found
        </p>
        <Link 
            to="/"
            className='inline-block bg-yellow text-black px-6 py-3 rounded-lg font-body font-semibold hover:bg-black hover:text-yellow transition-all duration-300'
        >
            Return to Homepage
        </Link>
    </div>
</main>  )
}

export default Error