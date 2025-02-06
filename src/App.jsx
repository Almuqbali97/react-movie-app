import react, { useState, useEffect } from 'react';
import Search from './components/Search';
import { MOVIES_API_BASE_URL } from './consts';
import Spinner from './components/Spinner';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${MOVIES_API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Error fetching movies. Please try later");
        setMoviesList([]);
        // setIsLoading(false);
        return;
      }
      setMoviesList(data.results || []);
      // setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies " + error);
      setErrorMessage("Error fetching movies. Please try later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='/hero.png' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movies</span> you'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className=' all-movies'>
          <h2 className='py-7'>All Movies</h2>
        </section>
        {isLoading ? (
          <p className=' mx-auto my-7'>{<Spinner />}</p>
        ) : errorMessage ? (
          <p className=' text-red-500'>{errorMessage}</p>
        ) : (
          <ul>
            {moviesList.map((movie) => {
              return <p key={movie.id} className=' text-white'>{movie.title}</p>;
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

export default App;

