// Currency mapping based on country codes
const currencyMap = {
    'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'JP': 'JPY', 'CA': 'CAD', 'AU': 'AUD', 'CH': 'CHF', 'CN': 'CNY', 'SE': 'SEK', 'NZ': 'NZD', 'MX': 'MXN', 'SG': 'SGD', 'HK': 'HKD', 'NO': 'NOK', 'KR': 'KRW', 'TR': 'TRY', 'RU': 'RUB', 'IN': 'INR', 'BR': 'BRL', 'ZA': 'ZAR', 'AE': 'AED', 'SA': 'SAR', 'EG': 'EGP', 'NG': 'NGN', 'KE': 'KES', 'GH': 'GHS', 'UG': 'UGX', 'TZ': 'TZS', 'RW': 'RWF', 'ET': 'ETB', 'MA': 'MAD', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'FI': 'EUR', 'PT': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR', 'SI': 'EUR', 'SK': 'EUR', 'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR', 'HR': 'EUR', 'PL': 'EUR', 'HU': 'EUR', 'CZ': 'EUR', 'BG': 'EUR', 'RO': 'EUR', 'DK': 'DKK', 'IS': 'ISK', 'TH': 'THB', 'MY': 'MYR', 'ID': 'IDR', 'PH': 'PHP', 'VN': 'VND', 'BD': 'BDT', 'LK': 'LKR', 'NP': 'NPR', 'PK': 'PKR', 'IL': 'ILS', 'JO': 'JOD', 'LB': 'LBP', 'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR', 'QA': 'QAR', 'YE': 'YER', 'IQ': 'IQD', 'SY': 'SYP', 'LY': 'LYD', 'TN': 'TND', 'DZ': 'DZD', 'SD': 'SDG', 'SO': 'SOS', 'DJ': 'DJF', 'ER': 'ERN', 'BI': 'BIF', 'RW': 'RWF', 'UG': 'UGX', 'TZ': 'TZS', 'KE': 'KES', 'ET': 'ETB', 'ZM': 'ZMW', 'ZW': 'ZWL', 'BW': 'BWP', 'MW': 'MWK', 'MZ': 'MZN', 'SZ': 'SZL', 'LS': 'LSL', 'NA': 'NAD', 'AO': 'AOA', 'CD': 'CDF', 'CG': 'XAF', 'GA': 'XAF', 'GQ': 'XAF', 'TD': 'XAF', 'CF': 'XAF', 'CM': 'XAF', 'BJ': 'XOF', 'BF': 'XOF', 'CI': 'XOF', 'GW': 'XOF', 'ML': 'XOF', 'NE': 'XOF', 'SN': 'XOF', 'TG': 'XOF', 'GN': 'GNF', 'SL': 'SLL', 'LR': 'LRD', 'GM': 'GMD', 'GN': 'GNF', 'CV': 'CVE', 'ST': 'STN', 'GQ': 'XAF', 'KM': 'KMF', 'SC': 'SCR', 'MU': 'MUR', 'RE': 'EUR', 'YT': 'EUR', 'PM': 'EUR', 'WF': 'XPF', 'PF': 'XPF', 'NC': 'XPF', 'VU': 'VUV', 'FJ': 'FJD', 'TO': 'TOP', 'WS': 'WST', 'AS': 'USD', 'CK': 'NZD', 'NU': 'NZD', 'TK': 'NZD', 'TV': 'AUD', 'WF': 'XPF', 'MH': 'USD', 'FM': 'USD', 'PW': 'USD', 'KI': 'AUD', 'NR': 'AUD', 'TV': 'AUD', 'SB': 'SBD', 'VU': 'VUV', 'FJ': 'FJD', 'TO': 'TOP', 'WS': 'WST', 'KI': 'AUD', 'NR': 'AUD', 'PW': 'USD', 'MH': 'USD', 'FM': 'USD', 'MP': 'USD', 'GU': 'USD', 'PR': 'USD', 'VI': 'USD', 'UM': 'USD', 'AS': 'USD', 'CK': 'NZD', 'NU': 'NZD', 'TK': 'NZD', 'WF': 'XPF', 'PF': 'XPF', 'NC': 'XPF', 'VU': 'VUV', 'FJ': 'FJD', 'TO': 'TOP', 'WS': 'WST', 'KI': 'AUD', 'NR': 'AUD', 'PW': 'USD', 'MH': 'USD', 'FM': 'USD', 'MP': 'USD', 'GU': 'USD', 'PR': 'USD', 'VI': 'USD', 'UM': 'USD'
};

