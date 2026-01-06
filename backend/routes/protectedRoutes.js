const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/buyer",
  verifyToken,
  allowRoles("buyer"),
  (req, res) => {
    res.json({ message: "Buyer access granted" });
  }
);

router.get(
  "/seller",
  verifyToken,
  allowRoles("seller"),
  (req, res) => {
    res.json({ message: "Seller access granted" });
  }
);

module.exports = router; // ✅ THIS IS CRITICAL
