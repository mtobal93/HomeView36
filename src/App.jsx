import React, { useEffect, useState } from "react";
import Search from "./components/search.jsx";
import Spinner from "./components/Spinner.jsx";

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

	const fetchMovies = async () => {
		setIsLoading(true);
		setErrorMessage("");
		try {
			const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

			const res = await fetch(endpoint, API_OPTIONS);
			if (!res.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await res.json();
			if (data.Response === "False") {
				setErrorMessage(data.Error || "Failed to fetch movies");
				setMovieList([]);
			}

			setMovieList(data.results || []);
		} catch (error) {
			console.error(`Error fetching movies: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMovies();
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

					<section className="all-movies">
						<h2 className="mt-[40px]">All Movies</h2>

						{/* {errorMessage && (
							<p className="text-red-500">{errorMessage}</p>
						)} */}

						{isLoading ? (
							<Spinner />
						) : errorMessage ? (
							<p className="text-red-500">{errorMessage}</p>
						) : (
							<ul>
								{movieList.map((movie) => (
									<p key={movie.id} className="text-white">
										{movie.title}
									</p>
								))}
							</ul>
						)}
					</section>

					<h1 className="text-white">{searchTerm}</h1>
				</div>
			</div>
		</main>
	);
};

export default App;
