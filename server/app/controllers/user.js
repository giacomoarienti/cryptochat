const { generateToken } = require("./auth");

const users = [];

const registerUser = (req, res) => {
  const username = req.body.username;

  if(!username) {
    return res.status(400).json({ error: "Username not valid" });
  }

  // check if the username is already taken
  if (users.includes(username)) {
    return res.status(400).json({ error: "Username already taken" });
  }
  if (username.length < 5 || username.length > 16) {
    return res.status(400).json({ error: "Username must be between 5 and 16 characters" });
  }
  // check if username is alphanumeric
  if(/[^a-zA-Z0-9]/.test(username)) {
    return res.status(400).json({ error: "Username contains invalid characters" });
  }

  users.push(username);

  const options = { expiresIn: '1d' };
  const payload = { username: username };

  // generate JWT token
  const jwtToken = generateToken(payload, options);

  // set the token
  res
    .cookie("token", jwtToken, { expires: new Date(Date.now() + 86400000), httpOnly: false })
    .sendStatus(200);
};

// return token from req username
const getUser = (req, res) => {
  if(req.username) {
    // TODO: delete me
    if(!users.includes(req.username)) {
      users.push(req.username);
    }

    return res.status(200).json({ username: req.username });
  }

  return res.sendStatus(400);
};

function removeUser(username) {
  let index = users.indexOf(username);
  users.splice(index, 1);
  delete index;
}

const logoutUser = (req, res) => {
  if(req.username && req.username !== "") {
    removeUser(req.username);
  }

  res.clearCookie("token").sendStatus(200);
};

function checkUser(username) {
  if(users.includes(username)) {
    return true;
  }
  return false;
}

module.exports = { registerUser, getUser, logoutUser, checkUser };
