// Global state
let bpiCocktails = [];
let priceData = [];
let currentCocktail = null;

// DOM Elements
const cocktailSearch = document.getElementById('cocktail-search');
const searchResults = document.getElementById('search-results');
const currentCocktailTitle = document.getElementById('current-cocktail-title');
const currentCocktailDiv = document.getElementById('current-cocktail');
const noCocktailMessage = document.getElementById('no-cocktail-message');
const ingredientsList = document.getElementById('ingredients-list');
const totalCostEl = document.getElementById('total-cost');
const costPerOzEl = document.getElementById('cost-per-oz');
const suggestedPriceEl = document.getElementById('suggested-price');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const saveCocktailBtn = document.getElementById('save-cocktail-btn');
const exportBtn = document.getElementById('export-btn');

// Load BPI cocktail specs
async function loadBPICocktails() {
    try {
        const response = await fetch('./bpi-cocktail-specs.json');
        const data = await response.json();
        bpiCocktails = data.cocktails;
        console.log('Loaded cocktails:', bpiCocktails.length);
    } catch (error) {
        console.error('Error loading BPI cocktails:', error);
    }
}

// Load price data
async function loadPriceData() {
    try {
        const response = await fetch('./price-data.json');
        const data = await response.json();
        priceData = data.ingredients;
        console.log('Loaded price data:', priceData.length);
    } catch (error) {
        console.error('Error loading price data:', error);
    }
}

// Search cocktails
function searchCocktails(query) {
    if (!query) {
        searchResults.classList.add('hidden');
        return;
    }

    const results = bpiCocktails.filter(cocktail => 
        cocktail.name.toLowerCase().includes(query.toLowerCase()) &&
        !cocktail.isFamily // Exclude family recipes
    );

    if (results.length > 0) {
        searchResults.innerHTML = results.map(cocktail => `
            <div class="p-3 hover:bg-pearl cursor-pointer" onclick="selectCocktail('${cocktail.name.replace(/'/g, "\\'")}')">
                ${cocktail.name}
            </div>
        `).join('');
        searchResults.classList.remove('hidden');
    } else {
        searchResults.classList.add('hidden');
    }
}

// Select cocktail
function selectCocktail(cocktailName) {
    const cocktail = bpiCocktails.find(c => c.name === cocktailName);
    if (!cocktail) {
        console.error('Cocktail not found:', cocktailName);
        return;
    }

    // Set current cocktail
    currentCocktail = {
        name: cocktail.name,
        ingredients: [],
        method: cocktail.method,
        glassware: cocktail.glassware,
        totalVolume: 0
    };
    
    // Process ingredients with converted amounts
    cocktail.ingredients.forEach(ing => {
        const amountInMl = convertToMl(ing.amount);
        const matchedIngredient = findMatchingIngredient(ing.ingredient);
        
        currentCocktail.ingredients.push({
            name: ing.ingredient,
            amount: amountInMl,
            originalAmount: ing.amount,
            note: ing.note || '',
            bottleSize: matchedIngredient ? matchedIngredient.volume : 750,
            bottleCost: matchedIngredient ? matchedIngredient.costPerUnit : 25.00,
            costPerMl: matchedIngredient ? (matchedIngredient.costPerUnit / matchedIngredient.volume) : (25.00 / 750)
        });
        
        currentCocktail.totalVolume += amountInMl;
    });

    // Update the UI
    currentCocktailTitle.textContent = cocktail.name;
    renderCurrentCocktail();
    updateCostSummary();
    
    // Show current cocktail section
    currentCocktailDiv.classList.remove('hidden');
    noCocktailMessage.classList.add('hidden');
    saveCocktailBtn.classList.remove('hidden');
    exportBtn.classList.remove('hidden');
    
    // Clear search
    cocktailSearch.value = '';
    searchResults.classList.add('hidden');
}

