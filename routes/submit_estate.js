const express = require('express');
const router = express.Router();

// GET route - Display the form
router.get('/', (req, res) => {
    res.render('submit_estate');
});

module.exports = router