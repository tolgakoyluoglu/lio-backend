var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Create User */
router.post('/register', function (req, res) {
    const { email, password, type, name, firstname, surname, industry } = req.body
    if (!email ||
        !password ||
        !type ||
        (type === 'Student' && (!firstname || !surname)) ||
        (type === 'Company' && !name) ||
        !industry
    )
        return res.status(401).json({ msg: 'Please enter all fields' })
    else if (!['Student', 'Company'].includes(type)) {
        return res.status(401).json({ msg: 'Please enter a valid user type' })
    }

    //Check if email already exists
    User.findOne({ email })
        .then(user => {
            if (user)
                return res.status(401).json({ msg: 'User already exists' })
        })
    //Create new user with the req data
    const newUser = new User({
        email,
        password
    })
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save()
                .then(async user => {
                    const nameProps = type === 'Student' ? { firstname, surname } : type === 'Company' ? { name } : {};

                    const profile = await new Profile({
                        user: user.id,
                        type,
                        ...nameProps,
                        industry
                    }).save();

                    //Create token and send it with the response
                    const payload = { user: { id: user.id, email: user.email } }
                    let token = jwt.sign(
                        payload,
                        process.env.JWTSECRET, {
                            expiresIn: 2500
                        })
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            email: user.email,
                            type: profile.type,
                            skills: profile.skills
                        }
                    })
                })

        })
    })
});

/* Login user */
router.post('/login', (req, res) => {
    const { email, password } = req.body
    User.findOne({ email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password).then(async isAuthed => {
                    if (isAuthed) {
                        const profile = await Profile.findOne({ user: user.id });

                        const payload = { user: { id: user.id, email: user.email } }
                        let token = jwt.sign(
                            payload,
                            process.env.JWTSECRET, {
                                expiresIn: 2500
                            })
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                email: user.email,
                                type: profile.type,
                                skills: profile.skills
                            }
                        })
                    } else {
                        res.status(401).json({
                            msg: 'Email or password does not match'
                        })
                    }
                })
            } else {
                res.status(401).json({ msg: 'User does not exist' })
            }
        })
        .catch(err => {
            res.send('error:' + err)
        })
})
module.exports = router;
