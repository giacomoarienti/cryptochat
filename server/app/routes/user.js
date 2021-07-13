const {isAuthed, isNotAuthed} = require('../middleware/middleware');
const {registerUser, getUser, logoutUser, checkUser} = require("../controllers/user");

module.exports = function(app) {
    app.get("/api/user/username", isAuthed, getUser);

    app.post("/api/user/register", isNotAuthed, registerUser);

    app.get("/api/user/logout", isAuthed, logoutUser);

    app.get("/api/user/:username", isAuthed, (req, res) => {
        if(checkUser(req.params.username)) {
            return res.status(200).send();
        }
        return res.status(404).send();
    });
};
