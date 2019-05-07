const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile')
const User = require('../models/User')

router.post('/', (req, res) => {
    const { skills } = req.body
    const fields = {}
    fields.user = req.id
    if (skills) {
        fields.skills = skills.split(',').map(skill => skill.trim())
    }
    console.log(fields.user)
    res.send('works')
})

module.exports = router;