// Convert amount string to ml value
function convertToMl(amountStr) {
    if (!amountStr) return 0;
    
    // Handle various formats
    if (amountStr === 'Top' || amountStr === 'Splash') {
        return 30; // Approximate for top or splash
    }
    
    if (amountStr.includes('dash')) {
        const numDashes = parseInt(amountStr) || 1;
        return numDashes * 0.9; // Approximate 0.9ml per dash
    }
    
    if (amountStr.includes('tsp')) {
        const numTsp = parseInt(amountStr) || 1;
        return numTsp * 5; // 5ml per tsp
    }
    
    if (amountStr.includes('oz')) {
        const match = amountStr.match(/(\d+(\.\d+)?)\s*oz/);
        if (match) {
            return parseFloat(match[1]) * 29.57; // Convert oz to ml
        }
    }
    
    return 0;
}

// Find matching ingredient from price data
function findMatchingIngredient(ingredientName) {
    // Exact match
    let match = priceData.find(ing => 
        ing.name.toLowerCase() === ingredientName.toLowerCase()
    );
    
    if (match) return match;
    
    // Partial match
    match = priceData.find(ing => 
        ing.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
        ingredientName.toLowerCase().includes(ing.name.toLowerCase())
    );
    
    // Return found match or null
    return match || null;
}

