const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile')
const User = require('../models/User');
const auth = require('../middleware/requireAuth');
//Get users profile
router.get('/user', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this user' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error when trying to get the profile of logged in user')
    }
})
//Search profile
router.get('/user/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ _id: req.params.id });
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
router.post('/', auth, async (req, res) => {
    const { name, firstname, surname, picture, type, status, description, location, website, skills, industry, language } = req.body
    const profileData = {}
    profileData.user = req.user.id
    if (type) profileData.type = type
    if (name) profileData.name = name
    if (industry) profileData.industry = industry
    if (firstname) profileData.firstname = firstname
    if (surname) profileData.surname = surname
    if (picture) profileData.picture = picture
    if (status) profileData.status = status
    if (description) profileData.description = description
    if (location) profileData.location = location
    if (website) profileData.website = website
    if (skills) profileData.skills = skills
    if (language) profileData.language = language
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
    res.send(profileData)
})
//Put to /exp, add experience to profiles
router.put('/experience', auth, async (req, res) => {
    const { title, company, location, description, isEmployed, from, to } = req.body
    const exp = { title, company, location, description, isEmployed, from, to }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.experience.unshift(exp)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error when saving experience')
    }
})
//Put to /education, add education to profiles
router.put('/education', auth, async (req, res) => {
    const { school, degree, field, description, isStudying, from, to } = req.body
    const education = { school, degree, field, description, isStudying, from, to }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.education.unshift(education)
        await profile.save()
        res.json(education)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error when saving experience')
    }
})
//Delete experience
router.delete('/experience/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const remove = profile.experience.map(item => item.id).indexOf(req.user.id)
        profile.experience.splice(remove, 1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        res.status(500).send('Error when removing experience')
    }
})

//Delete education
router.delete('/education/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const remove = profile.education.map(item => item.id).indexOf(req.user.id)
        profile.education.splice(remove, 1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        res.status(500).send('Error when removing education')
    }
})

module.exports = router;