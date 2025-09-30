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

async function getShopItems() {
    try {
        const response = await query(`/items/shop?fields=*,media.*`, {
            method: 'GET'
        });

        if (response.ok) {
            const shopData = await response.json();
            return shopData.data;
        } else {
            throw new Error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Shop route
router.get('/', async(req, res) => {
    const products = await getShopItems();
    const user = req.session.user;

    // console.log(products)

    res.render('shop', { products, user });
});

// Product details route
router.get('/:id', async(req, res) => {
    const productId = req.params.id;
    const user = req.session.user;
    try {
        const response = await query(`/items/shop/${productId}?fields=*,media.*`, {
            method: 'GET'
        });

        if (response.ok) {
            const product = await response.json();
            res.render('product', { product: product.data, user });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
