const express = require('express');
const router = express.Router();

// About page
router.get('/', (req, res) => {
    res.render('book_success');
});

module.exports = router;