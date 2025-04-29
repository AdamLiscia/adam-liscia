// Load cocktail data
let cocktailData = null;
let selectedFamilies = new Set();

// DOM Elements
const menuNameInput = document.getElementById('menu-name');
const seasonSelect = document.getElementById('season');
const cocktailCountInput = document.getElementById('cocktail-count');
const includeNAInput = document.getElementById('include-na');
const cocktailFamiliesDiv = document.getElementById('cocktail-families');
const generateMenuBtn = document.getElementById('generate-menu');
const printMenuBtn = document.getElementById('print-menu');
const menuPreviewDiv = document.getElementById('menu-preview');

// Cocktail families and their characteristics
const cocktailFamilies = {
    'Classic Sours': {
        description: 'Balanced cocktails with spirit, citrus, and sweetener',
        examples: ['Daiquiri', 'Whiskey Sour', 'Margarita'],
        seasonality: {
            spring: 0.8,
            summer: 1.0,
            fall: 0.7,
            winter: 0.6
        }
    },
    'Spirit-Forward': {
        description: 'Complex cocktails with multiple spirits and bitters',
        examples: ['Manhattan', 'Martini', 'Negroni'],
        seasonality: {
            spring: 0.7,
            summer: 0.6,
            fall: 0.9,
            winter: 1.0
        }
    },
    'Tiki & Tropical': {
        description: 'Fruity, exotic cocktails with multiple juices and rums',
        examples: ['Mai Tai', 'Zombie', 'Painkiller'],
        seasonality: {
            spring: 0.8,
            summer: 1.0,
            fall: 0.6,
            winter: 0.4
        }
    },
    'Highballs & Collins': {
        description: 'Refreshing, effervescent cocktails with soda or tonic',
        examples: ['Gin & Tonic', 'Moscow Mule', 'Tom Collins'],
        seasonality: {
            spring: 0.9,
            summer: 1.0,
            fall: 0.7,
            winter: 0.5
        }
    },
    'Flips & Creamy': {
        description: 'Rich, dessert-like cocktails with eggs or cream',
        examples: ['Brandy Alexander', 'Grasshopper', 'White Russian'],
        seasonality: {
            spring: 0.6,
            summer: 0.4,
            fall: 0.8,
            winter: 1.0
        }
    },
    'Non-Alcoholic': {
        description: 'Complex, flavorful drinks without alcohol',
        examples: ['Shirley Temple', 'Virgin Mojito', 'Nojito'],
        seasonality: {
            spring: 0.8,
            summer: 1.0,
            fall: 0.7,
            winter: 0.6
        }
    }
};

// Initialize the page
function initialize() {
    // Load cocktail data
    fetch('./bpi-cocktail-specs.json')
        .then(response => response.json())
        .then(data => {
            cocktailData = data;
            renderCocktailFamilies();
        })
        .catch(error => console.error('Error loading cocktail data:', error));

    // Add event listeners
    generateMenuBtn.addEventListener('click', generateMenu);
    printMenuBtn.addEventListener('click', printMenu);
}

// Render cocktail family checkboxes
function renderCocktailFamilies() {
    cocktailFamiliesDiv.innerHTML = Object.entries(cocktailFamilies)
        .map(([family, info]) => `
            <div class="flex items-center space-x-4 p-2 bg-pearl rounded">
                <input type="checkbox" 
                       id="family-${family.toLowerCase().replace(/\s+/g, '-')}" 
                       class="family-checkbox" 
                       value="${family}"
                       ${family === 'Non-Alcoholic' ? 'disabled' : ''}>
                <label for="family-${family.toLowerCase().replace(/\s+/g, '-')}" 
                       class="flex-1">
                    <span class="font-medium">${family}</span>
                    <p class="text-sm text-slate/80">${info.description}</p>
                    <p class="text-xs text-slate/60">Examples: ${info.examples.join(', ')}</p>
                </label>
            </div>
        `).join('');

    // Add event listeners to checkboxes
    document.querySelectorAll('.family-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedFamilies.add(e.target.value);
            } else {
                selectedFamilies.delete(e.target.value);
            }
        });
    });
}

