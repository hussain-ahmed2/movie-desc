import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MovieWithCount extends Movie {
	count: number;
	searchQuery: string;
}

const MOVIES_KEY = "movies";

export const updateSearchCount = async (query: string, movie?: Movie) => {
	const result = await AsyncStorage.getItem(MOVIES_KEY);
	const movies: MovieWithCount[] = result ? JSON.parse(result) : [];

	if (movie) {
		const existingMovie = movies.find((m) => m.id === movie.id);

		if (existingMovie) {
			existingMovie.count += 1;
		} else {
			movies.push({
				...movie,
				searchQuery: query,
				count: 1,
			});
		}

		await AsyncStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
	}

	return movies;
};

export const getTrendingMovies = async () => {
	const result = await AsyncStorage.getItem(MOVIES_KEY);
	const movies: MovieWithCount[] = result ? JSON.parse(result) : [];

	return movies.sort((a, b) => b.count - a.count).slice(0, 5);
};
