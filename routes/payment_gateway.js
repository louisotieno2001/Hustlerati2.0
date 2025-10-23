const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = process.env.DIRECTUS_URL;
const accessToken = process.env.DIRECTUS_TOKEN;

// Query function to directus API endpoints
async function query(path, config) {
    try {
        const res = await fetch(encodeURI(`${url}${path}`), {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            ...config
        });
        return res;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw new Error('Database connection failed.')
    }
}

// M-Pesa API base URLs
const BASE_URL_SANDBOX = 'https://sandbox.safaricom.co.ke';
const BASE_URL_PRODUCTION = 'https://api.safaricom.co.ke';

// Get base URL based on environment
function getBaseUrl() {
    const env = process.env.MPESA_ENVIRONMENT || 'sandbox';
    return env === 'production' ? BASE_URL_PRODUCTION : BASE_URL_SANDBOX;
}

// Generate access token
async function getAccessToken() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios.get(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw new Error('Failed to get M-Pesa access token');
    }
}

// Generate timestamp
function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
}

// Generate password
function generatePassword(shortcode, passkey, timestamp) {
    const password = `${shortcode}${passkey}${timestamp}`;
    return Buffer.from(password).toString('base64');
}

// Initiate STK Push
async function initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
        // Format phone number: remove + if present
        if (phoneNumber.startsWith('+')) {
            phoneNumber = phoneNumber.substring(1);
        }

        const accessToken = await getAccessToken();
        const timestamp = generateTimestamp();
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const password = generatePassword(shortcode, passkey, timestamp);

        const payload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: shortcode,
            PhoneNumber: phoneNumber,
            CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc
        };

        const response = await axios.post(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error.response?.data || error.message);
        throw new Error('Failed to initiate STK Push');
    }
}

// M-Pesa callback handler
router.post('/callback', async (req, res) => {
    try {
        const callbackData = req.body;
        console.log('M-Pesa Callback:', JSON.stringify(callbackData, null, 2));

        // Check if payment was successful
        if (callbackData.Body && callbackData.Body.stkCallback) {
            const stkCallback = callbackData.Body.stkCallback;
            const resultCode = stkCallback.ResultCode;
            const checkoutRequestId = stkCallback.CheckoutRequestID;

            if (resultCode === 0) {
                // Payment successful
                const callbackMetadata = stkCallback.CallbackMetadata.Item;
                const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber').Value;
                const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate').Value;
                const phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber').Value;
                const amount = callbackMetadata.find(item => item.Name === 'Amount').Value;

                // Verify the checkoutRequestId against stored session
                const storedCheckoutRequestId = req.session.mpesaCheckoutRequestId;
                if (checkoutRequestId !== storedCheckoutRequestId) {
                    console.log('Invalid CheckoutRequestID');
                    return res.json({ ResultCode: 0, ResultDesc: 'Invalid CheckoutRequestID' });
                }

                // Retrieve pending payment details
                const pendingPayment = req.session.pendingPayment;
                if (!pendingPayment) {
                    console.log('No pending payment found');
                    return res.json({ ResultCode: 0, ResultDesc: 'No pending payment found' });
                }

                console.log(`Payment successful: Receipt ${mpesaReceiptNumber}, Amount: ${amount}`);

                // TODO: Complete the order processing here
                // This would involve updating orders to 'complete', subtracting units from shop, etc.
                // For now, we'll mark the payment as completed in session
                req.session.paymentCompleted = true;
                req.session.completedPayment = {
                    receiptNumber: mpesaReceiptNumber,
                    amount,
                    transactionDate,
                    phoneNumber
                };

                // Clear pending payment
                delete req.session.pendingPayment;
                delete req.session.mpesaCheckoutRequestId;
                
            } else {
                // Payment failed
                console.log(`Payment failed with result code: ${resultCode}`);
                // Mark payment as failed in session
                req.session.paymentFailed = true;
                // Clear pending payment
                delete req.session.pendingPayment;
                delete req.session.mpesaCheckoutRequestId;
            }
        }

        // Always respond with success to acknowledge receipt
        res.json({ ResultCode: 0, ResultDesc: 'Callback received successfully' });
    } catch (error) {
        console.error('Error processing M-Pesa callback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initiate M-Pesa payment
router.post('/initiate-mpesa', async (req, res) => {
    try {
        const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

        if (!phoneNumber || !amount || !accountReference) {
            return res.status(400).json({ error: 'Missing required fields: phoneNumber, amount, accountReference' });
        }

        const stkPushResponse = await initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc || 'Payment for order');

        // Store the CheckoutRequestID in session or database for verification in callback
        // For now, we'll store it in session (in production, use database)
        req.session.mpesaCheckoutRequestId = stkPushResponse.CheckoutRequestID;
        req.session.pendingPayment = {
            checkoutRequestId: stkPushResponse.CheckoutRequestID,
            amount,
            accountReference,
            phoneNumber
        };

        res.json({
            success: true,
            checkoutRequestId: stkPushResponse.CheckoutRequestID,
            responseCode: stkPushResponse.ResponseCode,
            responseDescription: stkPushResponse.ResponseDescription,
            customerMessage: stkPushResponse.CustomerMessage
        });
    } catch (error) {
        console.error('Error initiating M-Pesa payment:', error);
        res.status(500).json({ error: 'Failed to initiate M-Pesa payment' });
    }
});

// Check payment status (for polling from client)
router.get('/payment-status', (req, res) => {
    const paymentCompleted = req.session.paymentCompleted;
    const paymentFailed = req.session.paymentFailed;

    if (paymentCompleted) {
        res.json({ completed: true, payment: req.session.completedPayment });
        // Clear the completed payment after sending
        delete req.session.paymentCompleted;
        delete req.session.completedPayment;
    } else if (paymentFailed) {
        res.json({ failed: true });
        delete req.session.paymentFailed;
    } else {
        res.json({ pending: true });
    }
});

// Payment success page
router.get('/success', (req, res) => {
    res.render('payment-success', {
        title: 'Payment Successful',
        message: 'Your payment has been processed successfully. Thank you for your purchase!'
    });
});

module.exports = router;
