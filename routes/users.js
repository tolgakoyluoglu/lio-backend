var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Create User */
router.post('/register', function (req, res) {
  const { email, name, password } = req.body
  console.log(req)
  if (!name || !email || !password)
    return res.status(401).json({ msg: 'Please enter all fields' })
  //Check if email already exists
  User.findOne({ email })
    .then(user => {
      if (user)
        return res.status(401).json({ msg: 'User already exists' })
    })
  //Create new user with the req data
  const newUser = new User({
    email: email,
    name: name,
    password: password
  })
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err
      newUser.password = hash
      newUser.save()
        .then(user => {
          //Create token and send it with the response
          let token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWTSECRET, {
              expiresIn: 2500
            })
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
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
        if (bcrypt.compare(password, user.password)) {
          let token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWTSECRET, {
              expiresIn: 2500
            })
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          })
        } else {
          res.status(401).json({
            msg: 'Email or password does not match'
          })
        }
      } else {
        res.status(401).json({ msg: 'User does not exist' })
      }
    })
    .catch(err => {
      res.send('error:' + err)
    })
})
module.exports = router;
