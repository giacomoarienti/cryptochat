const {isAuthed} = require('../middleware/middleware');

module.exports = function(app) {
  app.get("/api/auth/authenticate", isAuthed, function(req, res) {
    res.status(200).send();
  });
};
