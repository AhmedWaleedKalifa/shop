// components/SearchBar.jsx
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchBar() {


  return (
  
        <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
    
  );
}

export default SearchBar;