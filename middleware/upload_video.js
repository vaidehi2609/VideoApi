const multer = require('multer');

//creates storage for videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploadVideo');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const uploadVideo = multer({ storage: storage })
module.exports = uploadVideo