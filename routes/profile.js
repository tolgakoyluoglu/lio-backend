const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile')
const User = require('../models/User')
const auth = require('../middleware/auth')

// Get users profile
// router.get('/user', auth, async (req, res) => {
//     try {
//         const profile = await Profile.findOne({ user: req.user.id });
//         if (!profile) {
//             console.log(req)
//             return res.status(400).json({ msg: 'No profile for this user' })
//         }
//         res.json(profile)
//     } catch (err) {
//         console.error(err.message)
//         console.log(req)
//         res.status(500).send('Error when trying to get the profile of logged in user')
//     }
// })

router.get('/user/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id });
        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this user' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error when trying to get the profile of logged in user')
    }
})

//Create user profile
router.post('/:id', async (req, res) => {
    const { firstname, surname, picture, type, status, description, location, website, skills } = req.body
    const profileData = {}
    profileData.user = req.params.id
    if (type) profileData.type = type
    if (firstname) profileData.firstname = firstname
    if (surname) profileData.surname = surname
    if (picture) profileData.picture = picture
    if (status) profileData.status = status
    if (description) profileData.description = description
    if (location) profileData.location = location
    if (website) profileData.website = website
    if (skills) profileData.skills = skills
    try {
        //Update the profile if there is a one already for the user
        let profile = await Profile.findOne({ user: req.params.id })
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.params.id },
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

//Put to /exp, add experience to profiles
router.put('/experience/:id', async (req, res) => {
    const { title, company, location, description, isEmployed, from, to } = req.body
    const exp = { title, company, location, description, isEmployed, from, to }
    try {
        const profile = await Profile.findOne({ user: req.params.id })
        profile.experience.unshift(exp)

        await profile.save()
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error when saving experience')
    }
})

//Put to /education, add education to profiles
router.put('/education/:id', async (req, res) => {
    const { school, degree, field, description, isStudying, from, to } = req.body
    const education = { school, degree, field, description, isStudying, from, to }
    try {
        const profile = await Profile.findOne({ user: req.params.id })
        profile.education.unshift(education)

        await profile.save()
        res.json(education)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error when saving experience')
    }
})
//Delete profile and user
router.delete('/delete', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id })
        await User.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: 'User and profile removed', })
    } catch (err) {
        res.status(500).send('Error when removing user')
    }
})

//Delete experience
router.delete('/experience/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const remove = profile.experience.map(item => item.id).indexOf(req.user.id)
        profile.experience.splice(remove, 1)

        await profile.save()
        res.json({ msg: 'Experience removed' })
    } catch (error) {
        res.status(500).send('Error when removing experience')
    }
})

module.exports = router;