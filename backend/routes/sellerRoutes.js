const express = require("express");
const router = express.Router();
const sql = require("mssql"); // ✅ FIXED
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadCattleImage");

const {
  addCattle,
  getSellerOrders,
  updateOrderStatus,
  getSellerCattle,
  getSingleCattle,
  updateCattle,
  deleteCattle
} = require("../controllers/sellerController");

const{
  getSellerNotifications,
  markAsRead
} = require("../controllers/sellerNotificationController")

// Add cattle
router.post(
  "/cattle",
  verifyToken,
  allowRoles("seller"),
  upload.single("image"),
  addCattle
);

// Seller cattle list
router.get(
  "/my-cattle",
  verifyToken,
  allowRoles("seller"),
  getSellerCattle
);

// Get single cattle (for edit page)
router.get(
  "/cattle/:id",
  verifyToken,
  allowRoles("seller"),
  getSingleCattle
);

// Update cattle
router.put(
  "/cattle/:id",
  verifyToken,
  allowRoles("seller"),
  upload.single("image"),
  updateCattle
);

// Delete cattle
router.delete(
  "/cattle/:id",
  verifyToken,
  allowRoles("seller"),
  deleteCattle
);

// Seller orders
router.get(
  "/orders",
  verifyToken,
  allowRoles("seller"),
  getSellerOrders
);

// Update order status
router.put(
  "/orders/:order_id/status",
  verifyToken,
  allowRoles("seller"),
  updateOrderStatus
);

router.get("/notifications", verifyToken, allowRoles("seller"), getSellerNotifications);
router.put("/notifications/:id/read", verifyToken, allowRoles("seller"), markAsRead);

module.exports = router;
