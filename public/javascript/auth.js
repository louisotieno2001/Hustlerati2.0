document.addEventListener('DOMContentLoaded', function () {
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const showError = (message) => {
        const errorDialog = document.querySelector('.general-error-dialog');
        if (errorDialog) {
            let errorMessage = errorDialog.querySelector('.general-error-message');
            // Always ensure the error message element exists
            if (!errorMessage) {
                errorMessage = document.createElement('p');
                errorMessage.className = 'general-error-message';
                errorDialog.appendChild(errorMessage);
            }
            // Always reset and show the dialog and message
            errorMessage.textContent = message;
            errorDialog.classList.remove('active');
            setTimeout(() => {
                errorDialog.classList.add('active');
            }, 10);
            // Set timeout to auto-close and reload after 4 seconds
            clearTimeout(window._errorDialogTimeout);
            window._errorDialogTimeout = setTimeout(() => {
                window.closeErrorDialog();
            }, 4000);
        }
    };

    // Utility to close error dialog and allow new errors to show
    window.closeErrorDialog = function () {
        const errorDialog = document.querySelector('.general-error-dialog');
        if (errorDialog) {
            errorDialog.classList.remove('active');
            const errorMessage = errorDialog.querySelector('.general-error-message');
            if (errorMessage) errorMessage.textContent = '';
        }
        // Automatically reload the page when the dialog is closed
        window.location.reload();
    };

    window.closeSuccessDialog = function () {
        const successDialog = document.querySelector('.general-success-dialog');
        if (successDialog) {
            successDialog.classList.remove('active');
            const successMessage = successDialog.querySelector('.success-message');
            if (successMessage) successMessage.textContent = '';
        }
        // Automatically reload the page when the dialog is closed
        window.location.reload();
    };

    const showSuccess = (message) => {
        const successDialog = document.querySelector('.general-success-dialog');
        if (successDialog) {
            let successMessage = successDialog.querySelector('.success-message');
            // Create a paragraph element if it doesn't exist
            if (!successMessage) {
                successMessage = document.createElement('p');
                successMessage.className = 'success-message';
                successDialog.appendChild(successMessage);
            }
            // Set the text content of the success message
            successMessage.textContent = message;
            successDialog.classList.remove('active');
            setTimeout(() => {
                successDialog.classList.add('active');
            }, 10);
            // Set timeout to auto-close and reload after 4 seconds
            clearTimeout(window._successDialogTimeout);
            window._successDialogTimeout = setTimeout(() => {
                window.closeSuccessDialog();
            }, 4000);
        }
    };

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength indicator (for signup page)
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const strengthText = document.getElementById('strengthText');
            const strengthBars = document.querySelectorAll('.strength-bar');
            const password = this.value;

            // Reset bars
            strengthBars.forEach(bar => {
                bar.style.backgroundColor = '#e0e0e0';
            });

            if (password.length === 0) {
                strengthText.textContent = '';
                return;
            }

            // Very simple strength check - in a real app, use a proper library
            let strength = 0;
            if (password.length > 5) strength++;
            if (password.length > 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            // Update UI
            let strengthLevel = '';
            let color = '';

            if (strength <= 2) {
                strengthLevel = 'Weak';
                color = '#e74c3c';
            } else if (strength <= 4) {
                strengthLevel = 'Medium';
                color = '#f39c12';
            } else {
                strengthLevel = 'Strong';
                color = '#2ecc71';
            }

            strengthText.textContent = strengthLevel;

            // Update bars
            const activeBars = Math.min(Math.ceil(strength / 2), 3);
            for (let i = 0; i < activeBars; i++) {
                strengthBars[i].style.backgroundColor = color;
            }
        });
    }

    // Form validation for login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Reset errors
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
                el.textContent = '';
            });

            const email = document.getElementById('email');
            const password = document.getElementById('password');
            let isValid = true;

            // Email validation
            if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address';
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }

            // Password validation
            if (!password.value || password.value.length < 6) {
                document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                // Form submission logic
                try {
                    const response = await fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email.value,
                            password: password.value
                        })
                    });

                    const result = await response.json();

                    if (result.message === 'Login successful') {
                        showSuccess(result.message);
                        // Redirect to the dashboard or another page
                        window.location.href = result.redirect;
                    } else {
                        showError(`Login failed: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error logging in:', error);
                    showError('An error occurred. Please try again later.');
                }

            }
        });
    }

    // Form validation for signup
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Reset errors
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
                el.textContent = '';
            });

            const fullName = document.getElementById('fullName');
            const email = document.getElementById('signupEmail');
            const phoneNumber = document.getElementById('phoneNumber');
            const password = document.getElementById('signupPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            const terms = document.getElementById('terms');
            let isValid = true;

            // Name validation
            if (!fullName.value || fullName.value.trim().length < 2) {
                document.getElementById('nameError').textContent = 'Please enter your full name';
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            }

            // Email validation
            if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                document.getElementById('signupEmailError').textContent = 'Please enter a valid email address';
                document.getElementById('signupEmailError').style.display = 'block';
                isValid = false;
            }

            // Phone number validation
            if (!phoneNumber.value || !/^\+?[1-9]\d{10,14}$/.test(phoneNumber.value)) {
                document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
                document.getElementById('phoneError').style.display = 'block';
                isValid = false;
            }

            // Password validation
            if (!password.value || password.value.length < 8) {
                document.getElementById('signupPasswordError').textContent = 'Password must be at least 8 characters';
                document.getElementById('signupPasswordError').style.display = 'block';
                isValid = false;
            }

            // Confirm password
            if (password.value !== confirmPassword.value) {
                document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
                document.getElementById('confirmPasswordError').style.display = 'block';
                isValid = false;
            }

            // Terms validation
            if (!terms.checked) {
                isValid = false;
                // You might want to add visual feedback for terms checkbox
                showError('You must agree to the terms and conditions');
            }

            // After all validations, scroll to first error if any
            if (!isValid) {
                const firstError = document.querySelector('.error-message[style*="display: block"]');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            if (isValid) {
                // Form submission logic
                try {
                    const response = await fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fullName: fullName.value,
                            email: email.value,
                            phone: phoneNumber.value,
                            password: password.value,
                            terms: terms.checked
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showSuccess('Registration successful!');
                        // Redirect or perform other actions
                        window.location.href = '/login'; // Redirect to login page
                    } else {
                        showError(`Registration failed: ${data.error}`);
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                }
            }
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function () {
            const provider = this.classList.contains('google') ? 'Google' : 'LinkedIn';
            showError(`${provider} authentication coming soon to Hustlerati!`);
        });
    });
});