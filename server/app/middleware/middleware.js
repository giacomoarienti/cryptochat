const jwt = require("jsonwebtoken");
const jwtsecret = require("../config/auth");

// check Cookie JWT Token
const isAuthed = (req, res, next) => {
  let cookie = req.cookies.token || null;

  if (!cookie) {
    return res.status(401).json({error: "Unauthenticated"});
  }

  jwt.verify(cookie, jwtsecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({error: "Unauthenticated"});
    }

    req.username = decoded.username;
    next();
  });
};

const isNotAuthed = (req, res, next) => {
  let cookie = req.cookies.token || null;

  if (cookie) {
    return res.status(403).json({error: "Not allowed"});
  }

  next();
};



module.exports = {isAuthed, isNotAuthed};