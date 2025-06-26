import React from 'react'

const SearchBar = ({ query, setQuery }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search notes..."
                className="form-control my-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    )
}

export default SearchBar
