document.addEventListener('DOMContentLoaded', function () {
    // Check for saved theme preference and apply it immediately
    const savedTheme = localStorage.getItem('hustlerati-theme');
    if (savedTheme) {
        document.body.className = savedTheme + '-theme';
    } else {
        // Default to light theme if no preference is saved
        document.body.className = 'light-theme';
    }

    // Theme switcher functionality for auth pages (if needed)
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        const themeToggleBtn = themeSwitcher.querySelector('.theme-toggle-btn');
        const themeDropdown = themeSwitcher.querySelector('.theme-dropdown');
        let themeDropdownOpen = false;

        themeToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            themeDropdownOpen = !themeDropdownOpen;

            if (themeDropdownOpen) {
                themeDropdown.classList.add('active');
            } else {
                themeDropdown.classList.remove('active');
            }
        });

        // Close theme dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (themeDropdownOpen && !themeSwitcher.contains(e.target)) {
                themeDropdown.classList.remove('active');
                themeDropdownOpen = false;
            }
        });

        const themeOptions = themeSwitcher.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const theme = this.getAttribute('data-theme');
                document.body.className = theme + '-theme';
                localStorage.setItem('hustlerati-theme', theme);
                themeDropdown.classList.remove('active');
                themeDropdownOpen = false;
            });
        });
    }

    // Error and success dialog functionality
    const closeErrorDialog = () => {
        const errorDialog = document.querySelector('.general-error-dialog');
        if (errorDialog) {
            errorDialog.style.display = 'none';
        }
    }

    const closeSuccessDialog = () => {
        const successDialog = document.querySelector('.general-success-dialog');
        if (successDialog) {
            successDialog.style.display = 'none';
        }
    }

    // Error handling for general errors
    const generalError = document.getElementById('generalError');
    if (generalError) {
        generalError.addEventListener('click', function () {
            const errorDialog = document.querySelector('.general-error-dialog');
            if (errorDialog) {
                errorDialog.style.display = 'block';
            }
        });
    }

    const closeErrorBtn = document.querySelector('.close-error-btn');
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', closeErrorDialog);
    }

    // Success handling for general success messages
    const generalSuccess = document.getElementById('generalSuccess');
    if (generalSuccess) {
        generalSuccess.addEventListener('click', function () {
            const successDialog = document.querySelector('.general-success-dialog');
            if (successDialog) {
                successDialog.style.display = 'block';
            }
        });
    }

    const closeSuccessBtn = document.querySelector('.close-success-btn');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeSuccessDialog);
    }
}); 