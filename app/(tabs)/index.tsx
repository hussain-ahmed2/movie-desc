import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingMovieCard from "@/components/TrendingMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/db";
import { useFetch } from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
	const router = useRouter();

	const { data: trendingMovies, loading: isTrendingLoading, error: trendingError } = useFetch(getTrendingMovies);

	const {
		data: movies,
		loading: isMoviesLoading,
		error: movieError,
	} = useFetch<Movie[]>(() => fetchMovies({ query: "" }));

	const handleSearch = useCallback(() => router.push("/search"), [router]);

	const isLoading = isMoviesLoading || isTrendingLoading;
	const error = movieError || trendingError;

	const ListHeader = useCallback(
		() => (
			<>
				<Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

				{isLoading ? (
					<ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
				) : error ? (
					<Text className="text-red-500 text-center mt-10">{error.message}</Text>
				) : (
					<>
						<SearchBar onPress={handleSearch} placeholder="Search for a movie" />

						{!!trendingMovies?.length && (
							<View className="mt-10">
								<Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
								<FlatList
									horizontal
									showsHorizontalScrollIndicator={false}
									ItemSeparatorComponent={() => <View className="w-4" />}
									data={trendingMovies}
									renderItem={({ item, index }) => <TrendingMovieCard {...item} index={index} />}
									keyExtractor={(item) => item.id.toString()}
									className="mb-4 mt-3"
								/>
							</View>
						)}

						<Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
					</>
				)}
			</>
		),
		[isLoading, error, trendingMovies, handleSearch],
	);

	return (
		<View className="flex-1 bg-primary">
			<Image source={images.bg} className="absolute w-full z-0" />
			<FlatList
				data={movies ?? []}
				renderItem={({ item }) => <MovieCard {...item} />}
				keyExtractor={(item) => item.id.toString()}
				numColumns={3}
				columnWrapperStyle={{
					justifyContent: "flex-start",
					gap: 20,
					paddingRight: 5,
					marginBottom: 10,
				}}
				ListHeaderComponent={ListHeader}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
			/>
		</View>
	);
}
