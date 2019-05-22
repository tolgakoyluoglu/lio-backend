const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const Profile = require('../models/Profile');
const requireAuth = require('../middleware/requireAuth');

/* Create Ad */
router.post('/', requireAuth, async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id });

    if (profile.type !== 'Company') {
        return res.status(401).json({ msg: 'Invalid user type' });
    }

    const { title, description, skills, location, endDate } = req.body;

    let ad = new Ad({
        title,
        description,
        skills,
        location,
        endDate,
        profile
    }).save((err, ad) => {
        if (err) return res.status(400).json({ msg: 'Invalid data' });

        return res.status(201).json(ad);
    });
});

/* Get Ad */
router.get('/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate('profile', ['name']).lean();

        return res.json({ ad });
    } catch (e) {
        return res.status(400).json({ msg: 'Invalid id' });
    }
});

module.exports = router;
