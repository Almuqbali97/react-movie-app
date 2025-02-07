// import { useState, useEffect, useCallback } from 'react';
// import Search from './components/Search';
// import { MOVIES_API_BASE_URL } from './consts';
// import Spinner from './components/Spinner';
// import MovieCard from './components/MovieCard';
// import { debounce } from 'lodash';
// import "./App.css";

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// const API_OPTIONS = {
//     method: "GET",
//     headers: {
//         accept: "application/json",
//         Authorization: `Bearer ${API_KEY}`
//     }
// };

// const App = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [moviesList, setMoviesList] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     // debouncing is important when fetching data from an API instead of the data being fitched every letter typed
//     // useCallback is important for optimizaion which prevents the search funciton from being crated on every new debounce
//     // we can use (react-use) library and use useDebounce from it for simpler and cleaner code
//     const fetchMovies = useCallback(debounce(async (query) => {
//         setIsLoading(true);
//         setErrorMessage('');
//         try {
//             // encodeURIComponent is important to avoid unsafe URL inputs and makes shure all the inputs follows the URL rules
//             const endpoint = query ? `${MOVIES_API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
//                 : `${MOVIES_API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
//             const response = await fetch(endpoint, API_OPTIONS);
//             const data = await response.json();
//             if (data.Response === "False") {
//                 setErrorMessage(data.Error || "Error fetching movies. Please try later");
//                 setMoviesList([]);
//                 // setIsLoading(false);
//                 return;
//             }
//             setMoviesList(data.results || []);
//             // setIsLoading(false);
//         } catch (error) {
//             console.error("Error fetching movies " + error);
//             setErrorMessage("Error fetching movies. Please try later");
//         } finally {
//             setIsLoading(false);
//         }
//     }, 700), []);


//     // calling the fetch function inside useEffect so the side effect gets hanndled
//     useEffect(() => {
//         fetchMovies(searchTerm);
//     }, [searchTerm]);

//     return (
//         <main>
//             <div className="pattern" />

//             <div className="wrapper">
//                 <header>
//                     <img src="./hero.png" alt="Hero Banner" />
//                     <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

//                     <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//                 </header>

//                 <section className="all-movies">
//                     <h2 className='mt-7'>All Movies</h2>
//                     {isLoading ? (
//                         <Spinner />
//                     ) : errorMessage ? (
//                         <p className="text-red-500">{errorMessage}</p>
//                     ) : (
//                         <ul>
//                             {moviesList.map((movie) => (
//                                 <MovieCard key={movie.id} movie={movie} />
//                             ))}
//                         </ul>
//                     )}
//                 </section>
//             </div>
//         </main>
//     );
// };

// export default App;

