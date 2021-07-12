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
    .cookie("token", jwtToken, { expires: 86400, httpOnly: true })
    .sendStatus(200);
};

// return token from req username
const getUser = (req, res) => {
  return res.status(200).json({ username: req.username });
};

function removeUser(username) {
  let index = users.indexOf(username);
  users.splice(index, 1);
  delete index;
}

const logoutUser = (req, res) => {
  if(req.username || req.username !== "") {
    removeUser(req.username);
  }

  res.clearCookie("token");
  res.sendStatus(200);
};

module.exports = { registerUser, getUser, logoutUser };
