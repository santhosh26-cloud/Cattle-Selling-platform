
const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getAvailableCattle,
  getSingleCattle,
  getPayableOrders,
  payForOrder,
} = require("../controllers/buyerController");

const {
  placeOrder,
  getBuyerOrders,
  downloadInvoice
} = require("../controllers/buyerOrderController");

const router = express.Router();

// Buyer → View cattle
router.get("/cattle", verifyToken, allowRoles("buyer"), getAvailableCattle);
router.get("/cattle/:cattle_id", verifyToken, allowRoles("buyer"), getSingleCattle);

// Buyer → Orders
router.post("/order", verifyToken, allowRoles("buyer"), placeOrder);
// router.get("/orders", verifyToken, allowRoles("buyer"), getMyOrders);
router.get(
  "/orders",
  verifyToken,
  allowRoles("buyer"),
  getBuyerOrders
);

router.get(
  "/orders/payable",
  verifyToken,
  allowRoles("buyer"),
  getPayableOrders
);

router.put(
  "/orders/:orderId/pay",
  verifyToken,
  allowRoles("buyer"),
  payForOrder
);

router.get(
  "/orders/:orderId/invoice",
  verifyToken,
  allowRoles("buyer"),
  downloadInvoice
);

module.exports = router;
