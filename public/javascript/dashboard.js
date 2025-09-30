document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // Tab switching functionality
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items and tabs
            navItems.forEach(navItem => navItem.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked nav item
            this.classList.add('active');

            // Show corresponding tab
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
                sidebarToggle.querySelector('i').classList.remove('fa-times');
                sidebarToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Sub-tab switching functionality for orders
    const subNavItems = document.querySelectorAll('.sub-tab-nav li');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all sub nav items and sub tabs
            subNavItems.forEach(navItem => navItem.classList.remove('sub-active'));
            subTabContents.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked sub nav item
            this.classList.add('sub-active');

            // Show corresponding sub tab
            const subTabId = this.getAttribute('data-sub-tab') + '-orders';
            document.getElementById(subTabId).classList.add('active');
        });
    });

    // Theme select functionality
    const themeSelect = document.getElementById('theme-select');

    themeSelect.addEventListener('change', async () => {
        const selectedTheme = themeSelect.value;
        document.body.className = selectedTheme + '-theme';
        localStorage.setItem('hustlerati-theme', selectedTheme);

        // Update preferences
        try {
            const response = await fetch('/dashboard/update-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: selectedTheme })
            });
            if (!response.ok) {
                showPopup('Failed to update theme preference.', 'error');
            }
        } catch (error) {
            console.error('Error updating theme preference:', error);
            showPopup('Error updating theme preference.', 'error');
        }
    });

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('hustlerati-theme');
    if (savedTheme) {
        document.body.className = savedTheme + '-theme';
    }

    // Custom popup functionality
    const customPopup = document.getElementById('custom-popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.querySelector('.popup-close');
    const popupOk = document.getElementById('popup-ok');

    function showPopup(message, type = 'info') {
        popupMessage.textContent = message;
        // Optional: Add class for different types (success, error, etc.)
        popupMessage.className = `popup-message ${type}`;
        customPopup.style.display = 'block';
    }

    function hidePopup() {
        customPopup.style.display = 'none';
    }

    popupClose.addEventListener('click', hidePopup);
    popupOk.addEventListener('click', hidePopup);

    // Close popup when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === customPopup) {
            hidePopup();
        }
    });

    // Header dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Toggle dropdown on click
        toggle.addEventListener('click', function(e) {
            e.preventDefault();

            // Close all other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }

        if (!e.target.closest('.theme-switcher')) {
            document.querySelector('.theme-dropdown').style.opacity = '0';
            document.querySelector('.theme-dropdown').style.visibility = 'hidden';
        }

        if (!e.target.closest('.user-dropdown')) {
            document.querySelector('.dropdown-menu').style.opacity = '0';
            document.querySelector('.dropdown-menu').style.visibility = 'hidden';
        }
    });

    // Settings tab functionality
    const coverEditBtn = document.querySelector('.cover-edit-btn');
    const coverUploadInput = document.getElementById('cover-upload');
    const coverPreview = document.getElementById('cover-preview');

    const profileEditBtn = document.querySelector('.profile-edit-btn');
    const profileUploadInput = document.getElementById('profile-upload');
    const profilePreview = document.getElementById('profile-preview');

    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const userForm = document.getElementById('user-form');

    const darkThemeToggle = document.getElementById('dark-theme-toggle');
    const emailVerificationsToggle = document.getElementById('email-verifications-toggle');

    const verifyEmailBtn = document.getElementById('verify-email-btn');
    const verifyPhoneBtn = document.getElementById('verify-phone-btn');

    // Helper to toggle edit mode for user form
    function toggleEditMode(enable) {
        const inputs = userForm.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.id !== 'email') {
                input.readOnly = !enable;
            }
        });
        editBtn.style.display = enable ? 'none' : 'inline-block';
        saveBtn.style.display = enable ? 'inline-block' : 'none';
        cancelBtn.style.display = enable ? 'inline-block' : 'none';
    }

    // Cover image upload
    coverEditBtn.addEventListener('click', () => {
        coverUploadInput.click();
    });

    coverUploadInput.addEventListener('change', async () => {
        const file = coverUploadInput.files[0];
        if (file) {
            // Show local preview immediately
            const reader = new FileReader();
            reader.onload = e => {
                coverPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Upload to server immediately
            const formData = new FormData();
            formData.append('media', file);

            try {
                const response = await fetch('/upload-cover', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    showPopup('Cover image updated successfully.', 'success');
                } else {
                    showPopup('Failed to upload cover image. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error uploading cover image:', error);
                showPopup('Error uploading cover image. Please check your internet connection and try again.', 'error');
            }
        }
    });

    // Profile image upload
    profileEditBtn.addEventListener('click', () => {
        profileUploadInput.click();
    });

    profileUploadInput.addEventListener('change', async () => {
        const file = profileUploadInput.files[0];
        
        if (file) {
            // Show local preview immediately
            const reader = new FileReader();
            reader.onload = e => {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Upload to server immediately
            const formData = new FormData();
            formData.append('media', file);

            console.log(formData)

            try {
                const response = await fetch('/upload-profile', {
                    method: 'POST',
                    body: formData
                });

                console.log("Server response", response)
                if (response.ok) {
                    showPopup('Profile image updated successfully.', 'success');
                } else {
                    showPopup('Failed to upload profile image. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error uploading profile image:', error);
                showPopup('Error uploading profile image. Please check your internet connection and try again.', 'error');
            }
        }
    });

    // Edit button click
    editBtn.addEventListener('click', () => {
        toggleEditMode(true);
    });

    // Cancel button click
    cancelBtn.addEventListener('click', () => {
        toggleEditMode(false);
        // Reset form values to original
        userForm.name.value = userForm.name.defaultValue;
        userForm.phone.value = userForm.phone.defaultValue;
        // Reset images to original src
        coverPreview.src = coverPreview.defaultSrc || coverPreview.src;
        profilePreview.src = profilePreview.defaultSrc || profilePreview.src;
        // Clear file inputs
        coverUploadInput.value = '';
        profileUploadInput.value = '';
    });

    // Save button click (form submit)
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prepare form data
        const formData = new FormData();
        formData.append('name', userForm.name.value);
        formData.append('phone', userForm.phone.value);

        if (coverUploadInput.files[0]) {
            formData.append('cover_image', coverUploadInput.files[0]);
        }
        if (profileUploadInput.files[0]) {
            formData.append('profile_image', profileUploadInput.files[0]);
        }

        try {
            const response = await fetch('/upload-profile', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                showPopup('Profile updated successfully.', 'success');
                // Update default values to new values
                userForm.name.defaultValue = userForm.name.value;
                userForm.phone.defaultValue = userForm.phone.value;
                coverPreview.defaultSrc = coverPreview.src;
                profilePreview.defaultSrc = profilePreview.src;
                toggleEditMode(false);
            } else {
                showPopup('Failed to update profile.', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showPopup('Error updating profile.', 'error');
        }
    });

    // Preferences toggles change handlers
    darkThemeToggle.addEventListener('change', async () => {
        const enabled = darkThemeToggle.checked;
        try {
            const response = await fetch('/dashboard/update-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dark_theme: enabled })
            });
            if (response.ok) {
                // Apply theme immediately
                document.body.className = enabled ? 'dark-theme' : 'light-theme';
                localStorage.setItem('hustlerati-theme', enabled ? 'dark' : 'light');
            } else {
                showPopup('Failed to update preferences.', 'error');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            showPopup('Error updating preferences.', 'error');
        }
    });

    emailVerificationsToggle.addEventListener('change', async () => {
        const enabled = emailVerificationsToggle.checked;
        try {
            const response = await fetch('/dashboard/update-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_verifications: enabled })
            });
            if (!response.ok) {
                showPopup('Failed to update preferences.', 'error');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            showPopup('Error updating preferences.', 'error');
        }
    });

    // Verification buttons click handlers
    verifyEmailBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/dashboard/send-email-verification', { method: 'POST' });
            if (response.ok) {
                showPopup('Verification email sent.', 'success');
                verifyEmailBtn.style.display = 'none';
            } else {
                showPopup('Failed to send verification email.', 'error');
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            showPopup('Error sending verification email.', 'error');
        }
    });

    verifyPhoneBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/dashboard/send-phone-verification', { method: 'POST' });
            if (response.ok) {
                showPopup('Verification SMS sent.', 'success');
                verifyPhoneBtn.style.display = 'none';
            } else {
                showPopup('Failed to send verification SMS.', 'error');
            }
        } catch (error) {
            console.error('Error sending verification SMS:', error);
            showPopup('Error sending verification SMS.', 'error');
        }
    });

    // Cancel order functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cancel-order') || e.target.closest('.cancel-order')) {
            const button = e.target.classList.contains('cancel-order') ? e.target : e.target.closest('.cancel-order');
            const orderId = button.getAttribute('data-id');
            if (confirm('Are you sure you want to cancel this order?')) {
                cancelOrder(orderId, button);
            }
        }
    });

    async function cancelOrder(orderId, button) {
        try {
            const response = await fetch(`/orders/${orderId}/cancel`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                showPopup('Order cancelled successfully.', 'success');
                // Remove the order card from DOM
                const orderCard = button.closest('.order-card');
                if (orderCard) {
                    orderCard.remove();
                }
                // Update badge count
                const ordersBadge = document.querySelector('li[data-tab="orders"] .badge');
                if (ordersBadge) {
                    const currentCount = parseInt(ordersBadge.textContent) || 0;
                    ordersBadge.textContent = Math.max(0, currentCount - 1);
                }
            } else {
                showPopup('Failed to cancel order.', 'error');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            showPopup('Error cancelling order.', 'error');
        }
    }

    // Image popup functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.image-overlay')) {
            const overlay = e.target.closest('.image-overlay');
            const popup = overlay.nextElementSibling;
            if (popup && popup.classList.contains('image-popup')) {
                popup.classList.add('active');
            }
        }
    });

    // Close popup when clicking outside or close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('image-popup') || e.target.classList.contains('popup-close')) {
            const popups = document.querySelectorAll('.image-popup.active');
            popups.forEach(popup => popup.classList.remove('active'));
        }
    });

    // Carousel navigation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('carousel-prev') || e.target.classList.contains('carousel-next')) {
            const button = e.target;
            const carousel = button.closest('.popup-carousel');
            const mediaItems = carousel.querySelectorAll('img, video');
            let currentIndex = Array.from(mediaItems).findIndex(item => item.classList.contains('active'));

            if (button.classList.contains('carousel-prev')) {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
            } else {
                currentIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
            }

            mediaItems.forEach((item, index) => {
                item.classList.toggle('active', index === currentIndex);
            });
        }
    });

    // Image overlay navigation buttons for orders
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('overlay-prev') || e.target.classList.contains('overlay-next')) {
            const button = e.target;
            const overlay = button.closest('.image-overlay');
            const media = JSON.parse(button.getAttribute('data-media'));
            let currentIndex = parseInt(button.getAttribute('data-index'), 10);

            if (button.classList.contains('overlay-prev')) {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : media.length - 1;
            } else {
                currentIndex = currentIndex < media.length - 1 ? currentIndex + 1 : 0;
            }

            // Update the data-index attribute on buttons
            const prevButton = overlay.querySelector('.overlay-prev');
            const nextButton = overlay.querySelector('.overlay-next');
            prevButton.setAttribute('data-index', currentIndex);
            nextButton.setAttribute('data-index', currentIndex);

            // Update the overlay content image and count
            const overlayContent = overlay.querySelector('.overlay-content');
            const span = overlayContent.querySelector('span');
            span.textContent = `+${media.length - 1} more (Showing ${currentIndex + 1} of ${media.length})`;

            // Optionally, update the main image shown in the order card
            const orderCard = overlay.closest('.order-card');
            if (orderCard) {
                const orderImage = orderCard.querySelector('.order-image img.order-media, .order-image video.order-media');
                if (orderImage) {
                    const mediaItem = media[currentIndex];
                    const mediaUrl = mediaItem.url || `/assets/${mediaItem.id}`;
                    const filename = mediaItem.filename_download || mediaItem.filename_disk || '';
                    if (filename.match(/\.(mp4|webm|ogg|mov)$/i)) {
                        // Replace image with video element
                        const video = document.createElement('video');
                        video.className = 'order-media';
                        video.controls = true;
                        video.preload = 'metadata';
                        video.src = mediaUrl;
                        orderImage.replaceWith(video);
                    } else {
                        // Replace video with image element
                        const img = document.createElement('img');
                        img.className = 'order-media';
                        img.src = mediaUrl;
                        img.alt = orderCard.querySelector('.order-details h4').textContent || 'Product Image';
                        img.loading = 'lazy';
                        orderImage.replaceWith(img);
                    }
                }
            }
        }
    });

    // Analytics charts
    const orderStatusCtx = document.getElementById('orderStatusChart');
    if (orderStatusCtx && orderStatusCtx.dataset.orders) {
        const orders = JSON.parse(orderStatusCtx.dataset.orders);
        const statusCounts = {};
        orders.forEach(order => {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });
        new Chart(orderStatusCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && revenueCtx.dataset.revenue) {
        const revenue = parseFloat(revenueCtx.dataset.revenue);
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Monthly Revenue'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [revenue],
                    backgroundColor: '#36a2eb'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const spacesStatusCtx = document.getElementById('spacesStatusChart');
    if (spacesStatusCtx && spacesStatusCtx.dataset.spaces) {
        const spaces = JSON.parse(spacesStatusCtx.dataset.spaces);
        const statusCounts = {};
        spaces.forEach(space => {
            statusCounts[space.status] = (statusCounts[space.status] || 0) + 1;
        });
        new Chart(spacesStatusCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    label: 'Number of Spaces',
                    data: Object.values(statusCounts),
                    backgroundColor: '#4bc0c0'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const bookingsTypeCtx = document.getElementById('bookingsTypeChart');
    if (bookingsTypeCtx && bookingsTypeCtx.dataset.bookings) {
        const bookings = JSON.parse(bookingsTypeCtx.dataset.bookings);
        const typeCounts = {};
        bookings.forEach(booking => {
            typeCounts[booking.type] = (typeCounts[booking.type] || 0) + 1;
        });
        new Chart(bookingsTypeCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(typeCounts),
                datasets: [{
                    data: Object.values(typeCounts),
                    backgroundColor: ['#ff9f40', '#ffcd56']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // New chart: Recent Activity (orders + bookings)
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx && activityCtx.dataset.orders && activityCtx.dataset.bookings) {
        const recentOrders = JSON.parse(activityCtx.dataset.orders);
        const recentBookings = JSON.parse(activityCtx.dataset.bookings);

        // Prepare data for recent activity chart (combined orders and bookings count by date)
        const activityData = {};

        recentOrders.forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString();
            activityData[date] = (activityData[date] || 0) + 1;
        });

        recentBookings.forEach(booking => {
            const date = new Date(booking.created_at).toLocaleDateString();
            activityData[date] = (activityData[date] || 0) + 1;
        });

        const labels = Object.keys(activityData).sort((a,b) => new Date(a) - new Date(b));
        const dataPoints = labels.map(label => activityData[label]);

        new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Recent Activity',
                    data: dataPoints,
                    fill: false,
                    borderColor: '#36a2eb',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    }
                }
            }
        });
    }

    // New chart: Space Performance (top 5 spaces by bookings count)
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx && performanceCtx.dataset.spaces) {
        const spaces = JSON.parse(performanceCtx.dataset.spaces);

        // Count bookings per space (assuming each space has bookings array)
        const bookingCounts = {};
        spaces.forEach(space => {
            bookingCounts[space.title] = (bookingCounts[space.title] || 0) + (space.bookings ? space.bookings.length : 0);
        });

        const labels = Object.keys(bookingCounts);
        const dataPoints = Object.values(bookingCounts);

        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Bookings Count',
                    data: dataPoints,
                    backgroundColor: '#ff6384'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
