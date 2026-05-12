import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../styles/SearchBar.css';

const SearchBar = ({ query, setQuery }) => {
  return (
    <div className="searchbar-wrap">
      <FontAwesomeIcon icon={faSearch} className="searchbar-icon" />
      <input
        type="text"
        className="input-dark searchbar-input"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
