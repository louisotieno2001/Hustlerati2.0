// Global variables
let allProperties = [];
let filteredProperties = [];
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

// Get properties from DOM data attributes
function getPropertiesFromDOM() {
    const propertyCards = document.querySelectorAll('.property-card');
    const properties = [];

    propertyCards.forEach(card => {
        const property = {
            id: card.dataset.id,
            type: card.dataset.type,
            price: parseFloat(card.dataset.price) || 0,
            size: parseFloat(card.dataset.size) || 0,
            city: card.dataset.city,
            spaceType: card.dataset.spaceType,
            leaseTerms: card.dataset.leaseTerms,
            availability: card.dataset.availability,
            amenities: JSON.parse(card.dataset.amenities || '[]'),
            businessSize: JSON.parse(card.dataset.businessSize || '[]'),
            title: card.dataset.title,
            location: card.dataset.location,
            description: card.dataset.description
        };
        properties.push(property);
    });

    return properties;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    allProperties = getPropertiesFromDOM();
    filteredProperties = [...allProperties];
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
    filteredProperties = allProperties.filter(property => {
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
    const allCards = document.querySelectorAll('.property-card');
    const noResults = document.getElementById('noResults');

    // First, set display based on whether in filteredProperties
    allCards.forEach(card => {
        const id = card.dataset.id;
        const isInFiltered = filteredProperties.some(p => p.id == id);
        card.style.display = isInFiltered ? 'block' : 'none';
    });

    // Then, for pagination, hide the filtered ones not in the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);

    allCards.forEach(card => {
        const id = card.dataset.id;
        const isInFiltered = filteredProperties.some(p => p.id == id);
        const isInPage = propertiesToShow.some(p => p.id == id);
        if (isInFiltered && !isInPage) {
            card.style.display = 'none';
        }
    });

    if (filteredProperties.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }

    updatePagination();
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

// Booking modal functionality
function handleBook(id, bookingType) {
    const modal = document.getElementById('bookingModal');
    const message = document.getElementById('modalMessage');
    const continueBtn = document.getElementById('continueBtn');

    if (bookingType === 'individual') {
        message.textContent = 'The property has been booked by an individual and is therefore closed.';
        continueBtn.style.display = 'none';
    } else if (bookingType === 'group') {
        message.textContent = 'The property is booked as group. Proceed if you want to join the group.';
        continueBtn.style.display = 'block';
        continueBtn.onclick = () => {
            window.location.href = `/booking/${id}`;
            modal.style.display = 'none';
        };
    } else if (bookingType === 'group full') {
        message.textContent = 'The property is group booked and the group is full.';
        continueBtn.style.display = 'none';
    } else {
        // Default, allow booking
        window.location.href = `/booking/${id}`;
        return;
    }

    modal.style.display = 'block';
}

// Modal close functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
