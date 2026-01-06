const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getAllUsers,
  updateUserStatus,
  getAnalytics
} = require("../controllers/adminController");

console.log("updatePaymentStatus =", updatePaymentStatus);

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  allowRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

router.get(
  "/orders",
  verifyToken,
  allowRoles("admin"),
  getAllOrders
);

router.put(
  "/orders/:order_id/status",
  verifyToken,
  allowRoles("admin"),
  updateOrderStatus
);

router.put(
  "/orders/:order_id/payment",
  verifyToken,
  allowRoles("admin"),
  updatePaymentStatus
);

router.get(
  "/users",
  verifyToken,
  allowRoles("admin"),
  getAllUsers
);

// Block / Unblock user
router.put(
  "/users/:user_id/status",
  verifyToken,
  allowRoles("admin"),
  updateUserStatus
);
router.get(
  "/analytics",
  verifyToken,
  allowRoles("admin"),
  getAnalytics
);

module.exports = router;
