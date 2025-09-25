// Property Details Page JavaScript

// Get property data from server
const propertyData = window.__PROPERTY_DATA__;

// Amenity labels mapping
const amenityLabels = {
    'parking': { label: 'Parking', icon: 'fas fa-parking' },
    'security': { label: 'Security', icon: 'fas fa-shield-alt' },
    'loading-dock': { label: 'Loading Dock', icon: 'fas fa-truck' },
    'climate-control': { label: 'Climate Control', icon: 'fas fa-snowflake' },
    'wifi': { label: 'WiFi', icon: 'fas fa-wifi' },
    'kitchen': { label: 'Kitchen', icon: 'fas fa-utensils' },
    'bathroom': { label: 'Bathroom', icon: 'fas fa-restroom' },
    'elevator': { label: 'Elevator', icon: 'fas fa-arrow-up' }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    if (propertyData) {
        initializePropertyDetails();
        initializeEventListeners();
    }
});

// Initialize property details display
function initializePropertyDetails() {
    populateAmenities();
    updatePageTitle();
}

// Populate amenities section
function populateAmenities() {
    const amenitiesGrid = document.getElementById('amenitiesGrid');
    if (!amenitiesGrid || !propertyData.amenities) return;

    // Normalize amenities to array
    let amenities = [];
    if (Array.isArray(propertyData.amenities)) {
        amenities = propertyData.amenities;
    } else if (typeof propertyData.amenities === 'string') {
        try {
            const parsed = JSON.parse(propertyData.amenities);
            amenities = Array.isArray(parsed) ? parsed : propertyData.amenities.split(',').map(s => s.trim());
        } catch (e) {
            amenities = propertyData.amenities.split(',').map(s => s.trim());
        }
    }

    if (amenities.length === 0) {
        amenitiesGrid.innerHTML = '<p class="no-amenities">No amenities listed for this property.</p>';
        return;
    }

    const amenitiesHTML = amenities.map(amenity => {
        const amenityKey = amenity.toLowerCase().replace(/\s+/g, '-');
        const amenityInfo = amenityLabels[amenityKey] || { 
            label: amenity, 
            icon: 'fas fa-check' 
        };
        
        return `
            <div class="amenity-item">
                <i class="${amenityInfo.icon}"></i>
                <span>${amenityInfo.label}</span>
            </div>
        `;
    }).join('');

    amenitiesGrid.innerHTML = amenitiesHTML;
}

// Update page title
function updatePageTitle() {
    if (propertyData.title) {
        document.title = `${propertyData.title} | Hustlerati`;
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    // Favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', handleFavorite);
    }

    // Contact button
    const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', handleContact);
    }

    // Contact action buttons
    const contactActions = document.querySelectorAll('.contact-actions .btn');
    contactActions.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            handleContactAction(action);
        });
    });
}

// Handle share functionality
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: propertyData.title || 'Property Listing',
            text: `Check out this property: ${propertyData.title}`,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

// Fallback share method
function fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!', 'success');
    }).catch(() => {
        // Show a modal with the URL
        showShareModal();
    });
}

// Show share modal
function showShareModal() {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Share Property</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Copy this link to share:</p>
                <input type="text" value="${window.location.href}" readonly class="share-url">
                <button class="btn btn-primary copy-url">Copy Link</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Copy URL functionality
    modal.querySelector('.copy-url').addEventListener('click', () => {
        const urlInput = modal.querySelector('.share-url');
        urlInput.select();
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
        document.body.removeChild(modal);
    });
}

// Handle favorite functionality
function handleFavorite() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const isFavorited = favoriteBtn.classList.contains('favorited');
    
    if (isFavorited) {
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Save';
        removeFromFavorites();
        showNotification('Removed from saved properties', 'info');
    } else {
        favoriteBtn.classList.add('favorited');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Saved';
        addToFavorites();
        showNotification('Added to saved properties', 'success');
    }
}

// Add to favorites (localStorage)
function addToFavorites() {
    const favorites = getFavorites();
    const propertyId = getPropertyIdFromUrl();
    
    if (!favorites.includes(propertyId)) {
        favorites.push(propertyId);
        localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
    }
}

// Remove from favorites (localStorage)
function removeFromFavorites() {
    const favorites = getFavorites();
    const propertyId = getPropertyIdFromUrl();
    
    const updatedFavorites = favorites.filter(id => id !== propertyId);
    localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
}

// Get favorites from localStorage
function getFavorites() {
    const favorites = localStorage.getItem('favoriteProperties');
    return favorites ? JSON.parse(favorites) : [];
}

// Get property ID from URL
function getPropertyIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

// Handle contact functionality
function handleContact() {
    showContactModal();
}

// Handle contact action
function handleContactAction(action) {
    switch (action) {
        case 'Call':
            showNotification('Phone number not available', 'info');
            break;
        case 'Email':
            showContactModal();
            break;
        case 'Schedule Visit':
            showVisitModal();
            break;
        default:
            showContactModal();
    }
}

// Show contact modal
function showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Contact Property Owner</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="contact-form">
                    <div class="form-group">
                        <label for="contactName">Your Name</label>
                        <input type="text" id="contactName" required>
                    </div>
                    <div class="form-group">
                        <label for="contactEmail">Your Email</label>
                        <input type="email" id="contactEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="contactPhone">Your Phone (Optional)</label>
                        <input type="tel" id="contactPhone">
                    </div>
                    <div class="form-group">
                        <label for="contactMessage">Message</label>
                        <textarea id="contactMessage" rows="4" required placeholder="Tell the owner about your interest in this property..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline modal-close">Cancel</button>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Close modal
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Handle form submission
    modal.querySelector('.contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully!', 'success');
        document.body.removeChild(modal);
    });
}

