import React from 'react'
import Navbar from './Navbar';
import { Outlet } from 'react-router';
function PageTemplate() {
  return (
    <>
    <Navbar/>
    <div className='lg:px-8'>
                  <Outlet/>

    </div>
    </>
  );  
}

export default PageTemplate