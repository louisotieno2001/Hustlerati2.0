// Submit Estate Form JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('submitEstateForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');

    // Currency data with flags
    const currencies = [
        { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
        { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
        { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
        { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
        { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
        { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
        { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
        { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
        { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
        { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
        { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
        { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
        { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
        { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
        { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
        { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
        { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
        { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
        { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
        { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
        { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
        { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
        { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
        { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
        { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭' },
        { code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬' },
        { code: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿' },
        { code: 'RWF', name: 'Rwandan Franc', flag: '🇷🇼' },
        { code: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹' },
        { code: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦' },
        { code: 'DZD', name: 'Algerian Dinar', flag: '🇩🇿' },
        { code: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳' },
        { code: 'LYD', name: 'Libyan Dinar', flag: '🇱🇾' },
        { code: 'SDG', name: 'Sudanese Pound', flag: '🇸🇩' },
        { code: 'SSP', name: 'South Sudanese Pound', flag: '🇸🇸' },
        { code: 'SYP', name: 'Syrian Pound', flag: '🇸🇾' },
        { code: 'YER', name: 'Yemeni Rial', flag: '🇾🇪' },
        { code: 'IQD', name: 'Iraqi Dinar', flag: '🇮🇶' },
        { code: 'JOD', name: 'Jordanian Dinar', flag: '🇯🇴' },
        { code: 'LBP', name: 'Lebanese Pound', flag: '🇱🇧' },
        { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱' },
        { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭' },
        { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
        { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲' },
        { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
        { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩' },
        { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
        { code: 'NPR', name: 'Nepalese Rupee', flag: '🇳🇵' },
        { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
        { code: 'AFN', name: 'Afghan Afghani', flag: '🇦🇫' },
        { code: 'TJS', name: 'Tajikistani Somoni', flag: '🇹🇯' },
        { code: 'TMT', name: 'Turkmenistani Manat', flag: '🇹🇲' },
        { code: 'UZS', name: 'Uzbekistani Som', flag: '🇺🇿' },
        { code: 'KZT', name: 'Kazakhstani Tenge', flag: '🇰🇿' },
        { code: 'KGS', name: 'Kyrgyzstani Som', flag: '🇰🇬' },
        { code: 'MNT', name: 'Mongolian Tugrik', flag: '🇲🇳' },
        { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
        { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
        { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
        { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
        { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
        { code: 'BND', name: 'Brunei Dollar', flag: '🇧🇳' },
        { code: 'KHR', name: 'Cambodian Riel', flag: '🇰🇭' },
        { code: 'LAK', name: 'Laotian Kip', flag: '🇱🇦' },
        { code: 'MMK', name: 'Myanmar Kyat', flag: '🇲🇲' },
        { code: 'KPW', name: 'North Korean Won', flag: '🇰🇵' },
        { code: 'TWD', name: 'New Taiwan Dollar', flag: '🇹🇼' },
        { code: 'MOP', name: 'Macanese Pataca', flag: '🇲🇴' },
        { code: 'FJD', name: 'Fijian Dollar', flag: '🇫🇯' },
        { code: 'PGK', name: 'Papua New Guinean Kina', flag: '🇵🇬' },
        { code: 'SBD', name: 'Solomon Islands Dollar', flag: '🇸🇧' },
        { code: 'TOP', name: 'Tongan Paʻanga', flag: '🇹🇴' },
        { code: 'VUV', name: 'Vanuatu Vatu', flag: '🇻🇺' },
        { code: 'WST', name: 'Samoan Tala', flag: '🇼🇸' },
        { code: 'XPF', name: 'CFP Franc', flag: '🇵🇫' },
        { code: 'ANG', name: 'Netherlands Antillean Guilder', flag: '🇳🇱' },
        { code: 'AWG', name: 'Aruban Florin', flag: '🇦🇼' },
        { code: 'BBD', name: 'Barbadian Dollar', flag: '🇧🇧' },
        { code: 'BMD', name: 'Bermudian Dollar', flag: '🇧🇲' },
        { code: 'BSD', name: 'Bahamian Dollar', flag: '🇧🇸' },
        { code: 'BZD', name: 'Belize Dollar', flag: '🇧🇿' },
        { code: 'CUC', name: 'Cuban Convertible Peso', flag: '🇨🇺' },
        { code: 'CUP', name: 'Cuban Peso', flag: '🇨🇺' },
        { code: 'DOP', name: 'Dominican Peso', flag: '🇩🇴' },
        { code: 'GMD', name: 'Gambian Dalasi', flag: '🇬🇲' },
        { code: 'GYD', name: 'Guyanese Dollar', flag: '🇬🇾' },
        { code: 'HTG', name: 'Haitian Gourde', flag: '🇭🇹' },
        { code: 'JMD', name: 'Jamaican Dollar', flag: '🇯🇲' },
        { code: 'LRD', name: 'Liberian Dollar', flag: '🇱🇷' },
        { code: 'LSL', name: 'Lesotho Loti', flag: '🇱🇸' },
        { code: 'MZN', name: 'Mozambican Metical', flag: '🇲🇿' },
        { code: 'NAD', name: 'Namibian Dollar', flag: '🇳🇦' },
        { code: 'SRD', name: 'Surinamese Dollar', flag: '🇸🇷' },
        { code: 'SZL', name: 'Swazi Lilangeni', flag: '🇸🇿' },
        { code: 'TTD', name: 'Trinidad and Tobago Dollar', flag: '🇹🇹' },
        { code: 'UYU', name: 'Uruguayan Peso', flag: '🇺🇾' },
        { code: 'VES', name: 'Venezuelan Bolívar', flag: '🇻🇪' },
        { code: 'XCD', name: 'East Caribbean Dollar', flag: '🇦🇬' },
        { code: 'XOF', name: 'West African CFA Franc', flag: '🇧🇯' },
        { code: 'XAF', name: 'Central African CFA Franc', flag: '🇨🇲' },
        { code: 'XDR', name: 'Special Drawing Rights', flag: '🌍' },
        { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲' },
        { code: 'ZWL', name: 'Zimbabwean Dollar', flag: '🇿🇼' },
        { code: 'BTN', name: 'Bhutanese Ngultrum', flag: '🇧🇹' },
        { code: 'MVR', name: 'Maldivian Rufiyaa', flag: '🇲🇻' },
        { code: 'MRO', name: 'Mauritanian Ouguiya', flag: '🇲🇷' },
        { code: 'STN', name: 'São Tomé and Príncipe Dobra', flag: '🇸🇹' },
        { code: 'SCR', name: 'Seychellois Rupee', flag: '🇸🇨' },
        { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼' },
        { code: 'BWP', name: 'Botswana Pula', flag: '🇧🇼' },
        { code: 'BIF', name: 'Burundian Franc', flag: '🇧🇮' },
        { code: 'CDF', name: 'Congolese Franc', flag: '🇨🇩' },
        { code: 'DJF', name: 'Djiboutian Franc', flag: '🇩🇯' },
        { code: 'ERN', name: 'Eritrean Nakfa', flag: '🇪🇷' },
        { code: 'FKP', name: 'Falkland Islands Pound', flag: '🇫🇰' },
        { code: 'GIP', name: 'Gibraltar Pound', flag: '🇬🇮' },
        { code: 'GNF', name: 'Guinean Franc', flag: '🇬🇳' },
        { code: 'ISK', name: 'Icelandic Króna', flag: '🇮🇸' },
        { code: 'SHP', name: 'Saint Helena Pound', flag: '🇸🇭' },
        { code: 'SLL', name: 'Sierra Leonean Leone', flag: '🇸🇱' },
        { code: 'SOS', name: 'Somali Shilling', flag: '🇸🇴' },
        { code: 'STD', name: 'São Tomé and Príncipe Dobra (old)', flag: '🇸🇹' },
        { code: 'SVC', name: 'Salvadoran Colón', flag: '🇸🇻' },
        { code: 'WST', name: 'Samoan Tala', flag: '🇼🇸' },
        { code: 'XAF', name: 'Central African CFA Franc', flag: '🇨🇲' },
        { code: 'XCD', name: 'East Caribbean Dollar', flag: '🇦🇬' },
        { code: 'XOF', name: 'West African CFA Franc', flag: '🇧🇯' },
        { code: 'XPF', name: 'CFP Franc', flag: '🇵🇫' },
        { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲' },
        { code: 'ZWL', name: 'Zimbabwean Dollar', flag: '🇿🇼' }
    ];

    // Populate currency datalist
    function populateCurrencies() {
        const datalist = document.getElementById('currencies');
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = `${currency.flag} ${currency.code} - ${currency.name}`;
            option.setAttribute('data-code', currency.code);
            datalist.appendChild(option);
        });
    }

    // Initialize currency population
    populateCurrencies();

    // Form Validation
    function validateForm() {
        const errors = [];

        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                errors.push(`${field.previousElementSibling.textContent.replace(' *', '')} is required`);
                field.style.borderColor = '#e74c3c';
            } else {
                field.style.borderColor = '';
            }
        });

        // Check email format
        const emailField = document.getElementById('contactEmail');
        if (emailField.value && !isValidEmail(emailField.value)) {
            errors.push('Please enter a valid email address');
            emailField.style.borderColor = '#e74c3c';
        }

        // Check phone format
        const phoneField = document.getElementById('contactPhone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            errors.push('Please enter a valid phone number');
            phoneField.style.borderColor = '#e74c3c';
        }

        return errors;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Show Error Message
    function showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        errorDiv.style.cssText = `
            background-color: #fff6f6;
            border: 1px solid #e74c3c;
            color: #e74c3c;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
        `;

        // form.insertAfter(errorDiv, form.lastChild);
        // Append the error message at the end of the form
        form.appendChild(errorDiv);

        // Auto-remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Show Success Message
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        successDiv.style.cssText = `
            background-color: #f0fff4;
            border: 1px solid #48bb78;
            color: #48bb78;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
        `;

        // form.insertAfter(successDiv, form.lastChild);
        // Append the success message at the end of the form
        form.appendChild(successDiv);

        // Auto-remove success after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }



    // Form Submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (errors.length > 0) {
            showError(errors.join('<br>'));
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            // Create FormData object
            // Extract currency code from the selected value
            const currencyInput = document.getElementById('currency').value;
            let currencyCode = '';
            if (currencyInput) {
                const selectedCurrency = currencies.find(c => `${c.flag} ${c.code} - ${c.name}` === currencyInput);
                currencyCode = selectedCurrency ? selectedCurrency.code : currencyInput.split(' ')[1]; // Fallback
            }

            const userData = {
                propertyTitle: document.getElementById('propertyTitle').value,
                propertyType: document.getElementById('propertyType').value,
                propertySize: document.getElementById('propertySize').value,
                monthlyPrice: document.getElementById('monthlyPrice').value,
                currency: currencyCode,
                propertyDescription: document.getElementById('propertyDescription').value,
                propertyCity: document.getElementById('propertyCity').value,
                propertyAddress: document.getElementById('propertyAddress').value,
                propertyZipCode: document.getElementById('propertyZipCode').value,
                propertyNeighborhood: document.getElementById('propertyNeighborhood').value,
                spaceType: document.getElementById('spaceType').value,
                leaseTerms: document.getElementById('leaseTerms').value,
                availability: document.getElementById('availability').value,
                businessSize: document.getElementById('businessSize').value,
                badge: document.getElementById('badge').value,
                contactName: document.getElementById('contactName').value,
                contactPhone: document.getElementById('contactPhone').value,
                contactEmail: document.getElementById('contactEmail').value,
                agreeTerms: document.querySelector('input[name="agreeTerms"]').checked,
                amenities: Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value)
            };

            const response = await fetch('/submit-estate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });


            const result = await response.json();

            if (response.ok) {
                showSuccess('Property listed successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/real_estate';
                }, 2000);
            } else {
                showError(result.message || 'Failed to submit property listing');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showError('Network error. Please try again.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Save Draft
    saveDraftBtn.addEventListener('click', function () {
        const formData = new FormData(form);
        formData.append('isDraft', 'true');

        // Save to localStorage as fallback
        const draftData = {
            formData: Object.fromEntries(formData),
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('estateDraft', JSON.stringify(draftData));
        showSuccess('Draft saved successfully!');
    });

    // Load Draft (if exists)
    function loadDraft() {
        const draftData = localStorage.getItem('estateDraft');
        if (draftData) {
            try {
                const draft = JSON.parse(draftData);
                const isOld = new Date(draft.timestamp) < new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

                if (isOld) {
                    localStorage.removeItem('estateDraft');
                    return;
                }

                // Populate form fields
                Object.keys(draft.formData).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field && draft.formData[key]) {
                        if (field.type === 'checkbox') {
                            field.checked = true;
                        } else {
                            field.value = draft.formData[key];
                        }
                    }
                });

                showSuccess('Draft loaded successfully!');
            } catch (error) {
                console.error('Error loading draft:', error);
                localStorage.removeItem('estateDraft');
            }
        }
    }

    loadDraft();
});