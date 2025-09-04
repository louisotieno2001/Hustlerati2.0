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

// Report Form
router.get('/', async (req, res) => {
    // const realEstate = await getRealEstate();
    // console.log("Results of real estate fetch", realEstate);
    res.render('real_estate');
});

module.exports = router;