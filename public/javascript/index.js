document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu state management
    let menuOpen = false;
    let dropdownOpen = null; // Track which dropdown is open

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const body = document.body;

    // Create mobile menu overlay
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    body.appendChild(mobileMenuOverlay);

    function toggleMobileMenu() {
        menuOpen = !menuOpen; // Toggle the state

        if (menuOpen) {
            nav.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            body.style.overflow = 'hidden';
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            nav.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';

            // Close any open dropdowns when closing the menu
            closeAllDropdowns();
            closeMobileThemeDropdown();
        }
    }

    function closeAllDropdowns() {
        dropdownOpen = null;
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.style.display = 'none';
            const chevron = dropdown.querySelector('.fas.fa-chevron-down');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        });
    }

    function closeMobileThemeDropdown() {
        const mobileThemeSwitcher = document.querySelector('.theme-switcher.mobile');
        if (mobileThemeSwitcher) {
            mobileThemeSwitcher.classList.remove('active');
        }
    }

    mobileMenuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu when clicking overlay
    mobileMenuOverlay.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (menuOpen && !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Enhanced dropdown functionality for both mobile and desktop
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');
        const chevron = link.querySelector('.fas.fa-chevron-down');

        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // If this dropdown is already open, close it
            if (dropdownOpen === dropdown) {
                dropdown.classList.remove('active');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
                dropdownOpen = null;
                return;
            }

            // Close other dropdowns first
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                    const otherChevron = otherDropdown.querySelector('.fas.fa-chevron-down');
                    if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
                }
            });

            // Open this dropdown
            dropdown.classList.add('active');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
            dropdownOpen = dropdown;
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const chevron = dropdown.querySelector('.fas.fa-chevron-down');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            });
            dropdownOpen = null;
        }
    });

    // Mobile theme switcher functionality
    const mobileThemeSwitcher = document.querySelector('.theme-switcher.mobile');
    if (mobileThemeSwitcher) {
        const mobileThemeToggleBtn = mobileThemeSwitcher.querySelector('.theme-toggle-btn');
        let mobileThemeDropdownOpen = false;

        mobileThemeToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            mobileThemeDropdownOpen = !mobileThemeDropdownOpen;

            if (mobileThemeDropdownOpen) {
                mobileThemeSwitcher.classList.add('active');
            } else {
                mobileThemeSwitcher.classList.remove('active');
            }
        });

        const mobileThemeOptions = mobileThemeSwitcher.querySelectorAll('.theme-option');
        mobileThemeOptions.forEach(option => {
            option.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const theme = this.getAttribute('data-theme');
                document.body.className = theme + '-theme';
                localStorage.setItem('hustlerati-theme', theme);
                mobileThemeSwitcher.classList.remove('active');
                mobileThemeDropdownOpen = false;
            });
        });
    }

    // Desktop theme switcher functionality
    const desktopThemeSwitcher = document.querySelector('.theme-switcher:not(.mobile)');
    if (desktopThemeSwitcher) {
        const desktopThemeToggleBtn = desktopThemeSwitcher.querySelector('.theme-toggle-btn');
        const desktopThemeDropdown = desktopThemeSwitcher.querySelector('.theme-dropdown');
        let desktopThemeOpen = false;

        desktopThemeToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            desktopThemeOpen = !desktopThemeOpen;

            if (desktopThemeOpen) {
                desktopThemeDropdown.classList.add('active');
            } else {
                desktopThemeDropdown.classList.remove('active');
            }
        });

        // Close desktop theme dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (desktopThemeOpen && !desktopThemeSwitcher.contains(e.target)) {
                desktopThemeDropdown.classList.remove('active');
                desktopThemeOpen = false;
            }
        });

        const desktopThemeOptions = desktopThemeSwitcher.querySelectorAll('.theme-option');
        desktopThemeOptions.forEach(option => {
            option.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const theme = this.getAttribute('data-theme');
                document.body.className = theme + '-theme';
                localStorage.setItem('hustlerati-theme', theme);
                desktopThemeDropdown.classList.remove('active');
                desktopThemeOpen = false;
            });
        });
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('hustlerati-theme');
    if (savedTheme) {
        document.body.className = savedTheme + '-theme';
    }

    // Tab functionality for business solutions
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Skip if it's an external link or not a hash link
            if (targetId === '#' || targetId.startsWith('http') || targetId.startsWith('//')) {
                return;
            }

            e.preventDefault();

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });



    const closeErrorDialog = () => {
        const errorDialog = document.querySelector('.general-error-dialog');
        if (errorDialog) {
            errorDialog.style.display = 'none';
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

    const closeSuccessDialog = () => {
        const successDialog = document.querySelector('.general-success-dialog');
        if (successDialog) {
            successDialog.style.display = 'none';
        }
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