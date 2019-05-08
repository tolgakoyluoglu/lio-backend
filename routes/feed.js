const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

/* Get Feed */
router.get('/', async (req, res) => {
    if (req.user) {
        Profile.findById(req.user.id)
            .then(profile => {
                if (profile) {
                    // Check type, send logged in feed
                    switch (profile.type) {
                        case 'Student':
                            // Send list of companies and ads
                            break;
                        case 'Company':
                            // Send list of students
                            break;
                    }
                }
            })
            .catch(e => res.status(500).json({ msg: 'Could not get feed' }));
    } else {
        // Send public feed, users and companies?
        const profiles = await Profile.find().populate('user', ['name']);

        return res.json({ profiles });
    }
});

module.exports = router;
