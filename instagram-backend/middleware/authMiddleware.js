const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) {
    req.userId = 0; // fake user id
    return next();
  }

  const token = header.split(" ")[1];

  if (!token) {
    req.userId = 0;
    return next();
  }

  jwt.verify(token, "secret", (err, decoded) => {

    if (err) {
      req.userId = 0;
      return next();
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = checkAuth;