// Render current cocktail
function renderCurrentCocktail() {
    if (!currentCocktail) {
        return;
    }
    
    ingredientsList.innerHTML = currentCocktail.ingredients.map((ing, index) => {
        const costForAmount = ing.costPerMl * ing.amount;
        const costPercentage = ((costForAmount / getTotalCost()) * 100).toFixed(1);
        
        return `
        <div class="p-3 bg-pearl rounded-lg">
            <div class="flex flex-wrap justify-between items-center mb-2">
                <div class="font-medium">${ing.name}</div>
                <div class="text-azure">${costPercentage}% of cost</div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-3">
                <div>
                    <label class="block text-xs text-slate/70 mb-1">Amount (ml)</label>
                    <input 
                        type="number" 
                        value="${ing.amount.toFixed(1)}" 
                        min="0" 
                        step="0.1" 
                        class="w-full p-1 border rounded" 
                        onchange="updateIngredientAmount(${index}, this.value)"
                    >
                    <div class="text-xs mt-1">${mlToOz(ing.amount).toFixed(2)} oz</div>
                </div>
                
                <div>
                    <label class="block text-xs text-slate/70 mb-1">Bottle Cost ($)</label>
                    <input 
                        type="number" 
                        value="${ing.bottleCost.toFixed(2)}" 
                        min="0" 
                        step="0.01" 
                        class="w-full p-1 border rounded"
                        onchange="updateIngredientBottleCost(${index}, this.value)"
                    >
                </div>
                
                <div>
                    <label class="block text-xs text-slate/70 mb-1">Bottle Size (ml)</label>
                    <input 
                        type="number" 
                        value="${ing.bottleSize}" 
                        min="1" 
                        class="w-full p-1 border rounded"
                        onchange="updateIngredientBottleSize(${index}, this.value)"
                    >
                </div>
            </div>
            
            <div class="flex justify-between items-center mt-2">
                <div class="text-sm">
                    <span class="font-medium">Cost: $${costForAmount.toFixed(2)}</span>
                    <span class="text-xs text-slate/70">(${(ing.costPerMl * 29.57).toFixed(2)}/oz)</span>
                </div>
                <button 
                    class="text-red-500 hover:text-red-700" 
                    onclick="removeIngredient(${index})"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Update ingredient amount
function updateIngredientAmount(index, newValue) {
    const amount = parseFloat(newValue);
    if (isNaN(amount) || amount < 0) return;
    
    currentCocktail.ingredients[index].amount = amount;
    recalculateTotalVolume();
    renderCurrentCocktail();
    updateCostSummary();
}

// Update ingredient bottle cost
function updateIngredientBottleCost(index, newValue) {
    const cost = parseFloat(newValue);
    if (isNaN(cost) || cost < 0) return;
    
    const ingredient = currentCocktail.ingredients[index];
    ingredient.bottleCost = cost;
    ingredient.costPerMl = cost / ingredient.bottleSize;
    
    renderCurrentCocktail();
    updateCostSummary();
}

// Update ingredient bottle size
function updateIngredientBottleSize(index, newValue) {
    const size = parseFloat(newValue);
    if (isNaN(size) || size <= 0) return;
    
    const ingredient = currentCocktail.ingredients[index];
    ingredient.bottleSize = size;
    ingredient.costPerMl = ingredient.bottleCost / size;
    
    renderCurrentCocktail();
    updateCostSummary();
}

// Remove ingredient
function removeIngredient(index) {
    currentCocktail.ingredients.splice(index, 1);
    recalculateTotalVolume();
    renderCurrentCocktail();
    updateCostSummary();
}

// Add new ingredient
function addNewIngredient() {
    if (!currentCocktail) return;
    
    // Create a modal for ingredient selection
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">Add Ingredient</h3>
            
            <div class="mb-4">
                <input type="text" placeholder="Search ingredients..." 
                    class="w-full p-2 border rounded-lg mb-4" 
                    id="ingredient-search-input"
                    oninput="searchIngredientsList(this.value)">
            </div>
            
            <div id="ingredient-search-results" class="max-h-60 overflow-y-auto mb-4">
                ${priceData.map((ing, idx) => `
                    <div class="p-2 hover:bg-pearl cursor-pointer rounded mb-1" 
                         onclick="selectIngredientToAdd(${idx})">
                        ${ing.name} - $${ing.costPerUnit.toFixed(2)}/${ing.volume}ml
                    </div>
                `).join('')}
            </div>
            
            <div class="flex justify-end space-x-2">
                <button class="bg-slate/20 px-3 py-1 rounded" onclick="document.querySelector('.fixed').remove()">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener to close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Focus the search input
    setTimeout(() => {
        document.getElementById('ingredient-search-input').focus();
    }, 100);
}

// Search through the ingredients list in the modal
function searchIngredientsList(query) {
    const resultsContainer = document.getElementById('ingredient-search-results');
    if (!resultsContainer) return;
    
    if (!query) {
        // Show all ingredients
        resultsContainer.innerHTML = priceData.map((ing, idx) => `
            <div class="p-2 hover:bg-pearl cursor-pointer rounded mb-1" 
                 onclick="selectIngredientToAdd(${idx})">
                ${ing.name} - $${ing.costPerUnit.toFixed(2)}/${ing.volume}ml
            </div>
        `).join('');
        return;
    }
    
    // Filter ingredients
    const filteredIngredients = priceData.filter(ing => 
        ing.name.toLowerCase().includes(query.toLowerCase()) ||
        ing.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // Display filtered results
    resultsContainer.innerHTML = filteredIngredients.map((ing, idx) => {
        const dataIndex = priceData.findIndex(i => i.name === ing.name);
        return `
            <div class="p-2 hover:bg-pearl cursor-pointer rounded mb-1" 
                 onclick="selectIngredientToAdd(${dataIndex})">
                ${ing.name} - $${ing.costPerUnit.toFixed(2)}/${ing.volume}ml
            </div>
        `;
    }).join('');
}

// Select an ingredient to add to the cocktail
function selectIngredientToAdd(dataIndex) {
    const ingredient = priceData[dataIndex];
    
    // Show amount input modal
    const amountModal = document.createElement('div');
    amountModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    amountModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-xl font-bold mb-4">Amount for ${ingredient.name}</h3>
            
            <div class="mb-4">
                <label class="block text-sm mb-1">Amount (ml):</label>
                <input type="number" id="amount-input" value="30" min="0" step="0.1" class="w-full p-2 border rounded">
                <div class="text-sm text-slate/70 mt-1" id="oz-conversion">Equal to 1.0 oz</div>
            </div>
            
            <div class="flex justify-end space-x-2">
                <button class="bg-slate/20 px-3 py-1 rounded" onclick="document.querySelector('.fixed').remove()">
                    Cancel
                </button>
                <button class="bg-azure text-white px-3 py-1 rounded" onclick="addIngredientWithAmount(${dataIndex})">
                    Add
                </button>
            </div>
        </div>
    `;
    
    // Remove the previous modal
    document.querySelector('.fixed').remove();
    
    // Add the amount modal
    document.body.appendChild(amountModal);
    
    // Focus the amount input
    setTimeout(() => {
        const amountInput = document.getElementById('amount-input');
        amountInput.focus();
        
        // Add conversion preview
        amountInput.addEventListener('input', () => {
            const ml = parseFloat(amountInput.value);
            if (!isNaN(ml)) {
                document.getElementById('oz-conversion').textContent = `Equal to ${mlToOz(ml).toFixed(2)} oz`;
            }
        });
    }, 100);
}

// Add ingredient with specified amount
function addIngredientWithAmount(dataIndex) {
    const ingredient = priceData[dataIndex];
    const amountInput = document.getElementById('amount-input');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    // Add the ingredient to current cocktail
    currentCocktail.ingredients.push({
        name: ingredient.name,
        amount: amount,
        bottleSize: ingredient.volume,
        bottleCost: ingredient.costPerUnit,
        costPerMl: ingredient.costPerUnit / ingredient.volume
    });
    
    // Close the modal
    document.querySelector('.fixed').remove();
    
    // Update the UI
    recalculateTotalVolume();
    renderCurrentCocktail();
    updateCostSummary();
}

// Convert ml to oz
function mlToOz(ml) {
    return ml / 29.57;
}

// Convert oz to ml
function ozToMl(oz) {
    return oz * 29.57;
}

// Recalculate total volume
function recalculateTotalVolume() {
    currentCocktail.totalVolume = currentCocktail.ingredients.reduce((sum, ing) => sum + ing.amount, 0);
}

// Get total cost
function getTotalCost() {
    if (!currentCocktail) return 0;
    
    return currentCocktail.ingredients.reduce((sum, ing) => {
        return sum + (ing.costPerMl * ing.amount);
    }, 0);
}

// Update cost summary
function updateCostSummary() {
    if (!currentCocktail) {
        totalCostEl.textContent = '$0.00';
        costPerOzEl.textContent = '$0.00';
        suggestedPriceEl.textContent = '$0.00';
        return;
    }
    
    const totalCost = getTotalCost();
    const totalOz = mlToOz(currentCocktail.totalVolume);
    const costPerOz = totalOz ? totalCost / totalOz : 0;
    const suggestedPrice = totalCost * 5; // 5x markup
    
    totalCostEl.textContent = `$${totalCost.toFixed(2)}`;
    costPerOzEl.textContent = `$${costPerOz.toFixed(2)}`;
    suggestedPriceEl.textContent = `$${suggestedPrice.toFixed(2)}`;
}

// Export current cocktail as JSON
function exportCurrentCocktail() {
    if (!currentCocktail) {
        alert('No cocktail selected');
        return;
    }
    
    const totalCost = getTotalCost();
    
    const exportData = {
        name: currentCocktail.name,
        totalCost: totalCost.toFixed(2),
        totalVolume: currentCocktail.totalVolume.toFixed(1),
        costPerOz: (totalCost / mlToOz(currentCocktail.totalVolume)).toFixed(2),
        suggestedPrice: (totalCost * 5).toFixed(2),
        method: currentCocktail.method,
        glassware: currentCocktail.glassware,
        ingredients: currentCocktail.ingredients.map(ing => ({
            name: ing.name,
            amount: ing.amount.toFixed(1),
            amountOz: mlToOz(ing.amount).toFixed(2),
            bottleCost: ing.bottleCost.toFixed(2),
            bottleSize: ing.bottleSize,
            cost: (ing.costPerMl * ing.amount).toFixed(2),
            costPercentage: ((ing.costPerMl * ing.amount) / totalCost * 100).toFixed(1)
        }))
    };
    
    // Create and download the export file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentCocktail.name.replace(/\s+/g, '-').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load data
    loadBPICocktails();
    loadPriceData();

    // Cocktail search input handler
    cocktailSearch.addEventListener('input', (e) => {
        searchCocktails(e.target.value);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!cocktailSearch.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
    
    // Add ingredient button
    addIngredientBtn.addEventListener('click', addNewIngredient);
    
    // Export button
    exportBtn.addEventListener('click', exportCurrentCocktail);
}); 