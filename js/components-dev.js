// Component templates
const HEADER_TEMPLATE = `
<!-- Header/Navigation Component -->
<nav class="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
    <!-- ... rest of header HTML ... -->
</nav>
`;

const FOOTER_TEMPLATE = `
<!-- Footer Component -->
<footer class="bg-charcoal py-12 mt-12">
    <!-- ... rest of footer HTML ... -->
</footer>
`;

// Component loader utility
const loadComponents = async () => {
    try {
        // Insert header
        const headerElement = document.getElementById('header');
        if (headerElement) {
            headerElement.innerHTML = HEADER_TEMPLATE;
        }

        // Insert footer
        const footerElement = document.getElementById('footer');
        if (footerElement) {
            footerElement.innerHTML = FOOTER_TEMPLATE;
        }

        // Initialize mobile portfolio after header is loaded
        await initializeMobilegallery();
        
        // Highlight current page in navigation
        highlightCurrentPage();
    } catch (error) {
        console.error('Error initializing components:', error);
    }
};

// Mobile portfolio initialization
const initializeMobilegallery = async () => {
    // Wait a bit to ensure DOM elements are loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    const mobilegalleryButton = document.getElementById('mobile-portfolio-button');
    const mobilegallery = document.getElementById('mobile-portfolio');
    const galleryOpenIcon = document.getElementById('portfolio-open-icon');
    const galleryCloseIcon = document.getElementById('portfolio-close-icon');
    
    if (!mobilegalleryButton || !mobilegallery) return;

    const togglegallery = () => {
        const isExpanded = mobilegalleryButton.getAttribute('aria-expanded') === 'true';
        mobilegalleryButton.setAttribute('aria-expanded', !isExpanded);
        mobilegallery.classList.toggle('hidden');
        galleryOpenIcon.classList.toggle('hidden');
        galleryCloseIcon.classList.toggle('hidden');
    };

    mobilegalleryButton.addEventListener('click', togglegallery);

    // Add keyboard accessibility
    mobilegalleryButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglegallery();
        }
    });

    // Close portfolio when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobilegallery.classList.contains('hidden') && 
            !mobilegalleryButton.contains(e.target) && 
            !mobilegallery.contains(e.target)) {
            mobilegallery.classList.add('hidden');
            mobilegalleryButton.setAttribute('aria-expanded', 'false');
            galleryOpenIcon.classList.remove('hidden');
            galleryCloseIcon.classList.add('hidden');
        }
    });
};

// Highlight current page in navigation
const highlightCurrentPage = () => {
    try {
        const currentPath = window.location.pathname;
        const page = currentPath.split('/').pop().replace('.html', '') || 'index';
        
        document.querySelectorAll(`[data-nav="${page}"]`).forEach(link => {
            link.classList.add('text-terra');
        });
    } catch (error) {
        console.error('Error highlighting current page:', error);
    }
};

// Load header component
const loadHeader = () => {
    const headerElement = document.getElementById('header');
    if (headerElement) {
        fetch('/components/header.html')  // Note: changed path to absolute
            .then(response => response.text())
            .then(data => {
                headerElement.innerHTML = data;
                initializeHeaderScripts();
                highlightCurrentPage();
            })
            .catch(error => console.error('Error loading header:', error));
    }
};

// Load footer component
const loadFooter = () => {
    const footerElement = document.getElementById('footer');
    if (footerElement) {
        fetch('/components/footer.html')  // Note: changed path to absolute
            .then(response => response.text())
            .then(data => {
                footerElement.innerHTML = data;
                initializeFooterScripts();
            })
            .catch(error => console.error('Error loading footer:', error));
    }
};

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});

// Function to initialize header-specific scripts
const initializeHeaderScripts = () => {
    // Initialize mobile portfolio
    initializeMobilegallery();
};

// Function to initialize footer-specific scripts
const initializeFooterScripts = () => {
    // Add any footer-specific initialization here
}; 