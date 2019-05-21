const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Ad = require('../models/Ad');

const resLimit = 1000;

/* Get Feed */
router.get('/', async (req, res) => {
    let conditions = {
        query: req.query.query || '',
        students: req.query.inclStudents == 'true',
        companies: req.query.inclCompanies == 'true',
        ads: req.query.inclAds == 'true',
        skills: req.query.skills != 'false' ? req.query.skills : false
    };

    const studentConditions = {
        type: 'Student',
        $or: [
            { firstname: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
            { surname: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
            { skills: { $in: [conditions.query] } }
        ]
    };

    if (conditions.skills) studentConditions.skills = { $in: [conditions.skills] };

    const students = conditions.students ? (await Profile.find(studentConditions)
        .limit(resLimit / 3)
        .lean())
        .map(i => ({ ...i, _itemType: 'profile' }))
        : [];

    const companyConditions = {
        type: 'Company',
        name: { $regex: '.*' + conditions.query + '.*', $options: 'i' }
    };

    if (conditions.skills) companyConditions.skills = { $in: [conditions.skills] };

    const companies = conditions.companies ? (await Profile.find(companyConditions)
        .limit(resLimit / 3)
        .lean())
        .map(i => ({ ...i, _itemType: 'profile' }))
        : [];

    const adConditions = {
        $or: [
            { title: { $regex: '.*' + conditions.query + '.*', $options: 'i' } },
            { skills: { $in: [conditions.query] } }
        ]
    };

    if (conditions.skills) adConditions.skills = { $in: [conditions.skills] };

    const ads = conditions.ads ? (await Ad.find(adConditions)
        .populate('profile', ['name'])
        .limit(resLimit / 3)
        .lean())
        .map(i => ({ ...i, _itemType: 'ad' }))
        : [];

    return res.json({ items: [...ads, ...companies, ...students] });
});

module.exports = router;
