import { IRecipeInfo } from "@/types/recipe.type";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface IRecipeDetailsProps {
  selectedRecipe: IRecipeInfo | undefined | null;
  onClose: (popUpType: "details" | "conversion") => void;
}

const RecipeDetails = ({ selectedRecipe, onClose }: IRecipeDetailsProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState<"left" | "right">("right");

    const variants = {
        
    };

    const nextStep = () => {
        if (currentStep < instructionsArray.length - 1) {
            setDirection("right");
            setCurrentStep((prev) => prev + 1);
        }
    };

    // Function to go to the previous step
    const prevStep = () => {
        if (currentStep > 0) {
            setDirection("left");
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Extract instructions as an array of steps
    const instructionsArray = selectedRecipe?.instructions
        ? selectedRecipe.instructions
            .match(/<li>(.*?)<\/li>/g) // Match all list items
            ?.map((step) => step.replace(/<\/?li>/g, "")) || [] // Remove <li> tags
        : [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{background: "rgba(0, 0, 0, 0.7)"}}
            className="fixed inset-0 flex gap-4 items-center justify-center p-4"
            onClick={() => onClose("details")}
        >
            <div onClick={(e) => e.stopPropagation()} className="bg-white text-left p-6 rounded-lg shadow-2xl max-w-lg w-full h-[80vh] flex flex-col relative">
                <div className="flex items-end justify-end">
                    <X onClick={() => onClose("details")} className="cursor-pointer hover:scale-110 transition-all" />
                </div>
                <h2 className="text-xl font-bold text-purple-700 mb-4">{selectedRecipe?.title}</h2>
                <p className="text-gray-600">
                    Calories: {selectedRecipe?.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount} kcal
                </p>

                <h3 className="text-lg font-semibold mt-4">Ingredients:</h3>
                <ul className="list-disc list-inside h-1/2 overflow-y-auto text-gray-600">
                    {selectedRecipe?.extendedIngredients.map((ing, index) => (
                        <li key={`${ing.id}-${index}`}>
                            {ing.original} ({ing.amount} {ing.unit})
                        </li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mt-4">Instructions:</h3>
                {instructionsArray.length > 0 ? (
                <div className="relative flex items-center justify-center w-full">
                    <motion.button
                        onClick={(e) => { e.stopPropagation(); prevStep() }}
                        disabled={currentStep === 0}
                        className="absolute -left-3 cursor-pointer p-1 rounded-full w-6 h-6 bg-gray-800 z-50 text-white shadow-lg disabled:opacity-50"
                        animate={currentStep > 0 ? { scale: [1, 1.2, 1], boxShadow: ["0px 0px 8px #9333ea", "0px 0px 12px #9333ea", "0px 0px 8px #9333ea"] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <ArrowLeft className="w-full h-full" />
                    </motion.button>

                    <motion.div
                        key={currentStep}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        custom={direction}
                        className="relative w-full h-64 flex items-center justify-center rounded-xl overflow-hidden"
                    >
                        <img 
                            src={selectedRecipe?.image} 
                            alt="Recipe Step" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        <div style={{background: "rgba(0, 0, 0, 0.8)"}} className="absolute inset-0"></div>
                        
                        <p className="relative text-white text-center px-6 text-lg font-medium">
                        {instructionsArray[currentStep]}
                        </p>
                    </motion.div>

                    <motion.button
                        onClick={(e) => { e.stopPropagation(); nextStep() }}
                        disabled={currentStep === instructionsArray.length - 1}
                        className="absolute -right-3 p-1 cursor-pointer rounded-full w-6 h-6 bg-purple-600 text-white shadow-lg disabled:opacity-50"
                        animate={currentStep === 0 || currentStep > 0 && currentStep !== instructionsArray.length - 1 ? { scale: [1, 1.2, 1], boxShadow: ["0px 0px 8px #9333ea", "0px 0px 12px #9333ea", "0px 0px 8px #9333ea"] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <ArrowRight className="w-full h-full" />
                    </motion.button>
                </div>
                ) : (
                    <p className="text-gray-600">No instructions available.</p>
                )}
            </div>
        </motion.div>
    );
};

export default RecipeDetails;
