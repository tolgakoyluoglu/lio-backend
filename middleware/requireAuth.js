const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const bearerHeader = req.headers.authorization;

    const token = typeof bearerHeader === 'string' ? bearerHeader.split(' ')[1] : false;

    if (!token || !bearerHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token recieved' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET)
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'No valid token' })
    }
}