import React from 'react'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router';
function Searchbar() {
  return (
    <>
    <Link to="/search">
        <FontAwesomeIcon icon={faMagnifyingGlass} className='fixed right-3 top-5 z-50 '/>
    </Link>
    </>
  )
}

export default Searchbar