// Show visit scheduling modal
function showVisitModal() {
    const modal = document.createElement('div');
    modal.className = 'visit-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Schedule Property Visit</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="visit-form">
                    <div class="form-group">
                        <label for="visitName">Your Name</label>
                        <input type="text" id="visitName" required>
                    </div>
                    <div class="form-group">
                        <label for="visitEmail">Your Email</label>
                        <input type="email" id="visitEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="visitPhone">Your Phone</label>
                        <input type="tel" id="visitPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="visitDate">Preferred Date</label>
                        <input type="date" id="visitDate" required>
                    </div>
                    <div class="form-group">
                        <label for="visitTime">Preferred Time</label>
                        <select id="visitTime" required>
                            <option value="">Select time</option>
                            <option value="morning">Morning (9 AM - 12 PM)</option>
                            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                            <option value="evening">Evening (5 PM - 8 PM)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="visitMessage">Additional Notes</label>
                        <textarea id="visitMessage" rows="3" placeholder="Any specific requirements or questions..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline modal-close">Cancel</button>
                        <button type="submit" class="btn btn-primary">Schedule Visit</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Set minimum date to today
    const dateInput = modal.querySelector('#visitDate');
    dateInput.min = new Date().toISOString().split('T')[0];

    // Close modal
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Handle form submission
    modal.querySelector('.visit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Visit request submitted successfully!', 'success');
        document.body.removeChild(modal);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        document.body.removeChild(notification);
    });
}

// Check if property is favorited on page load
document.addEventListener('DOMContentLoaded', function() {
    if (propertyData) {
        const favorites = getFavorites();
        const propertyId = getPropertyIdFromUrl();
        const favoriteBtn = document.getElementById('favoriteBtn');
        
        if (favorites.includes(propertyId) && favoriteBtn) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Saved';
        }
    }
});

// Add CSS for modals and notifications
const style = document.createElement('style');
style.textContent = `
    .share-modal, .contact-modal, .visit-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        color: var(--text-color);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .modal-header h3 {
        margin: 0;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }

    .modal-body {
        padding: 20px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
    }

    .form-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .share-url {
        margin: 10px 0;
        font-family: monospace;
        background: #f5f5f5;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        min-width: 300px;
        color: #666;
    }

    .notification-success {
        border-left: 4px solid #28a745;
        color: #666;
    }

    .notification-info {
        border-left: 4px solid #17a2b8;
        color: #666;
    }

    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        color: #666;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        margin-left: 10px;
        color: #666;
    }

    .favorited {
        background-color: #dc3545 !important;
        color: white !important;
    }

    .amenity-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        background-color: var(--card-bg);
        border: 2px solid var(--border-color);
        padding: 10px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .amenity-item i {
        font-size: 18px;
        color: #666;
    }

    .amenity-item span {
        font-size: 14px;
        color: #666;
    }

    .no-amenities {
        color: #666;
        font-style: italic;
        text-align: center;
        padding: 20px;
    }

    .amenity-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .amenity-item:hover i {
        color: var(--primary-color);
    }

    .amenity-item:hover span {
        color: var(--primary-color);
    }

    .property-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        width: 100%;
        max-width: 1200px;
    }

    .info-section {
        background-color: var(--card-bg);
        border: 2px solid var(--border-color);
        padding: 20px;
        border-radius: 5px;
        box-shadow: var(--shadow);
    }

    .info-section h2 {
        font-size: 24px;
        margin-bottom: 20px;
        color: var(--text-color);
    }
    
    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: var(--card-bg);
        border: 2px solid var(--border-color);
        padding: 10px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .detail-item i {
        font-size: 18px;
        color: #666;
    }

    .detail-item div {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .detail-item .detail-label {
        font-size: 14px;
        color: #666;
    }

    .detail-item .detail-value {
        font-size: 14px;
        color: #666;
    }

    .detail-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .detail-item:hover i {
        color: var(--primary-color);
    }

    .detail-item:hover .detail-label {
        color: var(--primary-color);
    }

    .detail-item:hover .detail-value {
        color: var(--primary-color);
    }

    .property-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .no-image {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background-color: var(--card-bg);
        border: 2px solid var(--border-color);
        padding: 10px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .no-image i {
        font-size: 18px;
        color: #666;
    }

    .no-image p {
        font-size: 14px;
        color: #666;
    }
    
    .no-image:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .no-image:hover i {
        color: var(--primary-color);
    }

    .no-image:hover p {
        color: var(--primary-color);
    }

    .contact-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
    
    .contact-actions .btn {
        width: 100%;
    }
    
    @media (max-width: 768px) {
        .property-info-grid {
            grid-template-columns: 1fr;
        }
        .details-grid {
            grid-template-columns: 1fr;
        }
        .contact-actions {
            flex-direction: column;
        }
        .contact-actions .btn {
            width: 100%;
        }
        .contact-actions .btn {
            width: 100%;
        }
        .contact-actions .btn {
            width: 100%;
        }
        .contact-actions .btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);