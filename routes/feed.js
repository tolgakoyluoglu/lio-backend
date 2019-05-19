const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Ad = require('../models/Ad');

const resLimit = 1000;

/* Get Feed */
router.get('/', async (req, res) => {
    let conditions = { query: req.query.query || '' };

    if (req.user) {
        const profile = await Profile.findOne({ user: req.user.id });

        // Check type, send logged in feed
        switch (profile.type) {
            case 'Student':
                const companies = (await Profile.find({
                    type: 'Company',
                    name: { $regex: '.*' + conditions.query + '.*', $options: 'i' }
                })
                    .limit(resLimit / 2)
                    .lean())
                    .map(i => ({ ...i, _itemType: 'profile' }));

                const ads = (await Ad.find({
                    $or: [
                        { title: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
                        { skills: { $in: [conditions.query] } }
                    ]
                })
                    .populate('profile', ['name'])
                    .limit(resLimit / 2)
                    .lean())
                    .map(i => ({ ...i, _itemType: 'ad' }));

                return res.json({ items: [...ads, ...companies] });
            case 'Company':
                const students = (await Profile.find({
                    type: 'Student',
                    $or: [
                        { firstname: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
                        { surname: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
                        { skills: { $in: [conditions.query] } }
                    ]
                })
                    .limit(resLimit)
                    .lean())
                    .map(i => ({ ...i, _itemType: 'profile' }));

                return res.json({ items: students });
            default:
                return res.status(500).json({ msg: 'Could not get feed' });
        }
    } else {
        // Send public feed - students, companies, ads
        const profiles = (await Profile.find({
            $or: [
                { firstname: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
                { surname: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
                { name: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
                { skills: { $in: [conditions.query] } }
            ]
        })
            .limit(resLimit / 2)
            .lean())
            .map(i => ({ ...i, _itemType: 'profile' }));
        const ads = (await Ad.find({
            $or: [
                { title: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
                { skills: { $in: [conditions.query] } }
            ]
        })
            .populate('profile', ['name'])
            .limit(resLimit / 2)
            .lean())
            .map(i => ({ ...i, _itemType: 'ad' }));

        return res.json({ items: [...profiles, ...ads] });
    }
});

module.exports = router;
