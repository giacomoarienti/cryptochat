const crypto = require('crypto');

jwtsecret = crypto.randomBytes(64).toString('hex');
module.exports = jwtsecret;