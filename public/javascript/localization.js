// Currency mapping based on country codes - comprehensive mapping
const currencyMap = {
    // Africa
    'NG': 'NGN', 'KE': 'KES', 'ZA': 'ZAR', 'GH': 'GHS', 'UG': 'UGX', 
    'TZ': 'TZS', 'RW': 'RWF', 'ET': 'ETB', 'MA': 'MAD', 'EG': 'EGP',
    'DZ': 'DZD', 'TN': 'TND', 'LY': 'LYD', 'SD': 'SDG', 'SO': 'SOS',
    'DJ': 'DJF', 'ER': 'ERN', 'BI': 'BIF', 'ZW': 'ZWL', 'ZM': 'ZMW',
    'MW': 'MWK', 'MZ': 'MZN', 'BW': 'BWP', 'SZ': 'SZL', 'LS': 'LSL',
    'NA': 'NAD', 'AO': 'AOA', 'CD': 'CDF', 'CG': 'XAF', 'GA': 'XAF',
    'GQ': 'XAF', 'TD': 'XAF', 'CF': 'XAF', 'CM': 'XAF', 'BJ': 'XOF',
    'BF': 'XOF', 'CI': 'XOF', 'GW': 'XOF', 'ML': 'XOF', 'NE': 'XOF',
    'SN': 'XOF', 'TG': 'XOF', 'GN': 'GNF', 'SL': 'SLL', 'LR': 'LRD',
    'GM': 'GMD', 'CV': 'CVE', 'STN': 'STN', 'KM': 'KMF', 'SC': 'SCR',
    'MU': 'MUR', 'RE': 'EUR', 'YT': 'EUR',
    
    // Europe
    'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
    'NL': 'EUR', 'BE': 'EUR', 'CH': 'CHF', 'AT': 'EUR', 'SE': 'SEK',
    'NO': 'NOK', 'DK': 'DKK', 'FI': 'EUR', 'PL': 'EUR', 'RU': 'RUB',
    'TR': 'TRY', 'IE': 'EUR', 'PT': 'EUR', 'GR': 'EUR', 'CZ': 'CZK',
    'RO': 'RON', 'HU': 'HUF', 'UA': 'UAH', 'BY': 'BYN', 'LT': 'EUR',
    'LV': 'EUR', 'EE': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'HR': 'EUR',
    'BA': 'BAM', 'RS': 'RSD', 'ME': 'EUR', 'MK': 'MKD', 'AL': 'ALL',
    'BG': 'BGN', 'IS': 'ISK', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR',
    
    // Asia
    'IN': 'INR', 'CN': 'CNY', 'JP': 'JPY', 'KR': 'KRW', 'SG': 'SGD',
    'HK': 'HKD', 'TH': 'THB', 'MY': 'MYR', 'ID': 'IDR', 'PH': 'PHP',
    'VN': 'VND', 'BD': 'BDT', 'PK': 'PKR', 'LK': 'LKR', 'NP': 'NPR',
    'AF': 'AFN', 'IR': 'IRR', 'IQ': 'IQD', 'IL': 'ILS', 'JO': 'JOD',
    'LB': 'LBP', 'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR', 'QA': 'QAR',
    'SA': 'SAR', 'AE': 'AED', 'YE': 'YER', 'SY': 'SYP', 'PS': 'ILS',
    'GE': 'GEL', 'AM': 'AMD', 'AZ': 'AZN', 'KZ': 'KZT', 'KG': 'KGS',
    'TJ': 'TJS', 'TM': 'TMT', 'UZ': 'UZS', 'MN': 'MNT', 'LA': 'LAK',
    'KH': 'USD', 'MM': 'MMK', 'BN': 'BND', 'TW': 'TWD', 'MOP': 'MOP',
    
    // North America
    'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
    
    // South America
    'BR': 'BRL', 'AR': 'ARS', 'CO': 'COP', 'PE': 'PEN', 'CL': 'CLP',
    'VE': 'VES', 'UYU': 'UYU', 'PY': 'PYG', 'BO': 'BOB', 'EC': 'USD',
    
    // Oceania
    'AU': 'AUD', 'NZ': 'NZD', 'FJ': 'FJD', 'PGK': 'PGK', 'SB': 'SBD',
    'VU': 'VUV', 'TO': 'TOP', 'WS': 'WST', 'KI': 'AUD', 'NR': 'AUD',
    'TV': 'AUD', 'PW': 'USD', 'MH': 'USD', 'FM': 'USD', 'GU': 'USD',
    'MP': 'USD', 'PR': 'USD', 'VI': 'USD', 'AS': 'USD', 'CK': 'NZD',
    'NU': 'NZD', 'TK': 'NZD', 'WF': 'XPF', 'PF': 'XPF', 'NC': 'XPF',
    
    // Caribbean & Central America
    'CU': 'CUP', 'DO': 'DOP', 'HT': 'HTG', 'JM': 'JMD', 'TT': 'TTD',
    'BB': 'BBD', 'BS': 'BSD', 'BZ': 'BZD', 'CR': 'CRC', 'PA': 'PAB',
    'SV': 'USD', 'GT': 'GTQ', 'HN': 'HNL', 'NI': 'NIO', 'VG': 'USD',
    'AG': 'XCD', 'DM': 'XCD', 'GD': 'XCD', 'KN': 'XCD', 'LC': 'XCD',
    'VC': 'XCD', 'AN': 'ANG', 'AW': 'AWG', 'KY': 'KYD'
};

