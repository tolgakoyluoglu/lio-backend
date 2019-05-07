const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user)
        console.log('sho')
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error from profile')
    }
})

/* Get user */
// router.get('/:id', (req, res) => {
//     const id = req.params.id;

//     User.findById(id)
//         .then(user => {
//             res.json({
//                 user: {
//                     id: user.id,
//                     name: user.name,
//                     email: user.email
//                 }
//             });
//         })
//         .catch(err => {
//             res.status(404).json({ msg: 'User does not exist' });
//         });
// })

module.exports = router;
