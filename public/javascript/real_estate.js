// Real Estate Page JavaScript

// Sample property data
const sampleProperties = [
    {
        id: 1,
        title: "Modern Warehouse Space",
        type: "warehouse",
        price: 8500,
        size: 15000,
        location: "New York",
        city: "new-york",
        spaceType: "dedicated",
        amenities: ["parking", "security", "loading-dock", "climate-control"],
        leaseTerms: "yearly",
        availability: "immediate",
        businessSize: ["small", "medium"],
        description: "Spacious warehouse with modern amenities, perfect for storage and distribution.",
        image: "🏭",
        badge: "Available Now"
    },
    {
        id: 2,
        title: "Downtown Retail Space",
        type: "retail",
        price: 12000,
        size: 2500,
        location: "Los Angeles",
        city: "los-angeles",
        spaceType: "dedicated",
        amenities: ["parking", "security", "wifi", "bathroom"],
        leaseTerms: "monthly",
        availability: "immediate",
        businessSize: ["startup", "small"],
        description: "Prime retail location in downtown LA with high foot traffic.",
        image: "🏪",
        badge: "Prime Location"
    },
    {
        id: 3,
        title: "Tech Office Hub",
        type: "office",
        price: 18000,
        size: 8000,
        location: "San Francisco",
        city: "san-jose",
        spaceType: "co-working",
        amenities: ["wifi", "kitchen", "bathroom", "elevator"],
        leaseTerms: "flexible",
        availability: "within-30-days",
        businessSize: ["startup", "small", "medium"],
        description: "Modern co-working space designed for tech startups and creative teams.",
        image: "🏢",
        badge: "Tech Ready"
    },
    {
        id: 4,
        title: "Industrial Manufacturing Facility",
        type: "industrial",
        price: 25000,
        size: 50000,
        location: "Chicago",
        city: "chicago",
        spaceType: "dedicated",
        amenities: ["parking", "security", "loading-dock", "climate-control"],
        leaseTerms: "yearly",
        availability: "within-90-days",
        businessSize: ["medium", "large"],
        description: "Large industrial facility with heavy machinery support and loading capabilities.",
        image: "🏭",
        badge: "Industrial Grade"
    },
    {
        id: 5,
        title: "Restaurant Space",
        type: "restaurant",
        price: 9500,
        size: 3000,
        location: "Houston",
        city: "houston",
        spaceType: "dedicated",
        amenities: ["parking", "kitchen", "bathroom", "wifi"],
        leaseTerms: "monthly",
        availability: "immediate",
        businessSize: ["startup", "small"],
        description: "Fully equipped restaurant space with commercial kitchen and dining area.",
        image: "🍽️",
        badge: "Kitchen Ready"
    },
    {
        id: 6,
        title: "Storage Facility Units",
        type: "storage",
        price: 800,
        size: 200,
        location: "Phoenix",
        city: "phoenix",
        spaceType: "shared",
        amenities: ["security", "climate-control"],
        leaseTerms: "monthly",
        availability: "immediate",
        businessSize: ["startup", "small"],
        description: "Secure storage units with climate control, perfect for inventory or equipment.",
        image: "📦",
        badge: "Secure Storage"
    },
    {
        id: 7,
        title: "Creative Studio Space",
        type: "office",
        price: 6500,
        size: 1500,
        location: "Philadelphia",
        city: "philadelphia",
        spaceType: "shared",
        amenities: ["wifi", "kitchen", "bathroom"],
        leaseTerms: "quarterly",
        availability: "within-30-days",
        businessSize: ["startup", "small"],
        description: "Creative studio space with natural lighting and collaborative areas.",
        image: "🎨",
        badge: "Creative Hub"
    },
    {
        id: 8,
        title: "Distribution Center",
        type: "warehouse",
        price: 35000,
        size: 75000,
        location: "Dallas",
        city: "dallas",
        spaceType: "dedicated",
        amenities: ["parking", "security", "loading-dock", "climate-control"],
        leaseTerms: "yearly",
        availability: "within-90-days",
        businessSize: ["large"],
        description: "Massive distribution center with multiple loading docks and office space.",
        image: "🚚",
        badge: "Distribution Ready"
    },
    {
        id: 9,
        title: "Boutique Retail Space",
        type: "retail",
        price: 7500,
        size: 1200,
        location: "San Diego",
        city: "san-diego",
        spaceType: "dedicated",
        amenities: ["parking", "security", "wifi"],
        leaseTerms: "monthly",
        availability: "immediate",
        businessSize: ["startup", "small"],
        description: "Charming boutique space in trendy neighborhood with high visibility.",
        image: "🛍️",
        badge: "Boutique Ready"
    },
    {
        id: 10,
        title: "Executive Office Suite",
        type: "office",
        price: 22000,
        size: 5000,
        location: "New York",
        city: "new-york",
        spaceType: "dedicated",
        amenities: ["parking", "security", "wifi", "kitchen", "bathroom", "elevator"],
        leaseTerms: "yearly",
        availability: "within-30-days",
        businessSize: ["medium", "large"],
        description: "Luxury executive office suite with premium amenities and city views.",
        image: "🏢",
        badge: "Executive"
    },
    {
        id: 11,
        title: "Food Processing Facility",
        type: "industrial",
        price: 28000,
        size: 35000,
        location: "San Antonio",
        city: "san-antonio",
        spaceType: "dedicated",
        amenities: ["parking", "security", "loading-dock", "climate-control", "kitchen"],
        leaseTerms: "yearly",
        availability: "within-90-days",
        businessSize: ["medium", "large"],
        description: "Specialized food processing facility with commercial kitchen equipment.",
        image: "🍕",
        badge: "Food Grade"
    },
    {
        id: 12,
        title: "Co-working Innovation Hub",
        type: "office",
        price: 4500,
        size: 2000,
        location: "Los Angeles",
        city: "los-angeles",
        spaceType: "co-working",
        amenities: ["wifi", "kitchen", "bathroom", "elevator"],
        leaseTerms: "flexible",
        availability: "immediate",
        businessSize: ["startup", "small"],
        description: "Innovation hub with meeting rooms, event space, and networking opportunities.",
        image: "💡",
        badge: "Innovation Hub"
    }
];