// Language mapping based on country codes
const languageMap = {
    'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en',
    'ZA': 'en', 'NG': 'en', 'KE': 'en', 'GH': 'en', 'UG': 'en', 'TZ': 'en',
    'RW': 'en', 'ZM': 'en', 'ZW': 'en', 'BW': 'en', 'MW': 'en', 'MZ': 'pt',
    'SZ': 'en', 'LS': 'en', 'NA': 'en', 'AO': 'pt', 'SG': 'en', 'HK': 'en',
    'PH': 'en', 'ZW': 'en', 'BW': 'en', 'FJ': 'en', 'TO': 'en', 'WS': 'en',
    'SB': 'en', 'KI': 'en', 'NR': 'en', 'TV': 'en', 'AS': 'en', 'CK': 'en',
    'NU': 'en', 'TK': 'en', 'MH': 'en', 'FM': 'en', 'PW': 'en', 'MP': 'en',
    'GU': 'en', 'PR': 'es', 'VI': 'en', 'UM': 'en',
    
    'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'MC': 'fr', 'RE': 'fr',
    'YT': 'fr', 'PM': 'fr', 'CD': 'fr', 'CG': 'fr', 'GA': 'fr', 'GQ': 'fr',
    'TD': 'fr', 'CF': 'fr', 'CM': 'fr', 'BJ': 'fr', 'BF': 'fr', 'CI': 'fr',
    'GW': 'pt', 'ML': 'fr', 'NE': 'fr', 'SN': 'fr', 'TG': 'fr', 'GN': 'fr',
    'BI': 'fr', 'DJ': 'fr', 'VU': 'fr', 'WF': 'fr', 'PF': 'fr', 'NC': 'fr',
    
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
    'VE': 'es', 'UY': 'es', 'PY': 'es', 'BO': 'es', 'EC': 'es', 'GT': 'es',
    'CU': 'es', 'DO': 'es', 'PR': 'es', 'CR': 'es', 'PA': 'es', 'SV': 'es',
    'HN': 'es', 'NI': 'es', 'GQ': 'es',
    
    'BR': 'pt', 'PT': 'pt', 'CV': 'pt', 'ST': 'pt', 'MZ': 'pt', 'AO': 'pt',
    'GW': 'pt',
    
    'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de', 'LU': 'de',
    
    'IT': 'it', 'SM': 'it',
    
    'NL': 'nl', 'BE': 'nl',
    
    'RU': 'ru', 'BY': 'be', 'UA': 'uk', 'KZ': 'kk', 'KG': 'ky', 'TJ': 'tg',
    'TM': 'tk', 'UZ': 'uz',
    
    'PL': 'pl', 'CZ': 'cs', 'SK': 'sk', 'HU': 'hu',
    
    'GR': 'el', 'CY': 'el',
    
    'RO': 'ro', 'MD': 'ro',
    
    'JP': 'ja',
    
    'KR': 'ko', 'KP': 'ko',
    
    'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh',
    
    'AR': 'ar', 'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'IQ': 'ar', 'SY': 'ar',
    'LB': 'ar', 'JO': 'ar', 'PS': 'ar', 'YE': 'ar', 'OM': 'ar', 'QA': 'ar',
    'BH': 'ar', 'KW': 'ar', 'LY': 'ar', 'TN': 'ar', 'DZ': 'ar', 'MA': 'ar',
    'SD': 'ar', 'SO': 'so', 'DJ': 'fr', 'MR': 'ar',
    
    'HI': 'hi', 'IN': 'hi', 'NP': 'ne', 'BT': 'dz',
    
    'VN': 'vi',
    
    'TH': 'th',
    
    'ID': 'id',
    
    'MS': 'ms', 'MY': 'ms', 'BN': 'ms',
    
    'TL': 'pt', 'TL': 'tet',
    
    'AF': 'ps', 'IR': 'fa',
    
    'TR': 'tr',
    
    'HE': 'he', 'IL': 'he',
    
    'UK': 'en', 'GB': 'en'
};

