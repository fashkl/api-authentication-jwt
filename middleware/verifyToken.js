const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    const token = req.header('access_token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        //set user variable to be available with thru the request
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }

}