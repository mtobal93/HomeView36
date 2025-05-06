import React, { useEffect, useState } from "react";
import Search from "./components/search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { updateSearchCount, getTendingMovies } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};
const App = () => {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [movieList, setMovieList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();

	const [trendingMovies, setTrendingMovies] = useState([]);
	const [trendingMoviesLoading, setTrendingMoviesLoading] = useState(false);
	const [trendingMoviesError, setTrendingMoviesError] = useState("");

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

	const fetchMovies = async (query = "") => {
		setIsLoading(true);
		setErrorMessage("");
		try {
			const endpoint = query
				? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

			const res = await fetch(endpoint, API_OPTIONS);
			if (!res.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await res.json();
			if (data.Response === "False") {
				setErrorMessage(data.Error || "Failed to fetch movies");
				setMovieList([]);
				return;
			}

			setMovieList(data.results || []);

			if (query && data.results.length > 0) {
				// Update search count in Appwrite
				await updateSearchCount(query, data.results[0]);
			}
		} catch (error) {
			console.error(`Error fetching movies: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const loadTrendingMovies = async () => {
		setTrendingMoviesLoading(true);
		setTrendingMoviesError("");

		try {
			const movies = await getTendingMovies();
			setTrendingMovies(movies);
		} catch (error) {
			setTrendingMoviesError("Failed to fetch trending movies");
			console.error(`Error fetching trending movies: ${error}`);
		} finally {
			setTrendingMoviesLoading(false);
		}
	};

	useEffect(() => {
		fetchMovies(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	useEffect(() => {
		loadTrendingMovies();
	}, []);

	return (
		<main>
			<div className="pattern">
				<div className="wrapper">
					<header>
						<img src="./hero.png" alt="Hero Banner" />
						<h1>
							The <span className="text-gradient">Movies</span>{" "}
							You Enjoy are All Here in One Place
						</h1>
						<Search
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
					</header>

					{trendingMovies.length > 0 && (
						<section className="trending">
							<h2>Trending Movies</h2>

							{trendingMoviesLoading ? (
								<Spinner />
							) : trendingMoviesError ? (
								<p className="text-red-500">
									{trendingMoviesError}
								</p>
							) : (
								<ul>
									{trendingMovies.map((movie, index) => (
										<li key={movie.$id}>
											<p>{index + 1}</p>
											<img
												src={movie.poster_url}
												alt={movie.title}
											/>
										</li>
									))}
								</ul>
							)}
						</section>
					)}

					<section className="all-movies">
						<h2>All Movies</h2>

						{isLoading ? (
							<Spinner />
						) : errorMessage ? (
							<p className="text-red-500">{errorMessage}</p>
						) : (
							<ul>
								{movieList.map((movie) => (
									<MovieCard key={movie.id} movie={movie} />
								))}
							</ul>
						)}
					</section>
				</div>
			</div>
		</main>
	);
};

export default App;
