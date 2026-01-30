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
        // Keep original fields for details page
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

// Group Booking Form
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

        res.render('group_booking', { property, userId });
    } catch (error) {
        console.error('Error fetching property for group booking:', error);
        res.redirect('/real_estate');
    }
});

// Handle Group Booking Submission
router.post('/', checkAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const {
            type,
            propertyId,
            propertyName,
            propertyLocation,
            propertyPrice,
            propertyDescription,
            price,
            currency,
            paymentMethod,
            cardNumber,
            expiryDate,
            cvv,
            cardName,
            paypalEmail,
            bitcoinAddress,
            mpesaPhone
        } = req.body;

        // Validate required fields
        if (!propertyId || !price || !currency || !paymentMethod) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate payment method specific fields
        switch (paymentMethod) {
            case 'card':
                if (!cardNumber || !expiryDate || !cvv || !cardName) {
                    return res.status(400).json({ error: 'Card details are required' });
                }
                break;
            case 'paypal':
                if (!paypalEmail) {
                    return res.status(400).json({ error: 'PayPal email is required' });
                }
                break;
            case 'bitcoin':
                if (!bitcoinAddress) {
                    return res.status(400).json({ error: 'Bitcoin address is required' });
                }
                break;
            case 'mpesa':
                if (!mpesaPhone) {
                    return res.status(400).json({ error: 'M-Pesa phone number is required' });
                }
                break;
            default:
                return res.status(400).json({ error: 'Invalid payment method' });
        }

        // For M-Pesa, payment should already be completed via the frontend polling
        // Here we just need to create the booking record
        const bookingData = {
            user_id: userId,
            property_id: propertyId,
            type: type || 'group',
            contribution_amount: price,
            currency: currency,
            payment_method: paymentMethod,
            status: 'confirmed', // Assuming payment is successful for non-Mpesa or already verified for Mpesa
            created_at: new Date().toISOString(),
            property_name: propertyName,
            property_location: propertyLocation,
            property_price: propertyPrice,
            property_description: propertyDescription
        };

        // Add payment-specific data
        if (paymentMethod === 'card') {
            bookingData.card_last_four = cardNumber.slice(-4);
            bookingData.card_name = cardName;
        } else if (paymentMethod === 'paypal') {
            bookingData.paypal_email = paypalEmail;
        } else if (paymentMethod === 'bitcoin') {
            bookingData.bitcoin_address = bitcoinAddress;
        } else if (paymentMethod === 'mpesa') {
            bookingData.mpesa_phone = mpesaPhone;
        }

        // Save booking to database
        const response = await query('/items/group_bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating group booking:', errorData);
            return res.status(500).json({ error: 'Failed to create booking' });
        }

        const bookingResult = await response.json();

        // Redirect to success page or return success response
        res.json({
            success: true,
            bookingId: bookingResult.data.id,
            message: 'Group booking created successfully'
        });

    } catch (error) {
        console.error('Error processing group booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
