const express = require('express');
const router = express.Router();

// Report Form
router.get('/', (req, res) => {
    res.render('solutions');
});

module.exports = router;