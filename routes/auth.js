const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('../middleware/requireAuth')

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error from auth')
    }
})

module.exports = router;
