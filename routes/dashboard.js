const express = require('express');
const router = express.Router();

// Directus API configuration
const url = process.env.DIRECTUS_URL;
const accessToken = process.env.DIRECTUS_TOKEN;

// Query function for Directus API
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


async function getRealEstates(userId) {
    try {
        const response = await query(`/items/real_estates?filter[user_id][_eq]=${userId}`, {
            method: 'GET'
        });

        if (response.ok) {
            const estateData = await response.json();
            return estateData.data;
        } else {
            throw new Error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

async function getBookings(userId) {
    try {
        const response = await query(`/items/bookings?filter[user_id][_eq]=${userId}`, {
            method: 'GET'
        });

        if (response.ok) {
            const estateData = await response.json();
            return estateData.data;
        } else {
            throw new Error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Dashboard route with session check
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const user = req.session.user;
    // For now, keep other stats hardcoded or set to 0
    const monthlyRevenue = 0; 
    const averageRating = 0; 
    const activeBookings = await getBookings(user.id)
    const listedSpaces = await getRealEstates(user.id);


    res.render('dashboard', { user, activeBookings, monthlyRevenue, averageRating, listedSpaces });
});

module.exports = router;