import React from 'react'
import { categoryService } from "../services/categoryService"
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
   

   

    return (
        <nav className=' flex flex-col sticky left-0 top-0 z-50 max-w-[100vw] h-auto m-0 p-0 bg-white/90 backdrop-blur-sm border-b border-gray/20 justify-center' title='Search'
        >
            <Link to="/search" aria-label="Search products">
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute right-2 md:right-8 top-4 font-body text-black hover:text-yellow transition-all duration-300"
                />
            </Link>

            <Link className='flex flex-row justify-center ' to="/" title='Logo'>
                <img
                    src="/logo.jpg"
                    alt="Werzu Store logo"
                    className='h-12 bg-cover font-body'
                />
            </Link>

         
        </nav>
    )
}

export default Navbar