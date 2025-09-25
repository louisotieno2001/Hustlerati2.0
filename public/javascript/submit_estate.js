// Submit Estate Form JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('submitEstateForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');

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

        form.insertBefore(errorDiv, form.firstChild);

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

        form.insertBefore(successDiv, form.firstChild);

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
            const userData = {
                propertyTitle: document.getElementById('propertyTitle').value,
                propertyType: document.getElementById('propertyType').value,
                propertySize: document.getElementById('propertySize').value,
                monthlyPrice: document.getElementById('monthlyPrice').value,
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