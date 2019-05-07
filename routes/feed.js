const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');

/* Get Feed */
router.get('/', async (req, res) => {
    if (req.auth) {
        Profile.findById(req.auth.id)
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
            .catch(e => res.json({ msg: 'Could not get feed' }));
    } else {
        // Send public feed, users and companies?
        const users = await User.find();

        return res.json({ users });
    }
});

module.exports = router;