// Global variables
let filteredProperties = [...sampleProperties];
let currentPage = 1;
let itemsPerPage = 6;
let currentView = 'grid';

// Filter state
let activeFilters = {
    propertyType: [],
    priceRange: { min: 0, max: 50000 },
    sizeRange: { min: 0, max: 100000 },
    location: '',
    spaceType: [],
    amenities: [],
    leaseTerms: [],
    availability: [],
    businessSize: [],
    searchQuery: ''
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializeFilters();
    initializeSearch();
    initializeViewControls();
    initializePagination();
    initializeMobileFilters();
    renderProperties();
    updateResultsCount();
});

// Initialize filter event listeners
function initializeFilters() {
    // Property type filters
    document.querySelectorAll('input[name="propertyType"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Space type filters
    document.querySelectorAll('input[name="spaceType"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Amenities filters
    document.querySelectorAll('input[name="amenities"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Lease terms filters
    document.querySelectorAll('input[name="leaseTerms"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Availability filters
    document.querySelectorAll('input[name="availability"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Business size filters
    document.querySelectorAll('input[name="businessSize"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Price range inputs
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceSlider = document.getElementById('priceSlider');

    minPriceInput.addEventListener('input', handlePriceChange);
    maxPriceInput.addEventListener('input', handlePriceChange);
    priceSlider.addEventListener('input', handlePriceSliderChange);

    // Size range inputs
    const minSizeInput = document.getElementById('minSize');
    const maxSizeInput = document.getElementById('maxSize');
    const sizeSlider = document.getElementById('sizeSlider');

    minSizeInput.addEventListener('input', handleSizeChange);
    maxSizeInput.addEventListener('input', handleSizeChange);
    sizeSlider.addEventListener('input', handleSizeSliderChange);

    // Location filter
    document.getElementById('cityFilter').addEventListener('change', handleLocationChange);

    // Clear filters button
    document.querySelector('.clear-filters-btn').addEventListener('click', clearAllFilters);

    // Quick filters
    document.querySelectorAll('.quick-filter').forEach(filter => {
        filter.addEventListener('click', handleQuickFilter);
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Initialize view controls
function initializeViewControls() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const view = this.dataset.view;
            setView(view);
        });
    });

    // Sort controls
    document.getElementById('sortSelect').addEventListener('change', handleSort);
}

// Initialize pagination
function initializePagination() {
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

// Initialize mobile filter functionality
function initializeMobileFilters() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');
    const filterCloseBtn = document.getElementById('filterCloseBtn');

    // Toggle filter sidebar
    filterToggleBtn.addEventListener('click', function() {
        filterSidebar.classList.add('active');
        filterOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close filter sidebar
    function closeFilterSidebar() {
        filterSidebar.classList.remove('active');
        filterOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    filterCloseBtn.addEventListener('click', closeFilterSidebar);
    filterOverlay.addEventListener('click', closeFilterSidebar);

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && filterSidebar.classList.contains('active')) {
            closeFilterSidebar();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && filterSidebar.classList.contains('active')) {
            closeFilterSidebar();
        }
    });
}

// Handle filter changes
function handleFilterChange(event) {
    const filterType = event.target.name;
    const filterValue = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        if (!activeFilters[filterType].includes(filterValue)) {
            activeFilters[filterType].push(filterValue);
        }
    } else {
        activeFilters[filterType] = activeFilters[filterType].filter(value => value !== filterValue);
    }

    applyFilters();
}

// Handle price range changes
function handlePriceChange() {
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || 50000;

    activeFilters.priceRange = { min: minPrice, max: maxPrice };
    applyFilters();
}

// Handle price slider changes
function handlePriceSliderChange(event) {
    const value = parseInt(event.target.value);
    document.getElementById('maxPrice').value = value;
    activeFilters.priceRange.max = value;
    applyFilters();
}

// Handle size range changes
function handleSizeChange() {
    const minSize = parseInt(document.getElementById('minSize').value) || 0;
    const maxSize = parseInt(document.getElementById('maxSize').value) || 100000;

    activeFilters.sizeRange = { min: minSize, max: maxSize };
    applyFilters();
}

// Handle size slider changes
function handleSizeSliderChange(event) {
    const value = parseInt(event.target.value);
    document.getElementById('maxSize').value = value;
    activeFilters.sizeRange.max = value;
    applyFilters();
}

// Handle location changes
function handleLocationChange(event) {
    activeFilters.location = event.target.value;
    applyFilters();
}

// Handle search
function handleSearch() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    activeFilters.searchQuery = searchQuery;
    applyFilters();
}

// Handle quick filters
function handleQuickFilter(event) {
    const filterType = event.target.dataset.type;

    // Clear other quick filters
    document.querySelectorAll('.quick-filter').forEach(filter => {
        filter.classList.remove('active');
    });

    // Activate this filter
    event.target.classList.add('active');

    // Set property type filter
    activeFilters.propertyType = [filterType];

    // Update checkboxes
    document.querySelectorAll('input[name="propertyType"]').forEach(checkbox => {
        checkbox.checked = checkbox.value === filterType;
    });

    applyFilters();
}

// Handle sort
function handleSort(event) {
    const sortBy = event.target.value;
    sortProperties(sortBy);
    renderProperties();
}

// Set view mode
function setView(view) {
    currentView = view;

    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Update results grid
    const resultsGrid = document.getElementById('resultsGrid');
    if (view === 'list') {
        resultsGrid.classList.add('list-view');
    } else {
        resultsGrid.classList.remove('list-view');
    }

    renderProperties();
}

// Apply all filters
function applyFilters() {
    filteredProperties = sampleProperties.filter(property => {
        // Property type filter
        if (activeFilters.propertyType.length > 0 && !activeFilters.propertyType.includes(property.type)) {
            return false;
        }

        // Price range filter
        if (property.price < activeFilters.priceRange.min || property.price > activeFilters.priceRange.max) {
            return false;
        }

        // Size range filter
        if (property.size < activeFilters.sizeRange.min || property.size > activeFilters.sizeRange.max) {
            return false;
        }

        // Location filter
        if (activeFilters.location && property.city !== activeFilters.location) {
            return false;
        }

        // Space type filter
        if (activeFilters.spaceType.length > 0 && !activeFilters.spaceType.includes(property.spaceType)) {
            return false;
        }

        // Amenities filter
        if (activeFilters.amenities.length > 0) {
            const hasAllAmenities = activeFilters.amenities.every(amenity =>
                property.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
        }

        // Lease terms filter
        if (activeFilters.leaseTerms.length > 0 && !activeFilters.leaseTerms.includes(property.leaseTerms)) {
            return false;
        }

        // Availability filter
        if (activeFilters.availability.length > 0 && !activeFilters.availability.includes(property.availability)) {
            return false;
        }

        // Business size filter
        if (activeFilters.businessSize.length > 0) {
            const hasMatchingSize = activeFilters.businessSize.some(size =>
                property.businessSize.includes(size)
            );
            if (!hasMatchingSize) return false;
        }

        // Search query filter
        if (activeFilters.searchQuery) {
            const searchLower = activeFilters.searchQuery.toLowerCase();
            const matchesSearch =
                property.title.toLowerCase().includes(searchLower) ||
                property.location.toLowerCase().includes(searchLower) ||
                property.type.toLowerCase().includes(searchLower) ||
                property.description.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        return true;
    });

    currentPage = 1;
    renderProperties();
    updateResultsCount();
}

// Sort properties
function sortProperties(sortBy) {
    filteredProperties.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'size-low':
                return a.size - b.size;
            case 'size-high':
                return b.size - a.size;
            case 'newest':
                return b.id - a.id;
            case 'oldest':
                return a.id - b.id;
            default:
                return 0;
        }
    });
}

// Render properties
function renderProperties() {
    const resultsGrid = document.getElementById('resultsGrid');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);

    resultsGrid.innerHTML = '';

    if (propertiesToShow.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 20px;"></i>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        `;
        return;
    }

    propertiesToShow.forEach(property => {
        const propertyCard = createPropertyCard(property);
        resultsGrid.appendChild(propertyCard);
    });

    updatePagination();
}

