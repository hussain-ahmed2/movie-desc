import { images } from "@/constants/images";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function TrendingMovieCard({
	id,
	title,
	poster_path,
	release_date,
	vote_average,
	overview,
	index,
}: Movie & { index: number }) {
	return (
		<Link href={`/movies/${id}`} asChild>
			<TouchableOpacity className="w-32 relative pl-5">
				<Image
					source={{
						uri: poster_path
							? `https://image.tmdb.org/t/p/w500${poster_path}`
							: "https://placehold.co/600x400/1a1a1a/ffffff.png",
					}}
					className="w-full h-52 rounded-lg"
					resizeMode="cover"
				/>

				<View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
					<MaskedView maskElement={<Text className="font-bold text-white text-6xl">{index + 1}</Text>}>
						<Image source={images.rankingGradient} className="size-14" resizeMode="cover" />
					</MaskedView>
				</View>

				<Text className="text-sm font-bold text-light-200 mt-2" numberOfLines={2}>
					{title}
				</Text>
			</TouchableOpacity>
		</Link>
	);
}
