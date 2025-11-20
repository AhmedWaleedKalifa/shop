// components/SearchBar.jsx
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchBar() {


  return (
    <form  className="w-full h-16 flex flex-row items-center justify-center  relative">
      <label htmlFor="search">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
      </label>
      <input
        type="text"
        id="search"
        name="search"
        placeholder="Search"
        className="searchInput"
      />
    </form>
  );
}

export default SearchBar;