import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/db";
import { useFetch } from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
export default function Search() {
	const [searchQuery, setSearchQuery] = useState("");

	const {
		data: movies,
		loading: isMoviesLoading,
		error: movieError,
		refetch,
		reset,
	} = useFetch<Movie[]>(() => fetchMovies({ query: searchQuery }), false);

	useEffect(() => {
		const timer = setTimeout(async function () {
			if (searchQuery.trim()) {
				const data = await refetch();
				if (data?.length && !!data?.[0]) {
					await updateSearchCount(searchQuery, data[0]);
				}
			} else {
				reset();
			}
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery, refetch, reset]);

	return (
		<View className="flex-1 bg-primary">
			<Image source={images.bg} className="absolute w-full z-0" />

			<FlatList
				data={movies}
				renderItem={({ item }) => <MovieCard {...item} />}
				keyExtractor={(item) => item.id.toString()}
				className="px-5 "
				numColumns={3}
				columnWrapperStyle={{ justifyContent: "center", gap: 16, marginVertical: 16 }}
				contentContainerStyle={{ paddingBottom: 100 }}
				ListHeaderComponent={
					<>
						<View className="w-full flex-row justify-center mt-20 items-center ">
							<Image source={icons.logo} className="w-12 h-10" />
						</View>

						<View className="my-5">
							<SearchBar
								placeholder="Search movies..."
								value={searchQuery}
								onChangeText={(text) => setSearchQuery(text)}
							/>
						</View>

						{isMoviesLoading && (
							<ActivityIndicator size="large" color="#0000ff" className="my-3 self-center" />
						)}

						{movieError && <Text className="text-red-500 px-5 my-3 text-center">{movieError.message}</Text>}

						{!isMoviesLoading && !movieError && !!searchQuery.trim() && !!movies?.length && (
							<Text className="text-xl text-white font-bold">
								Search result for&nbsp;
								<Text className="text-accent">{searchQuery.trim()}</Text>
							</Text>
						)}
					</>
				}
				ListEmptyComponent={
					!isMoviesLoading && !movieError ? (
						<View className="mt-10 px-5">
							<Text className="text-center text-gray-500">
								{searchQuery.trim() ? "No results found" : "Search for movies..."}
							</Text>
						</View>
					) : null
				}
			/>
		</View>
	);
}
