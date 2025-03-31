'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IRecipe } from "@/types/recipe.type";
import { IExchangeRateResponse } from "@/types/conversionRate.type";
import RecipeCard from "@/components/custom/RecipeCard";
import RecipeDetails from "@/components/custom/RecipeDetails";
import { useRandomRecipes, useRecipeDetails, useSearchRecipes } from "@/hooks/useRecipes";
import { useDebounce } from "@/hooks/useDebounce";
import { EmptyState } from "@/components/custom/EmptyState";
import { ArrowLeft, ArrowRight, Utensils, X } from "lucide-react";
import RecipeCardSkeletonLoader from "@/components/skeletons/RecipeCardsLoader";
import cookingAnimation from "@/animations/cooking.json";
import plateAnimation from "@/animations/plate.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function FoodInquiryApp() {
  const [query, setQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | undefined>(undefined);
  const [usdToNaira, setUsdToNaira] = useState<number | null>(null);
  const [showRecipeDetailPopup, setShowRecipeDetailPopup] = useState(false);
  const [showConversionPopup, setShowConversionPopup] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState<string | null>(null);

  const [openedRecipeConversionPrice, setOpenRecipeConversionPrice] = useState<IRecipe | null>(null)

  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 1000);

  const { data: randomRecipes, isLoading: isRandomRecipesLoading } = useRandomRecipes();
  const { data: searchResults, isLoading: isSearchLoading } = useSearchRecipes(debouncedQuery, page);

  const { data: recipeDetails, isLoading: isDetailLoading } = useRecipeDetails(selectedRecipeId);

  const recipes: IRecipe[] = query ? searchResults : randomRecipes;

  const router = useRouter()
  

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data: IExchangeRateResponse) => setUsdToNaira(data.rates.NGN));
  }, []);

  const fetchRecipeDetails = async (id: number) => {
    setSelectedRecipeId(id);
    setShowRecipeDetailPopup(true);
  };

  const handleConversion = (price: number, recipe: IRecipe) => {
    if (usdToNaira) {
      setConvertedPrice((price / usdToNaira).toFixed(2));
      setShowConversionPopup(true);
      setOpenRecipeConversionPrice(recipe)
    }
  };

  const onclose = (popUpType: "details" | "conversion") => {
    if (popUpType === "details") setShowRecipeDetailPopup(false);
    if (popUpType === "conversion") {
      setShowConversionPopup(false)
      setOpenRecipeConversionPrice(null)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <div className="w-40 mx-auto mb-4">
        <Lottie animationData={cookingAnimation} loop />
      </div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-purple-600 text-4xl font-bold"
      >
        Ore's Food Recipe
      </motion.h1>
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-purple-950 text-sm font-bold"
      >
        You can prepare it for yourself
      </motion.span>

      {usdToNaira !== null ? (
        <p className="text-gray-600 mb-4 mt-6">
          Current Exchange Rate: <span className="font-bold text-purple-700">$1 = ₦{usdToNaira.toFixed(2)}</span>
        </p>
      ) : (
        <p className="text-gray-500 mb-4">Fetching exchange rate...</p>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-3 rounded-md w-full"
        />
        {/* <Button onClick={fetchRecipes}>Search</Button> */}
      </div>

      <div className="relative">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-2xl flex items-center gap-4 font-semibold mb-4 text-purple-700">Trending Recipes <Utensils /></h2>
          <Lottie className="w-16" animationData={plateAnimation} loop />
        </div>

        <div className="absolute top-0 right-0">
          <Button onClick={() => router.push('/resturants')} className="bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-all">Resturants near me</Button>
        </div>
      </div>

      {isRandomRecipesLoading || isSearchLoading || !recipes ? 
        <RecipeCardSkeletonLoader />
        : 
        recipes?.length === 0 ? <EmptyState title="No recipe found" description="Try adjusting your search and try again" icon={Utensils} /> : 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes?.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              convertedPrice={convertedPrice}
              fetchRecipeDetails={fetchRecipeDetails}
              handleConversion={handleConversion}
              showConversionPopup={showConversionPopup}
              onClose={onclose}
            />
          ))}
        </div>
      }

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="p-3 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 flex items-center cursor-pointer"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Previous
        </button>

        <span className="text-lg font-semibold text-purple-700">Page {page}</span>

        <button
          className="p-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={recipes?.length === 0} // Disable if no more recipes
        >
          Next <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {showRecipeDetailPopup && selectedRecipeId && (
        <RecipeDetails selectedRecipe={recipeDetails} onClose={onclose} />
      )}

      {showConversionPopup &&
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{background: "rgba(0, 0, 0, 0.7)"}}
            className="fixed inset-0 flex items-center justify-center p-4"
        >
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <div className="flex items-end justify-end">
                  <X onClick={() => {onclose("conversion"); setOpenRecipeConversionPrice(null)}} className="cursor-pointer hover:scale-110 transition-all" />
                </div>
                <h2 className="text-xl font-bold text-purple-700 mb-4">{openedRecipeConversionPrice?.title}</h2>
                <p className="text-gray-600">Converted Price: <span className="font-bold">${convertedPrice} USD</span></p>
            </div>
        </motion.div>
      }
    </div>
  );
}
