const sql = require("mssql");

const placeOrder = async (req, res) => {
  const buyerUserId = req.user.user_id;
  const { cattle_id } = req.body;

  try {
    const buyerResult = await sql.query`
      SELECT buyer_id FROM Buyers WHERE user_id = ${buyerUserId}
    `;

    if (buyerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Buyer profile not found" });
    }

    const buyer_id = buyerResult.recordset[0].buyer_id;

    await sql.query`
      INSERT INTO Orders (buyer_id, cattle_id, order_status, payment_status)
      VALUES (${buyer_id}, ${cattle_id}, 'placed', 'pending')
    `;

    await sql.query`
      UPDATE Cattle
      SET status = 'ordered'
      WHERE cattle_id = ${cattle_id}
    `;

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getMyOrders = async (req, res) => {
//   const buyerUserId = req.user.user_id;

//   try {
//     const result = await sql.query`
//       SELECT 
//         o.order_id,
//         o.order_status,
//         o.payment_status,
//         o.created_at,
//         c.price,
//         c.image_url
//       FROM Orders o
//       JOIN Buyers b ON o.buyer_id = b.buyer_id
//       JOIN Cattle c ON o.cattle_id = c.cattle_id
//       WHERE b.user_id = ${buyerUserId}
//     `;

//     res.json(result.recordset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getBuyerOrders = async (req, res) => {
//   try {
//     const buyerUserId = req.user.user_id;

//     // 1️⃣ Get buyer_id
//     const buyerResult = await sql.query`
//       SELECT buyer_id FROM Buyers WHERE user_id = ${buyerUserId}
//     `;

//     if (buyerResult.recordset.length === 0) {
//       return res.status(403).json({ message: "Buyer profile not found" });
//     }

//     const buyerId = buyerResult.recordset[0].buyer_id;

//     // 2️⃣ Fetch buyer orders
//     const ordersResult = await sql.query`
//       SELECT
//         o.order_id,
//         o.order_status,
//         o.payment_status,
//         o.created_at,
//         c.cattle_id,
//         c.price,
//         c.image_url,
//         b.breed_name,
//         u.name AS seller_name
//       FROM Orders o
//       JOIN Cattle c ON o.cattle_id = c.cattle_id
//       JOIN Breeds b ON c.breed_id = b.breed_id
//       JOIN Sellers s ON c.seller_id = s.seller_id
//       JOIN Users u ON s.user_id = u.user_id
//       WHERE o.buyer_id = ${buyerId}
//       ORDER BY o.created_at DESC
//     `;

//     res.json(ordersResult.recordset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// const getBuyerOrders = async (req, res) => {
//   try {
//     const userId = req.user.user_id;

//     // 1️⃣ Get buyer_id
//     const buyerResult = await sql.query`
//       SELECT buyer_id FROM Buyers WHERE user_id = ${userId}
//     `;

//     if (buyerResult.recordset.length === 0) {
//       return res.status(403).json({ message: "Buyer profile not found" });
//     }

//     const buyerId = buyerResult.recordset[0].buyer_id;

//     // 2️⃣ Get buyer orders with breed + seller name
//     const ordersResult = await sql.query`
//       SELECT
//         o.order_id,
//         o.order_status,
//         o.payment_status,
//         o.created_at,
//         c.price,
//         c.image_url,
//         b.breed_name,
//         su.name AS seller_name
//       FROM Orders o
//       JOIN Cattle c ON o.cattle_id = c.cattle_id
//       JOIN Breeds b ON c.breed_id = b.breed_id
//       JOIN Sellers s ON c.seller_id = s.seller_id
//       JOIN Users su ON s.user_id = su.user_id
//       WHERE o.buyer_id = ${buyerId}
//       ORDER BY o.created_at DESC
//     `;

//     res.json(ordersResult.recordset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getBuyerOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const buyerResult = await sql.query`
      SELECT buyer_id FROM Buyers WHERE user_id = ${userId}
    `;

    if (buyerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Buyer profile not found" });
    }

    const buyerId = buyerResult.recordset[0].buyer_id;

    const ordersResult = await sql.query`
      SELECT
        o.order_id,
        o.order_status,
        o.payment_status,
        o.created_at,
        c.price,
        c.image_url,
        b.breed_name,
        su.name AS seller_name
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      JOIN Breeds b ON c.breed_id = b.breed_id
      JOIN Sellers s ON c.seller_id = s.seller_id
      JOIN Users su ON s.user_id = su.user_id
      WHERE o.buyer_id = ${buyerId}
      ORDER BY o.created_at DESC
    `;

    res.json(ordersResult.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  placeOrder,
  getBuyerOrders
};
