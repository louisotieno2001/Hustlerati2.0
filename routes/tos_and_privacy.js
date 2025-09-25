const express = require('express');
const router = express.Router();

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

async function getTosAndPrivacy() {
    try {
        const response = await query(`/items/tos_and_privacy`, {
            method: 'GET'
        });

        if (response.ok) {
            const tosAndPrivacyData = await response.json();
            return tosAndPrivacyData.data;
        } else {
            throw new Error('Failed to fetch tos and privacy');
        }
    } catch (error) {
        console.error('Error fetching tos and privacy:', error);
        throw error;
    }
}

router.get('/', async (req, res) => {
    try {
        const tosAndPrivacy = await getTosAndPrivacy();

        console.log("Results of privacy fetch", tosAndPrivacy);

        // Since the API returns an array, we need to get the first item
        const tosAndPrivacyData = tosAndPrivacy && tosAndPrivacy.length > 0 ? tosAndPrivacy[0] : null;

        if (!tosAndPrivacyData) {
            throw new Error('No Terms of Service and Privacy Policy data found');
        }

        res.render('tos_and_privacy', { tosAndPrivacy: tosAndPrivacyData });
    } catch (error) {
        console.error('Error in tos_and_privacy route:', error);
        res.status(500).render('tos_and_privacy', {
            tosAndPrivacy: {
                tos: '<p>Error loading Terms of Service. Please try again later.</p>',
                privacy: '<p>Error loading Privacy Policy. Please try again later.</p>',
                tos_last_updated: 'N/A',
                privacy_last_updated: 'N/A'
            }
        });
    }
});

module.exports = router;