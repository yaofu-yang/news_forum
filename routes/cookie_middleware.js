const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const wdt = req.cookies.webdevtoken;

    if (!wdt) {
        return res.status(401).send("No valid web dev token given")
    } else {
        jwt.verify(wdt, 'salty_salt', function(error, decoded_token) {
            if (error) {
                return res.status(499).send("Invalid token");
            } else {
                req.username = decoded_token;
                next();
            }
        })
    }
}