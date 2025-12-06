import React from 'react'
import Navbar from './Navbar';
import { Outlet } from 'react-router';
import Footer from './Footer';
function PageTemplate() {
  return (
    <>
      <Navbar />
      <div className='lg:px-8'>
        <Outlet />

      </div>
      <Footer/>
    </>
  );
}

export default PageTemplate