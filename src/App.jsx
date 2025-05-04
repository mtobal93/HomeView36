// import "./App.css";
import { useEffect } from "react";
import { useState } from "react";

const Cards = ({title}) => {
	const [count, setCount] = useState(0)
	const [hasLiked, setHasLiked] = useState(false)
	useEffect(() => {
		console.log(`Card ${title} has been liked: ${hasLiked}`);
		
	})

	return(

			<div className="card">
				{/* <img src="https://picsum.photos/200/300" alt="Card 1" /> */}
				<h2>{title}</h2>
				<button onClick={() => setHasLiked(!hasLiked)}>
					{ hasLiked ? "❤️" : "🤍" }
				</button>
			</div>
	)
}

const App = () => {

	return (
		<div className="card-container">
			<Cards title="Happy"/>
			<Cards title="Lonely"/>
			<Cards title="Crowdy"/>
			<Cards title="Tired"/>
		</div>
	);
}

export default App;