// Language mapping based on country codes
const languageMap = {
    'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en', 'ZA': 'en', 'NG': 'en', 'KE': 'en', 'GH': 'en', 'UG': 'en', 'TZ': 'en', 'RW': 'en', 'ZM': 'en', 'ZW': 'en', 'BW': 'en', 'MW': 'en', 'MZ': 'en', 'SZ': 'en', 'LS': 'en', 'NA': 'en', 'AO': 'en', 'ZM': 'en', 'ZW': 'en', 'BW': 'en', 'MW': 'en', 'MZ': 'en', 'SZ': 'en', 'LS': 'en', 'NA': 'en', 'AO': 'en', 'CD': 'fr', 'CG': 'fr', 'GA': 'fr', 'GQ': 'fr', 'TD': 'fr', 'CF': 'fr', 'CM': 'fr', 'BJ': 'fr', 'BF': 'fr', 'CI': 'fr', 'GW': 'fr', 'ML': 'fr', 'NE': 'fr', 'SN': 'fr', 'TG': 'fr', 'GN': 'fr', 'SL': 'en', 'LR': 'en', 'GM': 'en', 'GN': 'fr', 'CV': 'pt', 'ST': 'pt', 'GQ': 'es', 'GQ': 'fr', 'KM': 'ar', 'SC': 'en', 'MU': 'en', 'RE': 'fr', 'YT': 'fr', 'PM': 'fr', 'WF': 'fr', 'PF': 'fr', 'NC': 'fr', 'VU': 'fr', 'FJ': 'en', 'TO': 'en', 'WS': 'en', 'AS': 'en', 'CK': 'en', 'NU': 'en', 'TK': 'en', 'TV': 'en', 'WF': 'fr', 'MH': 'en', 'FM': 'en', 'PW': 'en', 'KI': 'en', 'NR': 'en', 'TV': 'en', 'SB': 'en', 'VU': 'fr', 'FJ': 'en', 'TO': 'en', 'WS': 'en', 'KI': 'en', 'NR': 'en', 'PW': 'en', 'MH': 'en', 'FM': 'en', 'MP': 'en', 'GU': 'en', 'PR': 'es', 'VI': 'en', 'UM': 'en', 'AS': 'en', 'CK': 'en', 'NU': 'en', 'TK': 'en', 'WF': 'fr', 'PF': 'fr', 'NC': 'fr', 'VU': 'fr', 'FJ': 'en', 'TO': 'en', 'WS': 'en', 'KI': 'en', 'NR': 'en', 'PW': 'en', 'MH': 'en', 'FM': 'en', 'MP': 'en', 'GU': 'en', 'PR': 'es', 'VI': 'en', 'UM': 'en', 'DE': 'de', 'AT': 'de', 'CH': 'de', 'LU': 'de', 'LI': 'de', 'FR': 'fr', 'BE': 'fr', 'IT': 'it', 'ES': 'es', 'PT': 'pt', 'GR': 'el', 'NL': 'nl', 'DK': 'da', 'NO': 'no', 'SE': 'sv', 'FI': 'fi', 'IS': 'is', 'PL': 'pl', 'CZ': 'cs', 'SK': 'sk', 'HU': 'hu', 'SI': 'sl', 'HR': 'hr', 'BA': 'bs', 'ME': 'sr', 'MK': 'mk', 'AL': 'sq', 'RS': 'sr', 'BG': 'bg', 'RO': 'ro', 'MD': 'ro', 'UA': 'uk', 'BY': 'be', 'RU': 'ru', 'EE': 'et', 'LV': 'lv', 'LT': 'lt', 'GE': 'ka', 'AM': 'hy', 'AZ': 'az', 'KZ': 'kk', 'KG': 'ky', 'TJ': 'tg', 'TM': 'tk', 'UZ': 'uz', 'MN': 'mn', 'CN': 'zh', 'JP': 'ja', 'KR': 'ko', 'KP': 'ko', 'VN': 'vi', 'LA': 'lo', 'TH': 'th', 'MY': 'ms', 'SG': 'en', 'ID': 'id', 'PH': 'tl', 'BN': 'ms', 'KH': 'km', 'MM': 'my', 'LK': 'si', 'NP': 'ne', 'BD': 'bn', 'PK': 'ur', 'AF': 'ps', 'IR': 'fa', 'IQ': 'ar', 'SY': 'ar', 'LB': 'ar', 'JO': 'ar', 'PS': 'ar', 'YE': 'ar', 'OM': 'ar', 'AE': 'ar', 'QA': 'ar', 'BH': 'ar', 'KW': 'ar', 'SA': 'ar', 'EG': 'ar', 'LY': 'ar', 'TN': 'ar', 'DZ': 'ar', 'MA': 'ar', 'SD': 'ar', 'SO': 'so', 'DJ': 'fr', 'ER': 'ti', 'BI': 'fr', 'RW': 'fr', 'UG': 'en', 'TZ': 'sw', 'KE': 'sw', 'ET': 'am', 'ZM': 'en', 'ZW': 'en', 'BW': 'en', 'MW': 'en', 'MZ': 'pt', 'SZ': 'en', 'LS': 'en', 'NA': 'en', 'AO': 'pt', 'CD': 'fr', 'CG': 'fr', 'GA': 'fr', 'GQ': 'es', 'TD': 'fr', 'CF': 'fr', 'CM': 'fr', 'BJ': 'fr', 'BF': 'fr', 'CI': 'fr', 'GW': 'pt', 'ML': 'fr', 'NE': 'fr', 'SN': 'fr', 'TG': 'fr', 'GN': 'fr', 'SL': 'en', 'LR': 'en', 'GM': 'en', 'GN': 'fr', 'CV': 'pt', 'ST': 'pt', 'GQ': 'es', 'GQ': 'fr', 'KM': 'ar', 'SC': 'en', 'MU': 'en', 'RE': 'fr', 'YT': 'fr', 'PM': 'fr', 'WF': 'fr', 'PF': 'fr', 'NC': 'fr', 'VU': 'fr', 'FJ': 'en', 'TO': 'en', 'WS': 'en', 'AS': 'en', 'CK': 'en', 'NU': 'en', 'TK': 'en', 'TV': 'en', 'WF': 'fr', 'MH': 'en', 'FM': 'en', 'PW': 'en', 'KI': 'en', 'NR': 'en', 'TV': 'en', 'SB': 'en', 'VU': 'fr', 'FJ': 'en', 'TO': 'en', 'WS': 'en', 'KI': 'en', 'NR': 'en', 'PW': 'en', 'MH': 'en', 'FM': 'en', 'MP': 'en', 'GU': 'en', 'PR': 'es', 'VI': 'en', 'UM': 'en', 'AS': 'en', 'CK': 'en', 'NU': 'en', 'TK': 'en', 'WF': 'fr', 'PF': 'fr', 'NC': 'fr', 'VU': 'fr', 'FJ': 'en', 'TO': 'en', 'WS': 'en', 'KI': 'en', 'NR': 'en', 'PW': 'en', 'MH': 'en', 'FM': 'en', 'MP': 'en', 'GU': 'en', 'PR': 'es', 'VI': 'en', 'UM': 'en'
};

