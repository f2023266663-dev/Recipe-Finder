import { useState, useCallback } from 'react';
import { getPublicRecipes, getCurrentUser } from '../utils/storage';

const DB_CATEGORY_TO_TAG = {
  Breakfast: "Breakfast",
  Dessert: "Dessert",
  Beef: "Dinner",
  Pork: "Dinner",
  Lamb: "Dinner",
  Goat: "Dinner",
  Chicken: "Lunch",
  Seafood: "Lunch",
  Vegetarian: "Lunch",
  Vegan: "Lunch",
  Pasta: "Dinner",
  Miscellaneous: "Lunch",
  Side: "Lunch",
  Starter: "Lunch"
};

const CATEGORY_MAP = {
  All: null,
  Breakfast: ["Breakfast"],
  Lunch: ["Chicken", "Vegetarian", "Seafood"],
  Dinner: ["Beef", "Pasta", "Pork"],
  Desserts: ["Dessert"]
};

export const getMealTag = (meal) => {
  if (meal.isUserRecipe) {
    return meal.strCategory || "Recipe";
  }
  if (meal.strCategory && DB_CATEGORY_TO_TAG[meal.strCategory]) {
    return DB_CATEGORY_TO_TAG[meal.strCategory];
  }
  return meal.strCategory || "Recipe";
};

export const getTagClass = (tag) => {
  const map = {
    Breakfast: "tag-breakfast",
    Lunch: "tag-lunch",
    Dinner: "tag-dinner",
    Dessert: "tag-dessert"
  };
  return map[tag] || "tag-default";
};

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMealsForCategories = useCallback(async (dbCategories) => {
    const requests = dbCategories.map(cat =>
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
        .then(res => res.json())
        .then(data => ({ cat, data }))
    );
    const results = await Promise.all(requests);

    let combined = [];
    results.forEach(({ cat, data }) => {
      if (data && data.meals) {
        const tagged = data.meals.map(meal => ({ ...meal, strCategory: cat }));
        combined = combined.concat(tagged);
      }
    });

    return combined;
  }, []);

  const searchRecipes = useCallback(async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      let meals = data.meals || [];
      
      const user = getCurrentUser();
      const publicRecipes = getPublicRecipes();
      let userRecipes = [];
      
      if (user && user.myRecipes) {
        userRecipes = userRecipes.concat(user.myRecipes);
      }
      
      const otherPublic = publicRecipes.filter(r => r.strCreator !== getCurrentUser()?.email);
      userRecipes = userRecipes.concat(otherPublic);
      
      const matchingUserRecipes = userRecipes.filter(recipe => 
        recipe.strMeal.toLowerCase().includes(query.toLowerCase()) ||
        (recipe.strCategory && recipe.strCategory.toLowerCase().includes(query.toLowerCase())) ||
        (recipe.strIngredients && recipe.strIngredients.some(ing => ing.toLowerCase().includes(query.toLowerCase())))
      );
      
      const allMeals = meals ? [...meals, ...matchingUserRecipes] : matchingUserRecipes;
      setRecipes(allMeals);
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
    setLoading(false);
  }, []);

  const filterByCategory = useCallback(async (category) => {
    setLoading(true);
    try {
      let meals = [];

      if (category === "All") {
        const [chicken, dessert, seafood, veg] = await Promise.all([
          fetchMealsForCategories(["Chicken"]),
          fetchMealsForCategories(["Dessert"]),
          fetchMealsForCategories(["Seafood"]),
          fetchMealsForCategories(["Vegetarian"])
        ]);
        meals = [...chicken, ...dessert, ...seafood, ...veg];
        
        const publicRecipes = getPublicRecipes();
        meals = [...meals, ...publicRecipes];
        
        const user = getCurrentUser();
        if (user && user.myRecipes) {
          meals = [...meals, ...user.myRecipes];
        }
        
        meals = meals.sort(() => Math.random() - 0.5);
      } else {
        const dbCategories = CATEGORY_MAP[category] || [category];
        const apiMeals = await fetchMealsForCategories(dbCategories);
        
        const publicRecipes = getPublicRecipes();
        const user = getCurrentUser();
        let userRecipes = [];
        
        if (user && user.myRecipes) {
          userRecipes = user.myRecipes.filter(r => r.strCategory === category);
        }
        
        const otherPublic = publicRecipes.filter(r => 
          r.strCategory === category && r.strCreator !== getCurrentUser()?.email
        );
        
        meals = [...apiMeals, ...userRecipes, ...otherPublic];
        meals = meals.sort(() => Math.random() - 0.5);
      }

      setRecipes(meals.slice(0, 12));
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
    setLoading(false);
  }, [fetchMealsForCategories]);

  return {
    recipes,
    loading,
    searchRecipes,
    filterByCategory,
    setRecipes
  };
};