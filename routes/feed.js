const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Ad = require('../models/Ad');

/* Get Feed */
router.get('/', async (req, res) => {
    if (req.user) {
        const profile = await Profile.findOne({ user: req.user.id });

        // Check type, send logged in feed
        switch (profile.type) {
            case 'Student':
                const companies = await Profile.find({ type: 'Company' }).populate('user', ['name']);
                const ads = await Ad.find();

                return res.json({ ads, profiles: companies });
            case 'Company':
                const students = await Profile.find({ type: 'Student' }).populate('user', ['name']);

                return res.json({ profiles: students });
            default:
                return res.status(500).json({ msg: 'Could not get feed' });
        }
    } else {
        // Send public feed - students, companies, ads
        const profiles = await Profile.find().populate('user', ['name']);
        const ads = await Ad.find();

        return res.json({ profiles, ads });
    }
});

module.exports = router;
