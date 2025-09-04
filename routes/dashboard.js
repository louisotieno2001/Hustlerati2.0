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

// Dashboard route with session check
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const user = req.session.user;

    try {
        // Fetch user's listed spaces
        const response = await query(`/items/real_estates?filter[contact_email][_eq]=${encodeURIComponent(user.email)}`);
        let listedSpaces = 0;
        let spaces = [];
        if (response.ok) {
            const data = await response.json();
            listedSpaces = data.data.length;
            spaces = data.data;
        }

        // For now, keep other stats hardcoded or set to 0
        const activeBookings = 0; // TODO: Fetch from bookings collection if exists
        const monthlyRevenue = 0; // TODO: Calculate from spaces or bookings
        const averageRating = 0; // TODO: Fetch from ratings

        res.render('dashboard', { user, listedSpaces, activeBookings, monthlyRevenue, averageRating, spaces });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.render('dashboard', { user, listedSpaces: 0, activeBookings: 0, monthlyRevenue: 0, averageRating: 0, spaces: [] });
    }
});

module.exports = router;