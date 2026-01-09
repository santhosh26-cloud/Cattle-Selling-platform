const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getUsers,
  updateProfile,
  changePassword,
  updateEmail,
  updateContactInfo,
  uploadProfilePicture,
  adminEditUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile"); 
  },
  filename: function (req, file, cb) {
    cb(null, `user_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Public
router.get("/", getUsers);

// Auth Required
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);
router.put("/email", authMiddleware, updateEmail);
router.put("/contact", authMiddleware, updateContactInfo);
router.post("/upload", authMiddleware, upload.single("image"), uploadProfilePicture);

// Admin Only
router.put("/admin/edit", authMiddleware, adminOnly, adminEditUser);

module.exports = router;
