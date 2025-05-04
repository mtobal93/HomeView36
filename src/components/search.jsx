import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
	return (
		<div className="search">
			<div>
				<img src="./search.svg" alt="search" />

				<input
					type="text"
					placeholder="Search for your Movie"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					// onKeyDown={(e) => {
					//     if (e.key === "Enter") {
					//         setSearchTerm(e.target.value)
					//     }
					// }}
				/>
			</div>
		</div>
	);
};

export default Search;
