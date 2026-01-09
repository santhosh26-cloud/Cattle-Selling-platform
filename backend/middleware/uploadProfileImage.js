const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/profiles",
  filename: (req, file, cb) => {
    cb(null, `profile_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
