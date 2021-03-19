const multer = require('multer');

//creates storage for videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploadAudio');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const uploadAudio = multer({ storage: storage })
module.exports = uploadAudio