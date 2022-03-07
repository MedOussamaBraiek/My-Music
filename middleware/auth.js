//verifie our token
const jwt = require('jsonwebtoken')
const jwtSecret = "secret"

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token')

    // check if token exists
    if(!token){
        return res.json({msg: "No token, access denied!"})
    }

    // decoded objet payload in token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if(err){
            return res.json({msg: "Token not valid!"})
        }
        // user new object in req
        req.user = decoded.user
        next()
    })
}