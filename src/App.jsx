import { useState, useEffect } from 'react';
import Search from './components/Search';
import { MOVIES_API_BASE_URL } from './consts';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './backend/appwrite';
import { API_KEY } from './consts';
// import { debounce } from 'lodash';

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, seTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);
  // debouncing is important when fetching data from an API instead of the data being fitched every letter typed
  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // encodeURIComponent is important to avoid unsafe URL inputs and makes shure all the inputs follows the URL rules
      const endpoint = query ? `${MOVIES_API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${MOVIES_API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Error fetching movies. Please try later");
        setMoviesList([]);
        return;
      }
      setMoviesList(data.results || []);
      //update trending movies list based on search if a search happens
      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies " + error);
      setErrorMessage("Error fetching movies. Please try later");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      seTrendingMovies(movies);
    } catch (error) {
      console.log(error);
    }
  };

  // calling the fetch function inside useEffect so the side effect gets hanndled
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  // fetch treding movies only first time the user opens the page
  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2 className='mt-7'>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => {
                return <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>;
              })}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2 className='mt-7'>Popular</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

