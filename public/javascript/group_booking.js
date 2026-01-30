document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('group-booking-form');
    const contributionInput = document.getElementById('contribution');
    const currencySelect = document.getElementById('currency');
    const errorMessage = document.getElementById('contribution-error');
    const convertedAmountDiv = document.getElementById('converted-amount');
    const usdAmountSpan = document.getElementById('usd-amount');
    const minContribution = 20; // Minimum for group booking in USD

    let exchangeRates = {};

    // Fetch exchange rates from the API
    async function fetchExchangeRates() {
        try {
            const response = await fetch('/api/exchange-rates');
            const data = await response.json();
            if (data.success) {
                exchangeRates = data.rates;
            } else {
                console.error('Failed to fetch exchange rates');
            }
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    }

    // Convert amount to USD
    function convertToUSD(amount, currency) {
        if (currency === 'USD') {
            return amount;
        }
        if (exchangeRates[currency]) {
            return amount / exchangeRates[currency];
        }
        return 0;
    }

    // Update converted amount display
    function updateConvertedAmount() {
        const amount = parseFloat(contributionInput.value) || 0;
        const currency = currencySelect.value;
        const usdAmount = convertToUSD(amount, currency);
        usdAmountSpan.textContent = usdAmount.toFixed(2);
        convertedAmountDiv.style.display = amount > 0 ? 'block' : 'none';
        return usdAmount;
    }

    // Validate contribution
    function validateContribution() {
        const usdAmount = updateConvertedAmount();
        if (usdAmount < minContribution) {
            errorMessage.style.display = 'block';
            return false;
        } else {
            errorMessage.style.display = 'none';
            return true;
        }
    }

    // Initialize
    fetchExchangeRates().then(() => {
        updateConvertedAmount();
    });

    form.addEventListener('submit', function(event) {
        if (!validateContribution()) {
            event.preventDefault();
            contributionInput.focus();
            return;
        }
        // Concatenate amount and currency
        const amount = parseFloat(contributionInput.value) || 0;
        const currency = currencySelect.value;
        const concatenatedPrice = `${amount} ${currency}`;
        contributionInput.value = concatenatedPrice; // Set the concatenated value to the input
    });

    contributionInput.addEventListener('input', function() {
        validateContribution();
    });

    currencySelect.addEventListener('change', function() {
        validateContribution();
    });

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

    // Form submission with payment validation
    form.addEventListener('submit', function(event) {
        if (!validateContribution()) {
            event.preventDefault();
            contributionInput.focus();
            return;
        }

        const paymentMethodValue = paymentMethod.value;
        if (!paymentMethodValue) {
            event.preventDefault();
            showNotification('Please select a payment method', 'error');
            return;
        }

        // Validate payment-specific fields
        let paymentValid = true;
        let paymentError = '';

        switch (paymentMethodValue) {
            case 'card':
                const cardNumber = document.getElementById('cardNumber').value;
                const expiryDate = document.getElementById('expiryDate').value;
                const cvv = document.getElementById('cvv').value;
                const cardName = document.getElementById('cardName').value;

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
                const paypalEmail = document.getElementById('paypalEmail').value;
                if (!paypalEmail || !/\S+@\S+\.\S+/.test(paypalEmail)) {
                    paymentError = 'Please enter a valid PayPal email';
                    paymentValid = false;
                }
                break;

            case 'bitcoin':
                const bitcoinAddress = document.getElementById('bitcoinAddress').value;
                if (!bitcoinAddress || bitcoinAddress.trim() === '') {
                    paymentError = 'Please enter your Bitcoin wallet address';
                    paymentValid = false;
                }
                break;

            case 'mpesa':
                const mpesaPhone = document.getElementById('mpesaPhone').value;
                if (!mpesaPhone || !/^\+?[\d\s\-\(\)]{10,15}$/.test(mpesaPhone)) {
                    paymentError = 'Please enter a valid M-Pesa phone number';
                    paymentValid = false;
                }
                break;
        }

        if (!paymentValid) {
            event.preventDefault();
            showNotification(paymentError, 'error');
            return;
        }

        // For M-Pesa, handle payment initiation
        if (paymentMethodValue === 'mpesa') {
            event.preventDefault(); // Prevent default form submission
            initiateMpesaPayment();
        }
    });

    // Function to initiate M-Pesa payment
    async function initiateMpesaPayment() {
        const mpesaPhone = document.getElementById('mpesaPhone').value;
        const amount = parseFloat(contributionInput.value) || 0;
        const currency = currencySelect.value;

        // Convert amount to USD for M-Pesa (assuming M-Pesa is in KES)
        let paymentAmount = amount;
        if (currency !== 'USD') {
            if (exchangeRates[currency]) {
                paymentAmount = amount / exchangeRates[currency];
            }
        }

        // Format phone number
        let formattedPhone = mpesaPhone.replace(/[\s\-\(\)\+]/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone;
        }

        const mpesaPayload = {
            phoneNumber: formattedPhone,
            amount: Math.ceil(paymentAmount), // Round up to nearest integer
            accountReference: `GroupBooking-${Date.now()}`,
            transactionDesc: `Group booking contribution: ${amount} ${currency}`
        };

        try {
            showNotification('Initiating M-Pesa payment...', 'info');

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

            showNotification('M-Pesa payment initiated. Please check your phone and authorize the payment.', 'info');

            // Poll for payment completion
            const pollForPayment = async () => {
                try {
                    const statusResponse = await fetch('/payment_gateway/payment-status');
                    const statusData = await statusResponse.json();

                    if (statusData.completed) {
                        // Payment completed, submit the form
                        showNotification('Payment successful! Submitting booking...', 'success');
                        form.submit();
                    } else if (statusData.failed) {
                        showNotification('Payment failed. Please try again.', 'error');
                    } else {
                        // Continue polling
                        setTimeout(pollForPayment, 3000);
                    }
                } catch (error) {
                    showNotification('Error checking payment status: ' + error.message, 'error');
                }
            };

            // Start polling after a short delay
            setTimeout(pollForPayment, 5000);
        } catch (error) {
            showNotification('Error initiating M-Pesa payment: ' + error.message, 'error');
        }
    }

    // Show notification function
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

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);

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
});
