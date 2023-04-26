const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1]  //remove space from Bearer hxgwyg
        jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
            if (err)
                res.status(403).json("Token is not verified!");
            req.user = user;
            next();

        })
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}



//to prevent verify token in each controller 
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.params.isAdmin) {
            next()
        } else {
            res.status(403).json("You are not allow for this Request!")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };









//for multifunction pass
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };