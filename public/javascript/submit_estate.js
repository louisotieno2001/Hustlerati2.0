// Submit Estate Form JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('submitEstateForm');
    const uploadZone = document.getElementById('uploadZone');
    const imagePreview = document.getElementById('imagePreview');
    const saveDraftBtn = document.getElementById('saveDraftBtn');

    let uploadedImages = [];
    const maxImages = 5;
    const minImages = 1;

    // Image Upload Handling
    function handleImageUpload(files) {
        const validFiles = Array.from(files).filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

            if (!isValidType) {
                showError('Please select only image files (JPEG, PNG, GIF, etc.)');
                return false;
            }

            if (!isValidSize) {
                showError('Image size must be less than 5MB');
                return false;
            }

            return true;
        });

        if (uploadedImages.length + validFiles.length > maxImages) {
            showError(`You can only upload a maximum of ${maxImages} images`);
            return;
        }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    src: e.target.result,
                    name: file.name,
                    base64: e.target.result // Store base64 for submission
                };

                uploadedImages.push(imageData);
                displayImagePreview(imageData);
                updateUploadZone();
            };
            reader.readAsDataURL(file);
        });
    }

    // Display Image Preview
    function displayImagePreview(imageData) {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.dataset.imageId = imageData.id;

        previewItem.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.name}">
            <button type="button" class="remove-image" onclick="removeImage('${imageData.id}')">
                <i class="fas fa-times"></i>
            </button>
            <div class="image-overlay">
                <button type="button" class="edit-image" onclick="editImage('${imageData.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;

        imagePreview.appendChild(previewItem);
    }

    // Remove Image
    window.removeImage = function (imageId) {
        uploadedImages = uploadedImages.filter(img => img.id !== imageId);
        const previewItem = document.querySelector(`[data-image-id="${imageId}"]`);
        if (previewItem) {
            previewItem.remove();
        }
        updateUploadZone();
    };

    // Edit Image (Replace)
    window.editImage = function (imageId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageIndex = uploadedImages.findIndex(img => img.id === imageId);
                    if (imageIndex !== -1) {
                        uploadedImages[imageIndex] = {
                            id: imageId,
                            file: file,
                            src: e.target.result,
                            name: file.name,
                            base64: e.target.result // Store base64 for submission
                        };

                        const previewItem = document.querySelector(`[data-image-id="${imageId}"]`);
                        if (previewItem) {
                            const img = previewItem.querySelector('img');
                            img.src = e.target.result;
                            img.alt = file.name;
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // Update Upload Zone
    function updateUploadZone() {
        const remainingSlots = maxImages - uploadedImages.length;

        if (remainingSlots === 0) {
            uploadZone.innerHTML = `
                <i class="fas fa-check-circle" style="color: var(--primary-color);"></i>
                <p>Maximum images uploaded (${maxImages})</p>
                <button type="button" class="btn btn-outline" onclick="clearAllImages()">
                    Clear All Images
                </button>
            `;
            uploadZone.style.cursor = 'default';
        } else {
            uploadZone.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag and drop images here or click to browse</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} remaining</p>
                <input type="file" id="propertyImages" name="propertyImages" multiple accept="image/*" style="display: none;">
                <button type="button" class="btn btn-outline" onclick="triggerFileInput()">
                    Choose Files
                </button>
            `;
            uploadZone.style.cursor = 'pointer';

            // Re-attach file input event listener
            const newFileInput = uploadZone.querySelector('#propertyImages');
            if (newFileInput) {
                newFileInput.addEventListener('change', handleFileInputChange);
            }
        }
    }

    // Trigger file input
    window.triggerFileInput = function () {
        const fileInput = document.getElementById('propertyImages');
        if (fileInput) {
            fileInput.click();
        }
    };

    // Handle file input change
    function handleFileInputChange(e) {
        handleImageUpload(e.target.files);
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    }

    // Clear All Images
    window.clearAllImages = function () {
        uploadedImages = [];
        imagePreview.innerHTML = '';
        updateUploadZone();
    };

    // Drag and Drop Events
    uploadZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleImageUpload(files);
    });

    // Click to upload functionality
    uploadZone.addEventListener('click', function (e) {
        // Only trigger if clicking on the upload zone itself, not on buttons
        if (e.target === uploadZone || e.target.tagName === 'I' || e.target.tagName === 'P') {
            const fileInput = uploadZone.querySelector('#propertyImages');
            if (fileInput) {
                fileInput.click();
            }
        }
    });

    // Initial file input event listener
    const initialFileInput = document.getElementById('propertyImages');
    if (initialFileInput) {
        initialFileInput.addEventListener('change', handleFileInputChange);
    }

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

        // Check image requirements
        if (uploadedImages.length < minImages) {
            errors.push(`At least ${minImages} image is required`);
        }

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
            // Collect form data by IDs
            const formData = {
                propertyTitle: document.getElementById('propertyTitle').value,
                propertyType: document.getElementById('propertyType').value,
                propertySize: parseInt(document.getElementById('propertySize').value),
                monthlyPrice: parseInt(document.getElementById('monthlyPrice').value),
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
                amenities: Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value),
                contactName: document.getElementById('contactName').value,
                contactPhone: document.getElementById('contactPhone').value,
                contactEmail: document.getElementById('contactEmail').value,
                agreeTerms: document.querySelector('input[name="agreeTerms"]').checked,
                images: uploadedImages // Array of image objects
            };

            const response = await fetch('/submit-estate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
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
            images: uploadedImages.map(img => ({ name: img.name, src: img.src })),
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

                // Load images
                draft.images.forEach(imgData => {
                    // Convert base64 back to file object
                    fetch(imgData.src)
                        .then(res => res.blob())
                        .then(blob => {
                            const file = new File([blob], imgData.name, { type: blob.type });
                            const imageData = {
                                id: Date.now() + Math.random(),
                                file: file,
                                src: imgData.src,
                                name: imgData.name
                            };
                            uploadedImages.push(imageData);
                            displayImagePreview(imageData);
                            updateUploadZone();
                        });
                });

                showSuccess('Draft loaded successfully!');
            } catch (error) {
                console.error('Error loading draft:', error);
                localStorage.removeItem('estateDraft');
            }
        }
    }

    // Initialize
    updateUploadZone();
    loadDraft();
});
