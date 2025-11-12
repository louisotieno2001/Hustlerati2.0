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

async function getPendingOrders(userId = null) {
    try {
        let filter = 'filter[status][_eq]=pending';
        if (userId) {
            filter += `&filter[user_id][_eq]=${userId}`;
        }
        const response = await query(`/items/orders?${filter}`, {
            method: 'GET'
        });

        if (response.ok) {
            const ordersData = await response.json();
            return ordersData.data;
        } else {
            throw new Error('Failed to fetch orders');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

async function getProductDetails(productId) {
    try {
        // Fetch the product
        const productResponse = await query(`/items/shop/${productId}`, {
            method: 'GET'
        });

        if (!productResponse.ok) {
            return null;
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

        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function getRealEstates() {
    try {
        const response = await query('/items/real_estates', {
            method: 'GET'
        });

        if (response.ok) {
            const estatesData = await response.json();
            return estatesData.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching real estates:', error);
        return [];
    }
}

// Cart route
router.get('/', async (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.id : null;
        const pendingOrders = await getPendingOrders(userId);
        const realEstates = await getRealEstates();
        // console.log("Real Estates:", realEstates);

        // Fetch product details for each order
        const ordersWithProducts = await Promise.all(
            pendingOrders.map(async (order) => {
                const product = await getProductDetails(order.product_id);
                return {
                    ...order,
                    product: product
                };
            })
        );

        // Calculate total quantity and total price
        let totalQuantity = 0;
        let total = 0;

        ordersWithProducts.forEach(order => {
            const quantity = parseInt(order.quantity) || 1;
            const price = order.product ? (order.product.price || 0) : 0;
            totalQuantity += quantity;
            total += price * quantity;
        });

        res.render('cart', { orders: ordersWithProducts, realEstates: realEstates, totalQuantity, total });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.render('cart', { orders: [], realEstates: [], totalQuantity: 0, total: 0 });
    }
});

// Checkout route
router.post('/checkout', async (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.id : null;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { orderIds, total, paymentMethod, deliveryLocation, mapLocation, deliveryAddress } = req.body;

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ error: 'No orders to checkout' });
        }

        // Verify orders belong to user and are pending
        const filter = `filter[id][_in]=${orderIds.join(',')}&filter[user_id][_eq]=${userId}&filter[status][_eq]=pending`;
        const verifyResponse = await query(`/items/orders?${filter}`, { method: 'GET' });

        if (!verifyResponse.ok) {
            return res.status(500).json({ error: 'Failed to verify orders' });
        }

        const verifiedOrders = await verifyResponse.json();
        if (verifiedOrders.data.length !== orderIds.length) {
            return res.status(400).json({ error: 'Some orders are invalid or not pending' });
        }

        // Group orders by product_id and sum quantities
        const productUpdates = {};
        verifiedOrders.data.forEach(order => {
            const productId = order.product_id;
            const quantity = parseInt(order.quantity) || 1;
            if (!productUpdates[productId]) {
                productUpdates[productId] = 0;
            }
            productUpdates[productId] += quantity;
        });

        // Update product units
        const productUpdatePromises = Object.entries(productUpdates).map(async ([productId, totalQuantity]) => {
            const productResponse = await query(`/items/shop/${productId}`, { method: 'GET' });
            if (!productResponse.ok) {
                throw new Error(`Failed to fetch product ${productId}`);
            }
            const product = await productResponse.json();
            const currentUnits = product.data.units || 0;
            const newUnits = Math.max(0, currentUnits - totalQuantity);
            const patchProductResponse = await query(`/items/shop/${productId}`, {
                method: 'PATCH',
                body: JSON.stringify({ units: newUnits })
            });
            if (!patchProductResponse.ok) {
                throw new Error(`Failed to update product ${productId} units`);
            }
        });

        await Promise.all(productUpdatePromises);

        // Update each order
        const updatePromises = verifiedOrders.data.map(async (order) => {
            const product = await getProductDetails(order.product_id);
            if (!product) {
                throw new Error(`Product not found for order ${order.id}`);
            }

            const quantity = order.quantity || 1;
            const price = product.price || 0;
            const subtotal = price * quantity;

            const updates = {
                status: 'paid',
                amount_paid: subtotal,
                payment_method: paymentMethod,
                delivery_location: deliveryLocation,
                map_location: mapLocation,
                delivery_address: deliveryAddress
            };

            const patchResponse = await query(`/items/orders/${order.id}`, {
                method: 'PATCH',
                body: JSON.stringify(updates)
            });

            if (!patchResponse.ok) {
                const errorBody = await patchResponse.text();
                console.error(`Failed to update order ${order.id}: Status ${patchResponse.status}, Body: ${errorBody}`);
                console.error('Updates attempted:', updates);
                throw new Error(`Failed to update order ${order.id}`);
            }

            return patchResponse.json();
        });

        await Promise.all(updatePromises);

        res.json({ success: true });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: error.message || 'Checkout failed' });
    }
});

// Route to get cart count
router.get('/count', async (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.id : null;
        if (!userId) {
            return res.json({ count: 0 });
        }

        const pendingOrders = await getPendingOrders(userId);

        let totalQuantity = 0;
        pendingOrders.forEach(order => {
            totalQuantity += parseInt(order.quantity) || 1;
        });

        res.json({ count: totalQuantity });
    } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({ error: 'Failed to get cart count' });
    }
});

module.exports = router;
