const express = require('express');
const router = express.Router();

// Query function for Directus API
const url = process.env.DIRECTUS_URL;
const accessToken = process.env.DIRECTUS_TOKEN;

async function query(path, config) {
    try {
        const res = await fetch(encodeURI(`${url}${path}`), {
            headers:
            {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            ...config
        });
        return res;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw new Error('Database connection failed.');
    }
}

// Utility functions for normalization
function toSlug(value) {
    return (value || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function normalizeToArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) { /* ignore */ }
        return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
}

function normalizeProperty(item) {
    const normalized = {
        id: item.id,
        price: Number(item.price) || 0,
        size: Number(item.size) || 0,
        title: item.title || 'Untitled',
        media: null
    };

    // Handle media normalization separately
    if (item.media) {
        if (typeof item.media === 'object' && item.media !== null) {
            if (item.media.full_url || item.media.id) {
                normalized.media = {
                    id: item.media.id,
                    url: item.media.full_url ? `${url}${item.media.full_url}` : null,
                    filename_disk: item.media.filename_disk,
                    filename_download: item.media.filename_download,
                    type: item.media.type,
                    width: item.media.width,
                    height: item.media.height
                };
            }
        } else if (typeof item.media === 'string' && item.media.length > 0) {
            normalized.media = { id: item.media };
        }
    }

    // Combine normalized data with additional fields
    return {
        ...normalized,
        type: (item.property_type || item.type || '').toString().toLowerCase(),
        location: item.location || '',
        city: toSlug(item.city || item.location || ''),
        spaceType: (item.space_type || item.spaceType || '').toString().toLowerCase(),
        amenities: normalizeToArray(item.amenities),
        leaseTerms: (item.lease_terms || item.leaseTerms || '').toString().toLowerCase(),
        availability: (item.availability || '').toString().toLowerCase(),
        businessSize: normalizeToArray(item.business_size || item.businessSize),
        description: item.description || '',
        badge: item.badge || '',
        booking_type: item.booking_type || '',
        // Keep original fields for details page
        property_type: item.property_type,
        space_type: item.space_type,
        lease_terms: item.lease_terms,
        business_size: item.business_size
    };
}

async function getRealEstate() {
    try {
        const response = await query(`/items/real_estates?filter[feature_this_estate][_eq]=true&fields=*,media.*`, {
            method: 'GET'
        });

        if (response.ok) {
            const realEstateData = await response.json();
            return realEstateData.data;
        } else {
            throw new Error('Failed to fetch real estate');
        }
    } catch (error) {
        console.error('Error fetching real estate:', error);
        throw error;
    }
}

// Get all real estate listings
router.get('/', async (req, res) => {
    const realEstates = await getRealEstate();
    const properties = realEstates.map(normalizeProperty);
    // console.log("Results of real estate fetch", properties);
    res.render('real_estate', { properties });
});

// Get individual property details
router.get('/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;
        const response = await query(`/items/real_estates/${propertyId}?fields=*,media.*`);

        if (!response.ok) {
            throw new Error('Failed to fetch property');
        }

        const propertyData = await response.json();
        const propertyRaw = propertyData.data;

        if (!propertyRaw) {
            return res.status(404).render('real_estate_details', {
                property: null,
                error: 'Property not found'
            });
        }

        const property = normalizeProperty(propertyRaw);
        // Pass the property data to the client for JavaScript usage
        const propertyDataJson = JSON.stringify(property);
        res.render('real_estate_details', {
            property,
            propertyData: propertyDataJson,
            error: null
        });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).render('real_estate_details', {
            property: null,
            error: 'Failed to load property details'
        });
    }
});

module.exports = router;