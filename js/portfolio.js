// Portfolio data structure
const portfolioItems = {
    exterior: [
        {
            id: 1,
            title: "Professional Exterior Detail",
            description: "Full exterior detail on a BMW M4",
            image: "../images/portfolio/exterior-1.jpg",
            category: "exterior"
        },
        {
            id: 2,
            title: "Professional Exterior Detail",
            description: "Full exterior detail on a BMW M4",
            image: "../images/portfolio/exterior-2.jpg",
            category: "exterior"
        },
        {
            id: 3,
            title: "Professional Exterior Detail",
            description: "Full exterior detail on a BMW M4",
            image: "../images/portfolio/exterior-3.jpg",
            category: "exterior"
        },
        {
            id: 4,
            title: "Professional Exterior Detail",
            description: "Full exterior detail on a BMW M4",
            image: "../images/portfolio/exterior-4.jpg",
            category: "exterior"
        },
        {
            id: 5,
            title: "Professional Exterior Detail",
            description: "Full exterior detail on a BMW M4",
            image: "../images/portfolio/exterior-5.jpg",
            category: "exterior"
        },
        {
            id: 6,
            title: "Professional Exterior Detail",
            description: "Full exterior detail on a BMW M4",
            image: "../images/portfolio/exterior-6.jpg",
            category: "exterior"
        }
        // Add more items...
    ],
    interior: [
        {
            id: 1,
            title: "Luxury Interior Detail",
            description: "Complete interior restoration of a Mercedes S-Class",
            image: "../images/portfolio/interior-1.jpg",
            category: "interior"
        },
        {
            id: 1,
            title: "Luxury Interior Detail",
            description: "Complete interior restoration of a Mercedes S-Class",
            image: "../images/portfolio/interior-2.jpg",
            category: "interior"
        },
        {
            id: 1,
            title: "Luxury Interior Detail",
            description: "Complete interior restoration of a Mercedes S-Class",
            image: "../images/portfolio/interior-3.jpg",
            category: "interior"
        },
        {
            id: 1,
            title: "Luxury Interior Detail",
            description: "Complete interior restoration of a Mercedes S-Class",
            image: "../images/portfolio/interior-4.jpg",
            category: "interior"
        },
        {
            id: 1,
            title: "Luxury Interior Detail",
            description: "Complete interior restoration of a Mercedes S-Class",
            image: "../images/portfolio/interior-5.jpg",
            category: "interior"
        },
        {
            id: 1,
            title: "Luxury Interior Detail",
            description: "Complete interior restoration of a Mercedes S-Class",
            image: "../images/portfolio/interior-6.jpg",
            category: "interior"
        }
        // Add more items...
    ],
    "paint-correction": [
        {
            id: 7,
            title: "Paint Correction Service",
            description: "Professional paint correction and swirl mark removal",
            image: "../images/portfolio/paint-correction-1.jpg",
            category: "paint-correction"
        },
        {
            id: 8,
            title: "Paint Enhancement",
            description: "Deep paint correction with multi-stage polishing",
            image: "../images/portfolio/paint-correction-2.jpg",
            category: "paint-correction"
        },
        {
            id: 9,
            title: "Scratch Removal",
            description: "Professional scratch and paint defect correction",
            image: "../images/portfolio/paint-correction-3.jpg",
            category: "paint-correction"
        },
        {
            id: 10,
            title: "Paint Restoration",
            description: "Full paint restoration and ceramic coating prep",
            image: "../images/portfolio/paint-correction-4.jpg",
            category: "paint-correction"
        },
        {
            id: 11,
            title: "Swirl Mark Removal",
            description: "Elimination of swirl marks and minor scratches",
            image: "../images/portfolio/paint-correction-5.jpg",
            category: "paint-correction"
        },
        {
            id: 12,
            title: "Paint Protection",
            description: "Paint correction and protective coating application",
            image: "../images/portfolio/paint-correction-6.jpg",
            category: "paint-correction"
        }
        // Add more items...
    ],
    "ceramic-coating": [
        {
            id: 7,
            title: "Paint Correction Service",
            description: "Professional paint correction and swirl mark removal",
            image: "../images/portfolio/ceramic-1.jpg",
            category: "paint-correction"
        },
        {
            id: 8,
            title: "Paint Enhancement",
            description: "Deep paint correction with multi-stage polishing",
            image: "../images/portfolio/ceramic-2.jpg",
            category: "paint-correction"
        },
        {
            id: 9,
            title: "Scratch Removal",
            description: "Professional scratch and paint defect correction",
            image: "../images/portfolio/ceramic-3.jpg",
            category: "paint-correction"
        },
        {
            id: 10,
            title: "Paint Restoration",
            description: "Full paint restoration and ceramic coating prep",
            image: "../images/portfolio/ceramic-4.jpg",
            category: "paint-correction"
        },
        {
            id: 11,
            title: "Swirl Mark Removal",
            description: "Elimination of swirl marks and minor scratches",
            image: "../images/portfolio/ceramic-5.jpg",
            category: "paint-correction"
        },
        {
            id: 12,
            title: "Paint Protection",
            description: "Paint correction and protective coating application",
            image: "../images/portfolio/ceramic-6.jpg",
            category: "paint-correction"
        }
        // Add more items...
    ]
    
    // Add other categories...
};

// Function to create portfolio item HTML
const createPortfolioItem = (item) => {
    return `
        <div class="portfolio-item" data-category="${item.category}">
            <div class="group relative overflow-hidden rounded-lg shadow-lg">
                <!-- Image Container with aspect ratio -->
                <div class="aspect-[4/3] overflow-hidden">
                    <img 
                        src="${item.image}" 
                        alt="${item.title}"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <!-- Overlay with text -->
                <div class="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="absolute bottom-0 left-0 right-0 p-6">
                        <h3 class="text-xl font-bold text-pearl">${item.title}</h3>
                        <p class="text-pearl/90 mt-2">${item.description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Function to display portfolio items
const displayPortfolio = (category) => {
    const container = document.getElementById('portfolio-container');
    const items = portfolioItems[category] || [];
    
    // Remove loading spinner
    const loadingElement = container.querySelector('.portfolio-loading');
    if (loadingElement) {
        loadingElement.remove();
    }

    // Update container class for grid layout
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
    
    // Display items
    container.innerHTML = items.map(item => createPortfolioItem(item)).join('');
};

// Handle filter buttons
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active states
            filterButtons.forEach(btn => btn.setAttribute('data-active', 'false'));
            button.setAttribute('data-active', 'true');
            
            // Display filtered items
            const category = button.getAttribute('data-filter');
            displayPortfolio(category);
        });
    });

    // Display initial category (exterior)
    displayPortfolio('exterior');
}); 