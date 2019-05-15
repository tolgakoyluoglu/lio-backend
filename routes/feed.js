const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Ad = require('../models/Ad');

const resLimit = 1000;

/* Get Feed */
router.get('/', async (req, res) => {
    if (req.user) {
        const profile = await Profile.findOne({ user: req.user.id });

        // Check type, send logged in feed
        switch (profile.type) {
            case 'Student':
                const companies = (await Profile.find({ type: 'Company' }).limit(resLimit / 2).populate('user', ['name']).lean()).map(i => ({ ...i, _itemType: 'profile' }));
                const ads = (await Ad.find().limit(resLimit / 2).lean()).map(i => ({ ...i, _itemType: 'ad' }));

                return res.json({ items: [...ads, ...companies] });
            case 'Company':
                const students = (await Profile.find({ type: 'Student' }).limit(resLimit).populate('user', ['name']).lean()).map(i => ({ ...i, _itemType: 'profile' }));

                return res.json({ items: students });
            default:
                return res.status(500).json({ msg: 'Could not get feed' });
        }
    } else {
        // Send public feed - students, companies, ads
        const profiles = (await Profile.find().limit(resLimit / 2).populate('user', ['name']).lean()).map(i => ({ ...i, _itemType: 'profile' }));
        const ads = (await Ad.find().limit(resLimit / 2).limit(10).lean()).map(i => ({ ...i, _itemType: 'ad' }));

        return res.json({ items: [...profiles, ...ads] });
    }
});

module.exports = router;
