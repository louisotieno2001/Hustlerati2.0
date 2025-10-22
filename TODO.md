# TODO: Make Settings Page Local

## Tasks
- [x] Update settings.ejs to load and save settings from/to localStorage
- [x] Add automatic detection of region, currency, and language using geolocation and OpenStreetMap Nominatim
- [x] Remove server-side saving logic (fetch to /api/user/settings)
- [ ] Test the functionality

## Details
- On page load, check localStorage for 'userSettings' (object with region, currency, language). If exists, set selects accordingly.
- If no localStorage, attempt geolocation to detect location, reverse geocode with Nominatim to get country, set region to country code, currency based on country, language to navigator.language.
- On save button click, save to localStorage and alert success.
- Remove EJS server-side selected attributes since it's now client-side.