// Generate a balanced menu based on selected families and season
function generateMenu() {
    if (selectedFamilies.size === 0) {
        alert('Please select at least one cocktail family');
        return;
    }

    const season = seasonSelect.value;
    const cocktailCount = parseInt(cocktailCountInput.value);
    const includeNA = includeNAInput.checked;

    // Calculate weights for each family based on seasonality
    const familyWeights = {};
    let totalWeight = 0;

    selectedFamilies.forEach(family => {
        const weight = cocktailFamilies[family].seasonality[season];
        familyWeights[family] = weight;
        totalWeight += weight;
    });

    // If non-alcoholic is selected, reserve one slot
    if (includeNA) {
        selectedFamilies.add('Non-Alcoholic');
        familyWeights['Non-Alcoholic'] = 1;
        totalWeight += 1;
    }

    // Calculate number of cocktails per family
    const cocktailsPerFamily = {};
    let remainingSlots = cocktailCount;

    selectedFamilies.forEach(family => {
        const weight = familyWeights[family];
        const slots = Math.round((weight / totalWeight) * cocktailCount);
        cocktailsPerFamily[family] = Math.min(slots, remainingSlots);
        remainingSlots -= slots;
    });

    // Distribute remaining slots
    while (remainingSlots > 0) {
        const families = Array.from(selectedFamilies);
        const randomFamily = families[Math.floor(Math.random() * families.length)];
        cocktailsPerFamily[randomFamily]++;
        remainingSlots--;
    }

    // Generate menu preview
    renderMenuPreview(cocktailsPerFamily);
}

// Get cocktails for a specific family
function getCocktailsForFamily(family) {
    if (!cocktailData) return [];
    
    return cocktailData.cocktails.filter(cocktail => {
        // Simple family matching based on ingredients and characteristics
        const ingredients = cocktail.ingredients.map(i => i.ingredient.toLowerCase());
        
        switch(family) {
            case 'Classic Sours':
                return ingredients.some(i => i.includes('lemon') || i.includes('lime')) &&
                       ingredients.some(i => i.includes('syrup') || i.includes('simple'));
            case 'Spirit-Forward':
                return ingredients.some(i => i.includes('bitters')) &&
                       ingredients.length <= 4;
            case 'Tiki & Tropical':
                return ingredients.some(i => i.includes('rum')) &&
                       ingredients.some(i => i.includes('juice'));
            case 'Highballs & Collins':
                return ingredients.some(i => i.includes('soda') || i.includes('tonic') || i.includes('ginger beer'));
            case 'Flips & Creamy':
                return ingredients.some(i => i.includes('egg') || i.includes('cream'));
            case 'Non-Alcoholic':
                return !ingredients.some(i => 
                    i.includes('gin') || 
                    i.includes('vodka') || 
                    i.includes('rum') || 
                    i.includes('whiskey') || 
                    i.includes('tequila') || 
                    i.includes('brandy')
                );
            default:
                return false;
        }
    });
}

// Format ingredients for display
function formatIngredients(ingredients) {
    return ingredients.map(ing => {
        let display = `${ing.amount} ${ing.ingredient}`;
        if (ing.note) display += ` (${ing.note})`;
        return display;
    }).join(', ');
}

// Render the menu preview
function renderMenuPreview(cocktailsPerFamily) {
    const menuName = menuNameInput.value || 'Seasonal Cocktail Menu';
    const season = seasonSelect.value;

    menuPreviewDiv.innerHTML = `
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-navy">${menuName}</h2>
            <p class="text-lg text-slate/80">${season.charAt(0).toUpperCase() + season.slice(1)} ${new Date().getFullYear()}</p>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
            ${Object.entries(cocktailsPerFamily)
                .map(([family, count]) => {
                    const cocktails = getCocktailsForFamily(family);
                    const selectedCocktails = cocktails
                        .sort(() => 0.5 - Math.random()) // Shuffle cocktails
                        .slice(0, count); // Take the first 'count' cocktails

                    return `
                        <div class="bg-pearl p-6 rounded-lg">
                            <h3 class="text-xl font-bold text-navy mb-4">${family}</h3>
                            <div class="space-y-4">
                                ${selectedCocktails.map(cocktail => `
                                    <div class="p-4 bg-white rounded shadow-sm">
                                        <h4 class="font-medium text-navy">${cocktail.name}</h4>
                                        <div class="text-sm text-slate/80 mt-2">
                                            <p><strong>Ingredients:</strong> ${formatIngredients(cocktail.ingredients)}</p>
                                            ${cocktail.method ? `<p><strong>Method:</strong> ${cocktail.method}</p>` : ''}
                                            ${cocktail.glassware ? `<p><strong>Glass:</strong> ${cocktail.glassware}</p>` : ''}
                                            ${cocktail.garnish ? `<p><strong>Garnish:</strong> ${cocktail.garnish}</p>` : ''}
                                            ${cocktail.notes ? `<p class="italic">${cocktail.notes}</p>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
        </div>
    `;
}

// Print menu
function printMenu() {
    window.print();
}

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', initialize); 