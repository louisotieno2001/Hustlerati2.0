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

// POST route to handle adding product to order/cart
router.post('/', async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Something went wrong, please try again' });
        }

        // Assuming orders collection exists in Directus
        const orderData = {
            product_id: productId,
            quantity: quantity,
            status: 'pending', // or 'in_cart'
            date_created: new Date().toISOString()
        };

        // console.log(orderData)

        // If user is logged in, add user_id
        if (req.session && req.session.user) {
            orderData.user_id = req.session.user.id;
        }

        const response = await query('/items/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const newOrder = await response.json();
            res.status(201).json({ message: 'Product added to order', order: newOrder.data });
        } else {
            const errorData = await response.json();
            res.status(response.status).json({ error: errorData.errors || 'Failed to add product' });
        }
    } catch (error) {
        console.error('Error adding product to order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH route to update order quantity
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Valid quantity is required' });
        }

        const response = await query(`/items/orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity })
        });

        if (response.ok) {
            const updatedOrder = await response.json();
            res.status(200).json({ message: 'Order updated', order: updatedOrder.data });
        } else {
            const errorData = await response.json();
            res.status(response.status).json({ error: errorData.errors || 'Failed to update order' });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await query(`/items/orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'cancelled' })
        });

        if (response.ok) {
            const updatedOrder = await response.json();
            res.status(200).json({ message: 'Order cancelled', order: updatedOrder.data });
        } else {
            const errorData = await response.json();
            res.status(response.status).json({ error: errorData.errors || 'Failed to cancel order' });
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route to remove order
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await query(`/items/orders/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            res.status(200).json({ message: 'Order removed' });
        } else {
            const errorData = await response.json();
            res.status(response.status).json({ error: errorData.errors || 'Failed to remove order' });
        }
    } catch (error) {
        console.error('Error removing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
