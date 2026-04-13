import { useCallback, useEffect, useState } from "react";

export function useFetch<T>(fn: () => Promise<T>, autoFetch = true) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const result = await fn();
			setData(result);
			return result;
		} catch (err) {
			setError(err instanceof Error ? err : new Error("An unknown error occurred"));
			return null;
		} finally {
			setLoading(false);
		}
	}, [fn]);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (autoFetch) {
			fetchData();
		}
	}, [autoFetch, fetchData]);

	return { data, loading, error, refetch: fetchData, reset };
}
