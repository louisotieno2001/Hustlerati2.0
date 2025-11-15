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
});