// Function to get user's location using geolocation
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        });
    });
}

// Function to reverse geocode using OpenStreetMap Nominatim
async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return null;
    }
}

// Function to detect and set default settings
async function detectAndSetDefaults() {
    try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;
        const geoData = await reverseGeocode(latitude, longitude);

        if (geoData && geoData.address) {
            const countryCode = geoData.address.country_code?.toUpperCase();
            if (countryCode) {
                const regionSelect = document.getElementById('region');
                const currencySelect = document.getElementById('currency');
                const languageSelect = document.getElementById('language');

                // Set region
                regionSelect.value = countryCode;

                // Set currency based on country
                const currency = currencyMap[countryCode] || 'USD';
                currencySelect.value = currency;

                // Set language based on country
                const language = languageMap[countryCode] || navigator.language.split('-')[0] || 'en';
                languageSelect.value = language;

                console.log(`Detected location: ${geoData.address.country}, Region: ${countryCode}, Currency: ${currency}, Language: ${language}`);
            }
        }
    } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to browser language
        const language = navigator.language.split('-')[0] || 'en';
        document.getElementById('language').value = language;
        document.getElementById('region').value = 'US'; // Default to US
        document.getElementById('currency').value = 'USD'; // Default to USD
    }
}

// Function to load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
    document.getElementById('region').value = settings.region || '';
    document.getElementById('currency').value = settings.currency || '';
    document.getElementById('language').value = settings.language || '';
}

// Function to save settings to localStorage
function saveSettings() {
    const region = document.getElementById('region').value;
    const currency = document.getElementById('currency').value;
    const language = document.getElementById('language').value;

    const settings = { region, currency, language };
    localStorage.setItem('userSettings', JSON.stringify(settings));

    alert('Settings saved successfully!');
}

// Event listener for save button
document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

// Load settings or detect defaults on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        loadSettings();
    } else {
        detectAndSetDefaults();
    }
});
