// // const express = require("express");
// // const verifyToken = require("../middleware/authMiddleware");
// // const allowRoles = require("../middleware/roleMiddleware");

// // const router = express.Router();

// // router.get(
// //   "/dashboard",
// //   verifyToken,
// //   allowRoles("buyer"),
// //   (req, res) => {
// //     res.json({
// //       message: "Welcome Buyer 👋",
// //       user: req.user
// //     });
// //   }   
// const express = require("express");
// const verifyToken = require("../middleware/authMiddleware");
// const allowRoles = require("../middleware/roleMiddleware");
// const {
//   getAvailableCattle,
//   getSingleCattle
// } = require("../controllers/buyerController");

// const router = express.Router();

// // Buyer – View all cattle
// router.get(
//   "/cattle",
//   verifyToken,
//   allowRoles("buyer"),
//   getAvailableCattle
// );

// // Buyer – View single cattle
// router.get(
//   "/cattle/:cattle_id",
//   verifyToken,
//   allowRoles("buyer"),
//   getSingleCattle
// );

// module.exports = router;
// const express = require("express");
// const verifyToken = require("../middleware/authMiddleware");
// const allowRoles = require("../middleware/roleMiddleware");

// const {
//   getAvailableCattle,
//   getSingleCattle
// } = require("../controllers/buyerController");

// const router = express.Router();

// // Buyer – view all cattle
// router.get(
//   "/cattle",
//   verifyToken,
//   allowRoles("buyer"),
//   getAvailableCattle
// );

// // Buyer – view single cattle
// router.get(
//   "/cattle/:cattle_id",
//   verifyToken,
//   allowRoles("buyer"),
//   getSingleCattle
// );

// module.exports = router; // ✅ THIS IS CRITICAL
const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getAvailableCattle,
  getSingleCattle,
  getPayableOrders,
  payForOrder
} = require("../controllers/buyerController");

const {
  placeOrder,
  getBuyerOrders
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

module.exports = router;
