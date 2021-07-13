const {isAuthed} = require('../middleware/middleware');
const {downloadFile} = require("../controllers/file");

module.exports = function(app) {
    app.get("/api/files/:fileId", isAuthed, downloadFile);
};
