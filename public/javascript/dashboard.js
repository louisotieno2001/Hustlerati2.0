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
});