const jwt = require("jsonwebtoken");

//verify middleware function
function verify(req, res, next) {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    //I need to add refreshToken in order not to access the jwt for a long time.

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
}

module.exports = verify;
