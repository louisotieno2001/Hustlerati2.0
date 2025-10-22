const express = require('express');
const router = express.Router();

// Settings page
router.get('/', (req, res) => {
    const user = req.session.user;
    res.render('settings', { user });
});

module.exports = router;
