import React from 'react'
import Navbar from './Navbar';
import { Outlet } from 'react-router';
function PageTemplate() {
  return (
    <>
    <Navbar/>
            <Outlet/>

    </>
  );  
}

export default PageTemplate