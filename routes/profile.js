const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile')
const User = require('../models/User')
const auth = require('../middleware/auth')

// Get users profile
router.get('/user/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name'])

        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this user' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error, something went wrong in in profile/user route') //Change msg later
    }
})

//Create user profile
router.post('/', auth, async (req, res) => {
    const { type, status, description, location, website, skills, title, company, locationExp, descriptionExp, fromExp, toExp, isEmployed, school, degree, field, descriptionEducation, isStudying, from, to } = req.body
    const profileData = {}
    profileData.user = req.user.id
    if (type) profileData.type = type
    if (status) profileData.status = status
    if (description) profileData.description = description
    if (location) profileData.location = location
    if (website) profileData.website = website
    if (skills) {
        profileData.skills = skills.split(',').map(skill => skill.trim())
    }
    //Experience fields
    profileData.exp = {}
    if (title) profileData.exp.title = title
    if (company) profileData.exp.company = company
    if (locationExp) profileData.exp.location = location
    if (descriptionExp) profileData.exp.description = description
    if (fromExp) profileData.exp.from = from
    if (toExp) profileData.exp.to = to
    if (isEmployed) profileData.exp.isEmployed = isEmployed
    //Education fields
    profileData.education = {}
    if (school) profileData.exp.school = school
    if (degree) profileData.exp.degree = degree
    if (field) profileData.exp.field = field
    if (descriptionEducation) profileData.exp.description = description
    if (from) profileData.exp.from = from
    if (to) profileData.exp.to = to
    if (isStudying) profileData.exp.isStudying = isStudying

    try {
        //Update the profile if there is a one already for the user
        let profile = await Profile.findOne({ user: req.user.id })
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileData },
                { new: true }
            )
            return res.json(profile)
        }
        //Create profile
        profile = new Profile(profileData)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error from creating or updating profile')
    }
    console.log(profileData)
    res.send(profileData)
})

//Delete profile and user
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id })
        await User.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: 'User and profile removed' })
    } catch (err) {
        res.status(500).send('Error when removing user')
    }
})

module.exports = router;