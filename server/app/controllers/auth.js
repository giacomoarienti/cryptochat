const jwt = require("jsonwebtoken");
const jwtsecret = require("../config/auth");

// validate token and return decoded
const getToken = (token) => {
  if (!token || token == "") {
    return null;
  }

  jwt.verify(token, jwtsecret, (err, decoded) => {
    if (err) {
      return null;
    }

    return decoded;
  });
};

// generetes signed token
const generateToken = (payload, options) => {
  return jwt.sign(payload, jwtsecret, options); 
};


module.exports = {getToken, generateToken};