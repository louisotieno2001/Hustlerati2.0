document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    const cartCountEl = document.getElementById('cartCount');

    function updateCartCount() {
        cartCountEl.textContent = cartCount;
        localStorage.setItem('cartCount', cartCount);
    }

    // Initialize cart count display
    updateCartCount();

    // Add to cart (placeholder)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.dataset.id;

            if (!productId) {
                showNotification("Something went wrong, please try again", 'error');
                return;
            }

            try {
                const response = await fetch('/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    cartCount++;
                    updateCartCount();
                    showNotification(`Added product ${productId} to cart!`, 'success');
                } else {
                    showNotification(`Failed to add: ${data.error || 'Unknown error'}`, 'error');
                }
            } catch (error) {
                showNotification('Error adding product to cart: ' + error.message, 'error');
            }
        });
    });
});

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

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        min-width: 300px;
        color: #333;
    }

    .notification-success {
        border-left: 4px solid #28a745;
    }

    .notification-error {
        border-left: 4px solid #dc3545;
    }

    .notification-info {
        border-left: 4px solid #17a2b8;
    }

    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);

// Cart management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const action = this.dataset.action;
            const orderId = this.dataset.orderId;
            const input = document.querySelector(`.quantity-input[data-order-id="${orderId}"]`);
            let quantity = parseInt(input.value);

            if (action === 'increase') {
                quantity++;
            } else if (action === 'decrease' && quantity > 1) {
                quantity--;
            }

            input.value = quantity;

            // Update order quantity
            try {
                const response = await fetch(`/orders/${orderId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity })
                });

                if (response.ok) {
                    updateCartTotals(orderId, quantity);
                } else {
                    showNotification('Failed to update quantity', 'error');
                }
            } catch (error) {
                showNotification('Error updating quantity', 'error');
            }
        });
    });

    // Quantity input change
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', async function() {
            const orderId = this.dataset.orderId;
            const quantity = parseInt(this.value);

            if (quantity < 1) {
                this.value = 1;
                return;
            }

            try {
                const response = await fetch(`/orders/${orderId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity })
                });

                if (response.ok) {
                    updateCartTotals(orderId, quantity);
                } else {
                    showNotification('Failed to update quantity', 'error');
                }
            } catch (error) {
                showNotification('Error updating quantity', 'error');
            }
        });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', async function() {
            const orderId = this.dataset.id;

            if (confirm('Are you sure you want to remove this item?')) {
                try {
                    const response = await fetch(`/orders/${orderId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        // Remove the item from DOM
                        const cartItem = document.querySelector(`.cart-item[data-order-id="${orderId}"]`);
                        if (cartItem) {
                            cartItem.remove();
                        }
                        // Update totals
                        updateOverallTotals();
                        showNotification('Item removed from cart', 'success');
                    } else {
                        showNotification('Failed to remove item', 'error');
                    }
                } catch (error) {
                    showNotification('Error removing item', 'error');
                }
            }
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutSection = document.getElementById('checkoutSection');
    const backToCart = document.getElementById('backToCart');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            checkoutSection.style.display = 'block';
            checkoutBtn.style.display = 'none';
        });
    }

    if (backToCart) {
        backToCart.addEventListener('click', function() {
            checkoutSection.style.display = 'none';
            checkoutBtn.style.display = 'block';
        });
    }

    // Handle delivery location change to show map link
    const deliveryLocation = document.getElementById('deliveryLocation');
    const mapLinkContainer = document.getElementById('mapLinkContainer');
    const viewInMapLink = document.getElementById('viewInMapLink');

    if (deliveryLocation) {
        deliveryLocation.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const mapLocation = selectedOption.getAttribute('data-map-location');

            if (mapLocation && mapLocation.trim() !== '') {
                // Parse coordinates (assuming format like "lat,lng" or "lat, lng")
                const coords = mapLocation.split(',').map(coord => coord.trim());
                if (coords.length === 2) {
                    const [lat, lng] = coords;
                    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                    viewInMapLink.href = googleMapsUrl;
                    mapLinkContainer.style.display = 'block';
                } else {
                    mapLinkContainer.style.display = 'none';
                }
            } else {
                mapLinkContainer.style.display = 'none';
            }
        });
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        // Payment method change handler
        const paymentMethod = document.getElementById('paymentMethod');
        const cardFields = document.getElementById('cardFields');
        const paypalFields = document.getElementById('paypalFields');
        const bitcoinFields = document.getElementById('bitcoinFields');
        const mpesaFields = document.getElementById('mpesaFields');

        if (paymentMethod) {
            paymentMethod.addEventListener('change', function() {
                // Hide all fields first
                if (cardFields) cardFields.style.display = 'none';
                if (paypalFields) paypalFields.style.display = 'none';
                if (bitcoinFields) bitcoinFields.style.display = 'none';
                if (mpesaFields) mpesaFields.style.display = 'none';

                // Show relevant fields
                const selectedMethod = this.value;
                switch (selectedMethod) {
                    case 'card':
                        if (cardFields) cardFields.style.display = 'block';
                        break;
                    case 'paypal':
                        if (paypalFields) paypalFields.style.display = 'block';
                        break;
                    case 'bitcoin':
                        if (bitcoinFields) bitcoinFields.style.display = 'block';
                        break;
                    case 'mpesa':
                        if (mpesaFields) mpesaFields.style.display = 'block';
                        break;
                }
            });
        }

        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const deliveryLocation = formData.get('deliveryLocation');
            const paymentMethod = formData.get('paymentMethod');
            const deliveryAddress = formData.get('deliveryAddress');

            if (!deliveryLocation || !paymentMethod || !deliveryAddress) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Validate payment-specific fields
            let paymentValid = true;
            let paymentError = '';

            switch (paymentMethod) {
                case 'card':
                    const cardNumber = formData.get('cardNumber');
                    const expiryDate = formData.get('expiryDate');
                    const cvv = formData.get('cvv');
                    const cardName = formData.get('cardName');

                    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
                        paymentError = 'Please enter a valid card number';
                        paymentValid = false;
                    } else if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
                        paymentError = 'Please enter a valid expiry date (MM/YY)';
                        paymentValid = false;
                    } else if (!cvv || cvv.length < 3) {
                        paymentError = 'Please enter a valid CVV';
                        paymentValid = false;
                    } else if (!cardName || cardName.trim() === '') {
                        paymentError = 'Please enter the name on card';
                        paymentValid = false;
                    }
                    break;

                case 'paypal':
                    const paypalEmail = formData.get('paypalEmail');
                    if (!paypalEmail || !/\S+@\S+\.\S+/.test(paypalEmail)) {
                        paymentError = 'Please enter a valid PayPal email';
                        paymentValid = false;
                    }
                    break;

                case 'bitcoin':
                    const bitcoinAddress = formData.get('bitcoinAddress');
                    if (!bitcoinAddress || bitcoinAddress.trim() === '') {
                        paymentError = 'Please enter your Bitcoin wallet address';
                        paymentValid = false;
                    }
                    break;

                case 'mpesa':
                    const mpesaPhone = formData.get('mpesaPhone');
                    if (!mpesaPhone || !/^\+?[\d\s\-\(\)]{10,15}$/.test(mpesaPhone)) {
                        paymentError = 'Please enter a valid M-Pesa phone number';
                        paymentValid = false;
                    }
                    break;
            }

            if (!paymentValid) {
                showNotification(paymentError, 'error');
                return;
            }

            // Collect order IDs from cart items
            const orderIds = Array.from(document.querySelectorAll('.cart-item[data-order-id]')).map(item => item.dataset.orderId);

            if (orderIds.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }

            // Get total from DOM
            const totalElement = document.querySelector('.summary-row.total span');
            const totalText = totalElement ? totalElement.textContent.replace('Total: ', '') : '0';
            const total = parseFloat(totalText) || 0;

            // Get map location from selected delivery location
            const deliveryLocationSelect = document.getElementById('deliveryLocation');
            const selectedOption = deliveryLocationSelect.options[deliveryLocationSelect.selectedIndex];
            const mapLocation = selectedOption.getAttribute('data-map-location') || '';

            // Prepare payload
            const payload = {
                orderIds,
                total,
                paymentMethod,
                deliveryLocation,
                mapLocation,
                deliveryAddress
            };

            try {
                if (paymentMethod === 'mpesa') {
                    // Initiate M-Pesa payment first
                    const mpesaPhone = formData.get('mpesaPhone');
                    // Format phone number - ensure it starts with 254 and remove any special characters
                    let formattedPhone = mpesaPhone.replace(/[\s\-\(\)\+]/g, '');
                    if (formattedPhone.startsWith('0')) {
                        formattedPhone = '254' + formattedPhone.substring(1);
                    } else if (!formattedPhone.startsWith('254')) {
                        formattedPhone = '254' + formattedPhone;
                    }
                    
                    // Convert amount to integer (M-Pesa requires amount in cents/smallest currency unit)
                    const amountInCents = Math.round(total * 100);
                    
                    const mpesaPayload = {
                        phoneNumber: formattedPhone,
                        amount: amountInCents,
                        accountReference: `Order-${Date.now()}`, // Generate unique reference
                        transactionDesc: `Payment for order totaling ${total}`
                    };

                    console.log('Initiating M-Pesa payment with payload:', mpesaPayload);

                    const mpesaResponse = await fetch('/payment_gateway/initiate-mpesa', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(mpesaPayload)
                    });

                    const mpesaData = await mpesaResponse.json();

                    if (!mpesaResponse.ok) {
                        showNotification(`Failed to initiate M-Pesa payment: ${mpesaData.error || 'Unknown error'}`, 'error');
                        return;
                    }

                    // Show waiting message for M-Pesa payment
                    showNotification('M-Pesa payment initiated. Please check your phone and authorize the payment.', 'info');

                    // Poll for payment completion (in production, use websockets or server-sent events)
                    const pollForPayment = async () => {
                        try {
                            const statusResponse = await fetch('/payment_gateway/payment-status');
                            const statusData = await statusResponse.json();

                            if (statusData.completed) {
                                // Payment completed, proceed with order placement
                                const orderResponse = await fetch('/cart/checkout', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(payload)
                                });

                                const orderData = await orderResponse.json();

                                if (orderResponse.ok) {
                                    showNotification('Order placed successfully!', 'success');
                                    setTimeout(() => {
                                        window.location.href = '/shop';
                                    }, 2000);
                                } else {
                                    showNotification(`Failed to place order: ${orderData.error || 'Unknown error'}`, 'error');
                                }
                            } else if (statusData.failed) {
                                showNotification('Payment failed. Please try again.', 'error');
                            } else {
                                // Continue polling
                                setTimeout(pollForPayment, 3000); // Poll every 3 seconds
                            }
                        } catch (error) {
                            showNotification('Error checking payment status: ' + error.message, 'error');
                        }
                    };

                    // Start polling after a short delay
                    setTimeout(pollForPayment, 5000);
                } else {
                    // For other payment methods, proceed directly to checkout
                    const response = await fetch('/cart/checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showNotification('Order placed successfully!', 'success');
                        setTimeout(() => {
                            window.location.href = '/shop'; // Redirect to shop
                        }, 2000);
                    } else {
                        showNotification(`Failed to place order: ${data.error || 'Unknown error'}`, 'error');
                    }
                }
            } catch (error) {
                showNotification('Error placing order: ' + error.message, 'error');
            }
        });
    }
});

// Function to update cart totals dynamically
function updateCartTotals(orderId, newQuantity) {
    const cartItem = document.querySelector(`.cart-item[data-order-id="${orderId}"]`);
    if (!cartItem) return;

    const priceElement = cartItem.querySelector('.item-price');
    const subtotalElement = cartItem.querySelector('.item-subtotal');

    if (!priceElement || !subtotalElement) return;

    // Extract price from the price element (remove $ sign)
    const priceText = priceElement.textContent.replace('$', '');
    const price = parseFloat(priceText);

    if (isNaN(price)) return;

    // Calculate new subtotal
    const newSubtotal = price * newQuantity;
    subtotalElement.textContent = `Subtotal: ${newSubtotal.toFixed(2)}`;

    // Update total items and total price
    updateOverallTotals();
}

function updateOverallTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        const quantityInput = item.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput ? quantityInput.value : 1) || 1;
        totalItems += quantity;

        const subtotalElement = item.querySelector('.item-subtotal');
        if (subtotalElement) {
            const subtotalText = subtotalElement.textContent.replace('Subtotal: $', '');
            const subtotal = parseFloat(subtotalText);
            if (!isNaN(subtotal)) {
                totalPrice += subtotal;
            }
        }
    });

    // Update total items display
    const totalItemsElement = document.querySelector('.summary-row span');
    if (totalItemsElement) {
        totalItemsElement.textContent = `Total Items: ${totalItems}`;
    }

    // Update total price display
    const totalPriceElement = document.querySelector('.summary-row.total span');
    if (totalPriceElement) {
        totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)}`;
    }

    // Check if cart is empty and show empty cart message
    const cartContent = document.querySelector('.cart-content');
    const emptyCart = document.querySelector('.empty-cart');
    if (cartItems.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
    } else {
        if (cartContent) cartContent.style.display = 'grid';
        if (emptyCart) emptyCart.style.display = 'none';
    }
}
