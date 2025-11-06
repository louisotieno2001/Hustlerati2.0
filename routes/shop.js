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
        // Fetch all products
        const response = await query(`/items/shop`, {
            method: 'GET'
        });

        if (response.ok) {
            const productsData = await response.json();
            const products = productsData.data;

            // For each product, fetch media files
            const productsWithMedia = await Promise.all(products.map(async (product) => {
                const mediaResponse = await query(`/items/shop_files?filter[shop_id][_eq]=${product.id}&fields=directus_files_id`, {
                    method: 'GET'
                });

                if (mediaResponse.ok) {
                    const mediaData = await mediaResponse.json();
                    const fileIds = mediaData.data.map(junction => junction.directus_files_id).filter(Boolean);

                    if (fileIds.length > 0) {
                        const mediaPromises = fileIds.map(async (fileId) => {
                            const fileResponse = await query(`/files/${fileId}`, {
                                method: 'GET'
                            });
                            if (fileResponse.ok) {
                                const fileData = await fileResponse.json();
                                return fileData.data;
                            } else {
                                return null;
                            }
                        });
                        const mediaResults = await Promise.all(mediaPromises);
                        product.media = mediaResults.filter(Boolean);
                    } else {
                        product.media = [];
                    }
                } else {
                    product.media = [];
                }
                return product;
            }));

            return productsWithMedia;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

const directusUrl = process.env.DIRECTUS_URL;

// Shop route
router.get('/', async (req, res) => {
    const products = await getShopItems();
    const user = req.session.user;

    products.forEach(product => {
        if (product.media && product.media.length > 0) {
            // console.log(`Product ${product.name} media array:`, product.media);
            product.media.forEach(media => {
                const id = media.directus_files_id && typeof media.directus_files_id === 'object' && media.directus_files_id.id
                    ? media.directus_files_id.id
                    : media.directus_files_id;
                const url = media.directus_files_id && media.directus_files_id.data && media.directus_files_id.data.url
                    ? (media.directus_files_id.data.url.startsWith('http') ? media.directus_files_id.data.url : directusUrl + media.directus_files_id.data.url)
                    : `/assets/${id || media.id}`;
                // console.log(`Product ${product.name} media URL: ${url}`);
            });
        } else {
            // console.log(`Product ${product.name} has no media`);
        }
    });

    // console.log('Products fetched for shop route:', JSON.stringify(products, null, 2));

    res.render('shop', { products, user, directusUrl });
});

// Product details route
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    const user = req.session.user;
    try {
        const response = await query(`/items/shop/${productId}?fields=*,media.*`, {
            method: 'GET'
        });

        if (response.ok) {
            const productData = await response.json();
            const product = productData.data;

            if (product.media && product.media.length > 0) {
                product.media.forEach(media => {
                    const id = media.directus_files_id && typeof media.directus_files_id === 'object' && media.directus_files_id.id
                        ? media.directus_files_id.id
                        : media.directus_files_id;
                    const url = media.directus_files_id && media.directus_files_id.data && media.directus_files_id.data.url
                        ? (media.directus_files_id.data.url.startsWith('http') ? media.directus_files_id.data.url : directusUrl + media.directus_files_id.data.url)
                        : `/assets/${id || media.id}`;
                    media.url = url; // Ensure the url is set on the media object
                });
            }

            res.render('product', { product: product, user });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
