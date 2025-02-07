import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search">
            <div>
                <img src="/search.svg" alt="Search" />
                <input
                    className='rounded-lg outline-indigo-400 focus:outline-1 focus:outline-indigo-400 transition-all  duration-500'
                    type="text"
                    placeholder="Search through millions of movies"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

    );
};

export default Search;
