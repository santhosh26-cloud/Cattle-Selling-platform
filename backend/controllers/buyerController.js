// const sql = require("mssql");

// /* =========================
//    Buyer – View All Cattle
// ========================= */
// const getAvailableCattle = async (req, res) => {
//   try {
//     const result = await sql.query`
//       SELECT 
//         c.cattle_id,
//         c.age,
//         c.price,
//         c.status,
//         c.image_url,
//         b.breed_name,
//         s.seller_id,
//         u.name AS seller_name
//       FROM Cattle c
//       JOIN Breeds b ON c.breed_id = b.breed_id
//       JOIN Sellers s ON c.seller_id = s.seller_id
//       JOIN Users u ON s.user_id = u.user_id
//       WHERE c.status = 'available'
//     `;

//     res.json(result.recordset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /* =========================
//    Buyer – View Single Cattle
// ========================= */
// const getSingleCattle = async (req, res) => {
//   const { cattle_id } = req.params;

//   try {
//     const result = await sql.query`
//       SELECT 
//         c.cattle_id,
//         c.age,
//         c.price,
//         c.status,
//         c.image_url,
//         b.breed_name,
//         u.name AS seller_name,
//         s.location
//       FROM Cattle c
//       JOIN Breeds b ON c.breed_id = b.breed_id
//       JOIN Sellers s ON c.seller_id = s.seller_id
//       JOIN Users u ON s.user_id = u.user_id
//       WHERE c.cattle_id = ${cattle_id}
//         AND c.status = 'available'
//     `;

//     if (result.recordset.length === 0) {
//       return res.status(404).json({ message: "Cattle not found" });
//     }

//     res.json(result.recordset[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /* =========================
//    EXPORT (VERY IMPORTANT)
// ========================= */
// module.exports = {
//   getAvailableCattle,
//   getSingleCattle
// };
const sql = require("mssql");

const getAvailableCattle = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        c.cattle_id,
        c.age,
        c.price,
        c.status,
        c.image_url,
        b.breed_name
      FROM Cattle c
      JOIN Breeds b ON c.breed_id = b.breed_id
      WHERE c.status = 'available'
    `;

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleCattle = async (req, res) => {
  const { cattle_id } = req.params;

  try {
    const result = await sql.query`
      SELECT *
      FROM Cattle
      WHERE cattle_id = ${cattle_id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Cattle not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPayableOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const buyerResult = await sql.query`
      SELECT buyer_id FROM Buyers WHERE user_id = ${userId}
    `;

    if (buyerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Buyer profile not found" });
    }

    const buyerId = buyerResult.recordset[0].buyer_id;

    const result = await sql.query`
      SELECT
        o.order_id,
        o.created_at,
        c.price,
        b.breed_name,
        u.name AS seller_name
      FROM Orders o
      JOIN Cattle c ON o.cattle_id = c.cattle_id
      JOIN Breeds b ON c.breed_id = b.breed_id
      JOIN Sellers s ON c.seller_id = s.seller_id
      JOIN Users u ON s.user_id = u.user_id
      WHERE o.buyer_id = ${buyerId}
        AND o.order_status = 'accepted'
        AND o.payment_status = 'pending'
    `;

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const payForOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.user_id;

  try {
    // Get buyer_id
    const buyerResult = await sql.query`
      SELECT buyer_id FROM Buyers WHERE user_id = ${userId}
    `;

    if (buyerResult.recordset.length === 0) {
      return res.status(403).json({ message: "Buyer profile not found" });
    }

    const buyerId = buyerResult.recordset[0].buyer_id;

    // Verify order
    const orderResult = await sql.query`
      SELECT cattle_id
      FROM Orders
      WHERE order_id = ${orderId}
        AND buyer_id = ${buyerId}
        AND order_status = 'accepted'
        AND payment_status = 'pending'
    `;

    if (orderResult.recordset.length === 0) {
      return res.status(400).json({ message: "Invalid or already paid order" });
    }

    const cattleId = orderResult.recordset[0].cattle_id;

    // Update payment
    await sql.query`
      UPDATE Orders
      SET payment_status = 'paid'
      WHERE order_id = ${orderId}
    `;

    // Update cattle
    await sql.query`
      UPDATE Cattle
      SET status = 'sold'
      WHERE cattle_id = ${cattleId}
    `;

    res.json({ message: "Payment successful 💳🐄" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAvailableCattle,
  getSingleCattle,
  getPayableOrders,
  payForOrder
};
