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
    const priceNum = Number(item.price);
    const sizeNum = Number(item.size);
    const title = item.title || 'Untitled';
    const imageHtml = item.images
        ? `<img src="/assets/${item.images}" alt="${title.replace(/"/g, '"')}"/>`
        : '🏢';
    return {
        id: item.id,
        title: title,
        type: (item.property_type || item.type || '').toString().toLowerCase(),
        price: Number.isFinite(priceNum) ? priceNum : 0,
        size: Number.isFinite(sizeNum) ? sizeNum : 0,
        location: item.location || '',
        city: toSlug(item.city || item.location || ''),
        spaceType: (item.space_type || item.spaceType || '').toString().toLowerCase(),
        amenities: normalizeToArray(item.amenities),
        leaseTerms: (item.lease_terms || item.leaseTerms || '').toString().toLowerCase(),
        availability: (item.availability || '').toString().toLowerCase(),
        businessSize: normalizeToArray(item.business_size || item.businessSize),
        description: item.description || '',
        image: imageHtml,
        badge: item.badge || '',
        property_type: item.property_type,
        space_type: item.space_type,
        lease_terms: item.lease_terms,
        business_size: item.business_size,
        whatsapp_link: item.whatsapp_link,
        currency: item.currency,
    };
}

async function getRealEstate() {
    try {
        const response = await query(`/items/real_estates`, {
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

// Middleware to check authentication
const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Individual Booking Form
router.get('/:id', checkAuth, async (req, res) => {
    try {
        const propertyId = req.params.id;
        const realEstates = await getRealEstate();

        // Find the property by UUID
        const propertyRaw = realEstates.find(p => p.id === propertyId);

        if (!propertyRaw) {
            return res.redirect('/real_estate');
        }

        const property = normalizeProperty(propertyRaw);
        const userId = req.session.user.id;

        res.render('individual_booking', { property, userId });
    } catch (error) {
        console.error('Error fetching property for individual booking:', error);
        res.redirect('/real_estate');
    }
});

module.exports = router;
