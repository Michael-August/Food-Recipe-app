import { axiosClient } from "@/lib/api/axiosClient";
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

export const useResturant = (lat?: number, lng?: number) => {
    const query = useQuery({
        queryKey: ["Resturants near me"],
        queryFn: async () => {
            const query = `[out:json];node["amenity"="restaurant"](around:5000,${lat},${lng});out;`;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            try {
                const response = await axiosClient.get(url)
                return response.data?.elements;
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to fetch recipes";
                toast.error(message);
                throw new Error(message);
            }
        },
        enabled: !!lat && !!lng,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    })

    return query;
}