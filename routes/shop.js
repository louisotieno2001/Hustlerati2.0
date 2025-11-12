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
                    // console.log(`Product ${product.id} fileIds:`, fileIds);

                    if (fileIds.length > 0) {
                        const mediaPromises = fileIds.map(async (fileId) => {
                            const fileResponse = await query(`/files/${fileId}`, {
                                method: 'GET'
                            });
                            if (fileResponse.ok) {
                                const fileData = await fileResponse.json();
                                const file = fileData.data;
                                // Set the URL for the file
                                file.url = `/shop/proxy/assets/${fileId}`;
                                // console.log(`File data for ${fileId}:`, file);
                                return file;
                            } else {
                                console.log(`Failed to fetch file ${fileId}`);
                                return null;
                            }
                        });
                        const mediaResults = await Promise.all(mediaPromises);
                        product.media = mediaResults.filter(Boolean);
                        // console.log(`Product ${product.id} media:`, product.media);
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
            // Media is already set with URLs in the getShopItems function
            // console.log(`Product ${product.name} media:`, product.media);
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
        // Fetch the product
        const productResponse = await query(`/items/shop/${productId}`, {
            method: 'GET'
        });

        if (!productResponse.ok) {
            return res.status(404).send('Product not found');
        }

        const productData = await productResponse.json();
        const product = productData.data;

        // Fetch media files from shop_files
        const mediaResponse = await query(`/items/shop_files?filter[shop_id][_eq]=${productId}&fields=directus_files_id`, {
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
                        const file = fileData.data;
                        file.url = `/shop/proxy/assets/${fileId}`;
                        return file;
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

        res.render('product', { product: product, user });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal server error');
    }
});

// Proxy route for assets to handle authentication
router.get('/proxy/assets/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await query(`/assets/${id}`, { method: 'GET' });

        if (response.ok) {
            const buffer = await response.arrayBuffer();
            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            res.set('Content-Type', contentType);
            res.send(Buffer.from(buffer));
        } else {
            res.status(response.status).send('Asset not found');
        }
    } catch (error) {
        console.error('Error proxying asset:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
