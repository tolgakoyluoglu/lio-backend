const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const requireAuth = require('../middleware/requireAuth');

/* Create Ad */
router.post('/', requireAuth, (req, res) => {
    const { title, description, skills, location, endDate } = req.body;

    let ad = new Ad({
        title,
        description,
        skills,
        location,
        endDate,
        user: req.user.id
    }).save((err, ad) => {
        if (err) return res.status(400).json({ msg: 'Invalid data' });

        return res.json(ad);
    });
});

module.exports = router;
