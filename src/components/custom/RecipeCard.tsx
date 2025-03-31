import { IRecipe } from "@/types/recipe.type";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

interface RecipeCardProps { 
    recipe: IRecipe;
    fetchRecipeDetails: (id: number) => void;
    handleConversion: (price: number, recipe: IRecipe) => void;
    convertedPrice: string | null;
    onClose: (popUpType: "details" | "conversion") => void;
    showConversionPopup: boolean;
}

const RecipeCard = ({ recipe, fetchRecipeDetails, handleConversion }: RecipeCardProps) => { 
    return (
        <>
            <motion.div
                key={recipe.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="bg-purple-50 shadow-xl rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl cursor-pointer"
                onClick={() => fetchRecipeDetails(recipe?.id)}
            >
                <div className="relative w-full h-40">
                    <img
                        src={recipe?.image}
                        alt={recipe?.title}
                        className="w-full h-full object-cover rounded-t-2xl"
                    />
                </div>
                <div className="p-4 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-purple-700">{recipe?.title}</h3>
                    <p className="text-gray-600 text-sm">Calories: {recipe?.calories} kcal</p>
                    <p className="text-gray-700 font-semibold">Price: <span className="text-purple-600">₦{recipe?.price}</span></p>

                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConversion(recipe.price, recipe);
                        }}
                        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-purple-700 transition-all"
                    >
                        Convert price to USD
                    </Button>
                </div>
            </motion.div>
        </>
    )
}

export default RecipeCard;
