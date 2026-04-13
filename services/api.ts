// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2YyMDAxZWZkYjFiYTQwZDEyNDZkODY1ZTVlOTBhZSIsIm5iZiI6MTc3NjA2NzQ3Ny45NTEsInN1YiI6IjY5ZGNhMzk1MTQzN2I3YTE0NWQ5M2EyOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UB6K3j0QqhNR5jsilOcAys7gOTy767rX3ZnwPNhn954'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));

export const TMDB_CONFIG = {
	BASE_URL: "https://api.themoviedb.org/3",
	API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
	},
};

export const fetchMovies = async ({ query }: { query: string }) => {
	const endpoint = query
		? `/search/movie?query=${encodeURIComponent(query)}`
		: "/discover/movie?sort_by=popularity.desc";

	const response = await fetch(`${TMDB_CONFIG.BASE_URL}${endpoint}`, {
		method: "GET",
		headers: TMDB_CONFIG.headers,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.statusText}`);
	}

	const data = await response.json();
	return data.results;
};

export const fetchMovieDetails = async (movieId: string) => {
	const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
		method: "GET",
		headers: TMDB_CONFIG.headers,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.statusText}`);
	}

	const data = await response.json();
	return data;
};
