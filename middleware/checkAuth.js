const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
    const bearerHeader = req.headers.authorization;

    const token = bearerHeader ? bearerHeader.split(' ')[1] : false;

    try {
        if (token && bearerHeader.startsWith('Bearer ')) {
            jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
                if (!err) {
                    User.findById(decoded.id)
                        .then(user => {
                            req.auth = user;
                            req.authErr = false;

                            next();
                        })
                        .catch(e => {
                            throw e;
                        });
                } else {
                    throw err;
                }
            });
        } else {
            throw 'Invalid token type';
        }
    } catch (e) {
        req.auth = false;
        req.authErr = e;

        next();
    }
}

module.exports = auth;