// Create property card
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = `property-card ${currentView === 'list' ? 'list-view' : ''}`;

    const amenitiesHTML = property.amenities.map(amenity =>
        `<span class="amenity-tag">${getAmenityLabel(amenity)}</span>`
    ).join('');

    card.innerHTML = `
        <div class="property-image">
            ${property.image}
            <div class="property-badge">${property.badge}</div>
        </div>
        <div class="property-content">
            <div class="property-header">
                <div>
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </div>
                </div>
                <div class="property-price">$${property.price.toLocaleString()}/mo</div>
            </div>
            
            <div class="property-details">
                <div class="property-detail">
                    <span class="detail-value">${property.size.toLocaleString()}</span>
                    <span class="detail-label">sq ft</span>
                </div>
                <div class="property-detail">
                    <span class="detail-value">${property.type}</span>
                    <span class="detail-label">type</span>
                </div>
                <div class="property-detail">
                    <span class="detail-value">${property.spaceType}</span>
                    <span class="detail-label">space</span>
                </div>
            </div>
            
            <div class="property-amenities">
                ${amenitiesHTML}
            </div>
            
            <div class="property-actions">
                <button class="btn btn-outline">View Details</button>
                <button class="btn btn-primary">Contact Owner</button>
            </div>
        </div>
    `;

    return card;
}

