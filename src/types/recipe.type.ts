export interface  IRecipe {
    id: number;
    title: string;
    image: string;
    price: number;
    calories?: number;
    nutrition?: any;
    grams?: {
        carbs: number;
        protein: number;
        fat: number;
    };
};

export interface IRecipeInfo {
    id: number;
    title: string;
    image: string;
    summary: string; // May contain HTML tags
    servings: number;
    readyInMinutes: number;
    ingredients: IIngredient[];
    instructions: string; // May contain HTML tags
    nutrition: INutrition;
    extendedIngredients: any[];
};

export interface IIngredient { 
    name: string;
    amount: number;
    unit: string;
}

export interface INutrition {
    calories: number;
    nutrients?: any[];
    grams: {
      carbs: number;
      protein: number;
      fat: number;
    };
}

