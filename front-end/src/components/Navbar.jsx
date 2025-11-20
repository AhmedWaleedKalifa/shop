import React from 'react'
import { categoryService } from "../services/categoryService"
import { useEffect } from 'react';
import { useState } from 'react';
import {Link, useLocation} from "react-router-dom"
import Searchbar from './Searchbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
function Navbar() {
    const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const location =useLocation()
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

      // Check if link is active
      const isActive = (path) => {
        if (path === '/') {
          return location.pathname === '/';
        }
        return location.pathname === path;
      };

  return (
    <>
   
    <div className='flex flex-col sticky left-0 top-0  z-40 max-w-[100vw] h-auto m-0 p-0'>
       <Link to="/search">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-4 top-4" />
    </Link>
      <div className='bg-white flex flex-row justify-center'>
        <img src="logo.jpg" alt="logo" className='h-12 bg-cover ' />
      </div>
      <div className='bg-white '>
      {
        loading&& <p>Loading...</p>
      }
      {categories&& <ul className='flex flex-row text-nowrap w-full gap-3 overflow-x-auto  pl-2 lg:pl-8 p-1'>
          <Link 
          to="/"
          title="home"
          >
            
          <li className={`${isActive('/') ? 'activeLink' : 'link'}`} >Home</li>
          </Link>
          {categories.map(e=>(
             <Link 
          to={`/category/${e.id}`}
          title="home"
          key={e.id}
          >
            
            <li className={`${isActive(`/category/${e.id}`) ? 'activeLink' : 'link'}`} key={e.id}>{e.name}</li>
          </Link>
          ))}
        </ul>}
      </div>
    </div>
    </>
  )
}

export default Navbar