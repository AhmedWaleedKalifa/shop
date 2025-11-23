import React from 'react'
import { categoryService } from "../services/categoryService"
import { useEffect } from 'react';
import { useState } from 'react';
import {Link, useLocation} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await categoryService.getAll();
                setCategories(Array.isArray(data) ? data : data.categories || []);
            }  finally {
                setLoading(false);
            }
        }
    
        loadCategories();
    }, []);

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname === path;
    };

    return (
        <nav className=' flex flex-col sticky left-0 top-0 z-50 max-w-[100vw] h-auto m-0 p-0 bg-white/90 backdrop-blur-sm border-b border-gray/20'>
            <Link to="/search" aria-label="Search products">
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute right-4 top-4 font-body" 
                />
            </Link>
            
            <header className='flex flex-row justify-center'>
                <img 
                    src="logo.jpg" 
                    alt="Werzu Store logo" 
                    className='h-12 bg-cover font-body' 
                />
            </header>
            
            <section className=''>
                {loading && (
                    <p className="font-body">Loading...</p>
                )}
                
                {categories && (
                    <ul 
                        role="navigation" 
                        aria-label="Main categories"
                        className='flex flex-row text-nowrap w-full gap-3 overflow-x-auto pl-2 lg:pl-8 p-1 font-body'
                    >
                        <li>
                            <Link to="/" title="Home">
                                <span className={`${isActive('/') ? 'activeLink' : 'link'} font-body-medium`}>
                                    Home
                                </span>
                            </Link>
                        </li>
                        
                        {categories.map(category => (
                            <li key={category.id}>
                                <Link to={`/category/${category.id}`} title={category.name}>
                                    <span className={`${isActive(`/category/${category.id}`) ? 'activeLink' : 'link'} font-body`}>
                                        {category.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </nav>
    )
}

export default Navbar