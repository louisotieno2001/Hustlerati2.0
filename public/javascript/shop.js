// Shop functionality
document.addEventListener('DOMContentLoaded', function () {
    // Carousel functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    let searchQuery = '';

    function performSearch() {
        searchQuery = searchInput.value.toLowerCase();
        filterProducts();
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Category filters
    const categoryCards = document.querySelectorAll('.category-card');
    let selectedMainCategories = [];
    let selectedSubs = {}; // {category: Set(subs)}

    categoryCards.forEach(card => {
        const category = card.dataset.category.toLowerCase();
        const subList = card.querySelector('.subcategory-list');

        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.classList.contains('checkmark')) return; // Don't toggle if clicking checkbox

            card.classList.toggle('selected');
            if (card.classList.contains('selected')) {
                selectedMainCategories.push(category);
                selectedSubs[category] = new Set();
                subList.style.display = 'block';
            } else {
                selectedMainCategories = selectedMainCategories.filter(c => c !== category);
                delete selectedSubs[category];
                subList.style.display = 'none';
                // Uncheck subcategories
                subList.querySelectorAll('input[type="checkbox"]').forEach(sub => {
                    sub.checked = false;
                });
            }
            filterProducts();
        });

        // Subcategory checkboxes
        const subCheckboxes = card.querySelectorAll('.sub-checkbox input[type="checkbox"]');
        subCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const subCategory = this.value.toLowerCase();
                if (this.checked) {
                    if (!selectedSubs[category]) selectedSubs[category] = new Set();
                    selectedSubs[category].add(subCategory);
                } else {
                    if (selectedSubs[category]) selectedSubs[category].delete(subCategory);
                }
                filterProducts();
            });
        });
    });

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', function () {
        const sortBy = this.value;
        sortProducts(sortBy);
    });

    // View controls
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const view = this.dataset.view;
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });

    // Clear filters
    document.querySelector('.clear-filters-btn').addEventListener('click', function () {
        categoryCards.forEach(card => {
            card.classList.remove('selected');
            const subList = card.querySelector('.subcategory-list');
            subList.style.display = 'none';
            subList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        });
        selectedMainCategories = [];
        selectedSubs = {};
        searchQuery = '';
        searchInput.value = '';
        filterProducts();
    });

    // Filter products function
    function filterProducts() {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const category = card.dataset.category.toLowerCase();
            const subcategory = card.dataset.subcategory.toLowerCase();
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();

            let show = true;

            // Main category filter
            if (selectedMainCategories.length > 0 && !selectedMainCategories.includes(category)) {
                show = false;
            }

            // Subcategory filter
            if (selectedMainCategories.includes(category)) {
                if (selectedSubs[category] && selectedSubs[category].size > 0) {
                    if (!Array.from(selectedSubs[category]).some(s => s === subcategory)) {
                        show = false;
                    }
                }
            } else if (Object.keys(selectedSubs).length > 0) {
                // If subcategory selected but main category not selected, hide
                show = false;
            }

            // Search filter
            if (searchQuery && !title.includes(searchQuery) && !description.includes(searchQuery)) {
                show = false;
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    // Sort products function
    function sortProducts(sortBy) {
        const productsGrid = document.getElementById('productsGrid');
        const productCards = Array.from(productsGrid.children).filter(card => card.classList.contains('product-card'));

        productCards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));

            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    return b.dataset.id - a.dataset.id;
                default:
                    return 0;
            }
        });

        productCards.forEach(card => productsGrid.appendChild(card));
    }

    // Function to load cart count
    async function loadCartCount() {
        try {
            const response = await fetch('/cart/count');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('cartCount').textContent = data.count;
            }
        } catch (error) {
            console.error('Error loading cart count:', error);
        }
    }

    // Load cart count on page load
    loadCartCount();

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async function (e) {
            if (!user || !user.id) {
                window.location.href = '/login';
                return;
            }

            const productId = this.dataset.id;
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            this.disabled = true;

            try {
                const response = await fetch('/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productId: productId,
                        quantity: 1
                    })
                });

                if (response.ok) {
                    // Reload cart count
                    await loadCartCount();

                    // Show success message
                    this.innerHTML = '<i class="fas fa-check"></i> Added!';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    alert('Failed to add to cart: ' + (errorData.error || 'Unknown error'));
                    this.innerHTML = originalText;
                    this.disabled = false;
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('Failed to add to cart. Please try again.');
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    });
});
