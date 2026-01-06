
// const express = require("express");
// const verifyToken = require("../middleware/authMiddleware");
// const allowRoles = require("../middleware/roleMiddleware");
// const upload = require("../middleware/uploadCattleImage");
// const { getSellerOrders } = require("../controllers/sellerController");
// const sql = require("mssql");

// const router = express.Router();

// router.post(
//   "/cattle",
//   verifyToken,
//   allowRoles("seller"),
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { breed_id, age, price, status } = req.body;
//       const imageUrl = req.file ? `/uploads/cattle/${req.file.filename}` : null;

//       const seller = await sql.query`
//         SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
//       `;

//       if (seller.recordset.length === 0) {
//         return res.status(403).json({ message: "Seller profile not found" });
//       }

//       await sql.query`
//         INSERT INTO Cattle (seller_id, breed_id, age, price, status, image_url)
//         VALUES (
//           ${seller.recordset[0].seller_id},
//           ${breed_id},
//           ${age},
//           ${price},
//           ${status},
//           ${imageUrl}
//         )
//       `;

//       res.json({ message: "Cattle added successfully 🐄" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// router.get(
//   "/orders",
//   verifyToken,
//   allowRoles("seller"),
//   getSellerOrders
// );

// module.exports = router;

const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadCattleImage");
const { getSellerOrders,updateOrderStatus } = require("../controllers/sellerController");
const sql = require("mssql");

console.log("verifyToken =", verifyToken);
console.log("allowRoles =", allowRoles);
console.log("allowRoles('seller') =", allowRoles("seller"));
console.log("getSellerOrders =", getSellerOrders);

const router = express.Router();

// Seller – Add Cattle
router.post(
  "/cattle",
  verifyToken,
  allowRoles("seller"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { breed_id, age, price, status } = req.body;
      const imageUrl = req.file ? `/uploads/cattle/${req.file.filename}` : null;

      const seller = await sql.query`
        SELECT seller_id FROM Sellers WHERE user_id = ${req.user.user_id}
      `;

      if (seller.recordset.length === 0) {
        return res.status(403).json({ message: "Seller profile not found" });
      }

      await sql.query`
        INSERT INTO Cattle (seller_id, breed_id, age, price, status, image_url)
        VALUES (
          ${seller.recordset[0].seller_id},
          ${breed_id},
          ${age},
          ${price},
          ${status},
          ${imageUrl}
        )
      `;

      res.status(201).json({ message: "Cattle added successfully 🐄" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Seller – View Orders
router.get(
  "/orders",
  verifyToken,
  allowRoles("seller"),
  getSellerOrders
);

router.put(
  "/orders/:order_id/status",
  verifyToken,
  allowRoles("seller"),
  updateOrderStatus
);

module.exports = router;
