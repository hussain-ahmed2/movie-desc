export function resolveTMDBImage(imagePath?: string | null | undefined) {
	return imagePath?.trim()
		? `https://image.tmdb.org/t/p/w500${imagePath}`
		: "https://placehold.co/600x400/1a1a1a/ffffff.png";
}
