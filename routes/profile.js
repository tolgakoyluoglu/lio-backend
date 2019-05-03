const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile')
const User = require('../models/User')

//Get profile of the logged in user
/* Get user */
router.get('/:id', (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .then(user => {
            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        })
        .catch(err => {
            res.status(404).json({ msg: 'User does not exist' });
        });
})

module.exports = router;