// Get amenity label
function getAmenityLabel(amenity) {
    const labels = {
        'parking': 'Parking',
        'security': 'Security',
        'loading-dock': 'Loading Dock',
        'climate-control': 'Climate Control',
        'wifi': 'WiFi',
        'kitchen': 'Kitchen',
        'bathroom': 'Bathroom',
        'elevator': 'Elevator'
    };
    return labels[amenity] || amenity;
}

// Update results count
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    countElement.textContent = filteredProperties.length;
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelector('.page-numbers');

    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Update page numbers
    pageNumbers.innerHTML = '';

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageNumber);
        }
    } else {
        // Show first page
        const firstPage = document.createElement('span');
        firstPage.className = `page-number ${currentPage === 1 ? 'active' : ''}`;
        firstPage.textContent = '1';
        firstPage.addEventListener('click', () => goToPage(1));
        pageNumbers.appendChild(firstPage);

        if (currentPage > 3) {
            const dots1 = document.createElement('span');
            dots1.className = 'page-dots';
            dots1.textContent = '...';
            pageNumbers.appendChild(dots1);
        }

        // Show current page and neighbors
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageNumber);
        }

        if (currentPage < totalPages - 2) {
            const dots2 = document.createElement('span');
            dots2.className = 'page-dots';
            dots2.textContent = '...';
            pageNumbers.appendChild(dots2);
        }

        // Show last page
        if (totalPages > 1) {
            const lastPage = document.createElement('span');
            lastPage.className = `page-number ${currentPage === totalPages ? 'active' : ''}`;
            lastPage.textContent = totalPages;
            lastPage.addEventListener('click', () => goToPage(totalPages));
            pageNumbers.appendChild(lastPage);
        }
    }
}

// Change page
function changePage(direction) {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProperties();
    }
}

// Go to specific page
function goToPage(page) {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProperties();
    }
}

// Clear all filters
function clearAllFilters() {
    // Reset filter state
    activeFilters = {
        propertyType: [],
        priceRange: { min: 0, max: 50000 },
        sizeRange: { min: 0, max: 100000 },
        location: '',
        spaceType: [],
        amenities: [],
        leaseTerms: [],
        availability: [],
        businessSize: [],
        searchQuery: ''
    };

    // Reset form elements
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('minSize').value = '';
    document.getElementById('maxSize').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('searchInput').value = '';

    // Reset quick filters
    document.querySelectorAll('.quick-filter').forEach(filter => {
        filter.classList.remove('active');
    });

    // Reset sliders
    document.getElementById('priceSlider').value = 50000;
    document.getElementById('sizeSlider').value = 100000;

    // Apply filters
    applyFilters();
}

// Add some CSS for no results
const style = document.createElement('style');
style.textContent = `
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--text-light);
    }
    
    .no-results h3 {
        margin-bottom: 10px;
        color: var(--text-color);
    }
`;
document.head.appendChild(style); 