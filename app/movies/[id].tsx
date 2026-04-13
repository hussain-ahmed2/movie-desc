import { icons } from "@/constants/icons";
import { resolveTMDBImage } from "@/lib/utils";
import { fetchMovieDetails } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const MovieInfo = ({ label, value }: { label: string; value?: string | number | null }) => (
	<View className="flex-col items-start justify-center mt-5">
		<Text className="text-light-200 font-normal text-sm">{label}</Text>
		<Text className="text-light-100 font-bold text-sm mt-2">{value || "N/A"}</Text>
	</View>
);

export default function MovieDetails() {
	const { id } = useLocalSearchParams();
	const router = useRouter();

	const {
		data: movie,
		loading: isMovieLoading,
		error: movieError,
	} = useFetch<MovieDetails>(() => fetchMovieDetails(id as string));

	return (
		<View className="bg-primary flex-1">
			<ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
				{isMovieLoading && <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />}
				{movieError && <Text className="text-red-500 text-center mt-10">Error: {movieError.message}</Text>}
				{movie && (
					<>
						<View>
							<Image
								source={{
									uri: resolveTMDBImage(movie?.poster_path),
								}}
								className="w-full h-[550px]"
								resizeMode="stretch"
							/>
						</View>

						<View className="flex-col items-start justify-center mt-5 px-5">
							<Text className="text-white font-bold text-xl">{movie?.title}</Text>

							<View className="flex-row items-center gap-x-1 mt-2">
								<Text className="text-light-200 text-sm">
									{movie?.release_date?.split("-")[0] || "N/A"}
								</Text>
								<Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
							</View>

							<View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
								<Image source={icons.star} className="size-4" />

								<Text className="text-white font-bold text-sm">
									{Math.round(movie?.vote_average ?? 0)}/10
								</Text>
								<Text className="text-light-200 text-sm">({movie?.vote_count} votes)</Text>
							</View>

							<MovieInfo label="Overview" value={movie?.overview} />
							<MovieInfo label="Genres" value={movie?.genres?.map((g) => g.name).join(", ") || "N/A"} />

							<View className="flex flex-row justify-between w-1/2">
								<MovieInfo
									label="Budget"
									value={movie?.budget ? `${movie?.budget / 1_000_000} million` : "N/A"}
								/>
								<MovieInfo
									label="Revenue"
									value={movie?.revenue ? `${Math.round(movie?.revenue / 1_000_000)} million` : "N/A"}
								/>
							</View>

							<MovieInfo
								label="Production Companies"
								value={movie?.production_companies?.map((c) => c.name).join("- ") || "N/A"}
							/>
						</View>
					</>
				)}
			</ScrollView>

			<TouchableOpacity
				onPress={() => router.back()}
				className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
			>
				<Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor={"#fff"} />
				<Text className="text-white text-base font-semibold">Go back</Text>
			</TouchableOpacity>
		</View>
	);
}
