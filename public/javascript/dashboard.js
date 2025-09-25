document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // Tab switching functionality
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items and tabs
            navItems.forEach(navItem => navItem.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding tab
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
                sidebarToggle.querySelector('i').classList.remove('fa-times');
                sidebarToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Theme switcher functionality
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.className = theme + '-theme';
            
            // Save theme preference to localStorage
            localStorage.setItem('hustlerati-theme', theme);
        });
    });

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('hustlerati-theme');
    if (savedTheme) {
        document.body.className = savedTheme + '-theme';
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.theme-switcher')) {
            document.querySelector('.theme-dropdown').style.opacity = '0';
            document.querySelector('.theme-dropdown').style.visibility = 'hidden';
        }

        if (!e.target.closest('.user-dropdown')) {
            document.querySelector('.dropdown-menu').style.opacity = '0';
            document.querySelector('.dropdown-menu').style.visibility = 'hidden';
        }
    });

    // Settings tab functionality
    const coverEditBtn = document.querySelector('.cover-edit-btn');
    const coverUploadInput = document.getElementById('cover-upload');
    const coverPreview = document.getElementById('cover-preview');

    const profileEditBtn = document.querySelector('.profile-edit-btn');
    const profileUploadInput = document.getElementById('profile-upload');
    const profilePreview = document.getElementById('profile-preview');

    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const userForm = document.getElementById('user-form');

    const darkThemeToggle = document.getElementById('dark-theme-toggle');
    const emailVerificationsToggle = document.getElementById('email-verifications-toggle');

    const verifyEmailBtn = document.getElementById('verify-email-btn');
    const verifyPhoneBtn = document.getElementById('verify-phone-btn');

    // Helper to toggle edit mode for user form
    function toggleEditMode(enable) {
        const inputs = userForm.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.id !== 'email') {
                input.readOnly = !enable;
            }
        });
        editBtn.style.display = enable ? 'none' : 'inline-block';
        saveBtn.style.display = enable ? 'inline-block' : 'none';
        cancelBtn.style.display = enable ? 'inline-block' : 'none';
    }

    // Cover image upload
    coverEditBtn.addEventListener('click', () => {
        coverUploadInput.click();
    });

    coverUploadInput.addEventListener('change', async () => {
        const file = coverUploadInput.files[0];
        if (file) {
            // Show local preview immediately
            const reader = new FileReader();
            reader.onload = e => {
                coverPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Upload to server immediately
            const formData = new FormData();
            formData.append('media', file);

            try {
                const response = await fetch('/upload-cover', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    alert('Cover image updated successfully.');
                } else {
                    alert('Failed to upload cover image. Please try again.');
                }
            } catch (error) {
                console.error('Error uploading cover image:', error);
                alert('Error uploading cover image. Please check your internet connection and try again.');
            }
        }
    });

    // Profile image upload
    profileEditBtn.addEventListener('click', () => {
        profileUploadInput.click();
    });

    profileUploadInput.addEventListener('change', async () => {
        const file = profileUploadInput.files[0];
        if (file) {
            // Show local preview immediately
            const reader = new FileReader();
            reader.onload = e => {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Upload to server immediately
            const formData = new FormData();
            formData.append('media', file);

            console.log(formData)

            try {
                const response = await fetch('/upload-profile', {
                    method: 'POST',
                    body: formData
                });

                console.log("Server response", response)
                if (response.ok) {
                    alert('Profile image updated successfully.');
                } else {
                    alert('Failed to upload profile image. Please try again.');
                }
            } catch (error) {
                console.error('Error uploading profile image:', error);
                alert('Error uploading profile image. Please check your internet connection and try again.');
            }
        }
    });

    // Edit button click
    editBtn.addEventListener('click', () => {
        toggleEditMode(true);
    });

    // Cancel button click
    cancelBtn.addEventListener('click', () => {
        toggleEditMode(false);
        // Reset form values to original
        userForm.name.value = userForm.name.defaultValue;
        userForm.phone.value = userForm.phone.defaultValue;
        // Reset images to original src
        coverPreview.src = coverPreview.defaultSrc || coverPreview.src;
        profilePreview.src = profilePreview.defaultSrc || profilePreview.src;
        // Clear file inputs
        coverUploadInput.value = '';
        profileUploadInput.value = '';
    });

    // Save button click (form submit)
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prepare form data
        const formData = new FormData();
        formData.append('name', userForm.name.value);
        formData.append('phone', userForm.phone.value);

        if (coverUploadInput.files[0]) {
            formData.append('cover_image', coverUploadInput.files[0]);
        }
        if (profileUploadInput.files[0]) {
            formData.append('profile_image', profileUploadInput.files[0]);
        }

        try {
            const response = await fetch('/upload-profile', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('Profile updated successfully.');
                // Update default values to new values
                userForm.name.defaultValue = userForm.name.value;
                userForm.phone.defaultValue = userForm.phone.value;
                coverPreview.defaultSrc = coverPreview.src;
                profilePreview.defaultSrc = profilePreview.src;
                toggleEditMode(false);
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
        }
    });

    // Preferences toggles change handlers
    darkThemeToggle.addEventListener('change', async () => {
        const enabled = darkThemeToggle.checked;
        try {
            const response = await fetch('/dashboard/update-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dark_theme: enabled })
            });
            if (response.ok) {
                // Apply theme immediately
                document.body.className = enabled ? 'dark-theme' : 'light-theme';
                localStorage.setItem('hustlerati-theme', enabled ? 'dark' : 'light');
            } else {
                alert('Failed to update preferences.');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            alert('Error updating preferences.');
        }
    });

    emailVerificationsToggle.addEventListener('change', async () => {
        const enabled = emailVerificationsToggle.checked;
        try {
            const response = await fetch('/dashboard/update-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_verifications: enabled })
            });
            if (!response.ok) {
                alert('Failed to update preferences.');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            alert('Error updating preferences.');
        }
    });

    // Verification buttons click handlers
    verifyEmailBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/dashboard/send-email-verification', { method: 'POST' });
            if (response.ok) {
                alert('Verification email sent.');
                verifyEmailBtn.style.display = 'none';
            } else {
                alert('Failed to send verification email.');
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            alert('Error sending verification email.');
        }
    });

    verifyPhoneBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/dashboard/send-phone-verification', { method: 'POST' });
            if (response.ok) {
                alert('Verification SMS sent.');
                verifyPhoneBtn.style.display = 'none';
            } else {
                alert('Failed to send verification SMS.');
            }
        } catch (error) {
            console.error('Error sending verification SMS:', error);
            alert('Error sending verification SMS.');
        }
    });
});
