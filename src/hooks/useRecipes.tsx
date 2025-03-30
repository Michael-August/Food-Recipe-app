/* 
    I have these hooks I normal use for all my get requests and for all my create requests and all Mutation requests with react query. 
    I will paste them below later but I won't be using it. Let's keep everything as simple as possible.
    I can also write one hook that handles all recipes requests (CREATE, READ, UPDATE, DELETE) and return the necessary things.
*/

import { axiosClient } from "@/lib/api/axiosClient"
import { IRecipe, IRecipeInfo } from "@/types/recipe.type"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useRandomRecipes = () => {
    const query = useQuery<IRecipe[]>({
        queryKey: ["Recipes"],
        queryFn: async () => {
            try {
                const response = await axiosClient.get(`/recipes/random?number=6&apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
                return response.data.recipes.map((recipe: IRecipe) => ({
                    ...recipe,
                    price: Math.floor(Math.random() * 2000) + 500,
                    calories: (Math.random() * (800 - 200) + 200).toFixed(1),
                }));
            } catch (error) {
                const message =
                error instanceof Error ? error.message : "Failed to fetch recipes";
                toast.error(message);
                throw new Error(message);
            }
        },
        staleTime: 1000 * 60 * 5,
    })

    return query;
}

export const useSearchRecipes = (query: string, page: number) => {
    const queryResult = useQuery({
        queryKey: ["Recipes", query, page],
        queryFn: async () => {
        if (!query) return [];
        try {
            const response = await axiosClient.get(
            `/recipes/complexSearch?query=${query}&page=${page}&addRecipeNutrition=true&apiKey=${process.env.NEXT_PUBLIC_API_KEY}`
            );
            return response.data.results.map((recipe: IRecipe) => ({
                ...recipe,
                price: Math.floor(Math.random() * 2000) + 500,
                calories: (Math.random() * (800 - 200) + 200).toFixed(1),
            }));
        } catch (error) {
            const message =
            error instanceof Error ? error.message : "Failed to fetch recipes";
            toast.error(message);
            throw new Error(message);
        }
        },
        enabled: !!query,
        staleTime: 1000 * 60 * 5,
    });

    return queryResult;
};

export const useRecipeDetails = (id?: number) => {
    const query = useQuery({
        queryKey: ["RecipeDetails", id],
        queryFn: async () => {
        if (!id) return null;
        try {
            const response = await axiosClient.get(
            `/recipes/${id}/information?includeNutrition=true&apiKey=${process.env.NEXT_PUBLIC_API_KEY}`
            );
            return response.data as IRecipeInfo;
        } catch (error) {
            const message =
            error instanceof Error ? error.message : "Failed to fetch recipe details";
            toast.error(message);
            throw new Error(message);
        }
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });

    return query;
};
