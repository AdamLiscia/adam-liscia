// Define the color palette
const colors = {
    navy: '#1C3879',      // Deep navy blue - primary color, represents trust and professionalism
    silver: '#E5E5E5',    // Metallic silver - represents cars and luxury
    azure: '#4B89DC',     // Bright blue - for accents and calls-to-action
    slate: '#2C3E50',     // Dark slate - for text and secondary elements
    pearl: '#F8F9FA',     // Pearl white - for backgrounds
    success: '#2ECC71',   // Green - for success messages and booking confirmations
};

// Export the colors for Tailwind configuration
const tailwindColors = {
    theme: {
        extend: {
            colors: colors
        }
    }
};

// Make colors available globally
window.restaurantColors = colors;
window.tailwindConfig = tailwindColors; 