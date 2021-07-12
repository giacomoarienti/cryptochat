const {isAuthed, isNotAuthed} = require('../middleware/middleware');
const {registerUser, getUser, logoutUser} = require("../controllers/user");

module.exports = function(app) {
    app.get("/api/user/username", isAuthed, getUser);

    app.post("/api/user/register", isNotAuthed, registerUser);

    app.get("/api/user/logout", isAuthed, logoutUser);
};
