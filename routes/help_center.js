const express = require('express');
const router = express.Router();

// GET Help Center page
router.get('/', (req, res) => {
    res.render('help_center');
});

// POST Contact Us form submission
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).send('Please fill in all required fields.');
    }

    // Here you would typically handle the form submission,
    // e.g., send an email, save to database, etc.
    // For now, just send a success response.

    res.status(200).send('Thank you for contacting us. We will get back to you shortly.');
});

module.exports = router;