// Region to full country name mapping
const countryNames = {
    'NG': 'Nigeria', 'KE': 'Kenya', 'ZA': 'South Africa', 'GH': 'Ghana',
    'UG': 'Uganda', 'TZ': 'Tanzania', 'RW': 'Rwanda', 'ET': 'Ethiopia',
    'MA': 'Morocco', 'EG': 'Egypt', 'IN': 'India', 'CN': 'China',
    'JP': 'Japan', 'KR': 'South Korea', 'SG': 'Singapore', 'HK': 'Hong Kong',
    'TH': 'Thailand', 'MY': 'Malaysia', 'ID': 'Indonesia', 'PH': 'Philippines',
    'VN': 'Vietnam', 'BD': 'Bangladesh', 'PK': 'Pakistan', 'LK': 'Sri Lanka',
    'NP': 'Nepal', 'GB': 'United Kingdom', 'DE': 'Germany', 'FR': 'France',
    'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands', 'BE': 'Belgium',
    'CH': 'Switzerland', 'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway',
    'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland', 'RU': 'Russia',
    'TR': 'Turkey', 'US': 'United States', 'CA': 'Canada', 'MX': 'Mexico',
    'BR': 'Brazil', 'AR': 'Argentina', 'CO': 'Colombia', 'PE': 'Peru',
    'CL': 'Chile', 'AU': 'Australia', 'NZ': 'New Zealand', 'AE': 'UAE',
    'SA': 'Saudi Arabia', 'IL': 'Israel', 'JO': 'Jordan', 'LB': 'Lebanon'
};

