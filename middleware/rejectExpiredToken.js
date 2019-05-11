const jwt = require('jsonwebtoken');

const rejectExpiredToken = (req, res, next) => {
    const bearerHeader = req.headers.authorization;

    const token = typeof bearerHeader === 'string' ? bearerHeader.split(' ')[1] : false;

    if (token && bearerHeader.startsWith('Bearer ')) {
        jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                return res.status(401).json({ msg: 'Token expired' });
            }

            return next();
        });
    } else {
        return next();
    }
}

module.exports = rejectExpiredToken;
