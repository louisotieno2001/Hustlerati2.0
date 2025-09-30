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

async function getProductDetails(productId) {
    try {
        const response = await query(`/items/shop/${productId}`, {
            method: 'GET'
        });

        if (response.ok) {
            const productData = await response.json();
            const product = productData.data;

            // console.log(product)
            // Fetch media from shop_files
            const mediaResponse = await query(`/items/shop_files?filter[shop_id][_eq]=${productId}&fields=directus_files_id`, {
                method: 'GET'
            });

            if (mediaResponse.ok) {
                const mediaData = await mediaResponse.json();
                const fileIds = mediaData.data.map(junction => junction.directus_files_id).filter(Boolean);
                if (fileIds.length > 0) {
                    // Fetch each file individually using /files/{id} endpoint
                    const mediaPromises = fileIds.map(async (fileId) => {
                        const fileResponse = await query(`/files/${fileId}`, {
                            method: 'GET'
                        });
                        if (fileResponse.ok) {
                            const fileData = await fileResponse.json();
                            return fileData.data;
                        } else {
                            // console.log(`Failed to fetch file ${fileId}:`, fileResponse.status, fileResponse.statusText);
                            return null;
                        }
                    });
                    const mediaResults = await Promise.all(mediaPromises);
                    product.media = mediaResults.filter(Boolean);
                    // console.log('product.media after fetching files:', product.media);
                } else {
                    product.media = [];
                }
            } else {
                product.media = [];
            }
            return product;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

async function getShopDetails(shopId) {
    try {
        const response = await query(`/items/real_estates/${shopId}`, {
            method: 'GET'
        });

        if (response.ok) {
            const shopData = await response.json();
            return shopData.data;
        } else {
            throw new Error('Failed to fetch shop details');
        }
    } catch (error) {
        console.error('Error fetching shop details:', error);
        return null;
    }
}

async function getOrders(userId) {
    try {
        const filter = `filter[user_id][_eq]=${userId}`;
        const response = await query(`/items/orders?${filter}`, {
            method: 'GET'
        });

        if (response.ok) {
            const ordersData = await response.json();
            // Fetch product details for each order
            const ordersWithProducts = await Promise.all(
                ordersData.data.map(async (order) => {
                    const product = await getProductDetails(order.product_id);
                    let shop = null;
                    if (product && product.shop_id) {
                        shop = await getShopDetails(product.shop_id);
                    }
                    return {
                        ...order,
                        product: product,
                        shop: shop
                    };
                })
            );
            return ordersWithProducts;
        } else {
            throw new Error('Failed to fetch orders');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
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
    const orders = await getOrders(user.id);

    // console.log(orders)

    res.render('dashboard', { user, activeBookings, monthlyRevenue, averageRating, listedSpaces, orders });
});

// Update preferences route
router.post('/update-preferences', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.session.user.id;
    const { theme, dark_theme, email_verifications } = req.body;

    try {
        // Get current user preferences
        const userResponse = await query(`/items/users/${userId}?fields=preferences`, {
            method: 'GET'
        });
        if (!userResponse.ok) {
            return res.status(500).json({ error: 'Failed to fetch user preferences' });
        }

        const userData = await userResponse.json();
        const currentPrefs = userData.data.preferences || {};

        // Update preferences
        const updatedPrefs = { ...currentPrefs };
        if (theme !== undefined) updatedPrefs.theme = theme;
        if (dark_theme !== undefined) updatedPrefs.dark_theme = dark_theme;
        if (email_verifications !== undefined) updatedPrefs.email_verifications = email_verifications;

        // Update user
        const updateResponse = await query(`/items/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ preferences: updatedPrefs })
        });

        if (updateResponse.ok) {
            // Update session
            req.session.user.preferences = updatedPrefs;
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to update preferences' });
        }
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