// Global settings object for cross-page access
window.UserLocalization = {
    settings: {
        region: 'US',
        currency: 'USD',
        language: 'en'
    },
    
    // Initialize settings from storage or detect
    init: function() {
        this.loadFromStorage();
        this.applyToPage();
        this.setupAutoDetection();
    },
    
    // Load settings from localStorage
    loadFromStorage: function() {
        const saved = localStorage.getItem('userLocalization');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
            } catch (e) {
                console.error('Error parsing localization settings:', e);
            }
        }
    },
    
    // Save settings to localStorage
    saveToStorage: function() {
        localStorage.setItem('userLocalization', JSON.stringify(this.settings));
    },
    
    // Apply settings to the current page
    applyToPage: function() {
        // Apply to select elements if they exist
        const regionSelect = document.getElementById('region');
        const currencySelect = document.getElementById('currency');
        const languageSelect = document.getElementById('language');
        
        if (regionSelect) regionSelect.value = this.settings.region;
        if (currencySelect) currencySelect.value = this.settings.currency;
        if (languageSelect) languageSelect.value = this.settings.language;
        
        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('localizationUpdated', {
            detail: this.settings
        }));
        
        console.log('Localization applied:', this.settings);
    },
    
    // Update settings and save
    update: function(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveToStorage();
        this.applyToPage();
    },
    
    // Auto-detect location on page load
    setupAutoDetection: function() {
        // Only auto-detect if no saved settings exist
        const saved = localStorage.getItem('userLocalization');
        if (saved) return; // User has already set preferences
        
        // Try to detect location
        this.detectLocation().then(detected => {
            if (detected) {
                this.update(detected);
                this.showNotification(`Location detected: ${countryNames[detected.region] || detected.region}`);
            }
        }).catch(error => {
            console.log('Location detection failed, using defaults:', error.message);
            // Fall back to browser language
            this.detectFromBrowser();
        });
    },
    
    // Detect location using multiple methods
    detectLocation: async function() {
        // Method 1: Try GPS/geolocation first
        try {
            const position = await this.getGeolocation();
            const geoData = await this.reverseGeocode(position.latitude, position.longitude);
            
            if (geoData && geoData.address && geoData.address.country_code) {
                const countryCode = geoData.address.country_code.toUpperCase();
                if (countryCode && currencyMap[countryCode]) {
                    return {
                        region: countryCode,
                        currency: currencyMap[countryCode],
                        language: languageMap[countryCode] || navigator.language.split('-')[0] || 'en'
                    };
                }
            }
        } catch (error) {
            console.log('GPS detection failed:', error.message);
        }
        
        // Method 2: Try IP-based detection via ipapi
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                const countryCode = data.country_code;
                if (countryCode && currencyMap[countryCode]) {
                    return {
                        region: countryCode,
                        currency: currencyMap[countryCode],
                        language: data.languages ? data.languages.split(',')[0].split('-')[0] : 'en'
                    };
                }
            }
        } catch (error) {
            console.log('IP detection failed:', error.message);
        }
        
        // Method 3: Try ip-api.com as fallback
        try {
            const response = await fetch('http://ip-api.com/json/?fields=countryCode,currency');
            if (response.ok) {
                const data = await response.json();
                if (data.countryCode && currencyMap[data.countryCode]) {
                    return {
                        region: data.countryCode,
                        currency: data.currency || currencyMap[data.countryCode],
                        language: navigator.language.split('-')[0] || 'en'
                    };
                }
            }
        } catch (error) {
            console.log('IP-API detection failed:', error.message);
        }
        
        throw new Error('All detection methods failed');
    },
    
    // Get geolocation position
    getGeolocation: function() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 300000 // 5 minutes
            });
        });
    },
    
    // Reverse geocode coordinates
    reverseGeocode: async function(lat, lon) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
        }
        return null;
    },
    
    // Fallback to browser language detection
    detectFromBrowser: function() {
        const lang = navigator.language.split('-')[0] || 'en';
        const region = this.getRegionFromLanguage(lang) || 'US';
        
        this.update({
            region: region,
            currency: currencyMap[region] || 'USD',
            language: lang
        });
    },
    
    // Get likely region from language
    getRegionFromLanguage: function(lang) {
        const langToRegion = {
            'en': ['US', 'GB', 'AU', 'CA', 'NZ'],
            'fr': ['FR', 'BE', 'CA'],
            'es': ['ES', 'MX', 'AR', 'CO'],
            'de': ['DE', 'AT', 'CH'],
            'pt': ['PT', 'BR'],
            'zh': ['CN', 'TW', 'HK'],
            'ja': ['JP'],
            'ko': ['KR'],
            'ar': ['SA', 'EG', 'MA'],
            'hi': ['IN'],
            'ru': ['RU']
        };
        return langToRegion[lang] ? langToRegion[lang][0] : null;
    },
    
    // Show notification
    showNotification: function(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'localization-notification';
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles if not already present
        if (!document.getElementById('localization-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'localization-notification-styles';
            style.textContent = `
                .localization-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4a6bff;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-family: 'Segoe UI', sans-serif;
                    animation: slideIn 0.3s ease;
                }
                .localization-notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    opacity: 0.8;
                }
                .localization-notification button:hover {
                    opacity: 1;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.UserLocalization.init();
});

// Also initialize immediately if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => window.UserLocalization.init(), 100);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.UserLocalization;
}

