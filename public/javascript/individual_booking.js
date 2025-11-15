document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('individual-booking-form');
    const contributionInput = document.getElementById('contribution');
    const currencySelect = document.getElementById('currency');
    const errorMessage = document.getElementById('contribution-error');
    const convertedAmountDiv = document.getElementById('converted-amount');
    const equivalentAmountSpan = document.getElementById('equivalent-amount');
    const propertyCurrency = document.querySelector('input[name="propertyCurrency"]').value;
    const minContribution = parseFloat(document.querySelector('input[name="propertyPrice"]').value);

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

    // Convert amount to property currency
    function convertToPropertyCurrency(amount, currency) {
        if (currency === propertyCurrency) {
            return amount;
        }
        // First convert to USD
        let usdAmount;
        if (currency === 'USD') {
            usdAmount = amount;
        } else if (exchangeRates[currency]) {
            usdAmount = amount / exchangeRates[currency];
        } else {
            return 0;
        }
        // Then convert from USD to property currency
        if (propertyCurrency === 'USD') {
            return usdAmount;
        } else if (exchangeRates[propertyCurrency]) {
            return usdAmount * exchangeRates[propertyCurrency];
        }
        return 0;
    }

    // Update converted amount display
    function updateConvertedAmount() {
        const amount = parseFloat(contributionInput.value) || 0;
        const currency = currencySelect.value;
        const equivalentAmount = convertToPropertyCurrency(amount, currency);
        equivalentAmountSpan.textContent = equivalentAmount.toFixed(2);
        convertedAmountDiv.style.display = amount > 0 ? 'block' : 'none';
        return equivalentAmount;
    }

    // Validate contribution
    function validateContribution() {
        const equivalentAmount = updateConvertedAmount();
        if (equivalentAmount < minContribution) {
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
});
