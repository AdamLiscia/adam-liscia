// Store ingredients and recipes
let ingredients = [];
let recipes = [];
let bpiCocktails = [];

// DOM Elements
const ingredientsList = document.getElementById('ingredients-list');
const recipesList = document.getElementById('recipes-list');
const cocktailSearch = document.getElementById('cocktail-search');
const searchResults = document.getElementById('search-results');

// Load BPI cocktail specs
async function loadBPICocktails() {
    try {
        const response = await fetch('../bpi-cocktail-specs.json');
        const data = await response.json();
        bpiCocktails = data.cocktails;
        console.log('Loaded cocktails:', bpiCocktails.length);
    } catch (error) {
        console.error('Error loading BPI cocktails:', error);
    }
}

// Search cocktails
function searchCocktails(query) {
    if (!query) {
        searchResults.classList.add('hidden');
        return;
    }

    console.log('Searching for:', query);
    console.log('Available cocktails:', bpiCocktails.length);

    const results = bpiCocktails.filter(cocktail => 
        cocktail.name.toLowerCase().includes(query.toLowerCase()) &&
        !cocktail.isFamily // Exclude family recipes
    );

    console.log('Found results:', results.length);

    if (results.length > 0) {
        searchResults.innerHTML = results.map(cocktail => `
            <div class="p-3 hover:bg-pearl cursor-pointer" onclick="importCocktail('${cocktail.name}')">
                ${cocktail.name}
            </div>
        `).join('');
        searchResults.classList.remove('hidden');
    } else {
        searchResults.classList.add('hidden');
    }
}

// Import cocktail
function importCocktail(cocktailName) {
    console.log('Importing cocktail:', cocktailName);
    const cocktail = bpiCocktails.find(c => c.name === cocktailName);
    if (!cocktail) {
        console.error('Cocktail not found:', cocktailName);
        return;
    }

    // Create a new recipe
    const recipe = {
        id: Date.now(),
        name: cocktail.name,
        ingredients: cocktail.ingredients.map(ing => ({
            name: ing.ingredient,
            amount: ing.amount,
            note: ing.note || ''
        }))
    };

    console.log('Created recipe:', recipe);
    recipes.push(recipe);
    renderRecipes();
    updateCostSummary();
    
    // Clear search
    cocktailSearch.value = '';
    searchResults.classList.add('hidden');
}

// Add ingredient
function addIngredient() {
    const nameInput = document.querySelector('input[placeholder="Ingredient Name"]');
    const costInput = document.querySelector('input[placeholder="Cost"]');
    const sizeInput = document.querySelector('input[placeholder="Size (ml)"]');

    const name = nameInput.value.trim();
    const cost = parseFloat(costInput.value);
    const size = parseFloat(sizeInput.value);

    if (name && !isNaN(cost) && !isNaN(size) && cost > 0 && size > 0) {
        const ingredient = {
            id: Date.now(),
            name,
            cost,
            size,
            costPerMl: cost / size
        };

        ingredients.push(ingredient);
        renderIngredients();
        
        // Clear inputs
        nameInput.value = '';
        costInput.value = '';
        sizeInput.value = '';
    }
}

// Render ingredients list
function renderIngredients() {
    ingredientsList.innerHTML = ingredients.map(ingredient => `
        <div class="flex items-center justify-between p-2 bg-pearl rounded">
            <span class="font-medium">${ingredient.name}</span>
            <div class="flex items-center space-x-4">
                <span>$${ingredient.cost.toFixed(2)} / ${ingredient.size}ml</span>
                <button onclick="removeIngredient(${ingredient.id})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Remove ingredient
function removeIngredient(id) {
    ingredients = ingredients.filter(ingredient => ingredient.id !== id);
    renderIngredients();
    updateCostSummary();
}

// Add recipe
function addRecipe() {
    const nameInput = document.querySelector('input[placeholder="Recipe Name"]');
    const name = nameInput.value.trim();

    if (name) {
        const recipe = {
            id: Date.now(),
            name,
            ingredients: []
        };

        recipes.push(recipe);
        renderRecipes();
        nameInput.value = '';
    }
}

// Render recipes list
function renderRecipes() {
    recipesList.innerHTML = recipes.map(recipe => `
        <div class="p-4 bg-pearl rounded">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold">${recipe.name}</h3>
                <button onclick="removeRecipe(${recipe.id})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="space-y-2">
                ${recipe.ingredients.map(ing => `
                    <div class="flex items-center justify-between">
                        <span>${ing.name}</span>
                        <span>${ing.amount}ml</span>
                    </div>
                `).join('')}
            </div>
            <div class="mt-2">
                <select class="p-2 border rounded w-full" onchange="addIngredientToRecipe(${recipe.id}, this.value)">
                    <option value="">Add Ingredient</option>
                    ${ingredients.map(ing => `
                        <option value="${ing.id}">${ing.name}</option>
                    `).join('')}
                </select>
            </div>
        </div>
    `).join('');
}

// Add ingredient to recipe
function addIngredientToRecipe(recipeId, ingredientId) {
    const recipe = recipes.find(r => r.id === recipeId);
    const ingredient = ingredients.find(i => i.id === parseInt(ingredientId));

    if (recipe && ingredient) {
        const amount = prompt(`Enter amount of ${ingredient.name} in ml:`);
        if (amount && !isNaN(amount) && amount > 0) {
            recipe.ingredients.push({
                id: ingredient.id,
                name: ingredient.name,
                amount: parseFloat(amount)
            });
            renderRecipes();
            updateCostSummary();
        }
    }
}

// Remove recipe
function removeRecipe(id) {
    recipes = recipes.filter(recipe => recipe.id !== id);
    renderRecipes();
    updateCostSummary();
}

// Update cost summary
function updateCostSummary() {
    let totalCost = 0;
    let totalVolume = 0;

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            const ingredient = ingredients.find(i => i.id === ing.id);
            if (ingredient) {
                totalCost += ingredient.costPerMl * ing.amount;
                totalVolume += ing.amount;
            }
        });
    });

    const costPerServing = totalCost;
    const suggestedPrice = costPerServing * 3; // 3x markup for suggested price

    document.querySelector('p:contains("Total Cost")').textContent = `$${totalCost.toFixed(2)}`;
    document.querySelector('p:contains("Cost per Serving")').textContent = `$${costPerServing.toFixed(2)}`;
    document.querySelector('p:contains("Suggested Price")').textContent = `$${suggestedPrice.toFixed(2)}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load BPI cocktails
    loadBPICocktails();

    // Add ingredient button
    document.querySelector('button i.fa-plus').parentElement.addEventListener('click', addIngredient);

    // Add recipe button
    document.querySelector('button:contains("Add Recipe")').addEventListener('click', addRecipe);

    // Search input handler
    cocktailSearch.addEventListener('input', (e) => {
        searchCocktails(e.target.value);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!cocktailSearch.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
}); 