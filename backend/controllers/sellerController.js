console.log("🔥 sellerController LOADED");
const sql = require("mssql");

const addCattle = async (req, res) => {
  try {
    const { breed_id, age, price, status } = req.body;
    const userId = req.user.user_id;

    // 1️⃣ Get seller_id from user_id
    const sellerResult = await sql.query`
      SELECT seller_id FROM Sellers WHERE user_id = ${userId}
    `;

    if (sellerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Seller profile not found" });
    }

    const sellerId = sellerResult.recordset[0].seller_id;

    // 2️⃣ Insert cattle
    await sql.query`
      INSERT INTO Cattle (seller_id, breed_id, age, price, status)
      VALUES (${sellerId}, ${breed_id}, ${age}, ${price}, ${status})
    `;

    res.status(201).json({ message: "Cattle added successfully 🐄" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const getSellerOrders = async (req, res) => {
//   try {
//     const sellerUserId = req.user.user_id;

//     // 1️⃣ Get seller profile
//     const sellerResult = await sql.query`
//       SELECT seller_id
//       FROM Sellers
//       WHERE user_id = ${sellerUserId}
//     `;

//     if (sellerResult.recordset.length === 0) {
//       return res.status(403).json({ message: "Seller profile not found" });
//     }

//     const sellerId = sellerResult.recordset[0].seller_id;

//     // 2️⃣ Get orders for seller's cattle
//     const ordersResult = await sql.query`
//       SELECT
//         o.order_id,
//         o.order_status,
//         o.payment_status,
//         o.order_date,
//         c.cattle_id,
//         c.price,
//         b.breed_name,
//         u.name AS buyer_name
//       FROM Orders o
//       JOIN Cattle c ON o.cattle_id = c.cattle_id
//       JOIN Breeds b ON c.breed_id = b.breed_id
//       JOIN Buyers by ON o.buyer_id = by.buyer_id
//       JOIN Users u ON by.user_id = u.user_id
//       WHERE c.seller_id = ${sellerId}
//       ORDER BY o.order_date DESC
//     `;

//     res.json(ordersResult.recordset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getSellerOrders = async (req, res) => {
  try {
    const sellerUserId = req.user.user_id;

    // 1️⃣ Get seller_id
    const sellerResult = await sql.query`
      SELECT seller_id
      FROM Sellers
      WHERE user_id = ${sellerUserId}
    `;

    if (sellerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Seller profile not found" });
    }

    const sellerId = sellerResult.recordset[0].seller_id;

    // 2️⃣ Get orders (FIXED alias)
    const ordersResult = await sql.query`
      SELECT
        o.order_id,
        o.order_status,
        o.payment_status,
        o.created_at,
        c.cattle_id,
        c.price,
        b.breed_name,
        u.name AS buyer_name
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      JOIN Breeds b ON c.breed_id = b.breed_id
      JOIN Buyers bu ON o.buyer_id = bu.buyer_id   -- ✅ FIXED
      JOIN Users u ON bu.user_id = u.user_id
      WHERE c.seller_id = ${sellerId}
      ORDER BY o.created_at DESC
    `;

    res.json(ordersResult.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const sellerUserId = req.user.user_id;

    // 1️⃣ Get seller_id
    const sellerResult = await sql.query`
      SELECT seller_id FROM Sellers WHERE user_id = ${sellerUserId}
    `;

    if (sellerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Seller profile not found" });
    }

    const sellerId = sellerResult.recordset[0].seller_id;

    // 2️⃣ Check order belongs to seller
    const orderResult = await sql.query`
      SELECT o.order_id, o.cattle_id
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      WHERE o.order_id = ${order_id}
      AND c.seller_id = ${sellerId}
    `;

    if (orderResult.recordset.length === 0) {
      return res.status(403).json({ message: "Order not found or unauthorized" });
    }

    const cattleId = orderResult.recordset[0].cattle_id;

    // 3️⃣ Update order status
    await sql.query`
      UPDATE Orders
      SET order_status = ${status}
      WHERE order_id = ${order_id}
    `;

    // 4️⃣ Update cattle status
    const cattleStatus = status === "accepted" ? "sold" : "available";

    await sql.query`
      UPDATE Cattle
      SET status = ${cattleStatus}
      WHERE cattle_id = ${cattleId}
    `;

    res.json({ message: `Order ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  addCattle,
  getSellerOrders,
  updateOrderStatus
 };
console.log("🔥 sellerController exports =", module.exports);
